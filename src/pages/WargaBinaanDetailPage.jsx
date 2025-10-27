import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Calendar,
  MapPin,
  Phone,
  IdCard,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, Button } from '../components/ui/UIComponents';
import Badge from '../components/ui/Badge';
import ConfirmationModal from '../components/ConfirmationModal';
import { wargaBinaanAPI } from '../services/api';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

const WargaBinaanDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [warga, setWarga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchWargaBinaan();
  }, [id]);

  const fetchWargaBinaan = async () => {
    setLoading(true);
    try {
      const response = await wargaBinaanAPI.getById(id);
      if (response.data.status === 'success') {
        setWarga(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching warga binaan:', error);
      alert('Gagal memuat data warga binaan');
      navigate('/warga-binaan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await wargaBinaanAPI.delete(id);
      alert('Warga binaan berhasil dihapus');
      navigate('/warga-binaan');
    } catch (error) {
      console.error('Error deleting warga binaan:', error);
      alert('Gagal menghapus warga binaan');
    }
  };

  const getStatusKTABadge = (status) => {
    return status === 'Sudah punya'
      ? <Badge variant="success" text="Sudah punya KTA" />
      : <Badge variant="warning" text="Belum punya KTA" />;
  };

  const getVerifikasiBadge = (hasil) => {
    if (!hasil) return <Badge variant="secondary" text="Belum diverifikasi" />;

    if (hasil.includes('minggu')) {
      return <Badge variant="success" text="Bersedia ikut UPA 1x per minggu" />;
    } else if (hasil.includes('bulan')) {
      return <Badge variant="info" text="Bersedia ikut UPA 1x per bulan" />;
    } else {
      return <Badge variant="danger" text="Tidak Bersedia" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout currentPage="warga-binaan">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!warga) {
    return (
      <DashboardLayout currentPage="warga-binaan">
        <div className="text-center py-12">
          <p className="text-slate-500">Data warga binaan tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="warga-binaan">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/warga-binaan')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Detail Warga Binaan</h1>
              <p className="text-slate-500 mt-1">Informasi lengkap warga binaan</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              onClick={() => navigate(`/warga-binaan/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>

        {/* Informasi Utama */}
        <Card>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-orange-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{warga.nama}</h2>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {warga.no_kta && (
                  <div className="flex items-center text-sm text-slate-600">
                    <IdCard className="w-4 h-4 mr-2 text-slate-400" />
                    No KTA: {warga.no_kta}
                  </div>
                )}
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  {warga.usia} tahun
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <User className="w-4 h-4 mr-2 text-slate-400" />
                  {warga.jenis_kelamin}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusKTABadge(warga.status_kta)}
                {getVerifikasiBadge(warga.hasil_verifikasi)}
              </div>
            </div>
          </div>
        </Card>

        {/* Informasi Relawan */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-orange-500" />
            Relawan Pembina
          </h3>
          {warga.relawan ? (
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Nama Relawan</p>
                  <p className="text-base font-medium text-slate-800">{warga.relawan.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Email</p>
                  <p className="text-base font-medium text-slate-800">{warga.relawan.email}</p>
                </div>
                {warga.relawan.phone && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">No HP</p>
                    <p className="text-base font-medium text-slate-800">{warga.relawan.phone}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-slate-500">Tidak ada informasi relawan</p>
          )}
        </Card>

        {/* Informasi Pribadi */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-orange-500" />
            Informasi Pribadi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Tanggal Lahir</p>
              <p className="text-base font-medium text-slate-800">
                {warga.tanggal_lahir ? format(new Date(warga.tanggal_lahir), 'd MMMM yyyy', { locale: localeId }) : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Usia</p>
              <p className="text-base font-medium text-slate-800">{warga.usia} tahun</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Jenis Kelamin</p>
              <p className="text-base font-medium text-slate-800">{warga.jenis_kelamin}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">No HP</p>
              <p className="text-base font-medium text-slate-800">
                {warga.no_hp ? (
                  <a href={`tel:${warga.no_hp}`} className="text-orange-600 hover:text-orange-700 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {warga.no_hp}
                  </a>
                ) : '-'}
              </p>
            </div>
          </div>
        </Card>

        {/* Alamat */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-orange-500" />
            Alamat
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Alamat Lengkap</p>
              <p className="text-base font-medium text-slate-800">{warga.alamat}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Kelurahan</p>
                <p className="text-base font-medium text-slate-800">{warga.kelurahan}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Kecamatan</p>
                <p className="text-base font-medium text-slate-800">{warga.kecamatan}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">RT</p>
                <p className="text-base font-medium text-slate-800">{warga.rt}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">RW</p>
                <p className="text-base font-medium text-slate-800">{warga.rw}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Status & Verifikasi */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-orange-500" />
            Status & Verifikasi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-2">Status KTA</p>
              {getStatusKTABadge(warga.status_kta)}
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-2">Hasil Verifikasi UPA</p>
              {getVerifikasiBadge(warga.hasil_verifikasi)}
            </div>
          </div>
        </Card>

        {/* Timestamp */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-500">
            <div>
              <p className="mb-1">Dibuat pada</p>
              <p className="font-medium text-slate-800">
                {warga.created_at ? format(new Date(warga.created_at), 'd MMMM yyyy, HH:mm', { locale: localeId }) : '-'}
              </p>
            </div>
            <div>
              <p className="mb-1">Terakhir diperbarui</p>
              <p className="font-medium text-slate-800">
                {warga.updated_at ? format(new Date(warga.updated_at), 'd MMMM yyyy, HH:mm', { locale: localeId }) : '-'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Hapus Warga Binaan"
        message={`Apakah Anda yakin ingin menghapus warga binaan "${warga?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        confirmVariant="danger"
      />
    </DashboardLayout>
  );
};

export default WargaBinaanDetailPage;
