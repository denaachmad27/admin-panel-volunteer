import React, { useState } from 'react';
import { User, Camera, Save, Lock } from 'lucide-react';

// Import Protected Layout dan Templates - GUNAKAN INI UNTUK KONSISTENSI
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  InputField, 
  TextareaField, 
  FileUploadField, 
  Button, 
  Alert, 
  Card,
  Tabs
} from '../components/ui/UIComponents';

const AdminProfilePage = () => {
  // State untuk form data
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '081234567890',
    address: 'Jl. Admin No. 123, Jakarta',
    bio: 'Administrator sistem bantuan sosial'
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Handle form changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.current_password) {
      newErrors.current_password = 'Password lama wajib diisi';
    }
    
    if (!passwordData.new_password) {
      newErrors.new_password = 'Password baru wajib diisi';
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = 'Password minimal 8 karakter';
    }
    
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Konfirmasi password tidak sama';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...formData
      }));
      
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    setLoading(true);
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
      
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  // Menu tambahan untuk Profile Admin
  const additionalMenuItems = [
    {
      title: 'Profil Admin',
      icon: User,
      path: '/admin/profile',
      id: 'profile'
    }
  ];

  // Tabs untuk profile page
  const tabs = [
    { id: 'profile', label: 'Informasi Profil' },
    { id: 'password', label: 'Ubah Password' },
    { id: 'settings', label: 'Pengaturan' }
  ];

  return (
    <DashboardLayout
      currentPage="profile"
      pageTitle="Profil Admin"
      breadcrumbs={['Admin', 'Profil']}
      additionalMenuItems={additionalMenuItems}
    >
      {/* Alert Success */}
      {showAlert && (
        <Alert
          type="success"
          title="Berhasil!"
          message={`${activeTab === 'profile' ? 'Profil' : 'Password'} berhasil diperbarui`}
          onClose={() => setShowAlert(false)}
          className="mb-6"
        />
      )}

      {/* Page Content - SIMPLE LAYOUT tanpa StandardPageTemplate */}
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Profil Administrator</h1>
              <p className="text-slate-600 mt-1">Kelola informasi akun dan pengaturan admin</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="primary"
                icon={Save}
                onClick={activeTab === 'profile' ? handleSubmitProfile : handleSubmitPassword}
                loading={loading}
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmitProfile}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Photo */}
              <div className="lg:col-span-1">
                <Card title="Foto Profil">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-16 h-16 text-white" />
                    </div>
                    
                    <FileUploadField
                      accept="image/*"
                      onChange={(file) => console.log('Photo uploaded:', file)}
                    />
                    
                    <p className="text-xs text-slate-500 mt-2">
                      Recommended: 400x400px, max 2MB
                    </p>
                  </div>
                </Card>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <Card title="Informasi Personal">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Nama Lengkap"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={errors.name}
                      required
                      placeholder="Masukkan nama lengkap"
                    />
                    
                    <InputField
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={errors.email}
                      required
                      placeholder="admin@example.com"
                    />
                    
                    <InputField
                      label="Nomor Telepon"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={errors.phone}
                      required
                      placeholder="081234567890"
                    />
                    
                    <InputField
                      label="Alamat"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      error={errors.address}
                      placeholder="Alamat lengkap"
                    />
                  </div>
                  
                  <div className="mt-6">
                    <TextareaField
                      label="Bio/Deskripsi"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      error={errors.bio}
                      rows={3}
                      placeholder="Ceritakan sedikit tentang Anda..."
                    />
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      disabled={loading}
                    >
                      {loading ? 'Menyimpan...' : 'Simpan Profil'}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handleSubmitPassword}>
            <Card 
              title="Ubah Password" 
              subtitle="Pastikan password baru aman dan mudah diingat"
            >
              <div className="max-w-md space-y-6">
                <InputField
                  label="Password Lama"
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                  error={errors.current_password}
                  required
                  placeholder="Masukkan password lama"
                />
                
                <InputField
                  label="Password Baru"
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                  error={errors.new_password}
                  required
                  placeholder="Minimal 8 karakter"
                />
                
                <InputField
                  label="Konfirmasi Password Baru"
                  type="password"
                  value={passwordData.new_password_confirmation}
                  onChange={(e) => handlePasswordChange('new_password_confirmation', e.target.value)}
                  error={errors.new_password_confirmation}
                  required
                  placeholder="Ulangi password baru"
                />
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Tips Password Aman:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Minimal 8 karakter</li>
                    <li>• Kombinasi huruf besar, kecil, angka</li>
                    <li>• Hindari informasi personal</li>
                    <li>• Gunakan password yang unik</li>
                  </ul>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? 'Mengubah Password...' : 'Ubah Password'}
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <Card title="Pengaturan Akun">
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">🚧 Coming Soon</h4>
                <p className="text-sm text-yellow-700">
                  Fitur pengaturan akan segera tersedia. Anda akan dapat mengatur:
                </p>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• Notifikasi email</li>
                  <li>• Tema interface</li>
                  <li>• Bahasa sistem</li>
                  <li>• Keamanan akun</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AdminProfilePage;