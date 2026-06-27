'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Car, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Calendar,
  LogOut,
  MessageSquare,
  MessageCircle,
  Settings,
  Users,
  LayoutDashboard,
  Menu,
  X,
  LucideIcon
} from 'lucide-react';
import Link from 'next/link';

interface Stat {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

interface Booking {
  id: string;
  customer: string;
  car: string;
  date: string;
  status: string;
  amount: string;
}

interface Sale {
  id: string;
  customer: string;
  car: string;
  date: string;
  status: string;
  amount: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Cars', href: '/admin/cars', icon: Car },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Sales', href: '/admin/sales', icon: ShoppingCart },
  { name: 'Live Chat', href: '/admin/chat', icon: MessageCircle },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Content', href: '/admin/content', icon: Settings },
  { name: 'Users', href: '/admin/users', icon: Users },
];

export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const hasLoadedData = useRef(false);
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminSession');
      
      // Fetch cars count
      const carsResponse = await fetch('/api/cars', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const carsData = await carsResponse.json();
      
      // Fetch bookings count
      const bookingsResponse = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const bookingsData = await bookingsResponse.json();
      
      // Fetch sales count
      const salesResponse = await fetch('/api/sales', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const salesData = await salesResponse.json();
      
      // Calculate total revenue
      const totalBookingsRevenue = bookingsData.bookings?.reduce((sum: number, b: { amount: number }) => sum + (b.amount || 0), 0) || 0;
      const totalSalesRevenue = salesData.sales?.reduce((sum: number, s: { amount: number }) => sum + (s.amount || 0), 0) || 0;
      const totalRevenue = totalBookingsRevenue + totalSalesRevenue;
      
      // Update stats with real data
      setStats([
        {
          title: 'Total Cars',
          value: carsData.cars?.length || '0',
          change: `${carsData.cars?.filter((c: { type: string }) => c.type === 'rental').length || 0} rental, ${carsData.cars?.filter((c: { type: string }) => c.type === 'sale').length || 0} sale`,
          icon: Car,
          color: 'bg-blue-500',
        },
        {
          title: 'Active Bookings',
          value: bookingsData.bookings?.filter((b: { status: string }) => b.status === 'Active').length || '0',
          change: `${bookingsData.bookings?.length || 0} total bookings`,
          icon: Calendar,
          color: 'bg-green-500',
        },
        {
          title: 'Total Sales',
          value: salesData.sales?.length || '0',
          change: `${salesData.sales?.filter((s: { status: string }) => s.status === 'Completed').length || 0} completed`,
          icon: ShoppingCart,
          color: 'bg-purple-500',
        },
        {
          title: 'Total Revenue',
          value: `${totalRevenue.toLocaleString()} XAF`,
          change: `Bookings: ${totalBookingsRevenue.toLocaleString()}, Sales: ${totalSalesRevenue.toLocaleString()}`,
          icon: DollarSign,
          color: 'bg-yellow-500',
        },
      ]);

      // Update recent bookings with real data
      setRecentBookings(bookingsData.bookings?.slice(0, 5).map((booking: { _id: string; customerName: string; carName: string; createdAt: string; status: string; amount: number }) => ({
        id: booking._id,
        customer: booking.customerName,
        car: booking.carName,
        date: new Date(booking.createdAt).toLocaleDateString(),
        status: booking.status,
        amount: `${(booking.amount || 0).toLocaleString()} XAF`,
      })) || []);

      // Update recent sales with real data
      setRecentSales(salesData.sales?.slice(0, 5).map((sale: { _id: string; customerName: string; carName: string; createdAt: string; status: string; amount: number }) => ({
        id: sale._id,
        customer: sale.customerName,
        car: sale.carName,
        date: new Date(sale.createdAt).toLocaleDateString(),
        status: sale.status,
        amount: `${(sale.amount || 0).toLocaleString()} XAF`,
      })) || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useEffect(() => {
    // Check if admin is logged in
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      router.push('/admin/login');
      return;
    }

    // Load real data from API
    if (!hasLoadedData.current) {
      hasLoadedData.current = true;
      loadDashboardData();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminEmail');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-gray-900">AUTOHub</h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, Admin</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Inventory Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Inventory Overview</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Car className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">Rental Cars</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{stats[0]?.value || '0'}</p>
                  <p className="text-sm text-gray-600">Available for rent</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingCart className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium text-gray-900">Cars for Sale</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{stats[2]?.value || '0'}</p>
                  <p className="text-sm text-gray-600">Available for purchase</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium text-gray-900">Active Rentals</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{stats[1]?.value || '0'}</p>
                  <p className="text-sm text-gray-600">Currently rented</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                <Link href="/admin/bookings" className="text-blue-600 text-sm hover:underline">View All</Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentBookings.length > 0 ? recentBookings.map((booking, index) => (
                    <div key={booking.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{booking.customer}</p>
                        <p className="text-sm text-gray-600">{booking.car}</p>
                        <p className="text-xs text-gray-500">{booking.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{booking.amount}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          booking.status === 'Active' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">No recent bookings</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Sales</h2>
                <Link href="/admin/sales" className="text-blue-600 text-sm hover:underline">View All</Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentSales.length > 0 ? recentSales.map((sale, index) => (
                    <div key={sale.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{sale.customer}</p>
                        <p className="text-sm text-gray-600">{sale.car}</p>
                        <p className="text-xs text-gray-500">{sale.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{sale.amount}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          sale.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          sale.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {sale.status}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">No recent sales</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
