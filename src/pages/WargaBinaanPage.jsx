import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  BarChart3,
  User,
  UserCheck,
  Calendar,
  Phone,
  MapPin,
  IdCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, Button, InputField, SelectField } from '../components/ui/UIComponents';
import QuickStatsRow from '../components/ui/QuickStatsRow';
import Badge from '../components/ui/Badge';
import ConfirmationModal from '../components/ConfirmationModal';
import { wargaBinaanAPI } from '../services/api';

const WargaBinaanPage = () => {
  const navigate = useNavigate();
  const [wargaBinaan, setWargaBinaan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    relawan_id: '',
    status_kta: 'all',
    hasil_verifikasi: 'all'
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  });
  const [relawanOptions, setRelawanOptions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wargaToDelete, setWargaToDelete] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  useEffect(() => {
    fetchWargaBinaan();
    fetchStatistics();
    fetchRelawanOptions();
  }, []);

  useEffect(() => {
    fetchWargaBinaan();
  }, [filters, pagination.current_page]);

  const fetchWargaBinaan = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.current_page,
        per_page: pagination.per_page
      };

      if (params.status_kta === 'all') delete params.status_kta;
      if (params.hasil_verifikasi === 'all') delete params.hasil_verifikasi;

      const response = await wargaBinaanAPI.getAll(params);

      if (response.data.status === 'success') {
        setWargaBinaan(response.data.data.data || []);
        setPagination({
          current_page: response.data.data.current_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total,
          last_page: response.data.data.last_page
        });
      }
    } catch (error) {
      console.error('Error fetching warga binaan:', error);
      alert('Gagal memuat data warga binaan');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await wargaBinaanAPI.getStatistics();
      if (response.data.status === 'success') {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchRelawanOptions = async () => {
    try {
      const response = await wargaBinaanAPI.getRelawanOptions();
      if (response.data.status === 'success') {
        setRelawanOptions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching relawan options:', error);
    }
  };

  const handleDelete = async () => {
    if (!wargaToDelete) return;

    try {
      await wargaBinaanAPI.delete(wargaToDelete.id);
      alert('Warga binaan berhasil dihapus');
      setShowDeleteModal(false);
      setWargaToDelete(null);
      setSelectedIds([]);
      fetchWargaBinaan();
      fetchStatistics();
    } catch (error) {
      console.error('Error deleting warga binaan:', error);
      alert('Gagal menghapus warga binaan');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      const response = await wargaBinaanAPI.bulkDelete(selectedIds);
      if (response.data.status === 'success') {
        alert(response.data.message);
        setShowBulkDeleteModal(false);
        setSelectedIds([]);
        fetchWargaBinaan();
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error bulk deleting:', error);
      alert('Gagal menghapus warga binaan');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(wargaBinaan.map(w => w.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await wargaBinaanAPI.downloadTemplate();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'template_warga_binaan.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Gagal mengunduh template');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  const getStatusKTABadge = (status) => {
    return status === 'Sudah punya'
      ? <Badge variant="success" text="Sudah punya KTA" />
      : <Badge variant="warning" text="Belum punya KTA" />;
  };

  const getVerifikasiBadge = (hasil) => {
    if (!hasil) return <Badge variant="secondary" text="-" />;

    if (hasil.includes('minggu')) {
      return <Badge variant="success" text="UPA Mingguan" />;
    } else if (hasil.includes('bulan')) {
      return <Badge variant="info" text="UPA Bulanan" />;
    } else {
      return <Badge variant="danger" text="Tidak Bersedia" />;
    }
  };

  const statsCards = statistics ? [
    {
      title: 'Total Warga Binaan',
      value: statistics.total_warga || 0,
      icon: Users,
      color: 'blue',
      trend: null
    },
    {
      title: 'Sudah Punya KTA',
      value: statistics.status_kta?.sudah_punya || 0,
      icon: IdCard,
      color: 'green',
      trend: null
    },
    {
      title: 'Belum Punya KTA',
      value: statistics.status_kta?.belum_punya || 0,
      icon: UserCheck,
      color: 'orange',
      trend: null
    },
    {
      title: 'UPA Aktif',
      value: (statistics.hasil_verifikasi?.upa_bulanan || 0) + (statistics.hasil_verifikasi?.upa_mingguan || 0),
      icon: BarChart3,
      color: 'purple',
      trend: null
    }
  ] : [];

  return (
    <DashboardLayout currentPage="warga-binaan">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Manajemen Warga Binaan</h1>
            <p className="text-slate-500 mt-1">Kelola data warga binaan relawan</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleDownloadTemplate}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/warga-binaan/upload')}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/warga-binaan/create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Warga Binaan
            </Button>
          </div>
        </div>

        {/* Statistics */}
        {statistics && <QuickStatsRow stats={statsCards} />}

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-orange-800">
                  {selectedIds.length} warga binaan dipilih
                </div>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-sm text-orange-600 hover:text-orange-700 underline"
                >
                  Batalkan Pilihan
                </button>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowBulkDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus {selectedIds.length} Data
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="Pencarian"
              placeholder="Cari nama, KTA, no HP..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              icon={Search}
            />
            <SelectField
              label="Relawan"
              value={filters.relawan_id}
              onChange={(e) => handleFilterChange('relawan_id', e.target.value)}
            >
              <option value="">Semua Relawan</option>
              {relawanOptions.map(relawan => (
                <option key={relawan.id} value={relawan.id}>
                  {relawan.name}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Status KTA"
              value={filters.status_kta}
              onChange={(e) => handleFilterChange('status_kta', e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="Sudah punya">Sudah Punya</option>
              <option value="Belum punya">Belum Punya</option>
            </SelectField>
            <SelectField
              label="Hasil Verifikasi"
              value={filters.hasil_verifikasi}
              onChange={(e) => handleFilterChange('hasil_verifikasi', e.target.value)}
            >
              <option value="all">Semua</option>
              <option value="Bersedia ikut UPA 1 kali per bulan">UPA Bulanan</option>
              <option value="Bersedia ikut UPA 1 kali per minggu">UPA Mingguan</option>
              <option value="Tidak bersedia">Tidak Bersedia</option>
            </SelectField>
          </div>
        </Card>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={wargaBinaan.length > 0 && selectedIds.length === wargaBinaan.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Warga Binaan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Relawan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status KTA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Verifikasi UPA
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : wargaBinaan.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-lg font-medium">Belum ada data warga binaan</p>
                      <p className="text-sm mt-1">Tambahkan warga binaan baru atau upload file CSV</p>
                    </td>
                  </tr>
                ) : (
                  wargaBinaan.map((warga) => (
                    <tr key={warga.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(warga.id)}
                          onChange={() => handleSelectOne(warga.id)}
                          className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{warga.nama}</div>
                            <div className="text-xs text-slate-500">
                              {warga.no_kta || '-'} • {warga.usia} tahun • {warga.jenis_kelamin}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{warga.relawan?.name || '-'}</div>
                        <div className="text-xs text-slate-500">{warga.relawan?.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{warga.no_hp || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">
                          {warga.kelurahan}, {warga.kecamatan}
                        </div>
                        <div className="text-xs text-slate-500">RT {warga.rt} / RW {warga.rw}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusKTABadge(warga.status_kta)}
                      </td>
                      <td className="px-6 py-4">
                        {getVerifikasiBadge(warga.hasil_verifikasi)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => navigate(`/warga-binaan/${warga.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/warga-binaan/${warga.id}/edit`)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setWargaToDelete(warga);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
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
          {!loading && wargaBinaan.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Menampilkan {((pagination.current_page - 1) * pagination.per_page) + 1} - {Math.min(pagination.current_page * pagination.per_page, pagination.total)} dari {pagination.total} data
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                  >
                    Sebelumnya
                  </Button>
                  <div className="text-sm text-slate-600">
                    Halaman {pagination.current_page} dari {pagination.last_page}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setWargaToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Hapus Warga Binaan"
        message={`Apakah Anda yakin ingin menghapus warga binaan "${wargaToDelete?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        confirmVariant="danger"
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={handleBulkDelete}
        title="Hapus Multiple Warga Binaan"
        message={`Apakah Anda yakin ingin menghapus ${selectedIds.length} warga binaan yang dipilih? Tindakan ini tidak dapat dibatalkan.`}
        confirmText={`Hapus ${selectedIds.length} Data`}
        confirmVariant="danger"
      />
    </DashboardLayout>
  );
};

export default WargaBinaanPage;
