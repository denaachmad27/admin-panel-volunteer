import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  Edit, 
  Trash2,
  Search,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  User,
  FileText,
  DollarSign,
  Heart,
  Filter,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, Button, InputField, SelectField } from '../components/ui/UIComponents';
import StatCard from '../components/ui/StatsCard';
import Badge from '../components/ui/Badge';
import volunteerService from '../services/volunteerService';
import VolunteerDetailModal from '../components/VolunteerDetailModal';
import ConfirmationModal from '../components/ConfirmationModal';

const ManajemenRelawan = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    profile_complete: 'all',
    city: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  });
  const [statistics, setStatistics] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] = useState(null);

  useEffect(() => {
    fetchVolunteers();
    fetchStatistics();
  }, [filters, pagination.current_page, pagination.per_page]);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.current_page,
        per_page: pagination.per_page
      };
      
      const data = await volunteerService.getVolunteers(params);
      setVolunteers(data.data);
      setPagination(prev => ({
        ...prev,
        ...data
      }));
    } catch (err) {
      setError(err.message || 'Gagal memuat data relawan');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await volunteerService.getVolunteerStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Gagal memuat statistik:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, current_page: 1 }));
    fetchVolunteers();
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleViewDetail = async (volunteer) => {
    try {
      const detailData = await volunteerService.getVolunteer(volunteer.id);
      setSelectedVolunteer(detailData);
      setShowDetailModal(true);
    } catch (err) {
      setError('Gagal memuat detail relawan');
    }
  };

  const handleToggleStatus = async (volunteer) => {
    try {
      await volunteerService.updateVolunteerStatus(volunteer.id, !volunteer.is_active);
      fetchVolunteers();
    } catch (err) {
      setError('Gagal mengubah status relawan');
    }
  };

  const handleDeleteVolunteer = async () => {
    if (!volunteerToDelete) return;
    
    try {
      await volunteerService.deleteVolunteer(volunteerToDelete.id);
      setShowDeleteModal(false);
      setVolunteerToDelete(null);
      fetchVolunteers();
    } catch (err) {
      setError('Gagal menghapus relawan');
    }
  };

  // Helper functions
  const getStatusBadge = (isActive) => {
    return (
      <Badge variant={isActive ? 'success' : 'danger'}>
        <div className="flex items-center space-x-1">
          {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          <span>{isActive ? 'Aktif' : 'Nonaktif'}</span>
        </div>
      </Badge>
    );
  };

  const getCompletionBadge = (completion) => {
    const getVariant = (percentage) => {
      if (percentage === 100) return 'success';
      if (percentage >= 75) return 'info';
      if (percentage >= 50) return 'warning';
      return 'danger';
    };

    return (
      <Badge variant={getVariant(completion.percentage)}>
        <div className="flex items-center space-x-1">
          {completion.percentage === 100 ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          <span>{completion.percentage}%</span>
        </div>
      </Badge>
    );
  };

  if (loading && !volunteers.length) {
    return (
      <DashboardLayout currentPage="volunteers">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="volunteers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Relawan</h1>
            <p className="text-slate-600 mt-1">
              Kelola data relawan dan profil lengkap mereka
            </p>
          </div>
          <Button
            variant="primary"
            icon={RefreshCw}
            onClick={() => {
              fetchVolunteers();
              fetchStatistics();
            }}
            loading={loading}
          >
            Refresh Data
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Relawan"
            value={statistics.total_volunteers}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Relawan Aktif"
            value={statistics.active_volunteers}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Profil Lengkap"
            value={statistics.complete_profiles}
            icon={FileText}
            color="bg-purple-500"
          />
          <StatCard
            title="Kelengkapan Profil"
            value={`${statistics.completion_percentage}%`}
            icon={BarChart3}
            color="bg-yellow-500"
          />
        </div>
      )}

        {/* Filters */}
        <Card 
          title="Filter & Pencarian" 
          subtitle="Gunakan filter untuk mempersempit pencarian relawan"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <InputField
                label="Cari Relawan"
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Nama, email, NIK..."
                icon={Search}
              />

              <SelectField
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                options={[
                  { value: 'all', label: 'Semua Status' },
                  { value: 'active', label: 'Aktif' },
                  { value: 'inactive', label: 'Nonaktif' }
                ]}
              />

              <SelectField
                label="Kelengkapan Profil"
                value={filters.profile_complete}
                onChange={(e) => handleFilterChange('profile_complete', e.target.value)}
                options={[
                  { value: 'all', label: 'Semua' },
                  { value: 'complete', label: 'Lengkap' },
                  { value: 'incomplete', label: 'Belum Lengkap' }
                ]}
              />

              <InputField
                label="Kota"
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="Kota..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ search: '', status: 'all', profile_complete: 'all', city: '' });
                  setPagination(prev => ({ ...prev, current_page: 1 }));
                }}
              >
                Reset Filter
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={Search}
              >
                Cari Relawan
              </Button>
            </div>
          </form>
        </Card>

        {/* Volunteers Table */}
        <Card 
          title="Daftar Relawan" 
          subtitle={`Total ${pagination.total} relawan terdaftar`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Relawan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Kelengkapan Profil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Terdaftar
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {volunteer.profile?.foto_profil ? (
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={volunteer.profile.foto_profil} 
                              alt={volunteer.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-300 flex items-center justify-center">
                              <User className="h-6 w-6 text-slate-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {volunteer.profile?.nama_lengkap || volunteer.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {volunteer.profile?.nik || 'NIK tidak tersedia'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{volunteer.email}</div>
                      <div className="text-sm text-slate-500">{volunteer.phone || 'Tidak ada'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(volunteer.is_active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getCompletionBadge(volunteer.profile_completion)}
                        <div className="text-xs text-slate-500">
                          {volunteer.profile_completion.completed_count}/{volunteer.profile_completion.total_count}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {volunteerService.formatDate(volunteer.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(volunteer)}
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={volunteer.is_active ? "danger" : "success"}
                          size="sm"
                          onClick={() => handleToggleStatus(volunteer)}
                          title={volunteer.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {volunteer.is_active ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setVolunteerToDelete(volunteer);
                            setShowDeleteModal(true);
                          }}
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          </div>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-slate-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                  disabled={pagination.current_page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                  disabled={pagination.current_page === pagination.last_page}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-700">
                    Menampilkan{' '}
                    <span className="font-medium">{pagination.from}</span>
                    {' '}sampai{' '}
                    <span className="font-medium">{pagination.to}</span>
                    {' '}dari{' '}
                    <span className="font-medium">{pagination.total}</span>
                    {' '}relawan
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                    disabled={pagination.current_page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                    disabled={pagination.current_page === pagination.last_page}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Empty State */}
        {!loading && volunteers.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">Tidak ada relawan</h3>
              <p className="mt-1 text-sm text-slate-500">
                Belum ada relawan yang terdaftar atau sesuai dengan filter yang dipilih.
              </p>
            </div>
          </Card>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedVolunteer && (
          <VolunteerDetailModal
            volunteer={selectedVolunteer}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedVolunteer(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setVolunteerToDelete(null);
            }}
            onConfirm={handleDeleteVolunteer}
            title="Hapus Relawan"
            message={`Apakah Anda yakin ingin menghapus relawan "${volunteerToDelete?.name}"? Semua data terkait akan dihapus permanen.`}
            confirmText="Hapus"
            cancelText="Batal"
            type="danger"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManajemenRelawan;