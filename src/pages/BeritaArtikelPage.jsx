import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit3, Eye, Trash2, Calendar, User, Tag, Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProtectedDashboardLayout from '../components/layout/ProtectedDashboardLayout';
import { Card } from '../components/ui/UIComponents';
import { newsAPI } from '../services/api';

const BeritaArtikelPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0
  });

  const categories = [
    'Pengumuman',
    'Kegiatan', 
    'Bantuan',
    'Umum'
  ];

  // Fetch news data
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (activeTab !== 'all') {
        params.is_published = activeTab === 'published';
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await newsAPI.getAll(params);
      
      if (response.data.status === 'success') {
        const newsData = response.data.data.data || [];
        setArticles(newsData);
        
        // Calculate stats
        const total = newsData.length;
        const published = newsData.filter(article => article.is_published).length;
        const draft = total - published;
        const totalViews = newsData.reduce((sum, article) => sum + (article.views || 0), 0);
        
        setStats({ total, published, draft, totalViews });
      } else {
        setError('Gagal mengambil data berita');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.response?.data?.message || 'Gagal mengambil data berita');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete news
  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      return;
    }
    
    try {
      await newsAPI.delete(id);
      await fetchNews(); // Refresh data
      alert('Berita berhasil dihapus');
    } catch (err) {
      console.error('Error deleting news:', err);
      alert(err.response?.data?.message || 'Gagal menghapus berita');
    }
  };

  // Handle toggle publish
  const handleTogglePublish = async (id) => {
    try {
      await newsAPI.togglePublish(id);
      await fetchNews(); // Refresh data
      alert('Status publikasi berhasil diubah');
    } catch (err) {
      console.error('Error toggling publish:', err);
      alert(err.response?.data?.message || 'Gagal mengubah status publikasi');
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchNews();
  }, [activeTab, searchQuery]);

  const getStatusBadge = (isPublished) => {
    if (isPublished) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Published
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Draft
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (content) => {
    if (!content) return '';
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  };

  return (
    <ProtectedDashboardLayout
      currentPage="news"
      pageTitle="Berita & Artikel"
      breadcrumbs={['Berita & Artikel']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Berita & Artikel</h1>
              <p className="text-blue-100">Kelola konten berita dan artikel untuk publikasi</p>
            </div>
            <div className="hidden md:block">
              <FileText className="w-16 h-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-600">Total Artikel</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalViews}</p>
                <p className="text-sm text-slate-600">Total Views</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <Edit3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.draft}</p>
                <p className="text-sm text-slate-600">Draft</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.published}</p>
                <p className="text-sm text-slate-600">Published</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          {/* Header with Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Daftar Artikel</h2>
              <p className="text-sm text-slate-600 mt-1">Kelola semua artikel dan berita</p>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <button 
                onClick={() => navigate('/tambah-berita')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Artikel
              </button>
              <button 
                onClick={fetchNews}
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
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'published', label: 'Published' },
                { id: 'draft', label: 'Draft' }
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

          {/* Articles List */}
          <div className="divide-y divide-slate-200">
            {loading ? (
              <div className="p-6 text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-slate-600">Memuat data berita...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600 mb-2">{error}</p>
                <button 
                  onClick={fetchNews}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            ) : articles.length === 0 ? (
              <div className="p-6 text-center">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">Belum ada artikel</p>
              </div>
            ) : (
              articles.map((article) => (
                <div key={article.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-slate-900 hover:text-blue-600 cursor-pointer">
                          {article.judul}
                        </h3>
                        {getStatusBadge(article.is_published)}
                      </div>
                      
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                        {getExcerpt(article.konten)}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-xs text-slate-500">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {article.author?.name || 'Admin'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(article.published_at || article.created_at)}
                        </div>
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 mr-1" />
                          {article.kategori}
                        </div>
                        {article.is_published && (
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {article.views || 0} views
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => handleTogglePublish(article.id)}
                        className={`p-2 hover:bg-blue-50 rounded-lg transition-colors ${
                          article.is_published ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'
                        }`}
                        title={article.is_published ? 'Unpublish' : 'Publish'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigate(`/edit-berita/${article.id}`)}
                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(article.id)}
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
          {!loading && !error && articles.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Menampilkan {articles.length} artikel
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
            onClick={() => navigate('/tambah-berita')}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Tulis Artikel Baru</h3>
                <p className="text-sm text-slate-600">Buat artikel atau berita baru</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Kelola Kategori</h3>
                <p className="text-sm text-slate-600">Atur kategori artikel</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Template Artikel</h3>
                <p className="text-sm text-slate-600">Gunakan template siap pakai</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Categories Overview */}
        <Card title="Kategori Artikel" subtitle="Distribusi artikel berdasarkan kategori">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => {
              const articleCount = articles.filter(article => article.kategori === category).length;
              const colors = [
                'bg-blue-100 text-blue-800',
                'bg-green-100 text-green-800', 
                'bg-purple-100 text-purple-800',
                'bg-yellow-100 text-yellow-800'
              ];
              
              return (
                <div key={category} className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900">{category}</h4>
                      <p className="text-sm text-slate-600">{articleCount} artikel</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[index % colors.length]}`}>
                      {articleCount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Status Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800">Berita & Artikel Terintegrasi</p>
              <p className="text-sm text-green-700 mt-1">
                Halaman ini sudah terintegrasi dengan API Laravel backend untuk manajemen berita dan artikel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
};

export default BeritaArtikelPage;