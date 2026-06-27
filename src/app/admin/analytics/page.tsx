'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Car,
  Users,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { SelectInput } from "@/components/ui/FormFields";

export default function Analytics() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topCars, setTopCars] = useState<any[]>([]);
  const [locationStats, setLocationStats] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      router.push('/admin/login');
      return;
    }
    loadAnalyticsData();
  }, [router, timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminSession');
      
      // Fetch bookings and sales data
      const [bookingsRes, salesRes, carsRes] = await Promise.all([
        fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/sales', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/cars', { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      const bookingsData = await bookingsRes.json();
      const salesData = await salesRes.json();
      const carsData = await carsRes.json();

      const bookings = bookingsData.bookings || [];
      const sales = salesData.sales || [];
      const cars = carsData.cars || [];

      // Calculate revenue data by month
      const monthlyRevenue = new Map<string, { revenue: number; bookings: number; sales: number }>();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      bookings.forEach((b: { createdAt: string; amount: number }) => {
        const date = new Date(b.createdAt);
        const month = months[date.getMonth()];
        if (!monthlyRevenue.has(month)) {
          monthlyRevenue.set(month, { revenue: 0, bookings: 0, sales: 0 });
        }
        const data = monthlyRevenue.get(month)!;
        data.revenue += b.amount;
        data.bookings += 1;
      });

      sales.forEach((s: { createdAt: string; amount: number }) => {
        const date = new Date(s.createdAt);
        const month = months[date.getMonth()];
        if (!monthlyRevenue.has(month)) {
          monthlyRevenue.set(month, { revenue: 0, bookings: 0, sales: 0 });
        }
        const data = monthlyRevenue.get(month)!;
        data.revenue += s.amount;
        data.sales += 1;
      });

      const revenueDataArray = Array.from(monthlyRevenue.entries()).map(([period, data]) => ({
        period,
        revenue: data.revenue,
        bookings: data.bookings,
        sales: data.sales,
      }));

      setRevenueData(revenueDataArray);

      // Calculate top cars by bookings
      const carBookings = new Map<string, { bookings: number; revenue: number }>();
      bookings.forEach((b: { carName: string; amount: number }) => {
        if (!carBookings.has(b.carName)) {
          carBookings.set(b.carName, { bookings: 0, revenue: 0 });
        }
        const data = carBookings.get(b.carName)!;
        data.bookings += 1;
        data.revenue += b.amount;
      });

      const topCarsArray = Array.from(carBookings.entries())
        .map(([name, data]) => ({ name, bookings: data.bookings, revenue: data.revenue }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5);

      setTopCars(topCarsArray);

      // Calculate location stats
      const locationData = new Map<string, { bookings: number; revenue: number }>();
      bookings.forEach((b: { location: string; amount: number }) => {
        if (!locationData.has(b.location)) {
          locationData.set(b.location, { bookings: 0, revenue: 0 });
        }
        const data = locationData.get(b.location)!;
        data.bookings += 1;
        data.revenue += b.amount;
      });

      const locationStatsArray = Array.from(locationData.entries())
        .map(([location, data]) => ({ location, bookings: data.bookings, revenue: data.revenue }))
        .sort((a, b) => b.revenue - a.revenue);

      setLocationStats(locationStatsArray);

      // Calculate KPIs
      const totalRevenue = bookings.reduce((sum: number, b: { amount: number }) => sum + b.amount, 0) +
                          sales.reduce((sum: number, s: { amount: number }) => sum + s.amount, 0);
      const totalBookings = bookings.length;
      const carsRented = bookings.filter((b: { status: string }) => b.status === 'Active').length;
      const activeUsers = new Set([...bookings.map((b: { customerEmail: string }) => b.customerEmail), 
                                    ...sales.map((s: { customerEmail: string }) => s.customerEmail)]).size;

      setKpis([
        {
          title: 'Total Revenue',
          value: `${totalRevenue.toLocaleString()} XAF`,
          change: `${bookings.length + sales.length} transactions`,
          icon: DollarSign,
          color: 'bg-green-500',
        },
        {
          title: 'Total Bookings',
          value: totalBookings.toString(),
          change: `${bookings.filter((b: { status: string }) => b.status === 'Active').length} active`,
          icon: Calendar,
          color: 'bg-blue-500',
        },
        {
          title: 'Cars Rented',
          value: carsRented.toString(),
          change: `${cars.filter((c: { type: string }) => c.type === 'rental').length} available`,
          icon: Car,
          color: 'bg-purple-500',
        },
        {
          title: 'Active Users',
          value: activeUsers.toString(),
          change: 'Total customers',
          icon: Users,
          color: 'bg-orange-500',
        },
      ]);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRevenue = (value: number) => {
    return `${value.toLocaleString()} XAF`;
  };

  const maxRevenue = revenueData.length > 0 ? Math.max(...revenueData.map(d => d.revenue)) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-sm text-gray-600">Track your business performance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <SelectInput
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
                  options={[
                    { label: "Last 7 Days", value: "7d" },
                    { label: "Last 30 Days", value: "30d" },
                    { label: "Last 90 Days", value: "90d" },
                    { label: "Last Year", value: "1y" }
                  ]}
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi) => (
            <div key={kpi.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.color}`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{kpi.change}</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{kpi.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Overview</h2>
            <div className="space-y-4">
              {revenueData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-gray-600">{data.period}</div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-300"
                        style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <p className="font-semibold text-gray-900">{formatRevenue(data.revenue)}</p>
                    <p className="text-xs text-gray-600">{data.bookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Cars */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Cars</h2>
            <div className="space-y-4">
              {topCars.map((car, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{car.name}</p>
                    <p className="text-sm text-gray-600">{car.bookings} bookings</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatRevenue(car.revenue)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance by Location</h2>
            <div className="space-y-4">
              {locationStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <p className="font-medium text-gray-900">{stat.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatRevenue(stat.revenue)}</p>
                    <p className="text-sm text-gray-600">{stat.bookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking vs Sales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Bookings vs Sales</h2>
            <div className="space-y-4">
              {revenueData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-gray-600">{data.period}</div>
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1">
                      <div className="h-6 bg-blue-100 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-lg"
                          style={{ width: `${(data.bookings / 70) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{data.bookings} bookings</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-6 bg-green-100 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-lg"
                          style={{ width: `${(data.sales / 10) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{data.sales} sales</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-gray-600">Bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-600">Sales</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
