import React, { useState, useEffect } from 'react';
import { Building, Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Search, Filter, RefreshCw, Mail, Phone, AlertTriangle, CheckCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import { departmentAPI } from '../services/api';
import DepartmentModal from '../components/modals/DepartmentModal';

const DaftarDinasPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'

  const categories = ['Teknis', 'Pelayanan', 'Bantuan', 'Saran', 'Lainnya'];

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getAll();
      setDepartments(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading departments:', err);
      setError('Gagal memuat data dinas');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDepartments();
  };

  const handleCreate = () => {
    setSelectedDepartment(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleView = (department) => {
    setSelectedDepartment(department);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus dinas ini?')) {
      return;
    }

    try {
      await departmentAPI.delete(id);
      await loadDepartments();
      alert('Dinas berhasil dihapus');
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Gagal menghapus dinas');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await departmentAPI.toggleStatus(id);
      await loadDepartments();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Gagal mengubah status dinas');
    }
  };

  const handleModalSave = async () => {
    // Reload data setelah modal berhasil save
    await loadDepartments();
    
    // Show success message
    const action = modalMode === 'create' ? 'ditambahkan' : 'diperbarui';
    alert(`Dinas berhasil ${action}!`);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedDepartment(null);
  };

  // Filter departments
  const filteredDepartments = departments.filter(department => {
    const matchesSearch = 
      department.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && department.is_active) ||
      (filterStatus === 'inactive' && !department.is_active);

    const matchesCategory = 
      filterCategory === 'all' ||
      (department.categories && department.categories.includes(filterCategory));

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: departments.length,
    active: departments.filter(d => d.is_active).length,
    inactive: departments.filter(d => !d.is_active).length,
    byCategory: categories.reduce((acc, cat) => {
      acc[cat] = departments.filter(d => 
        d.categories && d.categories.includes(cat)
      ).length;
      return acc;
    }, {})
  };

  return (
    <DashboardLayout
      currentPage="settings"
      pageTitle="Daftar Dinas"
      breadcrumbs={['Pengaturan', 'Daftar Dinas']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Daftar Dinas</h1>
              <p className="text-blue-100">Kelola daftar dinas untuk forwarding pengaduan</p>
            </div>
            <div className="hidden md:block">
              <Building className="w-16 h-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-600">Total Dinas</p>
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
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.inactive}</p>
                <p className="text-sm text-slate-600">Non-aktif</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{filteredDepartments.length}</p>
                <p className="text-sm text-slate-600">Tampil</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Daftar Dinas</h2>
                <p className="text-sm text-slate-600 mt-1">Kelola dinas untuk forwarding pengaduan</p>
              </div>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Dinas
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari dinas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Non-aktif</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Department List */}
          <div className="divide-y divide-slate-200">
            {loading ? (
              <div className="p-6 text-center">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                <p className="text-slate-600">Memuat data dinas...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-400" />
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Coba Lagi
                </button>
              </div>
            ) : filteredDepartments.length === 0 ? (
              <div className="p-6 text-center">
                <Building className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                <p className="text-slate-600">Tidak ada dinas yang ditemukan</p>
              </div>
            ) : (
              filteredDepartments.map((department) => (
                <div key={department.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-slate-900">
                          {department.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          department.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {department.is_active ? 'Aktif' : 'Non-aktif'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {department.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {department.whatsapp}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Filter className="w-4 h-4 mr-2" />
                            <span className="text-xs">
                              {department.categories ? department.categories.join(', ') : 'Tidak ada kategori'}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleToggleStatus(department.id)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={department.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {department.is_active ? (
                          <ToggleRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-red-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleView(department)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(department)}
                        className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(department.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Menampilkan {filteredDepartments.length} dari {departments.length} dinas
              </p>
            </div>
          </div>
        </Card>

        {/* Category Stats */}
        <Card title="Distribusi Kategori" subtitle="Jumlah dinas per kategori">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => {
              const count = stats.byCategory[category] || 0;
              const colors = [
                'bg-blue-100 text-blue-800',
                'bg-green-100 text-green-800',
                'bg-yellow-100 text-yellow-800',
                'bg-purple-100 text-purple-800',
                'bg-red-100 text-red-800'
              ];
              
              return (
                <div key={category} className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="text-center">
                    <h4 className="font-medium text-slate-900 mb-1">{category}</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[index % colors.length]}`}>
                      {count} dinas
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Department Modal */}
        <DepartmentModal
          isOpen={showModal}
          onClose={handleModalClose}
          onSave={handleModalSave}
          department={selectedDepartment}
          mode={modalMode}
        />
      </div>
    </DashboardLayout>
  );
};

export default DaftarDinasPage;