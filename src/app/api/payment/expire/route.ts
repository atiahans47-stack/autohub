import { NextRequest, NextResponse } from 'next/server';
import { expirePayment } from '@/lib/fapshi';

interface PaymentExpireBody {
  transactionId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PaymentExpireBody = await req.json();
    const result = await expirePayment(body.transactionId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error expiring payment' }, { status: 500 });
  }
}
