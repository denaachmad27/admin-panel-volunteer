import React, { useState, useEffect } from 'react';
import { X, Building, Mail, Phone, Save, AlertCircle, Tag, Shield } from 'lucide-react';
import { departmentAPI } from '../../services/api';

const DepartmentModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  department = null, 
  mode = 'add'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    categories: [],
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or department changes
  useEffect(() => {
    if (isOpen) {
      if ((mode === 'edit' || mode === 'view') && department) {
        setFormData({
          name: department.name || '',
          email: department.email || '',
          whatsapp: department.whatsapp || '',
          categories: department.categories || [],
          is_active: department.is_active !== undefined ? department.is_active : true
        });
      } else {
        setFormData({
          name: '',
          email: '',
          whatsapp: '',
          categories: [],
          is_active: true
        });
      }
      setErrors({});
    }
  }, [isOpen, department, mode]);

  const availableCategories = [
    'Teknis', 'Pelayanan', 'Bantuan', 'Saran', 
    'Kesehatan', 'Pendidikan', 'Sosial', 'Lingkungan', 'Lainnya'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama dinas wajib diisi';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nama dinas minimal 3 karakter';
    }
    
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (formData.whatsapp && !isValidPhone(formData.whatsapp)) {
      newErrors.whatsapp = 'Format nomor WhatsApp tidak valid (contoh: +62812345678)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If view mode, just close modal
    if (mode === 'view') {
      onClose();
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (mode === 'edit' && department) {
        await departmentAPI.update(department.id, formData);
      } else if (mode === 'create') {
        await departmentAPI.create(formData);
      }
      
      // Wait for parent to reload data
      await onSave();
      onClose();
    } catch (error) {
      console.error('Error saving department:', error);
      setErrors({
        submit: error.response?.data?.message || 'Gagal menyimpan dinas. Silakan coba lagi.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onKeyDown={handleKeyDown}
    >
      {/* Background overlay */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      />

      {/* Modal panel */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-t-lg px-6 py-5 border-b border-orange-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white bg-opacity-30 rounded-lg flex items-center justify-center mr-4">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {mode === 'create' ? 'Tambah Dinas Baru' : mode === 'edit' ? 'Edit Dinas' : 'Detail Dinas'}
                </h3>
                <p className="text-orange-100 text-sm mt-1">
                  {mode === 'create' ? 'Lengkapi informasi dinas yang akan ditambahkan' : mode === 'edit' ? 'Perbarui informasi dinas' : 'Lihat detail informasi dinas'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-100 p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200 group"
              title="Tutup"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nama Dinas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Dinas <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Building className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.name ? 'border-red-500' : ''} ${mode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                placeholder="Contoh: Dinas Sosial"
                disabled={mode === 'view'}
                required
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Dinas
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.email ? 'border-red-500' : ''} ${mode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                placeholder="email@dinas.gov.id"
                disabled={mode === 'view'}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor WhatsApp
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Phone className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.whatsapp ? 'border-red-500' : ''} ${mode === 'view' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                placeholder="+62 812 3456 7890"
                disabled={mode === 'view'}
              />
            </div>
            {errors.whatsapp && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.whatsapp}
              </p>
            )}
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Tag className="w-4 h-4 inline mr-1" />
              Kategori Pengaduan yang Ditangani
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableCategories.map(category => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-orange-600 bg-white border-gray-300 rounded"
                      disabled={mode === 'view'}
                    />
                    <span className="text-sm text-gray-700 font-medium">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Pilih kategori pengaduan yang akan ditangani oleh dinas ini
            </p>
          </div>

          {/* Status Aktif */}
          <div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-5 h-5 text-orange-600 bg-white border-gray-300 rounded"
                  disabled={mode === 'view'}
                />
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Dinas Aktif
                  </span>
                </div>
              </label>
              <p className="text-sm text-gray-500 mt-2 ml-8">
                Nonaktifkan jika dinas tidak menerima pengaduan sementara
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Gagal menyimpan</h4>
                  <p className="text-sm text-red-700 mt-1">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t">
            {mode === 'view' ? (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 text-sm font-medium rounded-lg transition-colors"
              >
                Tutup
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {mode === 'create' ? 'Menambahkan...' : 'Menyimpan...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {mode === 'create' ? 'Tambah Dinas' : 'Simpan Perubahan'}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;