import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { initialNetworks } from '@/lib/mock-data';

export async function GET() {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('networks').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: 'supabase', data });
      }
    } catch {
      // Fallback below
    }
  }

  return NextResponse.json({ success: true, source: 'mock', data: initialNetworks });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, region, redundancyPolicy, organizationId } = body;

    const netCode = `RYV-NET-${Math.floor(1000 + Math.random() * 9000)}`;
    const supabase = getServiceSupabase();

    if (supabase) {
      const { data, error } = await supabase.from('networks').insert([
        {
          network_id_code: netCode,
          organization_id: organizationId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          name,
          description,
          region: region || 'us-east-1',
          redundancy_policy: redundancyPolicy || 'Reed-Solomon (8+4)',
          status: 'healthy',
        }
      ]).select().single();

      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
    }

    // Mock response
    return NextResponse.json({
      success: true,
      data: {
        id: `net-${Date.now()}`,
        network_id_code: netCode,
        name,
        description,
        region: region || 'us-east-1',
        redundancy_policy: redundancyPolicy || 'Reed-Solomon (8+4)',
        status: 'healthy',
        created_at: new Date().toISOString(),
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
