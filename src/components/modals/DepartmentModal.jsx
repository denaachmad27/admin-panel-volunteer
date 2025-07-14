import React, { useState, useEffect } from 'react';
import { X, Building, Mail, Phone, Save, AlertCircle, Tag, Shield } from 'lucide-react';

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
      if (mode === 'edit' && department) {
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
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
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
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="btn-primary rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <Building className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {mode === 'add' ? 'Tambah Dinas Baru' : 'Edit Dinas'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-1 rounded-lg hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nama Dinas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Dinas <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Building className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Contoh: Dinas Sosial"
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
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="email@dinas.gov.id"
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
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Phone className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className={`input-field pl-10 ${errors.whatsapp ? 'border-red-500' : ''}`}
                placeholder="+62 812 3456 7890"
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
              <div className="grid grid-cols-2 gap-3">
                {availableCategories.map(category => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded"
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
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded"
                />
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
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
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === 'add' ? 'Tambah Dinas' : 'Simpan Perubahan'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;