'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Car, Clock, CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

interface Booking {
  id: string;
  car_name: string;
  start_date: string;
  end_date: string;
  location: string;
  amount: number;
  status: BookingStatus;
  payment_status: string;
  created_at: string;
}

export default function UserBookingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | 'All'>('All');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/dashboard/bookings');
      return;
    }

    async function loadBookings() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('customer_id', user!.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setBookings(data || []);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [user, router]);

  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your car rental bookings</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex gap-2 flex-wrap">
              {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as BookingStatus | 'All')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'All' 
                ? "You haven't made any bookings yet." 
                : `No ${filter.toLowerCase()} bookings found.`}
            </p>
            <button
              onClick={() => router.push('/rent-cars')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Car Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Car className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{booking.car_name}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Amount */}
                  <div className="flex flex-col md:items-end gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {booking.amount?.toLocaleString()} XAF
                    </div>
                    <div className="text-xs text-gray-500">
                      Booked on {new Date(booking.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Payment:</span>
                    <span className={`font-medium ${
                      booking.payment_status === 'Paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {booking.payment_status}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push(`/booking/confirmed?booking=${booking.id}&success=true`)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
