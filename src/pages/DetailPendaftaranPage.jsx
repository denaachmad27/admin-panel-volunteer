import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, FileText, 
  CheckCircle, XCircle, Clock, Eye, AlertCircle, AlertTriangle, Loader, 
  MessageSquare, Download, Edit3, Award, Heart, RefreshCw
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import { pendaftaranAPI } from '../services/api';

const DetailPendaftaranPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const fromVerifikasi = searchParams.get('from') === 'verifikasi';
  const [loading, setLoading] = useState(true);
  const [pendaftaran, setPendaftaran] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPendaftaranDetail();
  }, [id]);

  const loadPendaftaranDetail = async () => {
    try {
      setLoading(true);
      const response = await pendaftaranAPI.getById(id);
      
      if (response.data.status === 'success') {
        setPendaftaran(response.data.data);
      } else {
        setError('Gagal memuat detail pendaftaran');
      }
    } catch (err) {
      console.error('Error loading pendaftaran detail:', err);
      setError('Pendaftaran tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus, notes = '') => {
    try {
      await pendaftaranAPI.updateStatus(id, newStatus, notes);
      setMessage(`Status pendaftaran berhasil diubah menjadi ${newStatus}`);
      await loadPendaftaranDetail(); // Refresh data
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.message || 'Gagal mengubah status pendaftaran');
    }
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      'Pending': 'Menunggu Review',
      'Diproses': 'Sedang Diproses', 
      'Disetujui': 'Disetujui',
      'Ditolak': 'Ditolak',
      'Selesai': 'Selesai',
      'Perlu Dilengkapi': 'Perlu Dilengkapi'
    };
    return labels[status] || status;
  };

  const getHistoryIcon = (status, isInitial = false) => {
    if (isInitial) {
      return <Calendar className="w-4 h-4" />;
    }
    
    switch(status) {
      case 'Pending': 
        return <Clock className="w-4 h-4" />;
      case 'Diproses':
        return <Eye className="w-4 h-4" />;
      case 'Disetujui':
        return <CheckCircle className="w-4 h-4" />;
      case 'Ditolak':
        return <XCircle className="w-4 h-4" />;
      case 'Selesai':
        return <Award className="w-4 h-4" />;
      case 'Perlu Dilengkapi':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getHistoryIconStyle = (status, isInitial = false) => {
    if (isInitial) {
      return 'bg-emerald-100 text-emerald-600';
    }
    
    switch(status) {
      case 'Pending': 
        return 'bg-yellow-100 text-yellow-600';
      case 'Diproses':
        return 'bg-blue-100 text-blue-600';
      case 'Disetujui':
        return 'bg-green-100 text-green-600';
      case 'Ditolak':
        return 'bg-red-100 text-red-600';
      case 'Selesai':
        return 'bg-purple-100 text-purple-600';
      case 'Perlu Dilengkapi':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        currentPage="bantuan"
        pageTitle="Detail Pendaftaran"
        breadcrumbs={['Bantuan Sosial', 'Pendaftaran', 'Detail']}
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-slate-600">Memuat detail pendaftaran...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !pendaftaran) {
    return (
      <DashboardLayout
        currentPage="bantuan"
        pageTitle="Detail Pendaftaran"
        breadcrumbs={['Bantuan Sosial', 'Pendaftaran', 'Detail']}
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Pendaftaran Tidak Ditemukan</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/pendaftaran')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Kembali ke Daftar Pendaftaran
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      currentPage="bantuan"
      pageTitle="Detail Pendaftaran"
      breadcrumbs={['Bantuan Sosial', 'Pendaftaran', pendaftaran.user?.name || 'Detail']}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/pendaftaran')}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  {pendaftaran.user?.name || 'Nama tidak tersedia'}
                </h1>
                {pendaftaran.is_resubmission && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Pengajuan Ulang #{pendaftaran.resubmission_count || 1}
                  </span>
                )}
              </div>
              <p className="text-slate-600">
                Pendaftaran ID: {pendaftaran.id} • {pendaftaran.bantuan_sosial?.nama_bantuan || 'Program tidak tersedia'}
              </p>
              {pendaftaran.is_resubmission && pendaftaran.resubmitted_at && (
                <p className="text-sm text-orange-600 mt-1">
                  Diajukan ulang pada: {new Date(pendaftaran.resubmitted_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusBadge(pendaftaran.status)}
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applicant Information */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informasi Pendaftar
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                      <p className="text-slate-900">{pendaftaran.user?.name || 'Tidak tersedia'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-slate-400" />
                        <p className="text-slate-900">{pendaftaran.user?.email || 'Tidak tersedia'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon</label>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-slate-400" />
                        <p className="text-slate-900">{pendaftaran.user?.phone || 'Tidak tersedia'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Pendaftaran</label>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        <p className="text-slate-900">{formatDate(pendaftaran.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Program Information */}
                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Program Bantuan
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-medium text-slate-900">{pendaftaran.bantuan_sosial?.nama_bantuan || 'Program tidak tersedia'}</p>
                      <p className="text-sm text-slate-600 mt-1">{pendaftaran.bantuan_sosial?.jenis_bantuan || 'Jenis tidak tersedia'}</p>
                      {pendaftaran.bantuan_sosial?.nominal && (
                        <p className="text-sm text-slate-600 mt-1">
                          Nominal: Rp {new Intl.NumberFormat('id-ID').format(pendaftaran.bantuan_sosial.nominal)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Applicant Message */}
                  {pendaftaran.alasan_pengajuan && (
                    <div className="pt-4 border-t border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Pesan Pemohon
                      </h3>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{pendaftaran.alasan_pengajuan}</p>
                      </div>
                    </div>
                  )}

                  {/* Profile Data */}
                  {pendaftaran.user?.profile && (
                    <div className="pt-4 border-t border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-3">Data Profil</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">NIK</label>
                          <p className="text-slate-900">{pendaftaran.user.profile.nik || 'Tidak tersedia'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                          <p className="text-slate-900">{formatDate(pendaftaran.user.profile.tanggal_lahir) || 'Tidak tersedia'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 mr-2 text-slate-400 mt-1" />
                            <p className="text-slate-900">{pendaftaran.user.profile.alamat || 'Alamat tidak tersedia'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Status & Actions */}
          <div>
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Status & Aksi
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Status Saat Ini</label>
                    {getStatusBadge(pendaftaran.status)}
                  </div>

                  {/* Status Actions */}
                  {pendaftaran.status === 'Pending' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Ubah Status</label>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleStatusUpdate('Disetujui')}
                          className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Setujui
                        </button>
                        <button
                          onClick={() => handleStatusUpdate('Perlu Dilengkapi')}
                          className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Perlu Dilengkapi
                        </button>
                        <button
                          onClick={() => handleStatusUpdate('Ditolak')}
                          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Tolak
                        </button>
                        <button
                          onClick={() => navigate(fromVerifikasi ? '/verifikasi' : '/pendaftaran')}
                          className="w-full flex items-center justify-center px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          {fromVerifikasi ? 'Kembali ke Verifikasi' : 'Kembali'}
                        </button>
                      </div>
                    </div>
                  )}

                  {pendaftaran.status === 'Under Review' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Finalisasi Review</label>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleStatusUpdate('Disetujui')}
                          className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Setujui
                        </button>
                        <button
                          onClick={() => handleStatusUpdate('Ditolak')}
                          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Tolak
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Review Information */}
                  {pendaftaran.reviewed_at && (
                    <div className="pt-4 border-t border-slate-200">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Informasi Review</label>
                      <div className="text-sm text-slate-600">
                        <p><strong>Direview pada:</strong> {formatDate(pendaftaran.reviewed_at)}</p>
                        {pendaftaran.reviewed_by && (
                          <p><strong>Direview oleh:</strong> {pendaftaran.reviewed_by}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Admin Notes */}
                  {pendaftaran.catatan_admin && (
                    <div className="pt-4 border-t border-slate-200">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Catatan Admin</label>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-sm text-slate-600">{pendaftaran.catatan_admin}</p>
                      </div>
                    </div>
                  )}

                  {/* Universal Back Button for non-Pending status */}
                  {pendaftaran.status !== 'Pending' && (
                    <div className="pt-4 border-t border-slate-200">
                      <button
                        onClick={() => navigate(fromVerifikasi ? '/verifikasi' : '/pendaftaran')}
                        className="w-full flex items-center justify-center px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {fromVerifikasi ? 'Kembali ke Verifikasi' : 'Kembali'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Documents */}
            {pendaftaran.dokumen_pendukung && (
              <Card className="mt-6">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Dokumen Pendukung
                  </h2>
                  
                  <div className="space-y-2">
                    {JSON.parse(pendaftaran.dokumen_pendukung).map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-slate-400" />
                          <span className="text-sm text-slate-700">{doc.name || `Dokumen ${index + 1}`}</span>
                        </div>
                        <button
                          onClick={() => window.open(doc.url, '_blank')}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Timeline */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Timeline Pendaftaran
            </h2>
            
            <div className="space-y-4">
              {pendaftaran.histories && pendaftaran.histories.length > 0 ? (
                <div className="space-y-4">
                  {pendaftaran.histories.map((history, index) => {
                    const isInitial = !history.status_from;
                    return (
                    <div key={history.id} className="flex items-start">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${getHistoryIconStyle(history.status_to, isInitial)}`}>
                        {getHistoryIcon(history.status_to, isInitial)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-900">{getStatusLabel(history.status_to)}</p>
                          <p className="text-xs text-slate-500">{formatDate(history.created_at)}</p>
                        </div>
                        {history.status_from ? (
                          <p className="text-sm text-slate-600">
                            Dari: {getStatusLabel(history.status_from)} → {getStatusLabel(history.status_to)}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-600">
                            Pengajuan baru masuk
                          </p>
                        )}
                        {history.notes && (
                          <p className="text-sm text-slate-600 mt-1">{history.notes}</p>
                        )}
                        {history.creator && (
                          <p className="text-xs text-slate-500 mt-1">
                            {history.creator.role === 'admin' ? 'Admin' : 'Pemohon'}: {history.creator.name}
                          </p>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Pendaftaran Dibuat</p>
                    <p className="text-sm text-slate-600">{formatDate(pendaftaran.created_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DetailPendaftaranPage;