import React, { useState, useEffect } from 'react';
import {
  Lightbulb, MapPin, Target, Plus, Edit3, Trash2,
  Search, Filter, RefreshCw, Eye, Flag, Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import QuickStatsRow from '../components/ui/QuickStatsRow';
import axios from 'axios';

const PokirPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pokirList, setPokirList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    proposed: 0,
    approved: 0,
    in_progress: 0,
    completed: 0
  });

  // Fetch pokir data
  const fetchPokir = async () => {
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
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/pokir?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setPokirList(data);

        // Calculate stats
        setStats({
          total: data.length,
          proposed: data.filter(p => p.status === 'proposed').length,
          approved: data.filter(p => p.status === 'approved').length,
          in_progress: data.filter(p => p.status === 'in_progress').length,
          completed: data.filter(p => p.status === 'completed').length
        });
      }
    } catch (err) {
      console.error('Error fetching pokir:', err);
      alert('Gagal memuat data pokir');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokir();
  }, [activeTab, searchQuery]);

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pokir ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/pokir/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Pokir berhasil dihapus');
      fetchPokir();
    } catch (err) {
      console.error('Error deleting pokir:', err);
      alert('Gagal menghapus pokir');
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      proposed: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
      in_progress: 'bg-orange-100 text-orange-700',
      completed: 'bg-teal-100 text-teal-700',
      rejected: 'bg-red-100 text-red-700'
    };

    const labels = {
      proposed: 'Diusulkan',
      approved: 'Disetujui',
      in_progress: 'Dalam Proses',
      completed: 'Selesai',
      rejected: 'Ditolak'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status] || 'bg-gray-100 text-gray-700'}`}>
        {labels[status] || status}
      </span>
    );
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-green-100 text-green-700'
    };

    const labels = {
      high: 'Tinggi',
      medium: 'Sedang',
      low: 'Rendah'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[priority] || 'bg-gray-100 text-gray-700'}`}>
        {labels[priority] || priority}
      </span>
    );
  };

  // Get category badge
  const getCategoryColor = (kategori) => {
    const colors = {
      'Infrastruktur': 'bg-brown-100 text-brown-700',
      'Pendidikan': 'bg-blue-100 text-blue-700',
      'Kesehatan': 'bg-green-100 text-green-700',
      'Ekonomi': 'bg-orange-100 text-orange-700',
      'Sosial': 'bg-purple-100 text-purple-700',
      'Lingkungan': 'bg-teal-100 text-teal-700'
    };
    return colors[kategori] || 'bg-gray-100 text-gray-700';
  };

  const statsData = [
    { label: 'Total Pokir', value: stats.total, icon: Lightbulb, color: 'bg-purple-500' },
    { label: 'Diusulkan', value: stats.proposed, icon: Target, color: 'bg-blue-500' },
    { label: 'Disetujui', value: stats.approved, icon: Flag, color: 'bg-green-500' },
    { label: 'Dalam Proses', value: stats.in_progress, icon: RefreshCw, color: 'bg-orange-500' }
  ];

  return (
    <DashboardLayout currentPage="pokir">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Pokok Pikiran (Pokir)</h1>
            <p className="text-slate-600 mt-1">Kelola usulan pokok pikiran anggota legislatif</p>
          </div>
          <button
            onClick={() => navigate('/pokir/create')}
            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Pokir</span>
          </button>
        </div>

        {/* Quick Stats */}
        <QuickStatsRow stats={statsData} />

        {/* Filters and Search */}
        <Card>
          <div className="p-6 space-y-4">
            {/* Tabs */}
            <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'proposed', label: 'Diusulkan' },
                { id: 'approved', label: 'Disetujui' },
                { id: 'in_progress', label: 'Dalam Proses' },
                { id: 'completed', label: 'Selesai' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
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
                  placeholder="Cari pokir..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                onClick={() => fetchPokir()}
                className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Pokir List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Judul
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Prioritas
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
                ) : pokirList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <Lightbulb className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                      Tidak ada data pokir
                    </td>
                  </tr>
                ) : (
                  pokirList.map((pokir) => (
                    <tr key={pokir.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{pokir.judul}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{pokir.deskripsi}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(pokir.kategori)}`}>
                          {pokir.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getPriorityBadge(pokir.prioritas)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(pokir.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {pokir.legislative_member_name || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/pokir/${pokir.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/pokir/${pokir.id}/edit`)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(pokir.id)}
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

export default PokirPage;
