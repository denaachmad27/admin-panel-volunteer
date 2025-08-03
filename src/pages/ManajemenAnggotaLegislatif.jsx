import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Eye, 
  Edit, 
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Users,
  User,
  MapPin,
  RefreshCw,
  AlertCircle,
  Plus,
  Phone,
  Mail,
  Calendar,
  Building,
  MapPinIcon,
  X
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import anggotaLegislatifService from '../services/anggotaLegislatifService';
import ConfirmationModal from '../components/ConfirmationModal';
import { useCache } from '../hooks/useCache';

const ManajemenAnggotaLegislatif = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  
  // Cache hooks for anggota legislatif and statistics with appropriate cache durations
  const {
    data: anggotaLegislatif,
    loading: anggotaLoading,
    error: anggotaError,
    loadData: loadAnggotaData,
    refreshData: refreshAnggotaData,
    clearCache: clearAnggotaCache
  } = useCache(`anggota_legislatif_${searchQuery}_${selectedStatus}_${selectedGender}_${selectedCity}_${selectedParty}`, 3 * 60 * 1000, []); // 3 minutes cache for anggota legislatif lists
  
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    loadData: loadStatsData,
    refreshData: refreshStatsData,
    clearCache: clearStatsCache
  } = useCache('anggota_legislatif_statistics', 3 * 60 * 1000, {
    total_aleg: 0,
    active_aleg: 0,
    inactive_aleg: 0,
    total_volunteers: 0
  }); // 3 minutes cache for statistics
  
  // Combined loading and error states
  const loading = anggotaLoading || statsLoading;
  const error = anggotaError || statsError;
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [anggotaToDelete, setAnggotaToDelete] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAnggota, setSelectedAnggota] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Load anggota legislatif from API with caching
  const loadAnggotaLegislatif = async (page = 1, forceRefresh = false) => {
    try {
      const params = {
        page: page,
        per_page: pagination.per_page,
        search: searchQuery,
        status: selectedStatus,
        jenis_kelamin: selectedGender,
        kota: selectedCity,
        partai: selectedParty
      };
      
      const fetchFunction = async () => {
        console.log('ManajemenAnggotaLegislatif: Loading anggota legislatif from API');
        const response = await anggotaLegislatifService.getAnggotaLegislatif(params);
        
        
        // Update pagination - response sudah berupa object pagination dari service
        setPagination({
          current_page: response.current_page || 1,
          per_page: response.per_page || 15,
          total: response.total || 0,
          last_page: response.last_page || 1
        });
        
        // Return the actual data array - response.data adalah array anggota legislatif
        return response.data || [];
      };
      
      if (forceRefresh) {
        return await refreshAnggotaData(fetchFunction);
      } else {
        return await loadAnggotaData(fetchFunction);
      }
      
    } catch (error) {
      console.error('Error loading anggota legislatif:', error);
      throw error;
    }
  };
  
  // Load statistics with caching
  const loadStatistics = async (forceRefresh = false) => {
    try {
      const fetchFunction = async () => {
        console.log('ManajemenAnggotaLegislatif: Loading statistics from API');
        const response = await anggotaLegislatifService.getAnggotaLegislatifStatistics();
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
    loadAnggotaLegislatif(1);
    loadStatistics();
  }, []);
  
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      // Clear cache when filters change to force fresh data
      clearAnggotaCache();
      loadAnggotaLegislatif(1);
    }, 500);
    
    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedStatus, selectedGender, selectedCity, selectedParty]);

  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'aktif', label: 'Aktif' },
    { value: 'tidak_aktif', label: 'Tidak Aktif' }
  ];

  const genderOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'Laki-laki', label: 'Laki-laki' },
    { value: 'Perempuan', label: 'Perempuan' }
  ];

  const handleRefresh = () => {
    // Clear cache and force refresh
    clearAnggotaCache();
    clearStatsCache();
    loadAnggotaLegislatif(pagination.current_page, true);
    loadStatistics(true);
  };

  const handleViewDetail = async (anggota) => {
    try {
      console.log('=== MODAL DEBUG ===');
      console.log('Opening detail modal for anggota:', anggota.id);
      console.log('Current states before:', { detailLoading, detailError, selectedAnggota });
      
      setDetailLoading(true);
      setDetailError(null);
      setSelectedAnggota(null); // Reset selected anggota
      setShowDetailModal(true);
      
      console.log('States after setting loading:', { detailLoading: true, detailError: null, selectedAnggota: null });
      console.log('Fetching detail data...');
      
      const detailData = await anggotaLegislatifService.getAnggotaLegislatifById(anggota.id);
      console.log('Detail data received:', detailData);
      console.log('Data keys:', Object.keys(detailData || {}));
      
      setSelectedAnggota(detailData);
      console.log('selectedAnggota set to:', detailData);
    } catch (err) {
      console.error('Error loading detail:', err);
      setDetailError(err.message || 'Gagal memuat detail anggota legislatif');
    } finally {
      setDetailLoading(false);
      console.log('Loading finished, detailLoading set to false');
    }
  };

  const handleDelete = (anggota) => {
    setAnggotaToDelete(anggota);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!anggotaToDelete) return;
    
    try {
      await anggotaLegislatifService.deleteAnggotaLegislatif(anggotaToDelete.id);
      
      // Clear cache and refresh data
      clearAnggotaCache();
      clearStatsCache();
      loadAnggotaLegislatif(pagination.current_page, true);
      loadStatistics(true);
      
      setShowDeleteModal(false);
      setAnggotaToDelete(null);
    } catch (error) {
      console.error('Error deleting anggota legislatif:', error);
      alert('Gagal menghapus anggota legislatif: ' + (typeof error === 'string' ? error : 'Terjadi kesalahan'));
    }
  };

  const handlePageChange = (page) => {
    loadAnggotaLegislatif(page);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <DashboardLayout
        currentPage="anggota-legislatif"
        pageTitle="Manajemen Anggota Legislatif"
        breadcrumbs={['Manajemen Anggota Legislatif']}
      >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Manajemen Anggota Legislatif</h1>
              <p className="text-orange-100">Kelola data anggota legislatif dan monitoring relawan</p>
            </div>
            <div className="hidden md:block">
              <UserCheck className="w-16 h-16 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <UserCheck className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.total_aleg}</p>
                <p className="text-sm text-slate-600">Total Anggota Legislatif</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.active_aleg}</p>
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
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.inactive_aleg}</p>
                <p className="text-sm text-slate-600">Tidak Aktif</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{loading ? '-' : stats.total_volunteers}</p>
                <p className="text-sm text-slate-600">Total Relawan</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          {/* Header with Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Daftar Anggota Legislatif</h2>
              <p className="text-sm text-slate-600 mt-1">Kelola semua anggota legislatif</p>
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
              <a
                href="/anggota-legislatif/create"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Anggota Legislatif
              </a>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-6 border-b border-slate-200">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari anggota legislatif (nama, kode, email, jabatan)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <select 
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {genderOptions.map(gender => (
                  <option key={gender.value} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Filter berdasarkan kota..."
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Filter berdasarkan partai..."
                value={selectedParty}
                onChange={(e) => setSelectedParty(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-6 border-b border-slate-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-red-700">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="p-6">

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : anggotaLegislatif.length === 0 ? (
              <div className="text-center py-12">
                <UserCheck className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Tidak ada data anggota legislatif</h3>
                <p className="text-slate-500 mb-4">Belum ada anggota legislatif yang terdaftar dalam sistem</p>
                <a
                  href="/anggota-legislatif/create"
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Anggota Legislatif Pertama
                </a>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Anggota Legislatif
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jabatan & Partai
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kontak
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Relawan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {anggotaLegislatif.map((anggota) => (
                        <tr key={anggota.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {anggota.foto_profil ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={`http://127.0.0.1:8000/storage/${anggota.foto_profil}`}
                                    alt={anggota.nama_lengkap}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-600" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {anggota.nama_lengkap}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {anggota.kode_aleg} • {anggota.jenis_kelamin}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Usia: {calculateAge(anggota.tanggal_lahir)} tahun
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{anggota.jabatan_saat_ini}</div>
                            <div className="text-sm text-gray-500">{anggota.partai_politik}</div>
                            <div className="text-xs text-gray-400">{anggota.daerah_pemilihan}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <Phone className="w-3 h-3 mr-1" />
                              {anggota.no_telepon}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="w-3 h-3 mr-1" />
                              {anggota.email}
                            </div>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {anggota.kota}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-orange-500 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {anggota.volunteers_count} relawan
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              anggota.status === 'Aktif' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {anggota.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDetail(anggota)}
                                className="text-orange-600 hover:text-orange-900"
                                title="Lihat Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <a
                                href={`/anggota-legislatif/edit/${anggota.id}`}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleDelete(anggota)}
                                className="text-red-600 hover:text-red-900"
                                title="Hapus"
                              >
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
                {pagination.last_page > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                    <div className="text-sm text-slate-700">
                      Menampilkan {((pagination.current_page - 1) * pagination.per_page) + 1} sampai {Math.min(pagination.current_page * pagination.per_page, pagination.total)} dari {pagination.total} entri
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                        className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-l-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sebelumnya
                      </button>
                      
                      {[...Array(Math.min(pagination.last_page, 7))].map((_, index) => {
                        let page;
                        if (pagination.last_page <= 7) {
                          page = index + 1;
                        } else if (pagination.current_page <= 4) {
                          page = index + 1;
                        } else if (pagination.current_page >= pagination.last_page - 3) {
                          page = pagination.last_page - 6 + index;
                        } else {
                          page = pagination.current_page - 3 + index;
                        }
                        
                        const isActive = page === pagination.current_page;
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium border ${
                              isActive
                                ? 'bg-orange-50 border-orange-500 text-orange-600'
                                : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                        className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-r-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Hapus Anggota Legislatif"
          message={`Apakah Anda yakin ingin menghapus anggota legislatif "${anggotaToDelete?.nama_lengkap}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus"
          cancelText="Batal"
          type="danger"
        />

        {/* Detail Modal */}
        {showDetailModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            overflowY: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              padding: '16px'
            }}>
              {/* Modal */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '24px',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    Detail Anggota Legislatif
                  </h3>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedAnggota(null);
                      setDetailError(null);
                      setDetailLoading(false);
                    }}
                    style={{
                      color: '#9ca3af',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                      padding: '4px'
                    }}
                  >
                    <X style={{ width: '20px', height: '20px' }} />
                  </button>
                </div>
                
                {/* Content */}
                <div style={{ padding: '24px' }}>
                  {(() => {
                    
                    if (detailLoading) {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
                          <div style={{ 
                            width: '48px', 
                            height: '48px', 
                            border: '2px solid transparent', 
                            borderTop: '2px solid #f97316', 
                            borderRadius: '50%', 
                            animation: 'spin 1s linear infinite' 
                          }}></div>
                          <p style={{ color: '#64748b', marginTop: '16px', fontSize: '14px' }}>Memuat detail anggota legislatif...</p>
                        </div>
                      );
                    }
                    
                    if (detailError) {
                      return (
                        <div style={{ 
                          backgroundColor: '#fef2f2', 
                          border: '1px solid #fecaca', 
                          borderRadius: '8px', 
                          padding: '16px', 
                          display: 'flex', 
                          alignItems: 'center' 
                        }}>
                          <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444', marginRight: '12px' }} />
                          <div style={{ flex: '1' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#991b1b' }}>Gagal Memuat Detail</h3>
                            <p style={{ fontSize: '14px', color: '#b91c1c', marginTop: '4px' }}>{detailError}</p>
                          </div>
                          <button
                            onClick={() => setDetailError(null)}
                            style={{ marginLeft: '12px', color: '#ef4444' }}
                          >
                            <X style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      );
                    }
                    
                    if (selectedAnggota) {
                      return (
                        <div style={{ padding: '0' }}>
                          {/* Basic Info */}
                          <div className="bg-gray-50 p-5 rounded-xl mb-6">
                            <div className="flex items-center mb-4">
                              {selectedAnggota.foto_profil ? (
                                <img
                                  className="h-20 w-20 rounded-full object-cover mr-5 border-3 border-gray-200"
                                  src={`http://127.0.0.1:8000/storage/${selectedAnggota.foto_profil}`}
                                  alt={selectedAnggota.nama_lengkap}
                                />
                              ) : (
                                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center mr-5 border-3 border-gray-300">
                                  <User className="w-10 h-10 text-gray-500" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2 text-gray-900">
                                  {selectedAnggota.nama_lengkap}
                                </h2>
                                <p className="text-gray-600 text-base mb-3 font-medium">
                                  {selectedAnggota.jabatan_saat_ini}
                                </p>
                                <span className={`inline-block px-4 py-1.5 text-sm rounded-full font-semibold border-2 ${
                                  selectedAnggota.status === 'Aktif' 
                                    ? 'bg-green-100 text-green-800 border-green-200' 
                                    : 'bg-red-100 text-red-800 border-red-200'
                                }`}>
                                  {selectedAnggota.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Info Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Card className="p-5">
                              <h3 className="text-lg font-bold mb-4 text-gray-700">
                                📋 Informasi Personal
                              </h3>
                              <div className="text-sm space-y-3">
                                <div className="flex">
                                  <span className="font-semibold text-gray-600 w-24">Kode Aleg:</span>
                                  <span className="text-gray-900">{selectedAnggota.kode_aleg}</span>
                                </div>
                                <div className="flex">
                                  <span className="font-semibold text-gray-600 w-24">Jenis Kelamin:</span>
                                  <span className="text-gray-900">{selectedAnggota.jenis_kelamin}</span>
                                </div>
                                <div className="flex">
                                  <span className="font-semibold text-gray-600 w-24">Tempat Lahir:</span>
                                  <span className="text-gray-900">{selectedAnggota.tempat_lahir}</span>
                                </div>
                                <div className="flex">
                                  <span className="font-semibold text-gray-600 w-24">Tanggal Lahir:</span>
                                  <span className="text-gray-900">{formatDate(selectedAnggota.tanggal_lahir)}</span>
                                </div>
                              </div>
                            </Card>
                            
                            <Card className="p-5">
                              <h3 className="text-lg font-bold mb-4 text-gray-700">
                                📞 Kontak
                              </h3>
                              <div className="text-sm space-y-3">
                                <div className="flex">
                                  <span className="font-semibold text-gray-600 w-16">Telepon:</span>
                                  <span className="text-gray-900">{selectedAnggota.no_telepon}</span>
                                </div>
                                <div className="flex">
                                  <span className="font-semibold text-gray-600 w-16">Email:</span>
                                  <span className="text-gray-900">{selectedAnggota.email}</span>
                                </div>
                              </div>
                            </Card>
                          </div>

                          {/* Address */}
                          <Card className="p-5 mb-6">
                            <h3 className="text-lg font-bold mb-4 text-gray-700">
                              📍 Alamat
                            </h3>
                            <p className="text-sm mb-2 text-gray-900 leading-relaxed">
                              {selectedAnggota.alamat}
                            </p>
                            <p className="text-sm text-gray-600">
                              {selectedAnggota.kelurahan}, {selectedAnggota.kecamatan}, {selectedAnggota.kota}, {selectedAnggota.provinsi}
                            </p>
                          </Card>

                          {/* Political Info */}
                          <Card className="p-5 mb-6">
                            <h3 className="text-lg font-bold mb-4 text-gray-700">
                              🏛️ Informasi Politik
                            </h3>
                            <div className="text-sm space-y-3">
                              <div className="flex">
                                <span className="font-semibold text-gray-600 w-32">Partai Politik:</span>
                                <span className="text-gray-900">{selectedAnggota.partai_politik}</span>
                              </div>
                              <div className="flex">
                                <span className="font-semibold text-gray-600 w-32">Daerah Pemilihan:</span>
                                <span className="text-gray-900">{selectedAnggota.daerah_pemilihan}</span>
                              </div>
                              {selectedAnggota.riwayat_jabatan && (
                                <div className="mt-4">
                                  <p className="font-semibold mb-2 text-gray-600">Riwayat Jabatan:</p>
                                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 leading-relaxed">
                                    {selectedAnggota.riwayat_jabatan}
                                  </div>
                                </div>
                              )}
                            </div>
                          </Card>

                          {/* Volunteers */}
                          {selectedAnggota.volunteers && selectedAnggota.volunteers.length > 0 && (
                            <Card className="p-5">
                              <h3 className="text-lg font-bold mb-4 text-gray-700">
                                👥 Relawan Terdaftar ({selectedAnggota.volunteers.length})
                              </h3>
                              <div className="max-h-48 overflow-y-auto">
                                {selectedAnggota.volunteers.map((volunteer, index) => (
                                  <div key={volunteer.id} className={`
                                    flex items-center p-3 rounded-lg text-sm mb-2 border
                                    ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-gray-100
                                  `}>
                                    <User className="w-5 h-5 text-gray-500 mr-3" />
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-900">{volunteer.name}</div>
                                      {volunteer.profile && (
                                        <div className="text-gray-600 text-xs mt-0.5">
                                          {volunteer.profile.nama_lengkap}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          )}
                        </div>
                      );
                    }
                    
                    // Fallback case
                    return (
                      <div style={{ textAlign: 'center', padding: '32px 0' }}>
                        <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '8px' }}>Tidak ada data untuk ditampilkan</p>
                        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                          Debug: detailLoading={detailLoading ? 'true' : 'false'}, 
                          detailError={detailError || 'null'}, 
                          selectedAnggota={selectedAnggota ? 'exists' : 'null'}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
    </>
  );
};

export default ManajemenAnggotaLegislatif;