import React, { useState } from 'react';
import { Tag, Plus, Edit3, Trash2, Eye, Search, AlertCircle, Save, X, FileText } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';

const KategoriPage = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Program Bantuan',
      slug: 'program-bantuan',
      description: 'Artikel tentang program-program bantuan sosial',
      articlesCount: 45,
      color: 'bg-blue-500',
      createdAt: '2023-12-01',
      status: 'active'
    },
    {
      id: 2,
      name: 'Kesehatan',
      slug: 'kesehatan',
      description: 'Tips dan informasi kesehatan untuk masyarakat',
      articlesCount: 28,
      color: 'bg-green-500',
      createdAt: '2023-12-01',
      status: 'active'
    },
    {
      id: 3,
      name: 'Pendidikan',
      slug: 'pendidikan',
      description: 'Informasi beasiswa dan program pendidikan',
      articlesCount: 32,
      color: 'bg-purple-500',
      createdAt: '2023-12-01',
      status: 'active'
    },
    {
      id: 4,
      name: 'Pemberdayaan',
      slug: 'pemberdayaan',
      description: 'Program pemberdayaan masyarakat dan UMKM',
      articlesCount: 19,
      color: 'bg-orange-500',
      createdAt: '2023-12-05',
      status: 'active'
    },
    {
      id: 5,
      name: 'Laporan',
      slug: 'laporan',
      description: 'Laporan kegiatan dan penyaluran bantuan',
      articlesCount: 15,
      color: 'bg-indigo-500',
      createdAt: '2023-12-10',
      status: 'active'
    },
    {
      id: 6,
      name: 'Pengumuman',
      slug: 'pengumuman',
      description: 'Pengumuman resmi dan informasi penting',
      articlesCount: 23,
      color: 'bg-red-500',
      createdAt: '2023-12-15',
      status: 'inactive'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: 'bg-blue-500'
  });
  const [errors, setErrors] = useState({});

  const colorOptions = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-yellow-500',
    'bg-gray-500'
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama kategori wajib diisi';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi kategori wajib diisi';
    }

    // Check if slug already exists (except for current editing category)
    const existingCategory = categories.find(cat => 
      cat.slug === formData.slug && cat.id !== editingCategory?.id
    );
    if (existingCategory) {
      newErrors.slug = 'Slug sudah digunakan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
    } else {
      // Add new category
      const newCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        ...formData,
        articlesCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      setCategories(prev => [...prev, newCategory]);
    }

    handleCloseModal();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color
    });
    setShowAddModal(true);
  };

  const handleDelete = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && category.articlesCount > 0) {
      alert(`Tidak dapat menghapus kategori "${category.name}" karena masih memiliki ${category.articlesCount} artikel.`);
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
  };

  const handleToggleStatus = (categoryId) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, status: cat.status === 'active' ? 'inactive' : 'active' }
        : cat
    ));
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: 'bg-blue-500'
    });
    setErrors({});
  };

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.status === 'active').length,
    inactive: categories.filter(c => c.status === 'inactive').length,
    totalArticles: categories.reduce((sum, c) => sum + c.articlesCount, 0)
  };

  return (
    <DashboardLayout
      currentPage="news"
      pageTitle="Kategori Artikel"
      breadcrumbs={['Berita & Artikel', 'Kategori']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Kategori Artikel</h1>
              <p className="text-purple-100">Kelola kategori untuk mengorganisir artikel dan berita</p>
            </div>
            <div className="hidden md:block">
              <Tag className="w-16 h-16 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-600">Total Kategori</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
                <p className="text-sm text-slate-600">Aktif</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.inactive}</p>
                <p className="text-sm text-slate-600">Tidak Aktif</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalArticles}</p>
                <p className="text-sm text-slate-600">Total Artikel</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Daftar Kategori</h2>
              <p className="text-sm text-slate-600 mt-1">Kelola semua kategori artikel</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 sm:mt-0 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kategori
            </button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-slate-200">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                <div key={category.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 ${category.color} rounded-full`}></div>
                      <div>
                        <h3 className="font-medium text-slate-900">{category.name}</h3>
                        <p className="text-sm text-slate-500">/{category.slug}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      category.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mb-3">{category.description}</p>

                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span>{category.articlesCount} artikel</span>
                    <span>{new Date(category.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 text-xs bg-blue-50 text-blue-700 py-2 px-3 rounded hover:bg-blue-100 transition-colors flex items-center justify-center"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleToggleStatus(category.id)}
                      className={`flex-1 text-xs py-2 px-3 rounded transition-colors flex items-center justify-center ${
                        category.status === 'active'
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      {category.status === 'active' ? 'Nonaktif' : 'Aktifkan'}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={category.articlesCount > 0}
                      className={`text-xs py-2 px-3 rounded transition-colors flex items-center justify-center ${
                        category.articlesCount > 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                      title={category.articlesCount > 0 ? 'Tidak dapat menghapus kategori yang memiliki artikel' : 'Hapus kategori'}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <div className="text-center py-8">
                <Tag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Tidak ada kategori yang ditemukan</p>
              </div>
            )}
          </div>
        </Card>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Kategori *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.name ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Masukkan nama kategori"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.slug ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="url-slug"
                  />
                  {errors.slug && (
                    <p className="text-red-600 text-sm mt-1">{errors.slug}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deskripsi *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.description ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Deskripsi kategori"
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Warna
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 ${color} rounded-full border-2 transition-all ${
                          formData.color === color 
                            ? 'border-slate-800 scale-110' 
                            : 'border-slate-300 hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-slate-200 text-slate-800 py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingCategory ? 'Update' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Temporary Page Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Halaman Sementara</p>
              <p className="text-sm text-yellow-700 mt-1">
                Ini adalah halaman sementara untuk submenu Kategori. Fitur lengkap sedang dalam pengembangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KategoriPage;