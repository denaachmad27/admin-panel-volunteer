import React, { useState } from 'react';
import { FileText, Plus, Edit3, Eye, Trash2, Calendar, User, Tag, Search, Filter, AlertCircle } from 'lucide-react';
import ProtectedDashboardLayout from '../components/layout/ProtectedDashboardLayout';
import { Card } from '../components/ui/UIComponents';

const BeritaArtikelPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data untuk berita
  const articles = [
    {
      id: 1,
      title: 'Program Bantuan Pangan Tahap 2 Dimulai',
      excerpt: 'Pemerintah meluncurkan program bantuan pangan tahap 2 untuk membantu keluarga kurang mampu di masa pandemi...',
      author: 'Admin Sosial',
      publishDate: '2024-01-15',
      status: 'published',
      category: 'Program Bantuan',
      views: 1248,
      image: null
    },
    {
      id: 2,
      title: 'Tips Menjaga Kesehatan di Musim Hujan',
      excerpt: 'Musim hujan telah tiba, berikut adalah tips untuk menjaga kesehatan keluarga agar terhindar dari penyakit...',
      author: 'Dr. Siti Nurhaliza',
      publishDate: '2024-01-12',
      status: 'published',
      category: 'Kesehatan',
      views: 892,
      image: null
    },
    {
      id: 3,
      title: 'Pendaftaran Beasiswa Pendidikan 2024',
      excerpt: 'Program beasiswa pendidikan untuk siswa berprestasi dari keluarga kurang mampu kini telah dibuka...',
      author: 'Admin Pendidikan',
      publishDate: '2024-01-10',
      status: 'draft',
      category: 'Pendidikan',
      views: 0,
      image: null
    },
    {
      id: 4,
      title: 'Pelatihan Keterampilan untuk Ibu Rumah Tangga',
      excerpt: 'Dinas Sosial mengadakan pelatihan keterampilan gratis untuk ibu rumah tangga dalam rangka pemberdayaan ekonomi...',
      author: 'Tim Pemberdayaan',
      publishDate: '2024-01-08',
      status: 'published',
      category: 'Pemberdayaan',
      views: 567,
      image: null
    },
    {
      id: 5,
      title: 'Laporan Penyaluran Bantuan Bulan Desember',
      excerpt: 'Berikut adalah laporan lengkap penyaluran bantuan sosial yang telah dilaksanakan pada bulan Desember 2023...',
      author: 'Admin Laporan',
      publishDate: '2024-01-05',
      status: 'published',
      category: 'Laporan',
      views: 334,
      image: null
    }
  ];

  const categories = [
    'Program Bantuan',
    'Kesehatan', 
    'Pendidikan',
    'Pemberdayaan',
    'Laporan',
    'Pengumuman'
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || article.status === activeTab;
    return matchesSearch && matchesTab;
  });

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
                <p className="text-2xl font-bold text-slate-900">156</p>
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
                <p className="text-2xl font-bold text-slate-900">12.4K</p>
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
                <p className="text-2xl font-bold text-slate-900">8</p>
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
                <p className="text-2xl font-bold text-slate-900">24</p>
                <p className="text-sm text-slate-600">Bulan Ini</p>
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
            <button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Artikel
            </button>
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
            {filteredArticles.map((article) => (
              <div key={article.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-slate-900 hover:text-blue-600 cursor-pointer">
                        {article.title}
                      </h3>
                      {getStatusBadge(article.status)}
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-xs text-slate-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.publishDate).toLocaleDateString('id-ID')}
                      </div>
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 mr-1" />
                        {article.category}
                      </div>
                      {article.status === 'published' && (
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {article.views} views
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Menampilkan {filteredArticles.length} dari {articles.length} artikel
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50">
                  2
                </button>
                <button className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category, index) => {
              const articleCount = articles.filter(article => article.category === category).length;
              const colors = [
                'bg-blue-100 text-blue-800',
                'bg-green-100 text-green-800', 
                'bg-purple-100 text-purple-800',
                'bg-yellow-100 text-yellow-800',
                'bg-red-100 text-red-800',
                'bg-indigo-100 text-indigo-800'
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

        {/* Temporary Page Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Halaman Sementara</p>
              <p className="text-sm text-yellow-700 mt-1">
                Ini adalah halaman sementara untuk menu Berita & Artikel. Fitur lengkap sedang dalam pengembangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
};

export default BeritaArtikelPage;