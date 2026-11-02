import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { initialFiles } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const networkId = searchParams.get('networkId');

  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      let query = supabase.from('files').select('*').order('created_at', { ascending: false });
      if (networkId && networkId !== 'all') {
        query = query.eq('network_id', networkId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: 'supabase', data });
      }
    } catch {
      // Fallback
    }
  }

  let files = initialFiles;
  if (networkId && networkId !== 'all') {
    files = files.filter((f) => f.network_id === networkId);
  }

  return NextResponse.json({ success: true, source: 'mock', data: files });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, sizeBytes, mimeType, networkId, organizationId } = body;

    const hash = `sha256-${Math.random().toString(36).substring(2, 18)}${Math.random().toString(36).substring(2, 18)}`;
    const supabase = getServiceSupabase();

    if (supabase) {
      const { data, error } = await supabase.from('files').insert([
        {
          organization_id: organizationId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          network_id: networkId,
          name,
          path: '/uploads/',
          size_bytes: sizeBytes,
          mime_type: mimeType || 'application/octet-stream',
          is_public: false,
          chunks_count: 12,
          data_chunks: 8,
          parity_chunks: 4,
          encryption_algorithm: 'AES-256-GCM',
          hash,
          uploaded_by: 'Alex Rivers',
        }
      ]).select().single();

      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: `file-${Date.now()}`,
        network_id: networkId,
        name,
        size_bytes: sizeBytes,
        mime_type: mimeType || 'application/octet-stream',
        chunks_count: 12,
        hash,
        created_at: new Date().toISOString(),
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
