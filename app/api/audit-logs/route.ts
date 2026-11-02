import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { initialAuditLogs } from '@/lib/mock-data';

export async function GET() {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: 'supabase', data });
      }
    } catch {
      // Fallback
    }
  }

  return NextResponse.json({ success: true, source: 'mock', data: initialAuditLogs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, targetType, targetId, details, organizationId, userName, userEmail } = body;

    const supabase = getServiceSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('audit_logs').insert([
        {
          organization_id: organizationId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          user_name: userName || 'Alex Rivers',
          user_email: userEmail || 'alex@acme.corp',
          action,
          target_type: targetType,
          target_id: targetId,
          details,
          ip_address: '127.0.0.1',
        }
      ]).select().single();

      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: `aud-${Date.now()}`,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
        created_at: new Date().toISOString(),
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
