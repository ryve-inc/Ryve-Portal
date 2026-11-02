import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { networkId, capacityTb, billingCycle, organizationId } = body;

    const pricePerMonth = (capacityTb || 1) * 4.0; // $4/TB
    const supabase = getServiceSupabase();

    if (supabase) {
      const { data, error } = await supabase.from('storage_requests').insert([
        {
          organization_id: organizationId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          network_id: networkId,
          requested_capacity_tb: capacityTb,
          billing_cycle: billingCycle || 'monthly',
          price_per_month_usd: pricePerMonth,
          status: 'active',
        }
      ]).select().single();

      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: `req-${Date.now()}`,
        network_id: networkId,
        requested_capacity_tb: capacityTb,
        billing_cycle: billingCycle || 'monthly',
        price_per_month_usd: pricePerMonth,
        status: 'active',
        created_at: new Date().toISOString(),
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
