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
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { SearchInput, SelectInput } from "@/components/ui/FormFields";

interface Sale {
  id: string;
  customer: string;
  email: string;
  phone: string;
  car: string;
  carImage: string;
  price: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  createdAt: string;
  paymentMethod: string;
}

export default function SalesManagement() {
  const router = useRouter();
  const hasLoadedData = useRef(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Pending' | 'Processing' | 'Completed' | 'Cancelled'>('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const loadSales = async () => {
    try {
      const token = localStorage.getItem('adminSession');
      const response = await fetch('/api/sales', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      const salesData = data.sales.map((sale: { _id: string; customerName: string; customerEmail: string; customerPhone: string; carName: string; amount: number; status: string; createdAt: string }) => ({
        id: sale._id,
        customer: sale.customerName,
        email: sale.customerEmail,
        phone: sale.customerPhone,
        car: sale.carName,
        carImage: '',
        price: sale.amount,
        status: sale.status as 'Pending' | 'Processing' | 'Completed' | 'Cancelled',
        createdAt: sale.createdAt,
        paymentMethod: 'Cash',
      }));
      
      setSales(salesData);
    } catch (error) {
      console.error('Error loading sales:', error);
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
      loadSales();
    }
  }, [router]);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || sale.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = async (saleId: string, newStatus: Sale['status']) => {
    try {
      const token = localStorage.getItem('adminSession');
      const response = await fetch(`/api/sales/${saleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setSales(sales.map(sale => 
          sale.id === saleId ? { ...sale, status: newStatus } : sale
        ));
      } else {
        alert('Failed to update sale status');
      }
    } catch (error) {
      console.error('Error updating sale status:', error);
      alert('Failed to update sale status');
    }
  };

  const getStatusColor = (status: Sale['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} XAF`;
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
                <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
                <p className="text-sm text-gray-600">Manage vehicle sales</p>
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
                placeholder="Search sales..."
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
                  { label: "Processing", value: "Processing" },
                  { label: "Completed", value: "Completed" },
                  { label: "Cancelled", value: "Cancelled" }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Sales ({filteredSales.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Car</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Payment</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{sale.customer}</p>
                          <p className="text-sm text-gray-600">{sale.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={sale.carImage}
                            alt={sale.car}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <p className="font-medium text-gray-900">{sale.car}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {formatPrice(sale.price)}
                      </td>
                      <td className="py-4 px-4 text-gray-600">{sale.paymentMethod}</td>
                      <td className="py-4 px-4 text-gray-600">{sale.createdAt}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(sale.status)}`}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(sale)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {sale.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(sale.id, 'Processing')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Process"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(sale.id, 'Cancelled')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {sale.status === 'Processing' && (
                            <button
                              onClick={() => handleStatusChange(sale.id, 'Completed')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Complete Sale"
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

            {filteredSales.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No sales found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sale Detail Modal */}
      {isDetailModalOpen && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Sale Details</h2>
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
                  <h3 className="font-semibold text-gray-900">{selectedSale.customer}</h3>
                  <p className="text-sm text-gray-600">{selectedSale.email}</p>
                  <p className="text-sm text-gray-600">{selectedSale.phone}</p>
                </div>
              </div>

              {/* Car Info */}
              <div className="flex items-start gap-4">
                <img
                  src={selectedSale.carImage}
                  alt={selectedSale.car}
                  className="w-24 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedSale.car}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(selectedSale.status)}`}>
                    {selectedSale.status}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(selectedSale.price)}</p>
                  <p className="text-sm text-gray-600">Payment Method: {selectedSale.paymentMethod}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sale Date: {selectedSale.createdAt}</p>
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
              {selectedSale.status === 'Pending' && (
                <>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedSale.id, 'Processing');
                      setIsDetailModalOpen(false);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Process Sale
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedSale.id, 'Cancelled');
                      setIsDetailModalOpen(false);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Sale
                  </button>
                </>
              )}
              {selectedSale.status === 'Processing' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedSale.id, 'Completed');
                    setIsDetailModalOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Complete Sale
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
