import React, { useState, useEffect } from 'react';
import { 
  User, Edit3, Save, X, Camera, Mail, Phone, 
  Shield, Eye, EyeOff, Check, Settings, Key
} from 'lucide-react';

const AdminProfile = () => {
  // State untuk mode view/edit
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk data admin
  const [adminData, setAdminData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profile_photo: null
  });
  
  // State untuk password
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // State untuk UI
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  // Simulasi load admin data
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      // SIMULASI: Nanti akan diganti dengan API call ke /auth/me
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulasi data admin dari localStorage atau API
      const mockAdmin = {
        id: 1,
        name: 'Admin Volunteer',
        email: 'admin@volunteer.com',
        phone: '081234567890',
        role: 'admin',
        is_active: true,
        created_at: '2024-01-15T10:30:00Z',
        profile_photo: null
      };
      
      setAdminData(mockAdmin);
      setFormData({
        name: mockAdmin.name,
        email: mockAdmin.email,
        phone: mockAdmin.phone || '',
        profile_photo: null
      });
      
    } catch (error) {
      console.error('Error loading admin data:', error);
      setMessage('Gagal memuat data admin');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error saat user mengetik
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle perubahan password
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error saat user mengetik
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle upload foto
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi file
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profile_photo: 'File harus berupa gambar'
        }));
        return;
      }
      
      if (file.size > 2048000) { // 2MB
        setErrors(prev => ({
          ...prev,
          profile_photo: 'Ukuran file maksimal 2MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        profile_photo: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);

      // Clear error
      setErrors(prev => ({
        ...prev,
        profile_photo: ''
      }));
    }
  };

  // Validasi form basic info
  const validateBasicForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (formData.phone && !/^\d+$/.test(formData.phone.replace(/[\s\-+]/g, ''))) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validasi form password
  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.current_password) {
      newErrors.current_password = 'Password saat ini wajib diisi';
    }

    if (!passwordData.new_password) {
      newErrors.new_password = 'Password baru wajib diisi';
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = 'Password minimal 8 karakter';
    }

    if (!passwordData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Konfirmasi password wajib diisi';
    } else if (passwordData.new_password !== passwordData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save basic info
  const handleSaveBasic = async () => {
    if (!validateBasicForm()) {
      setMessage('Harap perbaiki kesalahan pada form');
      return;
    }

    setIsSaving(true);
    try {
      // SIMULASI: Nanti akan diganti dengan API call ke /auth/update-profile
      console.log('Saving admin basic data:', formData);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state
      setAdminData(prev => ({
        ...prev,
        ...formData
      }));
      setIsEditing(false);
      setMessage('Profile berhasil diperbarui!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      console.error('Error saving admin data:', error);
      setMessage('Gagal menyimpan profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle save password
  const handleSavePassword = async () => {
    if (!validatePasswordForm()) {
      setMessage('Harap perbaiki kesalahan pada form password');
      return;
    }

    setIsSaving(true);
    try {
      // SIMULASI: Nanti akan diganti dengan API call ke /auth/change-password
      console.log('Changing admin password');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset password form
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
      setIsChangingPassword(false);
      setMessage('Password berhasil diubah!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Gagal mengubah password');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      name: adminData.name,
      email: adminData.email,
      phone: adminData.phone || '',
      profile_photo: null
    });
    setPasswordData({
      current_password: '',
      new_password: '',
      new_password_confirmation: ''
    });
    setIsEditing(false);
    setIsChangingPassword(false);
    setErrors({});
    setMessage('');
    setPhotoPreview(null);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Profile</h1>
            <p className="text-gray-600">Kelola informasi akun administrator</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4 inline mr-1" />
              Admin
            </div>
          </div>
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('berhasil') 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          <div className="flex items-center">
            {message.includes('berhasil') && <Check className="w-5 h-5 mr-2" />}
            {message}
          </div>
        </div>
      )}

      {/* Basic Profile Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Informasi Dasar
          </h2>
          
          {!isEditing && !isChangingPassword ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </button>
          ) : isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={handleSaveBasic}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
              
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </button>
            </div>
          ) : null}
        </div>

        {/* Photo Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Camera className="w-4 h-4 mr-2" />
            Foto Profile
          </h3>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
                {photoPreview || adminData?.profile_photo ? (
                  <img
                    src={photoPreview || `http://localhost:8000/storage/${adminData.profile_photo}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>
            
            {isEditing && (
              <div>
                <label className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors text-sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
                {errors.profile_photo && (
                  <p className="text-sm text-red-600 mt-1">{errors.profile_photo}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG (Max: 2MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Basic Info Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap *
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Nama lengkap"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>
            ) : (
              <p className="text-gray-800 py-2 font-medium">{adminData?.name || '-'}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            {isEditing ? (
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="email@domain.com"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>
            ) : (
              <p className="text-gray-800 py-2 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                {adminData?.email || '-'}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon
            </label>
            {isEditing ? (
              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="081234567890"
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>
            ) : (
              <p className="text-gray-800 py-2 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                {adminData?.phone || '-'}
              </p>
            )}
          </div>

          {/* Account Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Akun
            </label>
            <div className="py-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                adminData?.is_active 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {adminData?.is_active ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Keamanan
          </h2>
          
          {!isChangingPassword && !isEditing ? (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Ubah Password
            </button>
          ) : isChangingPassword ? (
            <div className="flex space-x-2">
              <button
                onClick={handleSavePassword}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Mengubah...' : 'Simpan'}
              </button>
              
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </button>
            </div>
          ) : null}
        </div>

        {isChangingPassword ? (
          <div className="space-y-4">
            
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Saat Ini *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.current_password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan password saat ini"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.current_password && <p className="text-sm text-red-600 mt-1">{errors.current_password}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Baru *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.new_password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan password baru (min. 8 karakter)"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.new_password && <p className="text-sm text-red-600 mt-1">{errors.new_password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password Baru *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="new_password_confirmation"
                  value={passwordData.new_password_confirmation}
                  onChange={handlePasswordChange}
                  className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.new_password_confirmation ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Konfirmasi password baru"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.new_password_confirmation && <p className="text-sm text-red-600 mt-1">{errors.new_password_confirmation}</p>}
            </div>
          </div>
        ) : (
          <div className="text-gray-600">
            <p>Password terakhir diubah: <span className="font-medium">15 Januari 2024</span></p>
            <p className="text-sm mt-1">Untuk keamanan, ubah password secara berkala.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminProfile;