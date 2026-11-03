import { NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { config } from '@/lib/config';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const logs = await db
      .select()
      .from(schema.auditLogs)
      .orderBy(desc(schema.auditLogs.createdAt))
      .limit(100);

    return NextResponse.json({ success: true, data: logs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, targetType, targetId, details, organizationId, userName, userEmail } = body;

    const user = await getCurrentUser(request.headers);
    const [newLog] = await db
      .insert(schema.auditLogs)
      .values({
        organizationId: organizationId || config.defaultOrgId,
        userName: userName || user?.name || 'Operator',
        userEmail: userEmail || user?.email || 'operator@ryve.local',
        action,
        targetType: targetType || 'system',
        targetId: targetId || 'global',
        details: details || '',
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      })
      .returning();

    return NextResponse.json({ success: true, data: newLog });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
