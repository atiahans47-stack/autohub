import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';
import type { MaintenanceLog } from '@/types/database';

// GET all maintenance logs (admin only)
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
    const carId = searchParams.get('carId');
    const status = searchParams.get('status');

    let query = supabase.from('maintenance_logs').select('*');

    if (carId) {
      query = query.eq('car_id', carId);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const { data: logs, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ logs: logs || [] });
  } catch (error) {
    console.error('Get maintenance logs error:', error);
    return NextResponse.json(
      { error: 'Internal server error', logs: [] },
      { status: 500 }
    );
  }
}

// POST add maintenance log (admin only)
export async function POST(request: NextRequest) {
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

    const logData = await request.json() as Partial<MaintenanceLog>;

    const { data: log, error } = await (supabase.from('maintenance_logs') as any)
      .insert(logData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Maintenance log added successfully',
      log,
    }, { status: 201 });
  } catch (error) {
    console.error('Add maintenance log error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
