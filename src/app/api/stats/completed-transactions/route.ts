import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get completed bookings count
    const { count: completedBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Completed');

    // Get completed sales count
    const { count: completedSales } = await supabase
      .from('sales')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    const totalCompleted = (completedBookings || 0) + (completedSales || 0);

    return NextResponse.json({ count: totalCompleted });
  } catch (error) {
    console.error('Error fetching completed transactions count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch completed transactions count', count: 0 },
      { status: 500 }
    );
  }
}
