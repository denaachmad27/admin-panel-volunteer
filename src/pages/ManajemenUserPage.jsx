import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit3, Trash2, Eye, Search, Filter, UserPlus, Shield, Clock, CheckCircle, XCircle, Mail, Phone, MapPin, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import userService from '../services/userService';
import UserModal from '../components/modals/UserModal';
import PermissionModal from '../components/modals/PermissionModal';
import BulkActionModal from '../components/modals/BulkActionModal';
import { useCache } from '../hooks/useCache';

const ManajemenUserPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  
  // Cache hooks for users and statistics with appropriate cache durations
  const {
    data: users,
    loading: usersLoading,
    error: usersError,
    loadData: loadUsersData,
    refreshData: refreshUsersData,
    clearCache: clearUsersCache
  } = useCache(`users_${activeTab}_${selectedRole}_${searchQuery}`, 3 * 60 * 1000, []); // 3 minutes cache for user lists
  
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    loadData: loadStatsData,
    refreshData: refreshStatsData,
    clearCache: clearStatsCache
  } = useCache('user_statistics', 3 * 60 * 1000, {
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    staff: 0,
    users: 0
  }); // 3 minutes cache for statistics
  
  // Combined loading and error states
  const loading = usersLoading || statsLoading;
  const error = usersError || statsError;
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [permissionUser, setPermissionUser] = useState(null);

  // Load users from API with caching
  const loadUsers = async (page = 1, forceRefresh = false) => {
    try {
      const params = {
        page: page,
        per_page: pagination.per_page,
        search: searchQuery,
        role: selectedRole,
        status: activeTab
      };
      
      const fetchFunction = async () => {
        console.log('ManajemenUserPage: Loading users from API');
        const response = await userService.getUsers(params);
        
        // Update pagination
        setPagination({
          current_page: response.current_page || 1,
          per_page: response.per_page || 15,
          total: response.total || 0,
          last_page: response.last_page || 1
        });
        
        return response.data || [];
      };
      
      if (forceRefresh) {
        return await refreshUsersData(fetchFunction);
      } else {
        return await loadUsersData(fetchFunction);
      }
      
    } catch (error) {
      console.error('Error loading users:', error);
      throw error;
    }
  };
  
  // Load statistics with caching
  const loadStatistics = async (forceRefresh = false) => {
    try {
      const fetchFunction = async () => {
        console.log('ManajemenUserPage: Loading statistics from API');
        const response = await userService.getUserStatistics();
        return response;
      };
      
      if (forceRefresh) {
        return await refreshStatsData(fetchFunction);
      } else {
        return await loadStatsData(fetchFunction);
      }
      
    } catch (error) {
      console.error('Error loading statistics:', error);
      throw error;
    }
  };
  
  // Load data on component mount and when filters change
  useEffect(() => {
    loadUsers(1);
    loadStatistics();
  }, []);
  
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      // Clear cache when filters change to force fresh data
      clearUsersCache();
      loadUsers(1);
    }, 500);
    
    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedRole, activeTab]);

  const roles = [
    { value: 'all', label: 'Semua Role' },
    { value: 'admin', label: 'Administrator' },
    { value: 'staff', label: 'Staff' },
    { value: 'user', label: 'User/Penerima' }
  ];

  const getStatusConfig = (isActive) => {
    if (isActive) {
      return { 
        bg: 'bg-orange-100', 
        text: 'text-orange-800', 
        label: 'Aktif', 
        icon: CheckCircle 
      };
    } else {
      return { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        label: 'Tidak Aktif', 
        icon: XCircle 
      };
    }
  };

  const getRoleConfig = (role) => {
    const configs = {
      admin: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Admin' },
      staff: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Staff' },
      user: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'User' }
    };
    return configs[role] || configs.user;
  };

  const getStatusBadge = (isActive) => {
    const config = getStatusConfig(isActive);
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

  const handlePageChange = (page) => {
    loadUsers(page);
  };
  
  const handleRefresh = () => {
    // Clear cache and force refresh
    clearUsersCache();
    clearStatsCache();
    loadUsers(pagination.current_page, true);
    loadStatistics(true);
  };
  
  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };
  
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };
  
  const handleSaveUser = async (userData) => {
    if (selectedUser) {
      // Update existing user
      await userService.updateUser(selectedUser.id, userData);
    } else {
      // Create new user
      await userService.createUser(userData);
    }
    
    // Clear cache and refresh data
    clearUsersCache();
    clearStatsCache();
    loadUsers(pagination.current_page, true);
    loadStatistics(true);
  };
  
  const handleDeleteUser = async (user) => {
    setDeleteConfirm(user);
  };
  
  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await userService.deleteUser(deleteConfirm.id);
      
      // Clear cache and refresh data
      clearUsersCache();
      clearStatsCache();
      loadUsers(pagination.current_page, true);
      loadStatistics(true);
      
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Gagal menghapus user: ' + (typeof error === 'string' ? error : 'Terjadi kesalahan'));
    }
  };
  
  const handleToggleUserStatus = async (user) => {
    try {
      await userService.updateUserStatus(user.id, !user.is_active);
      
      // Clear cache and refresh data
      clearUsersCache();
      clearStatsCache();
      loadUsers(pagination.current_page, true);
      loadStatistics(true);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Gagal mengubah status user: ' + (typeof error === 'string' ? error : 'Terjadi kesalahan'));
    }
  };
  
  const handleOpenPermissions = (user) => {
    setPermissionUser(user);
    setShowPermissionModal(true);
  };
  
  const handleOpenBulkActions = () => {
    setShowBulkActionModal(true);
  };
  
  const handleBulkAction = async (action, userIds) => {
    await userService.bulkAction(action, userIds);
    
    // Clear cache and refresh data
    clearUsersCache();
    clearStatsCache();
    loadUsers(pagination.current_page, true);
    loadStatistics(true);
  };

  return (
    <DashboardLayout
      currentPage="users"
      pageTitle="Manajemen User"
      breadcrumbs={['Manajemen User']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Manajemen User</h1>
              <p className="text-orange-100">Kelola pengguna sistem dan hak akses</p>
            </div>
            <div className="hidden md:block">
              <Users className="w-16 h-16 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.total}</p>
                <p className="text-sm text-slate-600">Total Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.active}</p>
                <p className="text-sm text-slate-600">Aktif</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.inactive}</p>
                <p className="text-sm text-slate-600">Tidak Aktif</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.admins}</p>
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
            <div className="mt-4 sm:mt-0 flex gap-2">
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button 
                onClick={handleCreateUser}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah User
              </button>
            </div>
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
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                { id: 'inactive', label: 'Tidak Aktif' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
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

          {/* Error State */}
          {error && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 animate-spin text-slate-400 mr-2" />
                        <span className="text-slate-500">Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center">
                      <div className="text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                        <p>Tidak ada pengguna ditemukan</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      {/* User Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 text-sm">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.phone || 'No phone'}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Email */}
                      <td className="py-3 px-4">
                        <div className="text-sm text-slate-900">{user.email}</div>
                        <div className="text-xs text-slate-500">
                          {user.updated_at 
                            ? `Login: ${new Date(user.updated_at).toLocaleDateString('id-ID')}`
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
                        {getStatusBadge(user.is_active)}
                      </td>
                      
                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center space-x-1">
                          <button 
                            onClick={() => handleToggleUserStatus(user)}
                            className={`p-1.5 rounded transition-colors ${
                              user.is_active 
                                ? 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'
                                : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                            title={user.is_active ? 'Nonaktifkan User' : 'Aktifkan User'}
                          >
                            {user.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => handleOpenPermissions(user)}
                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" 
                            title="Atur Permissions"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors" 
                            title="Edit User"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                            title="Hapus User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && users.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Menampilkan {users.length} dari {pagination.total} pengguna (Halaman {pagination.current_page} dari {pagination.last_page})
                </p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page <= 1}
                    className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button 
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          pagination.current_page === page
                            ? 'bg-orange-600 text-white'
                            : 'border border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button 
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page >= pagination.last_page}
                    className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Role Distribution */}
        <Card title="Distribusi Role" subtitle="Pembagian pengguna berdasarkan peran">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.admins}</h3>
              <p className="text-sm text-slate-600">Administrator</p>
              <p className="text-xs text-slate-500 mt-1">Akses penuh sistem</p>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.staff}</h3>
              <p className="text-sm text-slate-600">Staff</p>
              <p className="text-xs text-slate-500 mt-1">Akses terbatas</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.users}</h3>
              <p className="text-sm text-slate-600">Pengguna</p>
              <p className="text-xs text-slate-500 mt-1">Penerima bantuan</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleCreateUser}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <Plus className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Tambah User Baru</h3>
                <p className="text-sm text-slate-600">Daftarkan pengguna baru</p>
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              if (users.length > 0) {
                handleOpenPermissions(users[0]); // Open with first user as example
              } else {
                alert('Tidak ada user tersedia untuk mengatur permissions');
              }
            }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Atur Permissions</h3>
                <p className="text-sm text-slate-600">Kelola hak akses user</p>
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleOpenBulkActions}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Bulk Actions</h3>
                <p className="text-sm text-slate-600">Aksi massal untuk users</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Modal */}
        <UserModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          onSave={handleSaveUser}
          user={selectedUser}
          title={selectedUser ? 'Edit User' : 'Tambah User'}
        />
        
        {/* Permission Modal */}
        <PermissionModal
          isOpen={showPermissionModal}
          onClose={() => {
            setShowPermissionModal(false);
            setPermissionUser(null);
          }}
          user={permissionUser}
        />
        
        {/* Bulk Action Modal */}
        <BulkActionModal
          isOpen={showBulkActionModal}
          onClose={() => setShowBulkActionModal(false)}
          users={users}
          onBulkAction={handleBulkAction}
        />
        
        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Konfirmasi Hapus</h3>
                  <p className="text-sm text-slate-600">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
              
              <p className="text-slate-700 mb-6">
                Apakah Anda yakin ingin menghapus user <strong>{deleteConfirm.name}</strong>? 
                Semua data terkait akan ikut terhapus.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-all duration-200 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Hapus User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManajemenUserPage;