'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Car, Users, Calendar, DollarSign, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';

interface DashboardStats {
  totalCars: number;
  totalUsers: number;
  totalBookings: number;
  totalSales: number;
  totalRevenue: number;
  pendingMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Cars',
      value: stats.totalCars,
      icon: Car,
      color: 'bg-blue-500',
      link: '/admin/cars',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      link: '/admin/users',
    },
    {
      title: 'Active Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-purple-500',
      link: '/admin/bookings',
    },
    {
      title: 'Car Sales',
      value: stats.totalSales,
      icon: DollarSign,
      color: 'bg-yellow-500',
      link: '/admin/sales',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-pink-500',
      link: '/admin/analytics',
    },
    {
      title: 'Unread Chats',
      value: stats.pendingMessages,
      icon: MessageSquare,
      color: 'bg-red-500',
      link: '/admin/chat',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Welcome back! Here's an overview of your business.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-8 w-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : (
            statCards.map((card) => (
              <Link
                key={card.title}
                href={card.link}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-blue-600 group-hover:text-blue-700">
                  <span>View details</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/cars/add"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Car className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-700">Add New Car</span>
            </Link>
            <Link
              href="/admin/content"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-700">Manage Content</span>
            </Link>
            <Link
              href="/admin/chat"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-700">Live Chat</span>
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-pink-600" />
              <span className="font-medium text-gray-700">View Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
