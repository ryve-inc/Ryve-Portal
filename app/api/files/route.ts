import { NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import { config } from '@/lib/config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const networkId = searchParams.get('networkId');

    if (networkId && networkId !== 'all') {
      const filesList = await db
        .select()
        .from(schema.files)
        .where(eq(schema.files.networkId, networkId))
        .orderBy(desc(schema.files.createdAt));
      return NextResponse.json({ success: true, data: filesList });
    }

    const allFiles = await db.select().from(schema.files).orderBy(desc(schema.files.createdAt));
    return NextResponse.json({ success: true, data: allFiles });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, sizeBytes, mimeType, networkId, organizationId } = body;

    const orgId = organizationId || config.defaultOrgId;
    const [net] = await db
      .select()
      .from(schema.networks)
      .where(eq(schema.networks.id, networkId))
      .limit(1);

    const netName = net?.name || 'Mesh Network';
    const hash = `sha256-${Math.random().toString(36).substring(2, 18)}${Math.random().toString(36).substring(2, 18)}`;

    const [newFile] = await db
      .insert(schema.files)
      .values({
        organizationId: orgId,
        networkId,
        networkName: netName,
        name,
        path: '/uploads/',
        sizeBytes: sizeBytes || 1048576,
        mimeType: mimeType || 'application/octet-stream',
        isPublic: false,
        chunksCount: 12,
        dataChunks: 8,
        parityChunks: 4,
        encryptionAlgorithm: 'AES-256-GCM',
        hash,
        uploadedBy: 'Alex Rivers',
      })
      .returning();

    // Audit log
    await db.insert(schema.auditLogs).values({
      organizationId: orgId,
      userName: 'Alex Rivers',
      userEmail: 'alex@acme.corp',
      action: 'FILE_CHUNKED_AND_DISTRIBUTED',
      targetType: 'file',
      targetId: name,
      details: `Encrypted (AES-256-GCM) and dispersed 12 Reed-Solomon shards across nodes`,
      ipAddress: '127.0.0.1',
      createdAt: 'Just now',
    });

    return NextResponse.json({ success: true, data: newFile });
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
      return NextResponse.json({ success: false, error: 'File ID is required' }, { status: 400 });
    }

    await db.delete(schema.files).where(eq(schema.files.id, id));
    return NextResponse.json({ success: true, message: 'File deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isPublic } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'File ID is required' }, { status: 400 });
    }

    const [updatedFile] = await db
      .update(schema.files)
      .set({ isPublic: Boolean(isPublic) })
      .where(eq(schema.files.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updatedFile });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
