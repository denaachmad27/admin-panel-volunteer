import React, { useState } from 'react';
import { Settings, Save, Upload, Bell, Shield, Database, Globe, Mail, Phone, MapPin, Building, User, Key, Eye, EyeOff, RefreshCw, Download, AlertCircle, CheckCircle } from 'lucide-react';
import ProtectedDashboardLayout from '../components/layout/ProtectedDashboardLayout';
import { Card } from '../components/ui/UIComponents';

const PengaturanPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Admin Panel Bantuan Sosial',
    siteDescription: 'Sistem administrasi bantuan sosial untuk pengelolaan program bantuan masyarakat',
    siteUrl: 'https://bantuan-sosial.gov.id',
    adminEmail: 'admin@bantuan-sosial.gov.id',
    contactPhone: '+62 21 1234 5678',
    address: 'Jl. Raya Bantuan Sosial No. 123, Jakarta Pusat',
    organization: 'Dinas Sosial DKI Jakarta',
    logo: null,
    timezone: 'Asia/Jakarta',
    language: 'id'
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newApplications: true,
    applicationApproved: true,
    applicationRejected: true,
    systemUpdates: false,
    weeklyReport: true,
    monthlyReport: true
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    allowMultipleSessions: false,
    loginAttempts: 5,
    lockoutDuration: 15
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 365,
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    compressionEnabled: true
  });

  // Account Settings State
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: 'admin@bantuan-sosial.gov.id',
    fullName: 'Administrator Sistem',
    phone: '+62 812 3456 7890'
  });

  const handleGeneralChange = (field, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSystemChange = (field, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccountChange = (field, value) => {
    setAccountSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGeneralSettings(prev => ({
        ...prev,
        logo: URL.createObjectURL(file)
      }));
    }
  };

  const handleSave = (section) => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const handleBackup = () => {
    alert('Backup sistem dimulai...');
  };

  const handleResetCache = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus cache sistem?')) {
      alert('Cache sistem berhasil dihapus');
    }
  };

  const tabs = [
    { id: 'general', label: 'Umum', icon: Settings },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'system', label: 'Sistem', icon: Database },
    { id: 'account', label: 'Akun', icon: User }
  ];

  return (
    <ProtectedDashboardLayout
      currentPage="settings"
      pageTitle="Pengaturan"
      breadcrumbs={['Pengaturan']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-slate-600 to-gray-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Pengaturan Sistem</h1>
              <p className="text-slate-200">Kelola konfigurasi dan preferensi sistem</p>
            </div>
            <div className="hidden md:block">
              <Settings className="w-16 h-16 text-slate-300" />
            </div>
          </div>
        </div>

        {/* Save Status */}
        {saveStatus && (
          <div className={`p-4 rounded-lg border ${
            saveStatus === 'saving' ? 'bg-blue-50 border-blue-200' :
            saveStatus === 'success' ? 'bg-green-50 border-green-200' :
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center">
              {saveStatus === 'saving' && <RefreshCw className="w-5 h-5 text-blue-600 mr-3 animate-spin" />}
              {saveStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mr-3" />}
              <span className={`font-medium ${
                saveStatus === 'saving' ? 'text-blue-800' :
                saveStatus === 'success' ? 'text-green-800' :
                'text-red-800'
              }`}>
                {saveStatus === 'saving' ? 'Menyimpan pengaturan...' :
                 saveStatus === 'success' ? 'Pengaturan berhasil disimpan!' :
                 'Gagal menyimpan pengaturan'}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <Card className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-slate-100 text-slate-900 border-r-2 border-slate-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-slate-600' : 'text-slate-400'}`} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* General Settings */}
            {activeTab === 'general' && (
              <Card title="Pengaturan Umum" subtitle="Konfigurasi dasar sistem">
                <div className="space-y-6">
                  {/* Site Information */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Informasi Situs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nama Situs
                        </label>
                        <input
                          type="text"
                          value={generalSettings.siteName}
                          onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          URL Situs
                        </label>
                        <input
                          type="url"
                          value={generalSettings.siteUrl}
                          onChange={(e) => handleGeneralChange('siteUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Deskripsi Situs
                      </label>
                      <textarea
                        rows={3}
                        value={generalSettings.siteDescription}
                        onChange={(e) => handleGeneralChange('siteDescription', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Informasi Kontak</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Admin
                        </label>
                        <input
                          type="email"
                          value={generalSettings.adminEmail}
                          onChange={(e) => handleGeneralChange('adminEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Telepon
                        </label>
                        <input
                          type="tel"
                          value={generalSettings.contactPhone}
                          onChange={(e) => handleGeneralChange('contactPhone', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Organisasi
                        </label>
                        <input
                          type="text"
                          value={generalSettings.organization}
                          onChange={(e) => handleGeneralChange('organization', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Zona Waktu
                        </label>
                        <select
                          value={generalSettings.timezone}
                          onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        >
                          <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                          <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                          <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Alamat
                      </label>
                      <textarea
                        rows={2}
                        value={generalSettings.address}
                        onChange={(e) => handleGeneralChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                      />
                    </div>
                  </div>

                  {/* Logo */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Logo Sistem</h3>
                    <div className="flex items-center space-x-4">
                      {generalSettings.logo ? (
                        <img src={generalSettings.logo} alt="Logo" className="w-16 h-16 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                          <Building className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <label className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-flex items-center transition-colors">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-sm text-slate-500 mt-1">Format: PNG, JPG. Maksimal 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleSave('general')}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Pengaturan
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <Card title="Pengaturan Notifikasi" subtitle="Atur preferensi notifikasi sistem">
                <div className="space-y-6">
                  {/* Notification Channels */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Saluran Notifikasi</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={() => handleNotificationChange('emailNotifications')}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Email Notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.pushNotifications}
                          onChange={() => handleNotificationChange('pushNotifications')}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Push Notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.smsNotifications}
                          onChange={() => handleNotificationChange('smsNotifications')}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">SMS Notifications</span>
                      </label>
                    </div>
                  </div>

                  {/* Event Notifications */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Notifikasi Kejadian</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.newApplications}
                          onChange={() => handleNotificationChange('newApplications')}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Pendaftaran Baru</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.applicationApproved}
                          onChange={() => handleNotificationChange('applicationApproved')}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Aplikasi Disetujui</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.applicationRejected}
                          onChange={() => handleNotificationChange('applicationRejected')}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Aplikasi Ditolak</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.systemUpdates}
                          onChange={() => handleNotificationChange('systemUpdates')}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Update Sistem</span>
                      </label>
                    </div>
                  </div>

                  {/* Report Notifications */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Laporan Berkala</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weeklyReport}
                          onChange={() => handleNotificationChange('weeklyReport')}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Laporan Mingguan</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.monthlyReport}
                          onChange={() => handleNotificationChange('monthlyReport')}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Laporan Bulanan</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleSave('notifications')}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Pengaturan
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <Card title="Pengaturan Keamanan" subtitle="Konfigurasi keamanan dan otentikasi">
                <div className="space-y-6">
                  {/* Authentication */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Otentikasi</h3>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Two-Factor Authentication (2FA)</span>
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Session Timeout (menit)
                          </label>
                          <input
                            type="number"
                            value={securitySettings.sessionTimeout}
                            onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password Expiry (hari)
                          </label>
                          <input
                            type="number"
                            value={securitySettings.passwordExpiry}
                            onChange={(e) => handleSecurityChange('passwordExpiry', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Login Security */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Keamanan Login</h3>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={securitySettings.allowMultipleSessions}
                          onChange={(e) => handleSecurityChange('allowMultipleSessions', e.target.checked)}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Izinkan Multiple Sessions</span>
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Max Login Attempts
                          </label>
                          <input
                            type="number"
                            value={securitySettings.loginAttempts}
                            onChange={(e) => handleSecurityChange('loginAttempts', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Lockout Duration (menit)
                          </label>
                          <input
                            type="number"
                            value={securitySettings.lockoutDuration}
                            onChange={(e) => handleSecurityChange('lockoutDuration', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleSave('security')}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Pengaturan
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <Card title="Pengaturan Sistem" subtitle="Konfigurasi teknis dan maintenance">
                <div className="space-y-6">
                  {/* Backup Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Backup & Restore</h3>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={systemSettings.autoBackup}
                          onChange={(e) => handleSystemChange('autoBackup', e.target.checked)}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Auto Backup</span>
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Frekuensi Backup
                          </label>
                          <select
                            value={systemSettings.backupFrequency}
                            onChange={(e) => handleSystemChange('backupFrequency', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          >
                            <option value="hourly">Setiap Jam</option>
                            <option value="daily">Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Retensi Data (hari)
                          </label>
                          <input
                            type="number"
                            value={systemSettings.dataRetention}
                            onChange={(e) => handleSystemChange('dataRetention', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={handleBackup}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Backup Sekarang
                        </button>
                        <button
                          onClick={handleResetCache}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reset Cache
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Performance Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Performance</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={systemSettings.cacheEnabled}
                          onChange={(e) => handleSystemChange('cacheEnabled', e.target.checked)}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Enable Cache</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={systemSettings.compressionEnabled}
                          onChange={(e) => handleSystemChange('compressionEnabled', e.target.checked)}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Enable Compression</span>
                      </label>
                    </div>
                  </div>

                  {/* Maintenance */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Maintenance</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={systemSettings.maintenanceMode}
                          onChange={(e) => handleSystemChange('maintenanceMode', e.target.checked)}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Maintenance Mode</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={systemSettings.debugMode}
                          onChange={(e) => handleSystemChange('debugMode', e.target.checked)}
                          className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700">Debug Mode</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleSave('system')}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Pengaturan
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <Card title="Pengaturan Akun" subtitle="Kelola informasi akun dan password">
                <div className="space-y-6">
                  {/* Profile Information */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Informasi Profil</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={accountSettings.fullName}
                          onChange={(e) => handleAccountChange('fullName', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={accountSettings.email}
                          onChange={(e) => handleAccountChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        value={accountSettings.phone}
                        onChange={(e) => handleAccountChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                      />
                    </div>
                  </div>

                  {/* Change Password */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Ubah Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Password Lama
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={accountSettings.currentPassword}
                            onChange={(e) => handleAccountChange('currentPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-slate-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password Baru
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={accountSettings.newPassword}
                            onChange={(e) => handleAccountChange('newPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Konfirmasi Password
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={accountSettings.confirmPassword}
                            onChange={(e) => handleAccountChange('confirmPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleSave('account')}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Pengaturan
                    </button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Temporary Page Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Halaman Sementara</p>
              <p className="text-sm text-yellow-700 mt-1">
                Ini adalah halaman sementara untuk menu Pengaturan. Fitur lengkap sedang dalam pengembangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
};

export default PengaturanPage;