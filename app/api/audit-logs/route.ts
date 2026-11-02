import { NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { config } from '@/lib/config';

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

    const [newLog] = await db
      .insert(schema.auditLogs)
      .values({
        organizationId: organizationId || config.defaultOrgId,
        userName: userName || 'Alex Rivers',
        userEmail: userEmail || 'alex@acme.corp',
        action,
        targetType: targetType || 'system',
        targetId: targetId || 'global',
        details: details || '',
        ipAddress: '127.0.0.1',
        createdAt: 'Just now',
      })
      .returning();

    return NextResponse.json({ success: true, data: newLog });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
