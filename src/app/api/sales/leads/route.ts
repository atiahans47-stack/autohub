import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';
import type { SalesLead } from '@/types/database';

// GET all leads (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    if (!isAdminUser(user)) {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase.from('sales_leads').select('*');

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const { data: leads, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ leads: leads || [] });
  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { error: 'Internal server error', leads: [] },
      { status: 500 }
    );
  }
}

// POST create new lead
export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json() as Partial<SalesLead>;

    const { data: lead, error } = await (supabase.from('sales_leads') as any)
      .insert(leadData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Lead created successfully',
      lead,
    }, { status: 201 });
  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
