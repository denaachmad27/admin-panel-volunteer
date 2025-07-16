import React, { useState, useEffect } from 'react';
import { Mail, Settings, Send, CheckCircle, AlertTriangle, Server, Key, Shield, MessageSquare, FileText } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import { emailAPI, departmentAPI } from '../services/api';

const EmailSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('smtp');
  const [testingEmail, setTestingEmail] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [emailSettings, setEmailSettings] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    from_email: '',
    from_name: '',
    is_active: false
  });

  const [templateSettings, setTemplateSettings] = useState({
    complaint_subject: 'Pengaduan Baru - #{ticket_number}',
    complaint_template: `Pengaduan baru telah diterima:

Nomor Tiket: {ticket_number}
Judul: {title}
Kategori: {category}
Prioritas: {priority}

Deskripsi:
{description}

Pelapor:
Nama: {user_name}
Email: {user_email}

Tanggal: {created_at}

Silakan tindak lanjuti pengaduan ini sesuai prosedur yang berlaku.

Terima kasih.`
  });

  useEffect(() => {
    loadEmailSettings();
    loadDepartments();
  }, []);

  const loadEmailSettings = async () => {
    try {
      setLoading(true);
      const response = await emailAPI.getEmailStatus();
      if (response.data.settings) {
        setEmailSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setEmailSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateChange = (field, value) => {
    setTemplateSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await emailAPI.updateSettings({
        ...emailSettings,
        templates: templateSettings
      });
      await loadEmailSettings();
      alert('Pengaturan email berhasil disimpan!');
    } catch (error) {
      console.error('Error saving email settings:', error);
      alert('Gagal menyimpan pengaturan email');
    } finally {
      setSaving(false);
    }
  };

  const testEmailConnection = async () => {
    try {
      setTestingEmail(true);
      const testEmail = prompt('Masukkan email tujuan untuk test:');
      if (!testEmail) return;

      const response = await emailAPI.sendTestEmail({
        to_email: testEmail,
        subject: 'Test Email Configuration',
        message: 'Ini adalah test email untuk memastikan konfigurasi SMTP berfungsi dengan baik.'
      });

      if (response.data.success) {
        alert(`✅ Test email berhasil dikirim ke ${testEmail}!`);
      } else {
        alert(`❌ Test email gagal: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error testing email:', error);
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setTestingEmail(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        currentPage="settings"
        pageTitle="Email Integration"
        breadcrumbs={['Pengaturan', 'Email']}
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading email settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      currentPage="settings"
      pageTitle="Email Integration"
      breadcrumbs={['Pengaturan', 'Email']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Email Integration</h1>
              <p className="text-blue-100">Configure email settings for complaint forwarding and notifications</p>
            </div>
            <div className="hidden md:block">
              <Mail className="w-16 h-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Email Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  emailSettings.is_active ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Mail className={`w-6 h-6 ${
                    emailSettings.is_active ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <p className="text-sm font-medium text-slate-900">Email Service</p>
                <p className="text-xs text-slate-600">
                  {emailSettings.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              
              <div className="text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  emailSettings.smtp_host ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Server className={`w-6 h-6 ${
                    emailSettings.smtp_host ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <p className="text-sm font-medium text-slate-900">SMTP Server</p>
                <p className="text-xs text-slate-600">
                  {emailSettings.smtp_host ? 'Configured' : 'Not configured'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-sm font-medium text-slate-900">Templates</p>
                <p className="text-xs text-slate-600">Ready</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-slate-900">Departments</p>
                <p className="text-xs text-slate-600">
                  {departments.filter(d => d.is_active && d.email).length} configured
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          {[
            { id: 'smtp', label: 'SMTP Configuration', icon: Server },
            { id: 'templates', label: 'Email Templates', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* SMTP Configuration Tab */}
        {activeTab === 'smtp' && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">SMTP Configuration</h3>
              
              <div className="space-y-6">
                {/* SMTP Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      SMTP Host <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtp_host}
                      onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      SMTP Port <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={emailSettings.smtp_port}
                      onChange={(e) => handleInputChange('smtp_port', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="587"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtp_username}
                      onChange={(e) => handleInputChange('smtp_username', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your-email@gmail.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={emailSettings.smtp_password}
                      onChange={(e) => handleInputChange('smtp_password', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Encryption
                    </label>
                    <select
                      value={emailSettings.smtp_encryption}
                      onChange={(e) => handleInputChange('smtp_encryption', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      From Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={emailSettings.from_email}
                      onChange={(e) => handleInputChange('from_email', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="noreply@bantuan-sosial.gov.id"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    From Name
                  </label>
                  <input
                    type="text"
                    value={emailSettings.from_name}
                    onChange={(e) => handleInputChange('from_name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Admin Panel Bantuan Sosial"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={emailSettings.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-slate-700">
                    Enable email forwarding
                  </label>
                </div>

                {/* Test Connection */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Test Email Configuration</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Send a test email to verify your SMTP configuration
                  </p>
                  <button
                    onClick={testEmailConnection}
                    disabled={testingEmail || !emailSettings.smtp_host}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center disabled:opacity-50"
                  >
                    {testingEmail ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Test...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Test Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Email Templates</h3>
              
              <div className="space-y-6">
                {/* Department Integration */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-purple-900">Department Integration</h4>
                      <p className="text-xs text-purple-700 mt-1">
                        Email forwards complaints to departments based on categories configured in Daftar Dinas
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-900">{departments.filter(d => d.is_active && d.email).length}</p>
                      <p className="text-xs text-purple-700">Active Email Configs</p>
                    </div>
                  </div>
                  
                  {departments.filter(d => d.is_active && d.email).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <p className="text-xs text-purple-700 mb-2">Departments with email:</p>
                      <div className="flex flex-wrap gap-2">
                        {departments.filter(d => d.is_active && d.email).map((dept) => (
                          <span key={dept.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {dept.name}
                            {dept.categories && dept.categories.length > 0 && (
                              <span className="ml-1 text-purple-600">({dept.categories.join(', ')})</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Template */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Subject Template
                  </label>
                  <input
                    type="text"
                    value={templateSettings.complaint_subject}
                    onChange={(e) => handleTemplateChange('complaint_subject', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Pengaduan Baru - #{ticket_number}"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Body Template
                  </label>
                  <textarea
                    value={templateSettings.complaint_template}
                    onChange={(e) => handleTemplateChange('complaint_template', e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Available Variables:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600">
                    <div><code className="bg-white px-1 rounded">{`{ticket_number}`}</code></div>
                    <div><code className="bg-white px-1 rounded">{`{title}`}</code></div>
                    <div><code className="bg-white px-1 rounded">{`{category}`}</code></div>
                    <div><code className="bg-white px-1 rounded">{`{description}`}</code></div>
                    <div><code className="bg-white px-1 rounded">{`{priority}`}</code></div>
                    <div><code className="bg-white px-1 rounded">{`{user_name}`}</code></div>
                    <div><code className="bg-white px-1 rounded">{`{user_email}`}</code></div>
                    <div><code className="bg-white px-1 rounded">{`{created_at}`}</code></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmailSettingsPage;