'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  ArrowLeft,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { SearchInput, SelectInput } from "@/components/ui/FormFields";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  status: 'Active' | 'Inactive' | 'Suspended';
  totalBookings: number;
  totalPurchases: number;
  joinedDate: string;
  lastActive: string;
}

export default function UsersManagement() {
  const router = useRouter();
  const hasLoadedData = useRef(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'customer' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Inactive' | 'Suspended'>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('adminSession');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error loading users:', data.error);
        return;
      }
      
      const usersData = (data.users || []).map((user: { _id: string; name: string; email: string; phone: string; role: string; status: string; totalBookings: number; totalPurchases: number; joinedDate: string; lastActive: string }) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role as 'customer' | 'admin',
        status: user.status as 'Active' | 'Inactive' | 'Suspended',
        totalBookings: user.totalBookings,
        totalPurchases: user.totalPurchases,
        joinedDate: new Date(user.joinedDate).toLocaleDateString(),
        lastActive: new Date(user.lastActive).toLocaleDateString(),
      }));
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
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
      loadUsers();
    }
  }, [router]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const token = localStorage.getItem('adminSession');
        const response = await fetch(`/api/users/${userToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setUsers(users.filter(user => user.id !== userToDelete));
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const getRoleColor = (role: User['role']) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Suspended':
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
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-600">Manage user accounts</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <UserPlus className="h-4 w-4" />
              Add User
            </button>
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <SelectInput
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                options={[
                  { label: "All Roles", value: "all" },
                  { label: "Customers", value: "customer" },
                  { label: "Admins", value: "admin" }
                ]}
              />
              <SelectInput
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                options={[
                  { label: "All Status", value: "all" },
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                  { label: "Suspended", value: "Suspended" }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Users ({filteredUsers.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Bookings</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Purchases</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{user.totalBookings}</td>
                      <td className="py-4 px-4 text-gray-900">{user.totalPurchases}</td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p className="text-gray-900">{user.joinedDate}</p>
                          <p className="text-gray-600">Last: {user.lastActive}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {user.role !== 'admin' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                              >
                                <Shield className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No users found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
