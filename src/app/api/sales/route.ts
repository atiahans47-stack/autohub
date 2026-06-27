import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';
import type { Sale } from '@/types/database';

// GET all sales (admin only)
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

    const supabaseAdmin = getSupabaseAdmin();
    let query = supabaseAdmin.from('sales').select('*');

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const { data: sales, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ sales: sales || [] });
  } catch (error) {
    console.error('Get sales error:', error);
    return NextResponse.json(
      { error: 'Internal server error', sales: [] },
      { status: 500 }
    );
  }
}

// POST create new sale
export async function POST(request: NextRequest) {
  try {
    const saleData = await request.json() as Partial<Sale>;

    const supabaseAdmin = getSupabaseAdmin();
    const { data: sale, error } = await supabaseAdmin
      .from('sales')
      .insert(saleData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Sale created successfully',
      sale,
    }, { status: 201 });
  } catch (error) {
    console.error('Create sale error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
