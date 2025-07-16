import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit3, Trash2, Search, Filter, RefreshCw, Heart, Calendar, Briefcase, GraduationCap, DollarSign, AlertCircle, User, Baby, UserCheck } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import familyService from '../services/familyService';
import userService from '../services/userService';
import FamilyModal from '../components/modals/FamilyModal';

const ManajemenKeluargaPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHubungan, setSelectedHubungan] = useState('all');
  const [selectedJenisKelamin, setSelectedJenisKelamin] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [families, setFamilies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    laki_laki: 0,
    perempuan: 0,
    tanggungan: 0,
    total_penghasilan: 0,
    avg_penghasilan: 0
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  });
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const hubunganOptions = [
    { value: 'all', label: 'Semua Hubungan' },
    { value: 'Suami', label: 'Suami' },
    { value: 'Istri', label: 'Istri' },
    { value: 'Anak', label: 'Anak' },
    { value: 'Orang Tua', label: 'Orang Tua' },
    { value: 'Saudara', label: 'Saudara' },
    { value: 'Lainnya', label: 'Lainnya' }
  ];

  const jenisKelaminOptions = [
    { value: 'all', label: 'Semua Jenis Kelamin' },
    { value: 'Laki-laki', label: 'Laki-laki' },
    { value: 'Perempuan', label: 'Perempuan' }
  ];

  const loadFamilies = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: page,
        per_page: pagination.per_page,
        search: searchQuery,
        hubungan: selectedHubungan,
        jenis_kelamin: selectedJenisKelamin,
        user_id: selectedUser !== 'all' ? selectedUser : null
      };
      
      const response = await familyService.getFamilies(params);
      
      setFamilies(response.data || []);
      setPagination({
        current_page: response.current_page || 1,
        per_page: response.per_page || 15,
        total: response.total || 0,
        last_page: response.last_page || 1
      });
      
    } catch (error) {
      console.error('Error loading families:', error);
      setError(typeof error === 'string' ? error : 'Gagal memuat data keluarga');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await familyService.getFamilyStatistics();
      setStats(response);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await userService.getUsers({ per_page: 1000 });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  useEffect(() => {
    loadFamilies(1);
    loadStatistics();
    loadUsers();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadFamilies(1);
    }, 500);
    
    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedHubungan, selectedJenisKelamin, selectedUser]);

  const getHubunganBadge = (hubungan) => {
    const configs = {
      'Suami': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Istri': { bg: 'bg-pink-100', text: 'text-pink-800' },
      'Anak': { bg: 'bg-green-100', text: 'text-green-800' },
      'Orang Tua': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Saudara': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Lainnya': { bg: 'bg-gray-100', text: 'text-gray-800' }
    };
    const config = configs[hubungan] || configs['Lainnya'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {hubungan}
      </span>
    );
  };

  const getJenisKelaminBadge = (jenisKelamin) => {
    const config = jenisKelamin === 'Laki-laki' 
      ? { bg: 'bg-blue-100', text: 'text-blue-800', icon: User }
      : { bg: 'bg-pink-100', text: 'text-pink-800', icon: User };
    
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {jenisKelamin}
      </span>
    );
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handlePageChange = (page) => {
    loadFamilies(page);
  };

  const handleRefresh = () => {
    loadFamilies(pagination.current_page);
    loadStatistics();
  };

  const handleCreateFamily = () => {
    setSelectedFamily(null);
    setShowFamilyModal(true);
  };

  const handleEditFamily = (family) => {
    setSelectedFamily(family);
    setShowFamilyModal(true);
  };

  const handleSaveFamily = async (familyData) => {
    if (selectedFamily) {
      await familyService.updateFamily(selectedFamily.id, familyData);
    } else {
      await familyService.createFamily(familyData);
    }
    
    loadFamilies(pagination.current_page);
    loadStatistics();
  };

  const handleDeleteFamily = async (family) => {
    setDeleteConfirm(family);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await familyService.deleteFamily(deleteConfirm.id);
      
      loadFamilies(pagination.current_page);
      loadStatistics();
      
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting family:', error);
      alert('Gagal menghapus anggota keluarga: ' + (typeof error === 'string' ? error : 'Terjadi kesalahan'));
    }
  };

  return (
    <DashboardLayout
      currentPage="families"
      pageTitle="Manajemen Keluarga"
      breadcrumbs={['Manajemen Keluarga']}
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Manajemen Data Keluarga</h1>
              <p className="text-purple-100">Kelola data anggota keluarga pengguna</p>
            </div>
            <div className="hidden md:block">
              <Heart className="w-16 h-16 text-purple-200" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.total}</p>
                <p className="text-sm text-slate-600">Total Anggota</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.laki_laki}</p>
                <p className="text-sm text-slate-600">Laki-laki</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-pink-100 mr-4">
                <User className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.perempuan}</p>
                <p className="text-sm text-slate-600">Perempuan</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <UserCheck className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.tanggungan}</p>
                <p className="text-sm text-slate-600">Tanggungan</p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Daftar Anggota Keluarga</h2>
              <p className="text-sm text-slate-600 mt-1">Kelola semua data keluarga pengguna</p>
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
                onClick={handleCreateFamily}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Anggota
              </button>
            </div>
          </div>

          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari anggota keluarga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select 
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
              <select 
                value={selectedHubungan}
                onChange={(e) => setSelectedHubungan(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {hubunganOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select 
                value={selectedJenisKelamin}
                onChange={(e) => setSelectedJenisKelamin(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {jenisKelaminOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

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

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-medium text-slate-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Anggota Keluarga</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-900">Hubungan</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-900">Jenis Kelamin</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-900">Umur</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-900">Pekerjaan</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-900">Penghasilan</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 animate-spin text-slate-400 mr-2" />
                        <span className="text-slate-500">Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : families.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center">
                      <div className="text-slate-500">
                        <Heart className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                        <p>Tidak ada data keluarga ditemukan</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  families.map((family) => (
                    <tr key={family.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                            {family.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 text-sm">{family.user?.name}</div>
                            <div className="text-xs text-slate-500">{family.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 text-sm">{family.nama_anggota}</div>
                        <div className="text-xs text-slate-500">
                          {formatDate(family.tanggal_lahir)} • {family.pendidikan}
                        </div>
                      </td>
                      
                      <td className="py-3 px-4 text-center">
                        {getHubunganBadge(family.hubungan)}
                      </td>
                      
                      <td className="py-3 px-4 text-center">
                        {getJenisKelaminBadge(family.jenis_kelamin)}
                      </td>
                      
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm text-slate-900">{calculateAge(family.tanggal_lahir)} tahun</span>
                      </td>
                      
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm text-slate-900">{family.pekerjaan}</span>
                      </td>
                      
                      <td className="py-3 px-4 text-center">
                        <div className="text-sm text-slate-900">{formatRupiah(family.penghasilan)}</div>
                        {family.tanggungan && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                            Tanggungan
                          </span>
                        )}
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center space-x-1">
                          <button 
                            onClick={() => handleEditFamily(family)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                            title="Edit Anggota"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteFamily(family)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                            title="Hapus Anggota"
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

          {!loading && families.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Menampilkan {families.length} dari {pagination.total} anggota (Halaman {pagination.current_page} dari {pagination.last_page})
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
                            ? 'bg-blue-600 text-white'
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

        <FamilyModal
          isOpen={showFamilyModal}
          onClose={() => setShowFamilyModal(false)}
          onSave={handleSaveFamily}
          family={selectedFamily}
          title={selectedFamily ? 'Edit Anggota Keluarga' : 'Tambah Anggota Keluarga'}
        />
        
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
                Apakah Anda yakin ingin menghapus anggota keluarga <strong>{deleteConfirm.nama_anggota}</strong>?
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
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManajemenKeluargaPage;