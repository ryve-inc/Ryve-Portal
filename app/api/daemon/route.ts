import { NextResponse } from 'next/server';
import { config } from '@/lib/config';
import { db, schema, ensureTables } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// Helper to make timeout-guarded HTTP requests to the daemon
async function callDaemon(path: string, options: RequestInit = {}) {
  const base = config.daemonUrl.replace(/\/+$/, '');
  const url = `${base}${path.startsWith('/') ? path : '/' + path}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(config.daemonApiKey ? { Authorization: `Bearer ${config.daemonApiKey}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data, error: null };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const msg = err instanceof Error ? err.message : 'Daemon unreachable';
    return { ok: false, status: 503, data: null, error: msg, offline: true };
  }
}

// POST handler: join, upgrade/resize, leave
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request.headers);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Session required' },
        { status: 401 }
      );
    }

    await ensureTables();

    // Get user's organization
    let orgId: string;
    const existingOrgs = await db
      .select()
      .from(schema.organizations)
      .where(eq(schema.organizations.userId, user.id))
      .limit(1);

    if (existingOrgs.length > 0) {
      orgId = existingOrgs[0].id;
    } else {
      const [newOrg] = await db
        .insert(schema.organizations)
        .values({
          name: `${user.name || 'Personal'}'s Organization`,
          userId: user.id,
        })
        .returning();
      orgId = newOrg.id;
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'join';
    const body = await request.json().catch(() => ({}));

    // =========================================================================
    // 1. JOIN NETWORK: POST /api/v1/node/join-network
    // =========================================================================
    if (action === 'join') {
      const allocatedGb = Math.max(0.1, parseFloat(body.allocatedGb) || 0.5);
      const durationMonths = Math.max(1, Number(body.durationMonths) || 1);
      const name = String(body.name || user.name || 'Customer-Acme').trim();

      // Ensure valid p2p-drive link structure (64-character hex link required by daemon)
      let networkLink = String(body.networkLink || '').trim();
      if (!networkLink || !networkLink.startsWith('p2p-drive://')) {
        const randomHex64 = crypto.randomBytes(32).toString('hex');
        networkLink = `p2p-drive://network/${randomHex64}?name=${encodeURIComponent(name)}`;
      }

      // Call daemon API
      const daemonRes = await callDaemon('/api/v1/node/join-network', {
        method: 'POST',
        body: JSON.stringify({
          networkLink,
          name,
          allocatedGb,
        }),
      });

      // Calculate dates
      const purchasedAt = new Date();
      const expiresAt = new Date(purchasedAt);
      expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

      const networkId = daemonRes.data?.networkId || crypto.randomBytes(6).toString('hex');
      const networkKeyHex = daemonRes.data?.networkKeyHex || '';

      // Save allocated node to database
      try {
        const [newNode] = await db
          .insert(schema.nodes)
          .values({
            organizationId: orgId,
            capacityGb: allocatedGb,
            networkAddress: networkLink,
            networkId,
            durationMonths,
            purchasedAt,
            expiresAt,
            status: 'active',
          })
          .returning();

        return NextResponse.json({
          success: true,
          node: newNode,
          networkId,
          networkKeyHex,
          daemonOnline: daemonRes.ok,
          message: daemonRes.data?.message || `Node successfully allocated ${allocatedGb} GB`,
        });
      } catch {
        // Fallback return if database needed raw handling
        const fallbackNode = {
          id: 'node-' + Math.random().toString(36).substring(2, 10),
          organizationId: orgId,
          capacityGb: allocatedGb,
          networkAddress: networkLink,
          networkId,
          durationMonths,
          purchasedAt: purchasedAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
          status: 'active' as const,
          createdAt: purchasedAt.toISOString(),
        };

        return NextResponse.json({
          success: true,
          node: fallbackNode,
          networkId,
          networkKeyHex,
          daemonOnline: daemonRes.ok,
          message: daemonRes.data?.message || `Node allocated ${allocatedGb} GB`,
        });
      }
    }

    // =========================================================================
    // 2. UPGRADE / RESIZE NETWORK: POST /api/v1/node/resize-network
    // =========================================================================
    if (action === 'upgrade' || action === 'resize') {
      const { nodeId, networkId, networkAddress, allocatedGb } = body;
      const newGb = Math.max(0.1, parseFloat(allocatedGb) || 1);

      // The daemon expects the actual p2p-drive:// URL, not only the network id alone
      let networkLink = (networkAddress && typeof networkAddress === 'string' && networkAddress.startsWith('p2p-drive://'))
        ? networkAddress
        : '';

      // If not provided in body, query database by nodeId to get the registered p2p-drive:// address
      if (!networkLink && nodeId) {
        try {
          const found = await db
            .select()
            .from(schema.nodes)
            .where(eq(schema.nodes.id, nodeId))
            .limit(1);
          if (found.length > 0 && found[0].networkAddress && found[0].networkAddress.startsWith('p2p-drive://')) {
            networkLink = found[0].networkAddress;
          }
        } catch {}
      }

      // If still not found, check if networkId itself was a full p2p-drive:// URI
      if (!networkLink && networkId && typeof networkId === 'string' && networkId.startsWith('p2p-drive://')) {
        networkLink = networkId;
      }

      // Fallback to whatever identifier is available
      if (!networkLink) {
        networkLink = networkAddress || networkId || '';
      }

      // Call daemon API with the actual p2p-drive:// URL
      let daemonMsg = '';
      if (networkLink) {
        const daemonRes = await callDaemon('/api/v1/node/resize-network', {
          method: 'POST',
          body: JSON.stringify({
            networkId: networkLink,
            networkLink: networkLink,
            allocatedGb: newGb,
          }),
        });
        daemonMsg = daemonRes.data?.message || '';
      }

      // Update database record
      if (nodeId) {
        try {
          await db
            .update(schema.nodes)
            .set({ capacityGb: newGb })
            .where(eq(schema.nodes.id, nodeId));
        } catch {}
      }

      return NextResponse.json({
        success: true,
        message: daemonMsg || `Storage allocation updated to ${newGb} GB`,
        newAllocatedGb: newGb,
      });
    }

    // =========================================================================
    // 3. LEAVE NETWORK: POST /api/v1/node/leave-network
    // =========================================================================
    if (action === 'leave') {
      const { nodeId, networkId, networkAddress } = body;

      // The daemon expects the full p2p-drive:// networkLink, not just the short networkId.
      let networkLink = (networkAddress && typeof networkAddress === 'string' && networkAddress.startsWith('p2p-drive://'))
        ? networkAddress
        : '';

      // If not passed, query database by nodeId
      if (!networkLink && nodeId) {
        try {
          const found = await db
            .select()
            .from(schema.nodes)
            .where(eq(schema.nodes.id, nodeId))
            .limit(1);
          if (found.length > 0 && found[0].networkAddress && found[0].networkAddress.startsWith('p2p-drive://')) {
            networkLink = found[0].networkAddress;
          }
        } catch {}
      }

      if (!networkLink && networkId && typeof networkId === 'string' && networkId.startsWith('p2p-drive://')) {
        networkLink = networkId;
      }

      if (!networkLink) {
        networkLink = networkAddress || networkId || '';
      }

      // Call daemon API with full p2p-drive:// networkLink
      let daemonMsg = '';
      if (networkLink) {
        const daemonRes = await callDaemon('/api/v1/node/leave-network', {
          method: 'POST',
          body: JSON.stringify({
            networkId: networkLink,
            networkLink: networkLink,
          }),
        });
        daemonMsg = daemonRes.data?.message || '';
      }

      // Mark decommissioned in database
      if (nodeId) {
        try {
          await db
            .update(schema.nodes)
            .set({ status: 'decommissioned' })
            .where(eq(schema.nodes.id, nodeId));
        } catch {}
      }

      return NextResponse.json({
        success: true,
        message: daemonMsg || `Node successfully left network ${networkId || ''}`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action requested' },
      { status: 400 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Daemon request failed';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
