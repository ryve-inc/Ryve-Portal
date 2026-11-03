import { NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq, desc, sql } from 'drizzle-orm';
import { config } from '@/lib/config';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const networkId = searchParams.get('networkId');

    let query = db.select().from(schema.nodes).orderBy(desc(schema.nodes.createdAt));
    if (networkId && networkId !== 'all') {
      const filtered = await db
        .select()
        .from(schema.nodes)
        .where(eq(schema.nodes.networkId, networkId))
        .orderBy(desc(schema.nodes.createdAt));
      return NextResponse.json({ success: true, data: filtered });
    }

    const nodesList = await query;
    return NextResponse.json({ success: true, data: nodesList });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, networkId, nodeType, capacityTb, osInfo, organizationId } = body;

    const orgId = organizationId || config.defaultOrgId;
    const prefix = nodeType === 'ryve_provided' ? 'RYV' : 'NODE';
    const nodeCode = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
    const totalBytes = (capacityTb || 1) * 1000000000000;
    const usedBytes = nodeType === 'ryve_provided' ? 0 : Math.floor(totalBytes * 0.15);

    const [newNode] = await db
      .insert(schema.nodes)
      .values({
        nodeIdCode: nodeCode,
        networkId,
        organizationId: orgId,
        name,
        nodeType: nodeType || 'customer_owned',
        ipAddress: `192.168.10.${Math.floor(20 + Math.random() * 200)}`,
        totalStorageBytes: totalBytes,
        usedStorageBytes: usedBytes,
        status: 'healthy',
        healthScore: 99,
        latencyMs: Math.floor(10 + Math.random() * 20),
        uptimePct: '100.00',
        version: 'v1.4.2-p2p',
        osInfo: osInfo || 'Ubuntu Server 24.04 (x86_64)',
        lastHeartbeat: new Date().toISOString(),
      })
      .returning();

    // Increment network metrics
    await db
      .update(schema.networks)
      .set({
        nodeCount: sql`${schema.networks.nodeCount} + 1`,
        totalStorageBytes: sql`${schema.networks.totalStorageBytes} + ${totalBytes}`,
        usedStorageBytes: sql`${schema.networks.usedStorageBytes} + ${usedBytes}`,
      })
      .where(eq(schema.networks.id, networkId));

    // Audit log with real session identity
    const user = await getCurrentUser(request.headers);
    await db.insert(schema.auditLogs).values({
      organizationId: orgId,
      userName: user?.name || body.userName || 'Operator',
      userEmail: user?.email || body.userEmail || 'operator@ryve.local',
      action: nodeType === 'ryve_provided' ? 'STORAGE_PROVISIONED' : 'NODE_ENROLLED',
      targetType: 'node',
      targetId: nodeCode,
      details: `${nodeType === 'ryve_provided' ? 'Provisioned dedicated Ryve pod' : 'Enrolled hardware node'} "${name}" (${capacityTb} TB)`,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, data: newNode });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Node ID is required' }, { status: 400 });
    }

    const [deletedNode] = await db.delete(schema.nodes).where(eq(schema.nodes.id, id)).returning();
    if (deletedNode) {
      // Decrement network metrics
      await db
        .update(schema.networks)
        .set({
          nodeCount: sql`GREATEST(0, ${schema.networks.nodeCount} - 1)`,
          totalStorageBytes: sql`GREATEST(0, ${schema.networks.totalStorageBytes} - ${deletedNode.totalStorageBytes})`,
          usedStorageBytes: sql`GREATEST(0, ${schema.networks.usedStorageBytes} - ${deletedNode.usedStorageBytes})`,
        })
        .where(eq(schema.networks.id, deletedNode.networkId));
    }

    return NextResponse.json({ success: true, message: 'Node revoked and removed' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and status required' }, { status: 400 });
    }

    const healthScore = status === 'healthy' ? 99 : status === 'warning' ? 70 : 0;
    const [updatedNode] = await db
      .update(schema.nodes)
      .set({
        status,
        healthScore,
        lastHeartbeat: new Date().toISOString(),
      })
      .where(eq(schema.nodes.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updatedNode });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
