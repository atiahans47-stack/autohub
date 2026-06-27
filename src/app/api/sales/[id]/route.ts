import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';
import type { Sale, SingleResult } from '@/types/database';

// GET single sale
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const { data: sale, error } = await supabase
      .from('sales')
      .select('*')
      .eq('id', id)
      .single() as SingleResult<Sale>;

    if (error || !sale) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ sale });
  } catch (error) {
    console.error('Get sale error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update sale (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const saleData = await request.json() as Partial<Sale>;

    const { data: sale, error } = await (supabase.from('sales') as any)
      .update(saleData)
      .eq('id', id)
      .select()
      .single();

    if (error || !sale) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Sale updated successfully',
      sale,
    });
  } catch (error) {
    console.error('Update sale error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE sale (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Sale deleted successfully',
    });
  } catch (error) {
    console.error('Delete sale error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
