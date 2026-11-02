import { NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';
import { config } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { networkId, capacityTb, billingCycle, organizationId } = body;

    const orgId = organizationId || config.defaultOrgId;
    const capacity = parseFloat(capacityTb) || 1;
    const pricePerMonth = capacity * config.ryveStoragePricePerTb;

    // Fetch network name
    const [targetNet] = await db
      .select()
      .from(schema.networks)
      .where(eq(schema.networks.id, networkId))
      .limit(1);

    const netName = targetNet?.name || 'Storage Network';
    const totalBytes = capacity * 1000000000000;
    const nodeCode = `RYV-POD-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Provision Ryve dedicated node in database
    const [provisionedNode] = await db
      .insert(schema.nodes)
      .values({
        nodeIdCode: nodeCode,
        networkId,
        organizationId: orgId,
        name: `Ryve Dedicated Block ${capacity}TB`,
        nodeType: 'ryve_provided',
        ipAddress: `54.${Math.floor(100 + Math.random() * 150)}.${Math.floor(10 + Math.random() * 80)}.${Math.floor(10 + Math.random() * 90)}`,
        totalStorageBytes: totalBytes,
        usedStorageBytes: 0,
        status: 'healthy',
        healthScore: 100,
        latencyMs: 14,
        uptimePct: '100.00',
        version: 'v1.4.2-p2p',
        osInfo: 'Ryve Managed NVMe Datacenter Pod',
        lastHeartbeat: 'Just now',
      })
      .returning();

    // 2. Record storage request
    const [newRequest] = await db
      .insert(schema.storageRequests)
      .values({
        organizationId: orgId,
        networkId,
        networkName: netName,
        requestedCapacityTb: capacity.toString(),
        billingCycle: billingCycle || 'monthly',
        pricePerMonthUsd: pricePerMonth.toString(),
        status: 'active',
        provisionedNodeId: provisionedNode.id,
      })
      .returning();

    // 3. Update network storage and node count
    await db
      .update(schema.networks)
      .set({
        nodeCount: sql`${schema.networks.nodeCount} + 1`,
        totalStorageBytes: sql`${schema.networks.totalStorageBytes} + ${totalBytes}`,
      })
      .where(eq(schema.networks.id, networkId));

    // 4. Audit Log
    await db.insert(schema.auditLogs).values({
      organizationId: orgId,
      userName: 'Alex Rivers',
      userEmail: 'alex@acme.corp',
      action: 'STORAGE_PROVISIONED',
      targetType: 'storage_request',
      targetId: nodeCode,
      details: `Provisioned ${capacity} TB dedicated NVMe pod (${nodeCode}) into ${netName}`,
      ipAddress: '127.0.0.1',
      createdAt: 'Just now',
    });

    return NextResponse.json({
      success: true,
      data: {
        request: newRequest,
        node: provisionedNode,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
