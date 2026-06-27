import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Booking, Sale } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();

    console.log('Fapshi webhook received:', webhookData);

    const { transId, status, externalId, amount, email, payerName } = webhookData;

    // Verify the transaction status
    if (status === 'SUCCESSFUL') {
      // Update booking or sale based on externalId
      // externalId should contain the booking/sale ID and type
      // Format: "booking-{id}" or "sale-{id}"
      
      if (externalId && externalId.startsWith('booking-')) {
        const bookingId = externalId.replace('booking-', '');
        
        const { error } = await (supabase.from('bookings') as any)
          .update({ 
            payment_status: 'Paid',
            status: 'Confirmed'
          })
          .eq('id', bookingId);

        if (error) {
          console.error('Error updating booking payment:', error);
        }
      } else if (externalId && externalId.startsWith('sale-')) {
        const saleId = externalId.replace('sale-', '');
        
        const { error } = await (supabase.from('sales') as any)
          .update({ 
            payment_status: 'Paid',
            status: 'Completed'
          })
          .eq('id', saleId);

        if (error) {
          console.error('Error updating sale payment:', error);
        }
      }
    }

    return NextResponse.json({ message: 'Webhook received successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
