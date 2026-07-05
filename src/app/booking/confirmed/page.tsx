'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, MapPin, Car, ArrowRight, Home } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function BookingConfirmedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadBooking() {
      const bookingId = searchParams.get('booking');
      const success = searchParams.get('success');

      if (!bookingId || success !== 'true') {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        // Update booking status to Confirmed and payment_status to Paid
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ 
            status: 'Confirmed',
            payment_status: 'Paid'
          })
          .eq('id', bookingId);

        if (updateError) {
          console.error('Error updating booking status:', updateError);
        }

        const { data, error: fetchError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (fetchError) throw fetchError;

        setBooking(data);
      } catch (err) {
        console.error('Error loading booking:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">✕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find your booking details.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-green-100">Your payment was successful</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="text-sm text-gray-600 mb-1">Booking Reference</div>
              <div className="text-2xl font-bold text-blue-600">{booking.id}</div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Car className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Vehicle</div>
                  <div className="font-semibold text-gray-900">{booking.car_name}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Rental Period</div>
                  <div className="font-semibold text-gray-900">
                    {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Pickup Location</div>
                  <div className="font-semibold text-gray-900">{booking.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="h-5 w-5 text-gray-400 mt-1">FCFA</div>
                <div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                  <div className="font-semibold text-gray-900">{booking.amount?.toLocaleString()} XAF</div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg mb-6">
              <div>
                <div className="text-sm text-gray-600">Payment Status</div>
                <div className="font-semibold text-green-600">Paid</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Booking Status</div>
                <div className="font-semibold text-green-600">Confirmed</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/dashboard/bookings')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>View My Bookings</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>A confirmation email has been sent to your email address.</p>
          <p className="mt-2">If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
