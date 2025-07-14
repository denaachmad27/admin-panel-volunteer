import React, { useState, useEffect } from 'react';
import { Settings, Save, Upload, Bell, Shield, Database, Globe, Mail, Phone, MapPin, Building, User, Key, Eye, EyeOff, RefreshCw, Download, AlertCircle, CheckCircle, MessageSquare, Send, Edit, Trash2, ExternalLink, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProtectedDashboardLayout from '../components/layout/ProtectedDashboardLayout';
import { Card } from '../components/ui/UIComponents';
import complaintForwardingService from '../services/complaintForwardingService';
import DepartmentModal from '../components/modals/DepartmentModal';

const PengaturanPage = () => {
  const navigate = useNavigate();
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

  // Complaint Forwarding Settings State
  const [complaintForwardingSettings, setComplaintForwardingSettings] = useState({
    emailForwarding: true,
    whatsappForwarding: false,
    forwardingMode: 'auto',
    adminEmail: 'admin@bantuan-sosial.gov.id',
    adminWhatsapp: '+62 812 9999 9999',
    departments: []
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Department modal state
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [departmentModalMode, setDepartmentModalMode] = useState('add');
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setSettingsLoading(true);
      const settings = await complaintForwardingService.getSettings();
      setComplaintForwardingSettings(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

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

  const handleComplaintForwardingChange = async (field, value) => {
    try {
      await complaintForwardingService.updateSetting(field, value);
      await loadSettings(); // Reload settings after update
    } catch (error) {
      console.error('Error updating setting:', error);
      alert('Gagal mengupdate pengaturan. Silakan coba lagi.');
    }
  };

  // Department modal handlers
  const handleAddDepartment = () => {
    setDepartmentModalMode('add');
    setSelectedDepartment(null);
    setShowDepartmentModal(true);
  };

  const handleEditDepartment = (department) => {
    setDepartmentModalMode('edit');
    setSelectedDepartment(department);
    setShowDepartmentModal(true);
  };

  const handleDepartmentSave = async (formData) => {
    try {
      if (departmentModalMode === 'add') {
        await complaintForwardingService.addDepartment(formData);
      } else {
        await complaintForwardingService.updateDepartment(selectedDepartment.id, formData);
      }
      await loadSettings(); // Reload settings after save
    } catch (error) {
      console.error('Error saving department:', error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  const removeDepartment = async (departmentId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus dinas ini?')) {
      try {
        await complaintForwardingService.removeDepartment(departmentId);
        await loadSettings(); // Reload settings after removal
      } catch (error) {
        console.error('Error removing department:', error);
        alert('Gagal menghapus dinas. Silakan coba lagi.');
      }
    }
  };

  const testAdminNotification = async (type) => {
    try {
      const recipient = type === 'email' 
        ? complaintForwardingSettings.adminEmail 
        : complaintForwardingSettings.adminWhatsapp;
      
      if (!recipient) {
        alert(`${type === 'email' ? 'Email' : 'WhatsApp'} admin belum diset!`);
        return;
      }

      const result = await complaintForwardingService.testForwarding(type, recipient);
      
      if (result.success) {
        alert(`✅ Test ${type === 'email' ? 'email' : 'WhatsApp'} berhasil!\n\n${result.message}`);
      } else {
        alert(`❌ Test ${type === 'email' ? 'email' : 'WhatsApp'} gagal!\n\n${result.message}`);
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
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
    { id: 'complaint-forwarding', label: 'Forward Pengaduan', icon: MessageSquare },
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

            {/* Complaint Forwarding Settings */}
            {activeTab === 'complaint-forwarding' && (
              <Card title="Pengaturan Forward Pengaduan" subtitle="Konfigurasi penerusan pengaduan ke dinas terkait">
                <div className="space-y-6">
                  {/* Forward Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Pengaturan Forward</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={complaintForwardingSettings.emailForwarding}
                            onChange={(e) => handleComplaintForwardingChange('emailForwarding', e.target.checked)}
                            className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                          />
                          <span className="ml-3 text-sm font-medium text-slate-700">Forward via Email</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={complaintForwardingSettings.whatsappForwarding}
                            onChange={(e) => handleComplaintForwardingChange('whatsappForwarding', e.target.checked)}
                            className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                          />
                          <span className="ml-3 text-sm font-medium text-slate-700">Forward via WhatsApp</span>
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Mode Forward
                        </label>
                        <select
                          value={complaintForwardingSettings.forwardingMode}
                          onChange={(e) => handleComplaintForwardingChange('forwardingMode', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        >
                          <option value="auto">Otomatis</option>
                          <option value="manual">Manual</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Admin Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Pengaturan Admin</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Admin
                        </label>
                        <input
                          type="email"
                          value={complaintForwardingSettings.adminEmail}
                          onChange={(e) => handleComplaintForwardingChange('adminEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          placeholder="admin@bantuan-sosial.gov.id"
                        />
                        <p className="text-sm text-slate-500 mt-1">
                          Email yang akan menerima notifikasi pengaduan darurat
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          WhatsApp Admin
                        </label>
                        <input
                          type="tel"
                          value={complaintForwardingSettings.adminWhatsapp}
                          onChange={(e) => handleComplaintForwardingChange('adminWhatsapp', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          placeholder="+62 812 9999 9999"
                        />
                        <p className="text-sm text-slate-500 mt-1">
                          Nomor WhatsApp admin untuk pesan real-time
                        </p>
                      </div>
                    </div>
                    
                    {/* Test Admin Settings */}
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 mt-4">
                      <h4 className="font-medium text-orange-900 mb-2">Test Notifikasi Admin</h4>
                      <p className="text-sm text-orange-700 mb-3">
                        Uji coba pengiriman notifikasi ke admin untuk pengaduan darurat
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => testAdminNotification('email')}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Test Email Admin
                        </button>
                        <button
                          onClick={() => testAdminNotification('whatsapp')}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Test WhatsApp Admin
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Integration Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Integrasi WhatsApp</h3>
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-green-100 mr-4">
                            <Smartphone className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-900">WhatsApp Settings</h4>
                            <p className="text-sm text-green-700">
                              Konfigurasi koneksi WhatsApp untuk forward pengaduan
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate('/settings/whatsapp')}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Konfigurasi WhatsApp
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                          <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-slate-900">Connection Status</p>
                          <p className="text-xs text-slate-600">Check WhatsApp connection</p>
                        </div>
                        
                        <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                          <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-slate-900">Department Mapping</p>
                          <p className="text-xs text-slate-600">Configure department contacts</p>
                        </div>
                        
                        <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                          <Mail className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-slate-900">Message Templates</p>
                          <p className="text-xs text-slate-600">Customize message formats</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-green-100 rounded-lg">
                        <p className="text-xs text-green-700">
                          💡 <strong>Tips:</strong> Pastikan WhatsApp sudah terhubung sebelum mengaktifkan forward via WhatsApp. 
                          Buka halaman konfigurasi untuk scan QR code dan mengatur mapping departemen.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Department Settings */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-slate-900">Pengaturan Dinas</h3>
                      <button
                        onClick={handleAddDepartment}
                        disabled={settingsLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm disabled:opacity-50"
                      >
                        <Building className="w-4 h-4 mr-2" />
                        {settingsLoading ? 'Loading...' : 'Tambah Dinas'}
                      </button>
                    </div>
                    
                    {settingsLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-slate-600">Memuat pengaturan dinas...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {complaintForwardingSettings.departments.map((department) => (
                          <div key={department.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-900 mb-1">
                                  {department.name || 'Dinas Baru'}
                                </h4>
                                <div className="text-sm text-slate-600">
                                  {department.email && (
                                    <div className="flex items-center mb-1">
                                      <Mail className="w-4 h-4 mr-1 text-slate-400" />
                                      {department.email}
                                    </div>
                                  )}
                                  {department.whatsapp && (
                                    <div className="flex items-center mb-1">
                                      <Phone className="w-4 h-4 mr-1 text-slate-400" />
                                      {department.whatsapp}
                                    </div>
                                  )}
                                  {department.categories && department.categories.length > 0 && (
                                    <div className="flex items-center">
                                      <span className="text-xs text-slate-500 mr-1">Kategori:</span>
                                      <div className="flex flex-wrap gap-1">
                                        {department.categories.map(category => (
                                          <span key={category} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                            {category}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <button
                                  onClick={() => handleEditDepartment(department)}
                                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Dinas"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => removeDepartment(department.id)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Hapus Dinas"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Forward Test */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Test Forward</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Uji coba pengiriman notifikasi ke dinas terkait
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => alert('Test email berhasil dikirim!')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Test Email
                      </button>
                      <button
                        onClick={() => alert('Test WhatsApp berhasil dikirim!')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Test WhatsApp
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleSave('complaint-forwarding')}
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

      {/* Department Modal */}
      <DepartmentModal
        isOpen={showDepartmentModal}
        onClose={() => setShowDepartmentModal(false)}
        onSave={handleDepartmentSave}
        department={selectedDepartment}
        mode={departmentModalMode}
      />
    </ProtectedDashboardLayout>
  );
};

export default PengaturanPage;