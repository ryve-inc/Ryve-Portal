import { NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const networkId = searchParams.get('networkId');

    if (networkId && networkId !== 'all') {
      const codes = await db
        .select()
        .from(schema.enrollmentCodes)
        .where(eq(schema.enrollmentCodes.networkId, networkId))
        .orderBy(desc(schema.enrollmentCodes.createdAt));
      return NextResponse.json({ success: true, data: codes });
    }

    const allCodes = await db
      .select()
      .from(schema.enrollmentCodes)
      .orderBy(desc(schema.enrollmentCodes.createdAt));

    return NextResponse.json({ success: true, data: allCodes });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { networkId, maxUses } = body;

    const code = `RYV-ENR-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const user = await getCurrentUser(request.headers);
    const [newCode] = await db
      .insert(schema.enrollmentCodes)
      .values({
        networkId,
        code,
        createdBy: user?.name || body.createdBy || 'Operator',
        maxUses: maxUses || 10,
        currentUses: 0,
        isActive: true,
        expiresAt,
      })
      .returning();

    return NextResponse.json({ success: true, data: newCode });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
