"use client";
import { useState } from 'react';
import { isMTNNumber, isOrangeNumber, isValidCameroonPhone, formatXAF } from '@/lib/cameroon';

interface FapshiPaymentProps {
  amount: number;
  bookingId?: string;
  customerName: string;
  customerEmail: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export default function FapshiPayment({ amount, bookingId, customerName, customerEmail, onSuccess, onError }: FapshiPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<'mtn_momo' | 'orange_money' | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const validateAndSetPhone = (value: string) => {
    setPhone(value);
    if (!value) { setPhoneError(''); return; }
    if (!isValidCameroonPhone(value)) {
      setPhoneError('Invalid number. Enter a valid Cameroonian number');
      return;
    }
    if (selectedMethod === 'mtn_momo' && !isMTNNumber(value)) {
      setPhoneError('This is not an MTN number. Use a 67X or 65X number');
      return;
    }
    if (selectedMethod === 'orange_money' && !isOrangeNumber(value)) {
      setPhoneError('This is not an Orange number. Use a 69X number');
      return;
    }
    setPhoneError('');
  };

  const handlePay = async () => {
    if (!selectedMethod || !phone || phoneError) return;
    setLoading(true);
    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          phone: `237${phone.replace(/\s/g,'')}`,
          name: customerName,
          email: customerEmail,
          message: `Car rental payment - ${bookingId || 'AUTOHub'}`,
          bookingId,
        })
      });
      const data = await res.json();
      if (data.transId) {
        onSuccess(data.transId);
      } else {
        onError(data.message || 'Payment failed');
      }
    } catch {
      onError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 font-medium">Select your payment method</p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => { setSelectedMethod('mtn_momo'); setPhone(''); setPhoneError(''); }}
          className={`border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${selectedMethod === 'mtn_momo' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'}`}
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black text-sm">MTN</div>
          <span className="text-sm font-medium text-gray-800">MTN MoMo</span>
        </button>

        <button
          onClick={() => { setSelectedMethod('orange_money'); setPhone(''); setPhoneError(''); }}
          className={`border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${selectedMethod === 'orange_money' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
        >
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white text-sm">OM</div>
          <span className="text-sm font-medium text-gray-800">Orange Money</span>
        </button>
      </div>

      {selectedMethod && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {selectedMethod === 'mtn_momo' ? 'MTN' : 'Orange'} Mobile Money number
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600 font-medium">+237</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => validateAndSetPhone(e.target.value)}
              placeholder={selectedMethod === 'mtn_momo' ? '670 000 000' : '690 000 000'}
              className="flex-1 bg-white border border-gray-300 rounded-r-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              maxLength={9}
            />
          </div>
          {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total amount</span>
          <span className="text-lg font-bold text-gray-900">{formatXAF(amount)}</span>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={!selectedMethod || !phone || !!phoneError || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
        ) : (
          `Pay ${formatXAF(amount)}` 
        )}
      </button>

      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
        🔒 Secure payment by <span className="font-medium text-gray-500">Fapshi</span>
      </p>
    </div>
  );
}
