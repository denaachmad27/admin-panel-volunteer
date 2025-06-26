import React, { useState } from 'react';
import { Users, Plus, Edit3, Trash2, Eye, Search, Filter, UserPlus, Shield, Clock, CheckCircle, XCircle, Mail, Phone, MapPin, Calendar, AlertCircle } from 'lucide-react';
import ProtectedDashboardLayout from '../components/layout/ProtectedDashboardLayout';
import { Card } from '../components/ui/UIComponents';

const ManajemenUserPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  // Mock data untuk users
  const users = [
    {
      id: 1,
      name: 'Ahmad Santoso',
      email: 'ahmad.santoso@email.com',
      phone: '081234567890',
      role: 'user',
      status: 'active',
      address: 'Jl. Merdeka No. 15, RT 05/RW 02',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20',
      programsReceived: ['Bantuan Pangan', 'Bantuan Kesehatan'],
      avatar: null
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      email: 'siti.nur@email.com',
      phone: '081234567891',
      role: 'user',
      status: 'active',
      address: 'Jl. Kenanga No. 23, RT 03/RW 01',
      joinDate: '2024-01-12',
      lastLogin: '2024-01-19',
      programsReceived: ['Bantuan Pendidikan'],
      avatar: null
    },
    {
      id: 3,
      name: 'Budi Hermawan',
      email: 'budi.h@email.com',
      phone: '081234567892',
      role: 'admin',
      status: 'active',
      address: 'Jl. Melati No. 8, RT 02/RW 03',
      joinDate: '2023-12-01',
      lastLogin: '2024-01-20',
      programsReceived: [],
      avatar: null
    },
    {
      id: 4,
      name: 'Dewi Sartika',
      email: 'dewi.sartika@email.com',
      phone: '081234567893',
      role: 'user',
      status: 'pending',
      address: 'Jl. Raya Utama No. 45, RT 01/RW 04',
      joinDate: '2024-01-18',
      lastLogin: null,
      programsReceived: [],
      avatar: null
    },
    {
      id: 5,
      name: 'Rini Marlina',
      email: 'rini.marlina@email.com',
      phone: '081234567894',
      role: 'staff',
      status: 'active',
      address: 'Jl. Industri No. 12, RT 06/RW 02',
      joinDate: '2023-11-15',
      lastLogin: '2024-01-18',
      programsReceived: [],
      avatar: null
    },
    {
      id: 6,
      name: 'Andi Wijaya',
      email: 'andi.wijaya@email.com',
      phone: '081234567895',
      role: 'user',
      status: 'suspended',
      address: 'Jl. Mawar No. 7, RT 04/RW 01',
      joinDate: '2023-10-20',
      lastLogin: '2024-01-10',
      programsReceived: ['Bantuan Pangan'],
      avatar: null
    },
    {
      id: 7,
      name: 'Lisa Permata',
      email: 'lisa.permata@email.com',
      phone: '081234567896',
      role: 'user',
      status: 'active',
      address: 'Jl. Dahlia No. 19, RT 07/RW 03',
      joinDate: '2024-01-08',
      lastLogin: '2024-01-17',
      programsReceived: ['Bantuan Usaha'],
      avatar: null
    },
    {
      id: 8,
      name: 'Joko Susilo',
      email: 'joko.susilo@email.com',
      phone: '081234567897',
      role: 'admin',
      status: 'active',
      address: 'Jl. Anggrek No. 25, RT 08/RW 04',
      joinDate: '2023-09-10',
      lastLogin: '2024-01-19',
      programsReceived: [],
      avatar: null
    }
  ];

  const roles = [
    { value: 'all', label: 'Semua Role' },
    { value: 'admin', label: 'Administrator' },
    { value: 'staff', label: 'Staff' },
    { value: 'user', label: 'User/Penerima' }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      active: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Aktif', 
        icon: CheckCircle 
      },
      pending: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        label: 'Pending', 
        icon: Clock 
      },
      suspended: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        label: 'Suspended', 
        icon: XCircle 
      }
    };
    return configs[status] || configs.pending;
  };

  const getRoleConfig = (role) => {
    const configs = {
      admin: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Admin' },
      staff: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Staff' },
      user: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'User' }
    };
    return configs[role] || configs.user;
  };

  const getStatusBadge = (status) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const config = getRoleConfig(role);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery);
    const matchesTab = activeTab === 'all' || user.status === activeTab;
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesTab && matchesRole;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    admins: users.filter(u => u.role === 'admin').length,
    staff: users.filter(u => u.role === 'staff').length,
    regularUsers: users.filter(u => u.role === 'user').length
  };

  return (
    <ProtectedDashboardLayout
      currentPage="users"
      pageTitle="Manajemen User"
      breadcrumbs={['Manajemen User']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Manajemen User</h1>
              <p className="text-blue-100">Kelola pengguna sistem dan hak akses</p>
            </div>
            <div className="hidden md:block">
              <Users className="w-16 h-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-600">Total Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
                <p className="text-sm text-slate-600">Aktif</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                <p className="text-sm text-slate-600">Pending</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.admins}</p>
                <p className="text-sm text-slate-600">Admin</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          {/* Header with Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Daftar Pengguna</h2>
              <p className="text-sm text-slate-600 mt-1">Kelola semua pengguna sistem</p>
            </div>
            <button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Tambah User
            </button>
          </div>

          {/* Filters and Search */}
          <div className="p-6 border-b border-slate-200">
            {/* Search and Role Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari user (nama, email, telepon)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'active', label: 'Aktif' },
                { id: 'pending', label: 'Pending' },
                { id: 'suspended', label: 'Suspended' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Pengguna</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Email</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-900">Role</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-900">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    {/* User Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.phone}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Email */}
                    <td className="py-3 px-4">
                      <div className="text-sm text-slate-900">{user.email}</div>
                      <div className="text-xs text-slate-500">
                        {user.lastLogin 
                          ? `Login: ${new Date(user.lastLogin).toLocaleDateString('id-ID')}`
                          : 'Belum login'
                        }
                      </div>
                    </td>
                    
                    {/* Role */}
                    <td className="py-3 px-4 text-center">
                      {getRoleBadge(user.role)}
                    </td>
                    
                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(user.status)}
                    </td>
                    
                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-1">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Lihat Detail">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Edit User">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Hapus User">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Menampilkan {filteredUsers.length} dari {users.length} pengguna
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50">
                  2
                </button>
                <button className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Role Distribution */}
        <Card title="Distribusi Role" subtitle="Pembagian pengguna berdasarkan peran">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{stats.admins}</h3>
              <p className="text-sm text-slate-600">Administrator</p>
              <p className="text-xs text-slate-500 mt-1">Akses penuh sistem</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{stats.staff}</h3>
              <p className="text-sm text-slate-600">Staff</p>
              <p className="text-xs text-slate-500 mt-1">Akses terbatas</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{stats.regularUsers}</h3>
              <p className="text-sm text-slate-600">Pengguna</p>
              <p className="text-xs text-slate-500 mt-1">Penerima bantuan</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Tambah User Baru</h3>
                <p className="text-sm text-slate-600">Daftarkan pengguna baru</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Atur Permissions</h3>
                <p className="text-sm text-slate-600">Kelola hak akses user</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Bulk Actions</h3>
                <p className="text-sm text-slate-600">Aksi massal untuk users</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Temporary Page Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Halaman Sementara</p>
              <p className="text-sm text-yellow-700 mt-1">
                Ini adalah halaman sementara untuk menu Manajemen User. Fitur lengkap sedang dalam pengembangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
};

export default ManajemenUserPage;