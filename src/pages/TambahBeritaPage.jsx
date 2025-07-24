import React, { useState, useEffect } from 'react';
import { FileText, Image, Save, Eye, Upload, Tag, Calendar, User, AlertCircle, Plus, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import { newsAPI } from '../services/api';

const TambahBeritaPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL for edit mode
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    judul: '',
    slug: '',
    konten: '',
    kategori: '',
    is_published: false,
    gambar_utama: null
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Kategori sesuai dengan backend Laravel
  const categories = [
    { id: 1, name: 'Pengumuman', value: 'Pengumuman' },
    { id: 2, name: 'Kegiatan', value: 'Kegiatan' },
    { id: 3, name: 'Bantuan', value: 'Bantuan' },
    { id: 4, name: 'Umum', value: 'Umum' }
  ];

  // Load existing news data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadNewsData();
    }
  }, [isEditMode, id]);

  // Load news data for editing
  const loadNewsData = async () => {
    try {
      setLoadingData(true);
      console.log('Loading news data for ID:', id);
      
      const response = await newsAPI.getByIdForEdit(id);
      
      if (response.data.status === 'success') {
        const newsData = response.data.data;
        console.log('Loaded news data:', newsData);
        
        setFormData({
          judul: newsData.judul || '',
          slug: newsData.slug || '',
          konten: newsData.konten || '',
          kategori: newsData.kategori || '',
          is_published: newsData.is_published || false,
          gambar_utama: newsData.gambar_utama ? `http://127.0.0.1:8000/storage/${newsData.gambar_utama}` : null
        });
      } else {
        alert('Gagal memuat data berita');
        navigate('/berita-artikel');
      }
    } catch (err) {
      console.error('Error loading news data:', err);
      alert('Gagal memuat data berita: ' + (err.message || 'Unknown error'));
      navigate('/berita-artikel');
    } finally {
      setLoadingData(false);
    }
  };

  // Debug authentication when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    console.log('Edit mode:', isEditMode, 'ID:', id);
    
    // Test API connection only if not in edit mode
    if (!isEditMode) {
      import('../services/api').then(({ default: api }) => {
        api.get('/debug/user')
          .then(response => {
            console.log('Auth test successful:', response.data);
          })
          .catch(error => {
            console.error('Auth test failed:', error.response?.status, error.response?.data);
          });
        
        api.get('/debug/admin')
          .then(response => {
            console.log('Admin test successful:', response.data);
          })
          .catch(error => {
            console.error('Admin test failed:', error.response?.status, error.response?.data);
          });
      });
    }
  }, [isEditMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    console.log('Input change:', { name, value, type, checked, newValue });
    
    // Handle form data update with slug generation in one go
    setFormData(prev => {
      console.log('Previous form data:', prev);
      
      const updatedData = {
        ...prev,
        [name]: newValue
      };

      // Auto-generate slug from title when judul changes (unless slug was manually edited)
      if (name === 'judul' && !isSlugManuallyEdited) {
        const slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        updatedData.slug = slug;
      }

      // Track if user manually edits slug
      if (name === 'slug') {
        setIsSlugManuallyEdited(true);
      }

      console.log('Updated form data:', updatedData);
      return updatedData;
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData(prev => ({
        ...prev,
        gambar_utama: URL.createObjectURL(file)
      }));
    }
  };

  const validateForm = () => {
    console.log('=== VALIDATION DEBUG ===');
    console.log('Current form data during validation:', formData);
    
    const newErrors = {};

    if (!formData.judul || !formData.judul.trim()) {
      newErrors.judul = 'Judul artikel wajib diisi';
      console.log('Judul validation failed:', formData.judul);
    }

    if (!formData.konten || !formData.konten.trim()) {
      newErrors.konten = 'Konten artikel wajib diisi';
      console.log('Konten validation failed:', formData.konten);
    }

    if (!formData.kategori || !formData.kategori.trim()) {
      newErrors.kategori = 'Kategori wajib dipilih';
      console.log('Kategori validation failed:', formData.kategori);
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (shouldPublish = false) => {
    console.log('=== SAVE DEBUG ===');
    console.log('Form data before validation:', formData);
    console.log('Should publish:', shouldPublish);
    console.log('Is edit mode:', isEditMode);
    console.log('ID:', id);
    
    if (!validateForm()) {
      console.log('Validation failed, form data:', formData);
      console.log('Validation errors:', errors);
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      console.log(`${isEditMode ? 'Updating' : 'Creating'} article:`, {
        judul: formData.judul,
        slug: formData.slug,
        konten: formData.konten,
        kategori: formData.kategori,
        is_published: shouldPublish,
        hasImage: !!imageFile,
        isEditMode,
        id
      });

      // Ensure we have valid data before creating FormData
      const judulValue = formData.judul?.trim() || '';
      const kontenValue = formData.konten?.trim() || '';
      const kategoriValue = formData.kategori?.trim() || '';
      const slugValue = formData.slug?.trim() || '';

      console.log('Pre-FormData values:', {
        judul: judulValue,
        konten: kontenValue.substring(0, 50) + '...',
        kategori: kategoriValue,
        slug: slugValue
      });

      // Double check data before sending
      if (!judulValue) {
        alert('Judul tidak boleh kosong!');
        setLoading(false);
        return;
      }
      if (!kontenValue) {
        alert('Konten tidak boleh kosong!');
        setLoading(false);
        return;
      }
      if (!kategoriValue) {
        alert('Kategori harus dipilih!');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('judul', judulValue);
      if (slugValue) {
        formDataToSend.append('slug', slugValue);
      }
      formDataToSend.append('konten', kontenValue);
      formDataToSend.append('kategori', kategoriValue);
      formDataToSend.append('is_published', shouldPublish ? '1' : '0');
      
      // Only append image if new file is selected
      if (imageFile) {
        formDataToSend.append('gambar_utama', imageFile);
      }

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, typeof value === 'string' ? value.substring(0, 50) + '...' : value);
      }

      let response;
      if (isEditMode) {
        response = await newsAPI.update(id, formDataToSend);
      } else {
        response = await newsAPI.create(formDataToSend);
      }
      
      console.log('API Response:', response.data);
      
      if (response.data.status === 'success') {
        const action = isEditMode ? 'diperbarui' : (shouldPublish ? 'dipublikasi' : 'disimpan sebagai draft');
        alert(`Artikel berhasil ${action}!`);
        navigate('/berita-artikel');
      } else {
        console.error('API returned error status:', response.data);
        alert(`Gagal ${isEditMode ? 'memperbarui' : 'menyimpan'} artikel: ` + (response.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'saving'} article:`, err);
      console.error('Error response:', err.response);
      
      if (err.response?.status === 401) {
        alert('Sesi login telah berakhir. Silakan login kembali.');
        navigate('/login');
      } else if (err.response?.status === 422) {
        // Validation errors
        const validationErrors = err.response.data.errors || {};
        setErrors(validationErrors);
        console.error('422 Validation errors:', validationErrors);
        console.error('Full error response:', err.response.data);
        
        // Show detailed validation errors
        const errorMessages = Object.entries(validationErrors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        
        alert(`Terdapat kesalahan validasi:\n\n${errorMessages}`);
      } else if (err.response?.status === 500) {
        alert('Terjadi kesalahan server. Periksa log server untuk detail.');
      } else {
        alert(err.response?.data?.message || err.message || `Gagal ${isEditMode ? 'memperbarui' : 'menyimpan'} artikel`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  if (previewMode) {
    return (
      <DashboardLayout
        currentPage="news"
        pageTitle="Preview Artikel"
        breadcrumbs={['Berita & Artikel', isEditMode ? 'Edit Berita' : 'Tambah Berita', 'Preview']}
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
              {formData.gambar_utama && (
                <div className="mb-8">
                  <img 
                    src={formData.gambar_utama} 
                    alt={formData.judul}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    {categories.find(cat => cat.value === formData.kategori)?.name || 'Uncategorized'}
                  </span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString('id-ID')}</span>
                  <span>•</span>
                  <span>Admin</span>
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-4">{formData.judul}</h1>
              </header>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                  {formData.konten}
                </div>
              </div>
            </article>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      currentPage="news"
      pageTitle={isEditMode ? "Edit Berita" : "Tambah Berita"}
      breadcrumbs={['Berita & Artikel', isEditMode ? 'Edit Berita' : 'Tambah Berita']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className={`bg-gradient-to-r ${isEditMode ? 'from-orange-500 to-red-600' : 'from-orange-500 to-red-600'} rounded-lg p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{isEditMode ? 'Edit Berita & Artikel' : 'Tambah Berita & Artikel'}</h1>
              <p className={`${isEditMode ? 'text-orange-100' : 'text-orange-100'}`}>
                {isEditMode ? 'Perbarui konten artikel atau berita' : 'Buat dan publikasikan artikel atau berita baru'}
              </p>
            </div>
            <div className="hidden md:block">
              <FileText className={`w-16 h-16 ${isEditMode ? 'text-orange-200' : 'text-orange-200'}`} />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loadingData && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Memuat data berita...</p>
            </div>
          </div>
        )}

        {!loadingData && (
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
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.judul ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Masukkan judul artikel yang menarik..."
                  />
                  {errors.judul && (
                    <p className="text-red-600 text-sm mt-1">{errors.judul}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      URL Slug
                    </label>
                    {isSlugManuallyEdited && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsSlugManuallyEdited(false);
                          const slug = formData.judul
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, '')
                            .replace(/\s+/g, '-')
                            .replace(/-+/g, '-')
                            .trim();
                          setFormData(prev => ({ ...prev, slug }));
                        }}
                        className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded hover:bg-orange-200 transition-colors"
                      >
                        Auto-generate
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="url-friendly-slug"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-slate-500 text-sm">
                      URL: /news/{formData.slug || 'url-artikel'}
                    </p>
                    {!isSlugManuallyEdited && (
                      <p className="text-orange-600 text-xs">
                        Auto-generated
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </Card>

            {/* Content */}
            <Card title="Konten Artikel" subtitle="Tulis konten lengkap artikel">
              <div>
                <textarea
                  name="konten"
                  value={formData.konten}
                  onChange={handleInputChange}
                  rows={15}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.konten ? 'border-red-300' : 'border-slate-300'
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
                {errors.konten && (
                  <p className="text-red-600 text-sm mt-1">{errors.konten}</p>
                )}
                <p className="text-slate-500 text-sm mt-2">
                  {formData.konten.length} karakter
                </p>
              </div>
            </Card>

            {/* Featured Image */}
            <Card title="Gambar Utama" subtitle="Upload gambar untuk artikel">
              <div className="space-y-4">
                {formData.gambar_utama ? (
                  <div className="relative">
                    <img 
                      src={formData.gambar_utama} 
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, gambar_utama: null }));
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <Image className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">Pilih gambar untuk artikel</p>
                    <label className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-flex items-center transition-colors">
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
            <Card title="Publikasi" subtitle="Atur status publikasi">
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleInputChange}
                      className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Publikasikan langsung
                    </span>
                  </label>
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.is_published 
                      ? 'Artikel akan langsung dipublikasikan'
                      : 'Artikel disimpan sebagai draft'
                    }
                  </p>
                </div>
              </div>
            </Card>

            {/* Category */}
            <Card title="Kategori" subtitle="Pilih kategori artikel">
              <div>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.kategori ? 'border-red-300' : 'border-slate-300'
                  }`}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.kategori && (
                  <p className="text-red-600 text-sm mt-1">{errors.kategori}</p>
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
                onClick={() => {
                  console.log('Save as draft clicked');
                  handleSave(false);
                }}
                disabled={loading}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Menyimpan...' : 'Simpan Draft'}
              </button>
              
              <button
                onClick={() => {
                  console.log('Publish clicked');
                  handleSave(true);
                }}
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                {loading ? 'Menyimpan...' : 'Publikasikan'}
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Status Notice */}
        <div className={`${isEditMode ? 'bg-orange-50 border-orange-200' : 'bg-orange-50 border-orange-200'} border rounded-lg p-4`}>
          <div className="flex items-center">
            <FileText className={`w-5 h-5 ${isEditMode ? 'text-orange-600' : 'text-orange-600'} mr-3`} />
            <div>
              <p className={`text-sm font-medium ${isEditMode ? 'text-orange-800' : 'text-orange-800'}`}>
                {isEditMode ? 'Form Edit Berita Terintegrasi' : 'Form Tambah Berita Terintegrasi'}
              </p>
              <p className={`text-sm ${isEditMode ? 'text-orange-700' : 'text-orange-700'} mt-1`}>
                {isEditMode 
                  ? 'Form ini sudah terintegrasi dengan API Laravel backend untuk mengedit berita dan artikel.'
                  : 'Form ini sudah terintegrasi dengan API Laravel backend untuk menambah berita dan artikel baru.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TambahBeritaPage;