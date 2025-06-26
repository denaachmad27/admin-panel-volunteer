import React, { useState } from 'react';
import { FileText, Image, Save, Eye, Upload, Tag, Calendar, User, AlertCircle, Plus, X } from 'lucide-react';
import ProtectedDashboardLayout from '../components/layout/ProtectedDashboardLayout';
import { Card } from '../components/ui/UIComponents';

const TambahBeritaPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    status: 'draft',
    publishDate: new Date().toISOString().split('T')[0],
    featuredImage: null,
    author: 'Admin User'
  });

  const [newTag, setNewTag] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState({});

  // Mock data untuk kategori
  const categories = [
    { id: 1, name: 'Program Bantuan', slug: 'program-bantuan' },
    { id: 2, name: 'Kesehatan', slug: 'kesehatan' },
    { id: 3, name: 'Pendidikan', slug: 'pendidikan' },
    { id: 4, name: 'Pemberdayaan', slug: 'pemberdayaan' },
    { id: 5, name: 'Laporan', slug: 'laporan' },
    { id: 6, name: 'Pengumuman', slug: 'pengumuman' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
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

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In real app, you would upload to server
      setFormData(prev => ({
        ...prev,
        featuredImage: URL.createObjectURL(file)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul artikel wajib diisi';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Ringkasan artikel wajib diisi';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Konten artikel wajib diisi';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (status) => {
    if (!validateForm()) {
      return;
    }

    const articleData = {
      ...formData,
      status,
      updatedAt: new Date().toISOString()
    };

    console.log('Saving article:', articleData);
    
    // Simulate save success
    alert(`Artikel berhasil ${status === 'published' ? 'dipublikasi' : 'disimpan sebagai draft'}!`);
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  if (previewMode) {
    return (
      <ProtectedDashboardLayout
        currentPage="news"
        pageTitle="Preview Artikel"
        breadcrumbs={['Berita & Artikel', 'Tambah Berita', 'Preview']}
      >
        <div className="space-y-6">
          {/* Preview Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Preview Artikel</h1>
            <button 
              onClick={handlePreview}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Tutup Preview
            </button>
          </div>

          {/* Preview Content */}
          <Card className="max-w-4xl mx-auto">
            <article className="p-8">
              {/* Featured Image */}
              {formData.featuredImage && (
                <div className="mb-8">
                  <img 
                    src={formData.featuredImage} 
                    alt={formData.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {categories.find(cat => cat.slug === formData.category)?.name || 'Uncategorized'}
                  </span>
                  <span>•</span>
                  <span>{new Date(formData.publishDate).toLocaleDateString('id-ID')}</span>
                  <span>•</span>
                  <span>Oleh {formData.author}</span>
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-4">{formData.title}</h1>
                
                <p className="text-lg text-slate-600 leading-relaxed">{formData.excerpt}</p>

                {/* Tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                  {formData.content}
                </div>
              </div>
            </article>
          </Card>
        </div>
      </ProtectedDashboardLayout>
    );
  }

  return (
    <ProtectedDashboardLayout
      currentPage="news"
      pageTitle="Tambah Berita"
      breadcrumbs={['Berita & Artikel', 'Tambah Berita']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Tambah Berita & Artikel</h1>
              <p className="text-green-100">Buat dan publikasikan artikel atau berita baru</p>
            </div>
            <div className="hidden md:block">
              <FileText className="w-16 h-16 text-green-200" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card title="Informasi Dasar" subtitle="Isi detail artikel yang akan dipublikasi">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Judul Artikel *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.title ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Masukkan judul artikel yang menarik..."
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="url-friendly-slug"
                  />
                  <p className="text-slate-500 text-sm mt-1">
                    URL: /news/{formData.slug || 'url-artikel'}
                  </p>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ringkasan Artikel *
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.excerpt ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Tulis ringkasan singkat artikel ini..."
                  />
                  {errors.excerpt && (
                    <p className="text-red-600 text-sm mt-1">{errors.excerpt}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Content */}
            <Card title="Konten Artikel" subtitle="Tulis konten lengkap artikel">
              <div>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={15}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.content ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Tulis konten artikel lengkap di sini...

Anda dapat menggunakan:
- Paragraf dengan enter ganda
- Format sederhana untuk struktur artikel
- Daftar dengan tanda -

Contoh:
Ini adalah paragraf pertama.

Ini adalah paragraf kedua dengan penjelasan lebih detail.

Manfaat program ini antara lain:
- Meningkatkan kesejahteraan masyarakat
- Memberikan akses pendidikan yang lebih baik
- Menciptakan lapangan kerja baru"
                />
                {errors.content && (
                  <p className="text-red-600 text-sm mt-1">{errors.content}</p>
                )}
                <p className="text-slate-500 text-sm mt-2">
                  {formData.content.length} karakter
                </p>
              </div>
            </Card>

            {/* Featured Image */}
            <Card title="Gambar Utama" subtitle="Upload gambar untuk artikel">
              <div className="space-y-4">
                {formData.featuredImage ? (
                  <div className="relative">
                    <img 
                      src={formData.featuredImage} 
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, featuredImage: null }))}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <Image className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">Pilih gambar untuk artikel</p>
                    <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-flex items-center transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Gambar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Options */}
            <Card title="Publikasi" subtitle="Atur status dan tanggal publikasi">
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                {/* Publish Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tanggal Publikasi
                  </label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Penulis
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </Card>

            {/* Category */}
            <Card title="Kategori" subtitle="Pilih kategori artikel">
              <div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.category ? 'border-red-300' : 'border-slate-300'
                  }`}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </Card>

            {/* Tags */}
            <Card title="Tags" subtitle="Tambahkan tag untuk artikel">
              <div className="space-y-3">
                {/* Add Tag */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Tambah tag..."
                  />
                  <button
                    onClick={handleAddTag}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Tags List */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center">
                        #{tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePreview}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Artikel
              </button>
              
              <button
                onClick={() => handleSave('draft')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Draft
              </button>
              
              <button
                onClick={() => handleSave('published')}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Publikasikan
              </button>
            </div>
          </div>
        </div>

        {/* Temporary Page Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Halaman Sementara</p>
              <p className="text-sm text-yellow-700 mt-1">
                Ini adalah halaman sementara untuk submenu Tambah Berita. Fitur lengkap sedang dalam pengembangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
};

export default TambahBeritaPage;