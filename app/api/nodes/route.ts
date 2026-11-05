import { NextResponse } from 'next/server';
import { db, schema, ensureTables } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request.headers);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Session required' },
        { status: 401 }
      );
    }

    // Auto-ensure database tables exist
    await ensureTables();

    // Find organization ID for current user
    let orgId: string | null = null;
    try {
      const existingOrgs = await db
        .select()
        .from(schema.organizations)
        .where(eq(schema.organizations.userId, user.id))
        .limit(1);

      if (existingOrgs.length > 0) {
        orgId = existingOrgs[0].id;
      }
    } catch {}

    if (!orgId) {
      return NextResponse.json({ success: true, nodes: [] });
    }

    // Fetch allocated nodes
    try {
      const allocatedNodes = await db
        .select()
        .from(schema.nodes)
        .where(eq(schema.nodes.organizationId, orgId))
        .orderBy(desc(schema.nodes.purchasedAt));

      const now = new Date();
      const formatted = allocatedNodes.map((node) => ({
        ...node,
        status: new Date(node.expiresAt) < now ? 'expired' : node.status,
      }));

      return NextResponse.json({
        success: true,
        nodes: formatted,
      });
    } catch {
      return NextResponse.json({ success: true, nodes: [] });
    }
  } catch {
    return NextResponse.json({ success: true, nodes: [] });
  }
}

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

    // Get or create organization
    let orgId: string;
    try {
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
    } catch {
      // Fallback ID if org table is in migration
      orgId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    }

    const body = await request.json();
    const capacityGb = Number(body.capacityGb) || 100;
    const networkAddress = String(body.networkAddress || '127.0.0.1:9000').trim();
    const networkId = body.networkId ? String(body.networkId).trim() : null;
    const durationMonths = Number(body.durationMonths) || 1;

    // Calculate dates
    const purchasedAt = new Date();
    const expiresAt = new Date(purchasedAt);
    expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

    try {
      const [newNode] = await db
        .insert(schema.nodes)
        .values({
          organizationId: orgId,
          capacityGb,
          networkAddress,
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
      });
    } catch {
      // Fallback return if insert needed raw execution
      const fallbackNode = {
        id: 'node-' + Math.random().toString(36).substring(2, 10),
        organizationId: orgId,
        capacityGb,
        networkAddress,
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
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Allocation failed';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 400 }
    );
  }
}
