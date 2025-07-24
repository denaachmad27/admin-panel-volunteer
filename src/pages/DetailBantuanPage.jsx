import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit3, Trash2, Users, Calendar, CheckCircle, Clock, AlertCircle, Loader, FileText, Heart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import { bantuanSosialAPI } from '../services/api';

const DetailBantuanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [bantuan, setBantuan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBantuanDetail();
  }, [id]);

  const loadBantuanDetail = async () => {
    try {
      setLoading(true);
      const response = await bantuanSosialAPI.getById(id);
      
      if (response.data.status === 'success') {
        setBantuan(response.data.data);
      } else {
        setError('Gagal memuat detail bantuan sosial');
      }
    } catch (err) {
      console.error('Error loading bantuan detail:', err);
      setError('Bantuan sosial tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus program bantuan ini?')) {
      return;
    }
    
    try {
      await bantuanSosialAPI.delete(id);
      alert('Program bantuan berhasil dihapus');
      navigate('/daftar-bantuan');
    } catch (err) {
      console.error('Error deleting bantuan sosial:', err);
      alert(err.response?.data?.message || 'Gagal menghapus program bantuan');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Aktif': { bg: 'bg-orange-100', text: 'text-orange-800', icon: CheckCircle },
      'Tidak Aktif': { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock },
      'Selesai': { bg: 'bg-orange-100', text: 'text-orange-800', icon: CheckCircle }
    };
    
    const config = statusConfig[status] || statusConfig['Tidak Aktif'];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="w-4 h-4 mr-1" />
        {status}
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
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

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
  };

  const getProgressPercentage = (used, total) => {
    if (!total) return 0;
    return Math.round((used / total) * 100);
  };

  if (loading) {
    return (
      <DashboardLayout
        currentPage="bantuan"
        pageTitle="Detail Program Bantuan"
        breadcrumbs={['Bantuan Sosial', 'Detail Program']}
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-slate-600">Memuat detail program bantuan...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !bantuan) {
    return (
      <DashboardLayout
        currentPage="bantuan"
        pageTitle="Detail Program Bantuan"
        breadcrumbs={['Bantuan Sosial', 'Detail Program']}
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Program Tidak Ditemukan</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/daftar-bantuan')}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Kembali ke Daftar Program
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      currentPage="bantuan"
      pageTitle="Detail Program Bantuan"
      breadcrumbs={['Bantuan Sosial', bantuan.nama_bantuan]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/daftar-bantuan')}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{bantuan.nama_bantuan}</h1>
              <p className="text-slate-600">Detail lengkap program bantuan sosial</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => navigate(`/edit-bantuan/${bantuan.id}`)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{bantuan.kuota}</p>
                <p className="text-sm text-slate-600">Total Kuota</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{bantuan.kuota_terpakai || 0}</p>
                <p className="text-sm text-slate-600">Terpakai</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{bantuan.kuota - (bantuan.kuota_terpakai || 0)}</p>
                <p className="text-sm text-slate-600">Sisa Kuota</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <span className="text-purple-600 font-bold">%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{getProgressPercentage(bantuan.kuota_terpakai || 0, bantuan.kuota)}%</p>
                <p className="text-sm text-slate-600">Progress</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Program Information */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Informasi Program</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Status:</span>
                    {getStatusBadge(bantuan.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Jenis Bantuan:</span>
                    {getJenisBadge(bantuan.jenis_bantuan)}
                  </div>
                  
                  {bantuan.nominal && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Nominal:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(bantuan.nominal)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Periode:</span>
                    <span className="font-medium">{formatDate(bantuan.tanggal_mulai)} - {formatDate(bantuan.tanggal_selesai)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Deskripsi Program</h3>
                  <p className="text-slate-600 leading-relaxed">{bantuan.deskripsi}</p>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                    <span>Progress Kuota</span>
                    <span>{getProgressPercentage(bantuan.kuota_terpakai || 0, bantuan.kuota)}% ({bantuan.kuota_terpakai || 0}/{bantuan.kuota})</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(getProgressPercentage(bantuan.kuota_terpakai || 0, bantuan.kuota), 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Requirements */}
          <div>
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Persyaratan
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Syarat Bantuan</h3>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm text-slate-600 whitespace-pre-line">{bantuan.syarat_bantuan}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Dokumen Diperlukan</h3>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm text-slate-600 whitespace-pre-line">{bantuan.dokumen_diperlukan}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Statistics */}
        {bantuan.statistik_pendaftaran && (
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Statistik Pendaftaran</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">{bantuan.statistik_pendaftaran.total_pendaftar}</p>
                  <p className="text-sm text-slate-600">Total Pendaftar</p>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-700">{bantuan.statistik_pendaftaran.pending}</p>
                  <p className="text-sm text-yellow-600">Pending</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{bantuan.statistik_pendaftaran.disetujui}</p>
                  <p className="text-sm text-green-600">Disetujui</p>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-700">{bantuan.statistik_pendaftaran.ditolak}</p>
                  <p className="text-sm text-red-600">Ditolak</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Metadata */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Informasi Sistem</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">ID Program:</span>
                <span className="ml-2 font-mono">{bantuan.id}</span>
              </div>
              
              <div>
                <span className="text-slate-600">Dibuat:</span>
                <span className="ml-2">{formatDate(bantuan.created_at)}</span>
              </div>
              
              <div>
                <span className="text-slate-600">Terakhir Diubah:</span>
                <span className="ml-2">{formatDate(bantuan.updated_at)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DetailBantuanPage;