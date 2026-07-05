import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Get all active/confirmed bookings that have expired
    const now = new Date().toISOString();
    
    const { data: expiredBookings, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('id, car_id, status, end_date')
      .in('status', ['Confirmed', 'Active'])
      .lt('end_date', now);

    if (fetchError) throw fetchError;

    if (!expiredBookings || expiredBookings.length === 0) {
      return NextResponse.json({ 
        message: 'No expired bookings found',
        updated: 0 
      });
    }

    // Update each expired booking to 'Completed' and set car back to 'Available'
    let updatedCount = 0;
    const carIds = new Set<string>();

    for (const booking of expiredBookings) {
      // Update booking status
      const { error: bookingUpdateError } = await supabaseAdmin
        .from('bookings')
        .update({ 
          status: 'Completed',
          payment_status: 'Paid'
        })
        .eq('id', booking.id);

      if (!bookingUpdateError) {
        carIds.add(booking.car_id);
        updatedCount++;
      }
    }

    // Update all affected cars back to 'Available'
    if (carIds.size > 0) {
      const { error: carUpdateError } = await supabaseAdmin
        .from('cars')
        .update({ availability: 'Available' })
        .in('id', Array.from(carIds));

      if (carUpdateError) {
        console.error('Error updating car availability:', carUpdateError);
      }
    }

    return NextResponse.json({ 
      message: 'Expired bookings processed successfully',
      updated: updatedCount,
      carsReleased: carIds.size
    });
  } catch (error) {
    console.error('Check expired bookings error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      updated: 0
    }, { status: 500 });
  }
}
