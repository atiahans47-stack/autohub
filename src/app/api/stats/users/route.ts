import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get unique users who have completed bookings (satisfied customers)
    const { data: completedBookings } = await supabase
      .from('bookings')
      .select('customer_id')
      .eq('status', 'Completed');

    // Count unique customer_ids
    const uniqueCustomers = new Set(completedBookings?.map(b => b.customer_id) || []);
    const satisfiedCustomersCount = uniqueCustomers.size;

    return NextResponse.json({ count: satisfiedCustomersCount });
  } catch (error) {
    console.error('Error fetching satisfied customers count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch satisfied customers count', count: 0 },
      { status: 500 }
    );
  }
}
