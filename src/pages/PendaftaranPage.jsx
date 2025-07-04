import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Eye, Edit3, CheckCircle, XCircle, Clock, User, Calendar, 
  MapPin, Phone, Mail, Search, Filter, AlertCircle, Download, RefreshCw,
  Users, Award, Loader, MessageSquare, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProtectedDashboardLayout from '../components/layout/ProtectedDashboardLayout';
import { Card } from '../components/ui/UIComponents';
import { pendaftaranAPI, bantuanSosialAPI } from '../services/api';

const PendaftaranPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  
  // Data states
  const [registrations, setRegistrations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    under_review: 0,
    approved: 0,
    rejected: 0
  });

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Reload when filters change
  useEffect(() => {
    if (!loading) {
      fetchPendaftaran();
    }
  }, [activeTab, searchQuery, selectedProgram]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load both pendaftaran and programs in parallel
      const [pendaftaranResponse, programsResponse] = await Promise.all([
        pendaftaranAPI.getAll(),
        bantuanSosialAPI.getAll()
      ]);

      // Set programs for filter dropdown
      if (programsResponse.data.status === 'success') {
        const programList = programsResponse.data.data.data || [];
        const programOptions = [
          { value: 'all', label: 'Semua Program' },
          ...programList.map(program => ({
            value: program.nama_bantuan,
            label: program.nama_bantuan
          }))
        ];
        setPrograms(programOptions);
      }

      // Set pendaftaran data
      if (pendaftaranResponse.data.status === 'success') {
        const pendaftaranData = pendaftaranResponse.data.data.data || [];
        setRegistrations(pendaftaranData);
        calculateStats(pendaftaranData);
      }

    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Gagal memuat data pendaftaran');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendaftaran = async () => {
    try {
      const params = {};
      if (activeTab !== 'all') {
        params.status = getStatusForAPI(activeTab);
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      if (selectedProgram !== 'all') {
        params.program = selectedProgram;
      }

      const response = await pendaftaranAPI.getAll(params);
      
      if (response.data.status === 'success') {
        const pendaftaranData = response.data.data.data || [];
        setRegistrations(pendaftaranData);
        calculateStats(pendaftaranData);
      }
    } catch (err) {
      console.error('Error fetching pendaftaran:', err);
      setError('Gagal memuat data pendaftaran');
    }
  };

  const calculateStats = (data) => {
    const newStats = {
      total: data.length,
      pending: data.filter(r => r.status === 'Pending').length,
      under_review: data.filter(r => r.status === 'Under Review').length,
      approved: data.filter(r => r.status === 'Disetujui').length,
      rejected: data.filter(r => r.status === 'Ditolak').length,
      need_completion: data.filter(r => r.status === 'Perlu Dilengkapi').length
    };
    setStats(newStats);
  };

  const getStatusForAPI = (tabStatus) => {
    const statusMap = {
      'pending': 'Pending',
      'under_review': 'Under Review', 
      'approved': 'Disetujui',
      'rejected': 'Ditolak'
    };
    return statusMap[tabStatus] || tabStatus;
  };

  const getStatusConfig = (status) => {
    const configs = {
      'Pending': { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        label: 'Menunggu', 
        icon: Clock 
      },
      'Under Review': { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        label: 'Direview', 
        icon: Eye 
      },
      'Disetujui': { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Disetujui', 
        icon: CheckCircle 
      },
      'Ditolak': { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        label: 'Ditolak', 
        icon: XCircle 
      },
      'Perlu Dilengkapi': { 
        bg: 'bg-orange-100', 
        text: 'text-orange-800', 
        label: 'Perlu Dilengkapi', 
        icon: AlertTriangle 
      }
    };
    return configs[status] || configs['Pending'];
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

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await pendaftaranAPI.updateStatus(id, newStatus);
      setMessage(`Status pendaftaran berhasil diubah menjadi ${newStatus}`);
      await fetchPendaftaran(); // Refresh data
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.message || 'Gagal mengubah status pendaftaran');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pendaftaran ini?')) {
      return;
    }
    
    try {
      await pendaftaranAPI.delete(id);
      setMessage('Pendaftaran berhasil dihapus');
      await fetchPendaftaran(); // Refresh data
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting pendaftaran:', err);
      setError(err.response?.data?.message || 'Gagal menghapus pendaftaran');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTabCount = (tabId) => {
    switch (tabId) {
      case 'pending': return stats.pending;
      case 'under_review': return stats.under_review;
      case 'approved': return stats.approved;
      case 'rejected': return stats.rejected;
      default: return stats.total;
    }
  };

  return (
    <ProtectedDashboardLayout
      currentPage="bantuan"
      pageTitle="Pendaftaran Bantuan"
      breadcrumbs={['Bantuan Sosial', 'Pendaftaran']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Pendaftaran Bantuan Sosial</h1>
              <p className="text-emerald-100">Kelola pendaftaran dan aplikasi bantuan sosial</p>
            </div>
            <div className="hidden md:block">
              <FileText className="w-16 h-16 text-emerald-200" />
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {message && (
          <div className="p-4 rounded-lg bg-green-100 text-green-700 border border-green-200 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-red-100 text-red-700 border border-red-200 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-emerald-100 mr-4">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-600">Total</p>
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
                <p className="text-sm text-slate-600">Menunggu</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.under_review}</p>
                <p className="text-sm text-slate-600">Review</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.approved}</p>
                <p className="text-sm text-slate-600">Disetujui</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.rejected}</p>
                <p className="text-sm text-slate-600">Ditolak</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Daftar Pendaftaran</h2>
              <p className="text-sm text-slate-600 mt-1">Kelola semua pendaftaran bantuan sosial</p>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <button 
                onClick={loadInitialData}
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button 
                onClick={() => navigate('/pendaftaran/verify')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Verifikasi
              </button>
              <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-6 border-b border-slate-200">
            {/* Search and Program Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari pendaftar (nama, email, telepon)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <select 
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {programs.map(program => (
                  <option key={program.value} value={program.value}>{program.label}</option>
                ))}
              </select>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'pending', label: 'Menunggu' },
                { id: 'under_review', label: 'Review' },
                { id: 'approved', label: 'Disetujui' },
                { id: 'rejected', label: 'Ditolak' }
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
                  {tab.label} ({getTabCount(tab.id)})
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="divide-y divide-slate-200">
            {loading ? (
              <div className="p-6 text-center">
                <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
                <p className="text-slate-600">Memuat data pendaftaran...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600 mb-2">{error}</p>
                <button 
                  onClick={loadInitialData}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            ) : registrations.length === 0 ? (
              <div className="p-6 text-center">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">Belum ada pendaftaran</p>
              </div>
            ) : (
              registrations.map((registration) => (
                <div key={registration.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-slate-900">
                              {registration.user?.name || 'Nama tidak tersedia'}
                            </h3>
                            {registration.is_resubmission && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Ke-{registration.resubmission_count || 1}
                              </span>
                            )}
                            {getStatusBadge(registration.status)}
                          </div>
                          <p className="text-slate-600 text-sm mb-2">
                            Program: <span className="font-medium">{registration.bantuan_sosial?.nama_bantuan || 'Program tidak tersedia'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center text-sm text-slate-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {registration.user?.email || 'Email tidak tersedia'}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          Daftar: {formatDate(registration.created_at)}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Users className="w-4 h-4 mr-2" />
                          ID: {registration.id}
                        </div>
                      </div>

                      {/* Notes */}
                      {registration.catatan_admin && (
                        <div className="bg-slate-50 p-3 rounded-lg mb-3">
                          <p className="text-sm text-slate-600">
                            <strong>Catatan Admin:</strong> {registration.catatan_admin}
                          </p>
                        </div>
                      )}

                      {/* Reviewed Info */}
                      {registration.reviewed_at && (
                        <div className="text-xs text-slate-500">
                          <strong>Direview:</strong> {formatDate(registration.reviewed_at)}
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => navigate(`/pendaftaran/${registration.id}`)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {registration.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(registration.id, 'Disetujui')}
                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Setujui"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(registration.id, 'Ditolak')}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Tolak"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      <button 
                        onClick={() => handleDelete(registration.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && registrations.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Menampilkan {registrations.length} pendaftaran
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
            onClick={() => navigate('/pendaftaran/verify')}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Verifikasi Pendaftaran</h3>
                <p className="text-sm text-slate-600">Review dan verifikasi aplikasi</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/daftar-bantuan')}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-emerald-100 mr-4">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Program Bantuan</h3>
                <p className="text-sm text-slate-600">Kelola program bantuan sosial</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Laporan Pendaftaran</h3>
                <p className="text-sm text-slate-600">Export data pendaftaran</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
};

export default PendaftaranPage;