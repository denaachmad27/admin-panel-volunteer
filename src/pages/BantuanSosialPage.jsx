import React, { useState, useEffect } from 'react';
import { 
  Heart, Users, FileText, Calendar, AlertCircle, Plus, Edit3, Trash2, 
  Search, Filter, RefreshCw, Eye, Clock, CheckCircle, XCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import { bantuanSosialAPI } from '../services/api';
import { useCache } from '../hooks/useCache';

const BantuanSosialPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cache hook for bantuan sosial data with appropriate cache duration
  const {
    data: bantuanData,
    loading,
    error,
    loadData: loadBantuanData,
    refreshData: refreshBantuanData,
    clearCache: clearBantuanCache
  } = useCache(`bantuan_sosial_${activeTab}_${searchQuery}`, 2 * 60 * 1000, { list: [], stats: { total: 0, aktif: 0, selesai: 0, totalPenerima: 0 } }); // 2 minutes cache for bantuan sosial
  
  // Extract data from cache
  const bantuanList = bantuanData?.list || [];
  const stats = bantuanData?.stats || { total: 0, aktif: 0, selesai: 0, totalPenerima: 0 };

  const jenisOptions = [
    'Uang Tunai',
    'Sembako', 
    'Peralatan',
    'Pelatihan',
    'Kesehatan',
    'Pendidikan'
  ];

  // Fetch bantuan sosial data with caching
  const fetchBantuanSosial = async (forceRefresh = false) => {
    try {
      const params = {};
      if (activeTab !== 'all') {
        params.status = activeTab === 'aktif' ? 'Aktif' : activeTab === 'selesai' ? 'Selesai' : 'Tidak Aktif';
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const fetchFunction = async () => {
        console.log('BantuanSosialPage: Loading bantuan sosial from API');
        const response = await bantuanSosialAPI.getAll(params);
        
        if (response.data.status === 'success') {
          const bantuanList = response.data.data.data || [];
          
          // Calculate stats
          const total = bantuanList.length;
          const aktif = bantuanList.filter(bantuan => bantuan.status === 'Aktif').length;
          const selesai = bantuanList.filter(bantuan => bantuan.status === 'Selesai').length;
          const totalPenerima = bantuanList.reduce((sum, bantuan) => sum + (bantuan.kuota_terpakai || 0), 0);
          
          return {
            list: bantuanList,
            stats: { total, aktif, selesai, totalPenerima }
          };
        } else {
          throw new Error('Gagal mengambil data bantuan sosial');
        }
      };
      
      if (forceRefresh) {
        return await refreshBantuanData(fetchFunction);
      } else {
        return await loadBantuanData(fetchFunction);
      }
      
    } catch (err) {
      console.error('Error fetching bantuan sosial:', err);
      throw err;
    }
  };

  // Handle delete bantuan sosial
  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus program bantuan ini?')) {
      return;
    }
    
    try {
      await bantuanSosialAPI.delete(id);
      // Clear cache and refresh data
      clearBantuanCache();
      await fetchBantuanSosial(true);
      alert('Program bantuan berhasil dihapus');
    } catch (err) {
      console.error('Error deleting bantuan sosial:', err);
      alert(err.response?.data?.message || 'Gagal menghapus program bantuan');
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchBantuanSosial();
  }, []);
  
  useEffect(() => {
    // Clear cache when filters change to force fresh data
    clearBantuanCache();
    fetchBantuanSosial();
  }, [activeTab, searchQuery]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Aktif': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Aktif' },
      'Tidak Aktif': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Tidak Aktif' },
      'Selesai': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Selesai' }
    };
    
    const config = statusConfig[status] || statusConfig['Tidak Aktif'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getJenisBadge = (jenis) => {
    const jenisConfig = {
      'Uang Tunai': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Sembako': { bg: 'bg-orange-100', text: 'text-orange-800' },
      'Peralatan': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Pelatihan': { bg: 'bg-orange-100', text: 'text-orange-800' },
      'Kesehatan': { bg: 'bg-red-100', text: 'text-red-800' },
      'Pendidikan': { bg: 'bg-orange-100', text: 'text-orange-800' }
    };
    
    const config = jenisConfig[jenis] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {jenis}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  

  const getProgressPercentage = (used, total) => {
    if (!total) return 0;
    return Math.round((used / total) * 100);
  };

  return (
    <DashboardLayout
      currentPage="bantuan"
      pageTitle="Bantuan Sosial"
      breadcrumbs={['Bantuan Sosial']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Bantuan Sosial</h1>
              <p className="text-orange-100">Kelola program bantuan sosial untuk masyarakat</p>
            </div>
            <div className="hidden md:block">
              <Heart className="w-16 h-16 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-600">Total Program</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.aktif}</p>
                <p className="text-sm text-slate-600">Program Aktif</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalPenerima}</p>
                <p className="text-sm text-slate-600">Total Penerima</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.selesai}</p>
                <p className="text-sm text-slate-600">Program Selesai</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          {/* Header with Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Daftar Program Bantuan</h2>
              <p className="text-sm text-slate-600 mt-1">Kelola semua program bantuan sosial</p>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <button 
                onClick={() => navigate('/tambah-bantuan')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Program
              </button>
              <button 
                onClick={fetchBantuanSosial}
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-6 border-b border-slate-200">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari program bantuan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'aktif', label: 'Aktif' },
                { id: 'selesai', label: 'Selesai' },
                { id: 'tidak-aktif', label: 'Tidak Aktif' }
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

          {/* Bantuan Sosial List */}
          <div className="divide-y divide-slate-200">
            {loading ? (
              <div className="p-6 text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-slate-600">Memuat data bantuan sosial...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600 mb-2">{error}</p>
                <button 
                  onClick={fetchBantuanSosial}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            ) : bantuanList.length === 0 ? (
              <div className="p-6 text-center">
                <Heart className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">Belum ada program bantuan</p>
              </div>
            ) : (
              bantuanList.map((bantuan) => (
                <div key={bantuan.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-slate-900">
                              {bantuan.nama_bantuan}
                            </h3>
                            {getStatusBadge(bantuan.status)}
                            {getJenisBadge(bantuan.jenis_bantuan)}
                          </div>
                          <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                            {bantuan.deskripsi}
                          </p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center text-sm text-slate-600">
                          <span className="w-4 h-4 mr-2 text-orange-600 font-bold">Rp</span>
                          {bantuan.nominal ? new Intl.NumberFormat('id-ID').format(bantuan.nominal) : 'Tidak ada nominal'}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(bantuan.tanggal_mulai)} - {formatDate(bantuan.tanggal_selesai)}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Users className="w-4 h-4 mr-2" />
                          {bantuan.kuota_terpakai || 0} / {bantuan.kuota} penerima
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-slate-600 mb-1">
                          <span>Progress Kuota</span>
                          <span>{getProgressPercentage(bantuan.kuota_terpakai || 0, bantuan.kuota)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(getProgressPercentage(bantuan.kuota_terpakai || 0, bantuan.kuota), 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="text-xs text-slate-500">
                        <strong>Syarat:</strong> {bantuan.syarat_bantuan?.substring(0, 100)}...
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => navigate(`/bantuan/${bantuan.id}`)}
                        className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigate(`/edit-bantuan/${bantuan.id}`)}
                        className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(bantuan.id)}
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
          {!loading && !error && bantuanList.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Menampilkan {bantuanList.length} program bantuan
                </p>
                {/* Pagination will be implemented when backend supports it */}
              </div>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/tambah-bantuan')}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <Plus className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Tambah Program Baru</h3>
                <p className="text-sm text-slate-600">Buat program bantuan sosial baru</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/pendaftaran')}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Review Pendaftaran</h3>
                <p className="text-sm text-slate-600">Review pengajuan bantuan sosial</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Laporan Bantuan</h3>
                <p className="text-sm text-slate-600">Lihat laporan dan statistik</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Categories Overview */}
        <Card title="Kategori Program Bantuan" subtitle="Distribusi program berdasarkan jenis bantuan">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {jenisOptions.map((jenis, index) => {
              const programCount = bantuanList.filter(bantuan => bantuan.jenis_bantuan === jenis).length;
              const colors = [
                'bg-yellow-100 text-yellow-800',
                'bg-orange-100 text-orange-800', 
                'bg-purple-100 text-purple-800',
                'bg-orange-100 text-orange-800',
                'bg-red-100 text-red-800',
                'bg-orange-100 text-orange-800'
              ];
              
              return (
                <div key={jenis} className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900">{jenis}</h4>
                      <p className="text-sm text-slate-600">{programCount} program</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[index % colors.length]}`}>
                      {programCount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BantuanSosialPage;