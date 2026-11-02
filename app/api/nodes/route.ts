import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { initialNodes } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const networkId = searchParams.get('networkId');

  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      let query = supabase.from('nodes').select('*').order('created_at', { ascending: false });
      if (networkId && networkId !== 'all') {
        query = query.eq('network_id', networkId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: 'supabase', data });
      }
    } catch {
      // Fallback below
    }
  }

  let nodes = initialNodes;
  if (networkId && networkId !== 'all') {
    nodes = nodes.filter((n) => n.network_id === networkId);
  }

  return NextResponse.json({ success: true, source: 'mock', data: nodes });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, networkId, nodeType, capacityTb, osInfo, organizationId } = body;

    const nodeCode = `NODE-${nodeType === 'ryve_provided' ? 'RYV' : 'USR'}-${Math.floor(10 + Math.random() * 90)}`;
    const totalBytes = (capacityTb || 1) * 1000000000000;
    const supabase = getServiceSupabase();

    if (supabase) {
      const { data, error } = await supabase.from('nodes').insert([
        {
          node_id_code: nodeCode,
          network_id: networkId,
          organization_id: organizationId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          name,
          node_type: nodeType || 'customer_owned',
          ip_address: `192.168.10.${Math.floor(20 + Math.random() * 200)}`,
          total_storage_bytes: totalBytes,
          used_storage_bytes: 0,
          status: 'healthy',
          health_score: 100,
          os_info: osInfo || 'Ubuntu 24.04 LTS (x86_64)',
        }
      ]).select().single();

      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: `node-${Date.now()}`,
        node_id_code: nodeCode,
        name,
        network_id: networkId,
        node_type: nodeType || 'customer_owned',
        ip_address: `192.168.10.${Math.floor(20 + Math.random() * 200)}`,
        total_storage_bytes: totalBytes,
        used_storage_bytes: 0,
        status: 'healthy',
        health_score: 100,
        latency_ms: 15,
        last_heartbeat: 'Just now',
        version: 'v1.4.2-p2p',
        os_info: osInfo || 'Ubuntu 24.04 LTS (x86_64)',
        uptime_pct: 100.0,
        created_at: new Date().toISOString(),
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
