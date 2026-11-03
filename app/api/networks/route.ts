import { NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { config } from '@/lib/config';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const networksList = await db
      .select()
      .from(schema.networks)
      .orderBy(desc(schema.networks.createdAt));

    return NextResponse.json({ success: true, data: networksList });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, region, redundancyPolicy, organizationId } = body;

    const netCode = `RYV-NET-${Math.floor(1000 + Math.random() * 9000)}`;
    const orgId = organizationId || config.defaultOrgId;

    const [newNetwork] = await db
      .insert(schema.networks)
      .values({
        networkIdCode: netCode,
        organizationId: orgId,
        name,
        description: description || '',
        region: region || 'us-east-1',
        redundancyPolicy: redundancyPolicy || config.defaultRedundancyPolicy,
        encryptionStandard: config.encryptionStandard,
        status: 'healthy',
        totalStorageBytes: 0,
        usedStorageBytes: 0,
        nodeCount: 0,
      })
      .returning();

    // Log action to audit table with real session identity
    const user = await getCurrentUser(request.headers);
    await db.insert(schema.auditLogs).values({
      organizationId: orgId,
      userName: user?.name || body.userName || 'Operator',
      userEmail: user?.email || body.userEmail || 'operator@ryve.local',
      action: 'NETWORK_CREATED',
      targetType: 'network',
      targetId: netCode,
      details: `Created network "${name}" in ${region || 'us-east-1'}`,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, data: newNetwork });
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
      return NextResponse.json({ success: false, error: 'Network ID is required' }, { status: 400 });
    }

    await db.delete(schema.networks).where(eq(schema.networks.id, id));
    return NextResponse.json({ success: true, message: 'Network deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
