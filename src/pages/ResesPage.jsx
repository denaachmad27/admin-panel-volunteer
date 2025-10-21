import React, { useState, useEffect } from 'react';
import {
  CalendarCheck, MapPin, Users, Plus, Edit3, Trash2,
  Search, Filter, RefreshCw, Eye, Calendar, Image
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import QuickStatsRow from '../components/ui/QuickStatsRow';
import axios from 'axios';

const ResesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resesList, setResesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    ongoing: 0,
    completed: 0
  });

  // Fetch reses data
  const fetchReses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();

      if (activeTab !== 'all') {
        params.append('status', activeTab);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/reses?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setResesList(data);

        // Calculate stats
        setStats({
          total: data.length,
          scheduled: data.filter(r => r.status === 'scheduled').length,
          ongoing: data.filter(r => r.status === 'ongoing').length,
          completed: data.filter(r => r.status === 'completed').length
        });
      }
    } catch (err) {
      console.error('Error fetching reses:', err);
      alert('Gagal memuat data reses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReses();
  }, [activeTab, searchQuery]);

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus reses ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/reses/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Reses berhasil dihapus');
      fetchReses();
    } catch (err) {
      console.error('Error deleting reses:', err);
      alert('Gagal menghapus reses');
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      scheduled: 'bg-blue-100 text-blue-700',
      ongoing: 'bg-orange-100 text-orange-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };

    const labels = {
      scheduled: 'Dijadwalkan',
      ongoing: 'Berlangsung',
      completed: 'Selesai',
      cancelled: 'Dibatalkan'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status] || 'bg-gray-100 text-gray-700'}`}>
        {labels[status] || status}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const statsData = [
    { label: 'Total Reses', value: stats.total, icon: CalendarCheck, color: 'bg-blue-500' },
    { label: 'Dijadwalkan', value: stats.scheduled, icon: Calendar, color: 'bg-indigo-500' },
    { label: 'Berlangsung', value: stats.ongoing, icon: Users, color: 'bg-orange-500' },
    { label: 'Selesai', value: stats.completed, icon: CalendarCheck, color: 'bg-green-500' }
  ];

  return (
    <DashboardLayout currentPage="reses">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Reses</h1>
            <p className="text-slate-600 mt-1">Kelola kegiatan reses anggota legislatif</p>
          </div>
          <button
            onClick={() => navigate('/reses/create')}
            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Reses</span>
          </button>
        </div>

        {/* Quick Stats */}
        <QuickStatsRow stats={statsData} />

        {/* Filters and Search */}
        <Card>
          <div className="p-6 space-y-4">
            {/* Tabs */}
            <div className="flex space-x-2 border-b border-slate-200">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'scheduled', label: 'Dijadwalkan' },
                { id: 'ongoing', label: 'Berlangsung' },
                { id: 'completed', label: 'Selesai' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari reses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                onClick={() => fetchReses()}
                className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Reses List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Judul
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Anggota Legislatif
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Memuat data...
                    </td>
                  </tr>
                ) : resesList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <CalendarCheck className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                      Tidak ada data reses
                    </td>
                  </tr>
                ) : (
                  resesList.map((reses) => (
                    <tr key={reses.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div>
                            <p className="font-medium text-slate-900">{reses.judul}</p>
                            {reses.foto_kegiatan && (
                              <p className="text-xs text-slate-500 flex items-center mt-1">
                                <Image className="w-3 h-3 mr-1" />
                                Ada foto
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {reses.lokasi}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{formatDate(reses.tanggal_mulai)}</div>
                        <div className="text-xs text-slate-400">s/d {formatDate(reses.tanggal_selesai)}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(reses.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {reses.legislative_member_name || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/reses/${reses.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/reses/${reses.id}/edit`)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(reses.id)}
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
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResesPage;
