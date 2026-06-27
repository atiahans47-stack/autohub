import { NextRequest, NextResponse } from 'next/server';
import { initiatePayment } from '@/lib/fapshi';
import { supabase } from '@/lib/supabase';
import type { Payment } from '@/types/database';

interface PaymentInitiateBody {
  amount: number;
  phone: string;
  name: string;
  email: string;
  message?: string;
  bookingId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PaymentInitiateBody = await req.json();

    if (!body.amount || !body.phone || !body.name || !body.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await initiatePayment({ amount: body.amount, phone: body.phone, name: body.name, email: body.email, message: body.message || '' });

    if (result.transId) {
      await (supabase.from('payments') as any).insert({
        booking_id: body.bookingId,
        amount: body.amount,
        phone: body.phone,
        fapshi_transaction_id: result.transId,
        fapshi_status: 'pending',
        status: 'pending',
        payment_method: body.phone.replace('+237','').replace(/\s/g,'').startsWith('6') ? 'mtn_momo' : 'orange_money',
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Payment error' }, { status: 500 });
  }
}
