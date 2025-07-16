import React, { useState, useEffect } from 'react';
import { Settings, Save, Upload, Bell, Shield, Database, Globe, Mail, Phone, MapPin, Building, User, Key, Eye, EyeOff, RefreshCw, Download, AlertCircle, CheckCircle, MessageSquare, Send, Edit, Trash2, ExternalLink, Smartphone, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import complaintForwardingService from '../services/complaintForwardingService';
import { generalSettingsAPI } from '../services/api';
import DepartmentModal from '../components/modals/DepartmentModal';
import { useGeneralSettings } from '../contexts/GeneralSettingsContext';

const PengaturanPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Use General Settings Context
  const { 
    settings: generalSettings, 
    loading: generalSettingsLoading, 
    updateSettings: updateGeneralSettingsContext,
    refreshSettings 
  } = useGeneralSettings();
  
  // Local state for editing
  const [localGeneralSettings, setLocalGeneralSettings] = useState({});
  
  // Logo preview state
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  
  // Sync local state when context settings change
  useEffect(() => {
    setLocalGeneralSettings(generalSettings);
    // Clear preview when general settings change
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
    setLogoFile(null);
  }, [generalSettings]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);
  const [availableOptions, setAvailableOptions] = useState({
    timezones: {},
    languages: {}
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
    loadAvailableOptions();
  }, []);

  const loadSettings = async () => {
    try {
      setSettingsLoading(true);
      const settings = await complaintForwardingService.getSettings();
      setComplaintForwardingSettings(settings);
    } catch (error) {
      console.error('Error loading complaint forwarding settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };


  const loadAvailableOptions = async () => {
    try {
      const response = await generalSettingsAPI.getOptions();
      if (response.data.status === 'success') {
        setAvailableOptions(response.data.data);
      }
    } catch (error) {
      console.error('Error loading available options:', error);
      // Set default options if API fails
      setAvailableOptions({
        timezones: {
          'Asia/Jakarta': 'Asia/Jakarta (WIB)',
          'Asia/Makassar': 'Asia/Makassar (WITA)',
          'Asia/Jayapura': 'Asia/Jayapura (WIT)'
        },
        languages: {
          'id': 'Bahasa Indonesia',
          'en': 'English'
        }
      });
    }
  };

  const handleGeneralChange = (field, value) => {
    setLocalGeneralSettings(prev => ({
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

  const handleLogoSelect = (e) => {
    console.log('handleLogoSelect called');
    const file = e.target.files[0];
    console.log('Selected file:', file);
    
    if (file) {
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 2MB.');
        e.target.value = ''; // Clear input
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar.');
        e.target.value = ''; // Clear input
        return;
      }

      // Clean up previous preview
      if (logoPreview) {
        console.log('Cleaning up previous preview:', logoPreview);
        URL.revokeObjectURL(logoPreview);
      }

      // Store file for later upload
      setLogoFile(file);
      console.log('Logo file stored:', file.name);
      
      // Create preview URL
      try {
        const previewUrl = URL.createObjectURL(file);
        console.log('Preview URL created:', previewUrl);
        
        // Test if URL is valid by creating a test image
        const testImg = new Image();
        testImg.onload = () => {
          console.log('Preview URL is valid and image can load');
        };
        testImg.onerror = () => {
          console.error('Preview URL is invalid or image cannot load');
        };
        testImg.src = previewUrl;
        
        setLogoPreview(previewUrl);
      } catch (error) {
        console.error('Error creating preview URL:', error);
      }
      
      console.log('Logo preview state updated');
    } else {
      console.log('No file selected');
    }
  };

  const handleSave = async (section) => {
    console.log('handleSave called for section:', section);
    console.log('Current logoFile:', logoFile?.name);
    console.log('Current logoPreview:', logoPreview);
    
    setSaveStatus('saving');
    
    try {
      if (section === 'general') {
        // First, upload logo if a new file is selected
        if (logoFile) {
          try {
            console.log('Starting logo upload for file:', logoFile.name);
            console.log('Logo file details:', {
              name: logoFile.name,
              size: logoFile.size,
              type: logoFile.type
            });
            
            const logoResponse = await generalSettingsAPI.uploadLogo(logoFile);
            console.log('Logo upload response:', JSON.stringify(logoResponse.data, null, 2));
            
            if (logoResponse.data.status === 'success') {
              console.log('Logo upload successful, updating local settings');
              
              const newLogoData = {
                logo_path: logoResponse.data.data.logo_path,
                logo_url: logoResponse.data.data.logo_url
              };
              console.log('New logo data:', newLogoData);
              
              // Update local settings with new logo data
              setLocalGeneralSettings(prev => {
                const updated = {
                  ...prev,
                  ...newLogoData
                };
                console.log('Updated local general settings:', updated);
                return updated;
              });
              
              // Update context immediately
              console.log('Updating context with new logo data');
              updateGeneralSettingsContext(newLogoData);
              
              // Clear preview and file since it's now uploaded
              if (logoPreview) {
                URL.revokeObjectURL(logoPreview);
              }
              setLogoPreview(null);
              setLogoFile(null);
              
              console.log('Logo upload completed successfully');
            } else {
              console.error('Logo upload failed with status:', logoResponse.data.status);
            }
          } catch (logoError) {
            console.error('Error uploading logo:', logoError);
            alert('Gagal upload logo: ' + (logoError.response?.data?.message || logoError.message));
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
            return; // Don't continue with other settings if logo upload fails
          }
        }
        
        // Prepare data object for JSON request
        const updateData = {};
        
        // Only send fields that are allowed by backend validation
        const allowedFields = [
          'site_name', 'site_description', 'site_url', 'admin_email',
          'contact_phone', 'address', 'organization', 'timezone', 'language'
        ];
        
        allowedFields.forEach(key => {
          const value = localGeneralSettings[key];
          console.log(`Processing ${key}:`, JSON.stringify(value), typeof value, 'empty check:', !value);
          
          // Always include required fields with default values if empty
          if (key === 'site_name') {
            const finalValue = (value && value.trim()) || 'Admin Panel Bantuan Sosial';
            updateData[key] = finalValue;
            console.log(`Adding required ${key}:`, JSON.stringify(finalValue));
          } else if (key === 'timezone') {
            const finalValue = value || 'Asia/Jakarta';
            updateData[key] = finalValue;
            console.log(`Adding required ${key}:`, JSON.stringify(finalValue));
          } else if (key === 'language') {
            const finalValue = value || 'id';
            updateData[key] = finalValue;
            console.log(`Adding required ${key}:`, JSON.stringify(finalValue));
          } else {
            // For optional fields, only send if they have actual values
            if (value !== null && value !== undefined && value !== '') {
              updateData[key] = value;
              console.log(`Adding optional ${key}:`, JSON.stringify(value));
            } else {
              console.log(`Skipping empty optional ${key}`);
            }
          }
        });

        // Debug data before sending
        console.log('=== SENDING REQUEST ===');
        console.log('JSON data to send:', updateData);

        const response = await generalSettingsAPI.updateSettings(updateData);
        
        if (response.data.status === 'success') {
          console.log('General settings update successful:', response.data.data);
          
          // Update local state
          setLocalGeneralSettings(response.data.data);
          
          // Update context to reflect changes in other components
          updateGeneralSettingsContext(response.data.data);
          
          // Refresh from server to ensure consistency (especially for logo)
          console.log('Refreshing settings from server...');
          await refreshSettings();
          
          setSaveStatus('success');
          console.log('All settings saved successfully');
        } else {
          console.error('Settings update failed:', response.data);
          throw new Error(response.data.message || 'Failed to save settings');
        }
      } else {
        // Handle other sections (notifications, security, etc.) - keep existing logic
        setSaveStatus('success');
      }
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      
      // More detailed error handling
      let errorMessage = 'Gagal menyimpan pengaturan';
      
      if (error.response?.data?.errors) {
        // Validation errors
        const validationErrors = error.response.data.errors;
        const errorList = Object.entries(validationErrors)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('\n');
        errorMessage += ':\n\n' + errorList;
      } else if (error.response?.data?.message) {
        errorMessage += ': ' + error.response.data.message;
      } else {
        errorMessage += ': ' + error.message;
      }
      
      console.log('=== ERROR DEBUGGING ===');
      console.log('Full error object:', error);
      console.log('Error response:', error.response);
      console.log('Error response data:', error.response?.data);
      console.log('Error response status:', error.response?.status);
      
      console.log('Current localGeneralSettings state:');
      console.log(localGeneralSettings);
      
      if (section === 'general') {
        console.log('Data processing for general settings:');
        const allowedFields = [
          'site_name', 'site_description', 'site_url', 'admin_email',
          'contact_phone', 'address', 'organization', 'timezone', 'language'
        ];
        
        const debugData = {};
        allowedFields.forEach(key => {
          const value = localGeneralSettings[key];
          console.log(`${key}:`, JSON.stringify(value), typeof value, 'length:', value?.length);
          
          // Show what would be sent
          if (key === 'site_name') {
            const finalValue = (value && value.trim()) || 'Admin Panel Bantuan Sosial';
            debugData[key] = finalValue;
            console.log(`  → Will send ${key}:`, JSON.stringify(finalValue));
          } else if (key === 'timezone') {
            const finalValue = value || 'Asia/Jakarta';
            debugData[key] = finalValue;
            console.log(`  → Will send ${key}:`, JSON.stringify(finalValue));
          } else if (key === 'language') {
            const finalValue = value || 'id';
            debugData[key] = finalValue;
            console.log(`  → Will send ${key}:`, JSON.stringify(finalValue));
          } else if (value !== null && value !== undefined && value !== '') {
            debugData[key] = value;
            console.log(`  → Will send ${key}:`, JSON.stringify(value));
          } else {
            console.log(`  → Will skip ${key} (empty)`);
          }
        });
        
        console.log('Final data to send:', debugData);
      }
      
      alert(errorMessage);
      setTimeout(() => setSaveStatus(null), 3000);
    }
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
    <DashboardLayout
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
                {generalSettingsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mr-3"></div>
                    <p className="text-slate-600">Memuat pengaturan...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Site Information */}
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Informasi Situs</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nama Situs <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={localGeneralSettings.site_name || ''}
                            onChange={(e) => handleGeneralChange('site_name', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                            placeholder="Admin Panel Bantuan Sosial"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            URL Situs
                          </label>
                          <input
                            type="url"
                            value={localGeneralSettings.site_url || ''}
                            onChange={(e) => handleGeneralChange('site_url', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                            placeholder="https://bantuan-sosial.gov.id"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Deskripsi Situs
                        </label>
                        <textarea
                          rows={3}
                          value={localGeneralSettings.site_description || ''}
                          onChange={(e) => handleGeneralChange('site_description', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          placeholder="Deskripsi singkat tentang sistem"
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
                            value={localGeneralSettings.admin_email || ''}
                            onChange={(e) => handleGeneralChange('admin_email', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                            placeholder="admin@bantuan-sosial.gov.id"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Telepon
                          </label>
                          <input
                            type="tel"
                            value={localGeneralSettings.contact_phone || ''}
                            onChange={(e) => handleGeneralChange('contact_phone', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                            placeholder="+62 21 1234 5678"
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
                            value={localGeneralSettings.organization || ''}
                            onChange={(e) => handleGeneralChange('organization', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                            placeholder="Dinas Sosial DKI Jakarta"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Zona Waktu
                          </label>
                          <select
                            value={localGeneralSettings.timezone || 'Asia/Jakarta'}
                            onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          >
                            {Object.entries(availableOptions.timezones).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Alamat
                        </label>
                        <textarea
                          rows={2}
                          value={localGeneralSettings.address || ''}
                          onChange={(e) => handleGeneralChange('address', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          placeholder="Alamat lengkap organisasi"
                        />
                      </div>
                    </div>

                    {/* Language Setting */}
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Preferensi Sistem</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Bahasa
                          </label>
                          <select
                            value={localGeneralSettings.language || 'id'}
                            onChange={(e) => handleGeneralChange('language', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          >
                            {Object.entries(availableOptions.languages).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>
                    </div>
                  </div>

                    {/* Logo */}
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Logo Sistem</h3>
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          {/* Show preview if available, otherwise show current logo */}
                          {(() => {
                            console.log('Rendering logo section:', { logoPreview, logoFile: logoFile?.name, localGeneralSettings: localGeneralSettings.logo_url });
                            return logoPreview ? (
                              <div className="w-20 h-20 border-2 border-blue-300 rounded-lg overflow-hidden relative">
                                <img 
                                  src={logoPreview} 
                                  alt="Preview Logo" 
                                  className="w-full h-full object-cover" 
                                  onLoad={() => console.log('Preview image loaded successfully')}
                                  onError={(e) => console.error('Preview image failed to load:', e)}
                                />
                                <div className="absolute inset-0 bg-blue-500/10 border border-blue-500/30"></div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">●</span>
                                </div>
                              </div>
                            ) : localGeneralSettings.logo_url ? (
                            <div className="w-20 h-20 border border-slate-200 rounded-lg overflow-hidden">
                              <img 
                                src={localGeneralSettings.logo_url} 
                                alt="Logo Sistem" 
                                className="w-full h-full object-cover" 
                                onLoad={() => console.log('Logo loaded successfully:', localGeneralSettings.logo_url)}
                                onError={(e) => {
                                  console.error('Logo failed to load:', localGeneralSettings.logo_url);
                                  console.error('Image error event:', e);
                                  // Only try alternate URL once to avoid infinite loop
                                  if (!e.target.dataset.retried) {
                                    e.target.dataset.retried = 'true';
                                    let fullUrl;
                                    if (localGeneralSettings.logo_url.startsWith('http')) {
                                      // Replace localhost with 127.0.0.1:8000 if needed
                                      fullUrl = localGeneralSettings.logo_url.replace('localhost', '127.0.0.1:8000');
                                    } else {
                                      fullUrl = `http://127.0.0.1:8000${localGeneralSettings.logo_url}`;
                                    }
                                    console.log('Trying corrected URL:', fullUrl);
                                    e.target.src = fullUrl;
                                  } else {
                                    console.error('Failed to load logo even with full URL');
                                    // Hide broken image
                                    e.target.style.display = 'none';
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                              <Building className="w-10 h-10 text-slate-400" />
                            </div>
                          );
                          })()}
                          {/* Debug info and status */}
                          <div className="mt-2 text-xs text-slate-500">
                            {logoPreview && (
                              <div className="text-blue-600 font-medium">
                                <p>● Preview: {logoFile?.name}</p>
                                <p className="text-orange-600">Belum disimpan - klik "Simpan Pengaturan"</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="space-y-3">
                            <div className="flex space-x-3">
                              <label className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-flex items-center transition-colors">
                                <Upload className="w-4 h-4 mr-2" />
                                {logoPreview ? 'Pilih Logo Lain' : (localGeneralSettings.logo_url ? 'Ganti Logo' : 'Pilih Logo')}
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
                                  onChange={handleLogoSelect}
                                  className="hidden"
                                />
                              </label>
                              {logoPreview && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLogoPreview(null);
                                    setLogoFile(null);
                                  }}
                                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Batal
                                </button>
                              )}
                            </div>
                            <div className="text-sm text-slate-500">
                              <p>Format: PNG, JPG, GIF, SVG</p>
                              <p>Ukuran maksimal: 2MB</p>
                              <p>Rekomendasi: 200x200 pixel</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                      {logoPreview && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center text-blue-800">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">
                              Logo baru akan diupload: {logoFile?.name}
                            </span>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => handleSave('general')}
                        disabled={saveStatus === 'saving'}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                          logoPreview 
                            ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400' 
                            : 'bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400'
                        } disabled:opacity-50 disabled:cursor-not-allowed text-white`}
                      >
                        {saveStatus === 'saving' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {logoFile ? 'Mengupload logo...' : 'Menyimpan...'}
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {logoFile ? 'Simpan & Upload Logo' : 'Simpan Pengaturan'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

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
                  {/* Integration Overview */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Integrasi Sistem</h3>
                    <p className="text-sm text-slate-600 mb-6">
                      Sistem forward pengaduan terintegrasi dengan WhatsApp dan Email untuk meneruskan pengaduan secara otomatis ke dinas terkait berdasarkan kategori.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* WhatsApp Integration Card */}
                      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 mr-4">
                              <Smartphone className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-900">WhatsApp Integration</h4>
                              <p className="text-sm text-green-700">
                                Forward pengaduan via WhatsApp ke departemen
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-700">Real-time message forwarding</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-700">Department-based routing</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-700">Customizable templates</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => navigate('/settings/whatsapp')}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Konfigurasi WhatsApp
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                      
                      {/* Email Integration Card */}
                      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 mr-4">
                              <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-blue-900">Email Integration</h4>
                              <p className="text-sm text-blue-700">
                                Forward pengaduan via email ke departemen
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-blue-700">SMTP configuration</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-blue-700">Email templates</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-blue-700">Department mapping</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => navigate('/settings/email')}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Konfigurasi Email
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>


                  {/* Department Management */}
                  <div>
                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-purple-100 mr-4">
                            <Building className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-900">Manajemen Dinas</h4>
                            <p className="text-sm text-purple-700">
                              Kelola daftar dinas dan mapping kategori pengaduan
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                          <span className="text-purple-700">Department contact management</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                          <span className="text-purple-700">Category-based routing</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                          <span className="text-purple-700">WhatsApp & Email integration</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => navigate('/settings/daftar-dinas')}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Kelola Daftar Dinas
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-3">Quick Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={() => navigate('/settings/whatsapp')}
                        className="p-3 bg-white border border-slate-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors text-left"
                      >
                        <Smartphone className="w-5 h-5 text-green-600 mb-1" />
                        <p className="text-sm font-medium text-slate-900">WhatsApp Settings</p>
                        <p className="text-xs text-slate-600">Configure WhatsApp integration</p>
                      </button>
                      
                      <button
                        onClick={() => navigate('/settings/email')}
                        className="p-3 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors text-left"
                      >
                        <Mail className="w-5 h-5 text-blue-600 mb-1" />
                        <p className="text-sm font-medium text-slate-900">Email Settings</p>
                        <p className="text-xs text-slate-600">Configure email integration</p>
                      </button>
                      
                      <button
                        onClick={() => navigate('/settings/daftar-dinas')}
                        className="p-3 bg-white border border-slate-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors text-left"
                      >
                        <Building className="w-5 h-5 text-purple-600 mb-1" />
                        <p className="text-sm font-medium text-slate-900">Manage Departments</p>
                        <p className="text-xs text-slate-600">Department contact management</p>
                      </button>
                    </div>
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
    </DashboardLayout>
  );
};

export default PengaturanPage;