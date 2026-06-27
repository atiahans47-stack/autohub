import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/fapshi';
import { supabase } from '@/lib/supabase';
import type { Payment } from '@/types/database';

interface PaymentVerifyBody {
  transactionId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PaymentVerifyBody = await req.json();
    const result = await verifyPayment(body.transactionId);

    if (result.status) {
      await (supabase.from('payments') as any)
        .update({ fapshi_status: result.status, status: result.status === 'SUCCESSFUL' ? 'success' : result.status === 'FAILED' ? 'failed' : 'pending' })
        .eq('fapshi_transaction_id', body.transactionId);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Verification error' }, { status: 500 });
  }
}
