const FAPSHI_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://live.fapshi.com'
  : 'https://sandbox.fapshi.com';

const headers = {
  'apiuser': process.env.FAPSHI_API_USER!,
  'apikey': process.env.FAPSHI_API_KEY!,
  'Content-Type': 'application/json',
};

export async function initiatePayment(data: {
  amount: number;
  phone: string;
  name: string;
  email: string;
  message: string;
  redirectUrl?: string;
  userId?: string;
}) {
  const response = await fetch(`${FAPSHI_BASE_URL}/initiate-pay`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      amount: data.amount,
      phone: data.phone.replace('+237','').replace(/\s/g,''),
      name: data.name,
      email: data.email,
      message: data.message,
      redirectUrl: data.redirectUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/booking/confirmed`,
      userId: data.userId,
    })
  });
  return response.json();
}

export async function verifyPayment(transactionId: string) {
  const response = await fetch(`${FAPSHI_BASE_URL}/payment-status/${transactionId}`, {
    method: 'GET',
    headers,
  });
  return response.json();
}

export async function directPay(data: {
  amount: number;
  phone: string;
  name: string;
  email: string;
  message: string;
}) {
  const response = await fetch(`${FAPSHI_BASE_URL}/direct-pay`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      amount: data.amount,
      phone: data.phone.replace('+237','').replace(/\s/g,''),
      name: data.name,
      email: data.email,
      message: data.message,
    })
  });
  return response.json();
}

export async function expirePayment(transactionId: string) {
  const response = await fetch(`${FAPSHI_BASE_URL}/expire-pay`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ transId: transactionId })
  });
  return response.json();
}
