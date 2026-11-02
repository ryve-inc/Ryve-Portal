import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { networkId, maxUses } = body;

    const code = `RYV-ENR-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const supabase = getServiceSupabase();

    if (supabase) {
      const { data, error } = await supabase.from('enrollment_codes').insert([
        {
          network_id: networkId,
          code,
          created_by: 'Alex Rivers',
          max_uses: maxUses || 10,
          current_uses: 0,
          is_active: true,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ]).select().single();

      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: `enr-${Date.now()}`,
        network_id: networkId,
        code,
        max_uses: maxUses || 10,
        current_uses: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
