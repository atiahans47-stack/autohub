'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  ArrowLeft,
  Eye,
  Check,
  X,
  Calendar,
  MapPin,
  User,
  Clock,
  Car
} from 'lucide-react';
import Link from 'next/link';
import { SearchInput, SelectInput } from "@/components/ui/FormFields";

interface Booking {
  id: string;
  customer: string;
  email: string;
  phone: string;
  car: string;
  carImage: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export default function BookingsManagement() {
  const router = useRouter();
  const hasLoadedData = useRef(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem('adminSession');
      const response = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      const bookingsData = data.bookings.map((booking: { _id: string; customerName: string; customerEmail: string; customerPhone: string; carName: string; carImage: string; startDate: string; endDate: string; location: string; amount: number; status: string; createdAt: string }) => ({
        id: booking._id,
        customer: booking.customerName,
        email: booking.customerEmail,
        phone: booking.customerPhone,
        car: booking.carName,
        carImage: booking.carImage,
        pickupDate: booking.startDate,
        returnDate: booking.endDate,
        pickupLocation: booking.location,
        totalPrice: booking.amount,
        status: booking.status as 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled',
        createdAt: booking.createdAt,
      }));
      
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      router.push('/admin/login');
      return;
    }

    if (!hasLoadedData.current) {
      hasLoadedData.current = true;
      loadBookings();
    }
  }, [router]);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      (booking.customer?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (booking.car?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (booking.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      const token = localStorage.getItem('adminSession');
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setBookings(bookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        ));
      } else {
        alert('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
                <p className="text-sm text-gray-600">Manage rental bookings</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <SelectInput
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                options={[
                  { label: "All Status", value: "all" },
                  { label: "Pending", value: "Pending" },
                  { label: "Confirmed", value: "Confirmed" },
                  { label: "Active", value: "Active" },
                  { label: "Completed", value: "Completed" },
                  { label: "Cancelled", value: "Cancelled" }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Bookings ({filteredBookings.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Car</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Dates</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{booking.customer && booking.customer !== 'Unknown' ? booking.customer : booking.email || 'Unknown'}</p>
                          <p className="text-sm text-gray-600">{booking.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {booking.carImage ? (
                            <img
                              src={booking.carImage}
                              alt={booking.car}
                              className="w-16 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <Car className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <p className="font-medium text-gray-900">{booking.car}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p className="text-gray-900">{booking.pickupDate}</p>
                          <p className="text-gray-600">to {booking.returnDate}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{booking.pickupLocation}</td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {booking.totalPrice ? booking.totalPrice.toLocaleString() : '0'} XAF
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {booking.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(booking.id, 'Confirmed')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Confirm"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(booking.id, 'Cancelled')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {booking.status === 'Confirmed' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'Active')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Start Rental"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          {booking.status === 'Active' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'Completed')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Complete"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No bookings found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Booking Detail Modal */}
      {isDetailModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedBooking.customer && selectedBooking.customer !== 'Unknown' ? selectedBooking.customer : selectedBooking.email || 'Unknown'}</h3>
                  <p className="text-sm text-gray-600">{selectedBooking.email}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.phone}</p>
                </div>
              </div>

              {/* Car Info */}
              <div className="flex items-start gap-4">
                {selectedBooking.carImage ? (
                  <img
                    src={selectedBooking.carImage}
                    alt={selectedBooking.car}
                    className="w-24 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <Car className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedBooking.car}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pickup: {selectedBooking.pickupDate}</p>
                  <p className="text-sm text-gray-600">Return: {selectedBooking.returnDate}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedBooking.pickupLocation}</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{selectedBooking.totalPrice ? selectedBooking.totalPrice.toLocaleString() : '0'} XAF</p>
                  <p className="text-sm text-gray-600">Booked on: {selectedBooking.createdAt}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedBooking.status === 'Pending' && (
                <>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'Confirmed');
                      setIsDetailModalOpen(false);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'Cancelled');
                      setIsDetailModalOpen(false);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
