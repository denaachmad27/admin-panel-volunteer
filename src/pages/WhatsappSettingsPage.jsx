import React, { useState, useEffect } from 'react';
import { MessageSquare, Settings, Users, Send, QrCode, Wifi, WifiOff, CheckCircle, AlertTriangle, Smartphone, Globe } from 'lucide-react';
import ProtectedDashboardLayout from '../components/layout/ProtectedDashboardLayout';
import { Card } from '../components/ui/UIComponents';
import { whatsappAPI, departmentAPI } from '../services/api';

const WhatsappSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState('connection');
  const [currentMode, setCurrentMode] = useState('mock');
  const [availableModes, setAvailableModes] = useState(['mock']);
  const [serviceStatus, setServiceStatus] = useState(null);
  const [testingMessage, setTestingMessage] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    session_name: '',
    is_active: false,
    default_message_template: '',
    department_mappings: {}
  });

  useEffect(() => {
    loadSettings();
    loadDepartments();
    checkServiceModes();
    checkServiceStatus();
    
    // Set up polling for real-time status updates
    const statusInterval = setInterval(() => {
      checkServiceStatus();
      // Also update logs for real-time display
      if (activeTab === 'logs') {
        fetchConsoleLogs();
      }
    }, 3000); // Check every 3 seconds
    
    return () => clearInterval(statusInterval);
  }, []);

  // Fetch logs when logs tab becomes active
  useEffect(() => {
    if (activeTab === 'logs') {
      fetchConsoleLogs();
    }
  }, [activeTab]);

  const checkServiceModes = async () => {
    try {
      const bridgeUrl = 'http://localhost:3001';
      const response = await fetch(`${bridgeUrl}/health`);
      if (response.ok) {
        const data = await response.json();
        setCurrentMode(data.current_mode || 'mock');
        setAvailableModes(data.available_modes || ['mock']);
      }
    } catch (error) {
      console.error('Error checking service modes:', error);
    }
  };

  const checkServiceStatus = async () => {
    try {
      const bridgeUrl = 'http://localhost:3001';
      const response = await fetch(`${bridgeUrl}/status`);
      if (response.ok) {
        const data = await response.json();
        setServiceStatus(data.data);
      }
    } catch (error) {
      console.error('Error checking service status:', error);
    }
  };

  const updateQRCode = async () => {
    try {
      const qrData = await whatsappAPI.getQRCode();
      if (qrData.data.data.qr_code && qrData.data.data.qr_code !== qrCode) {
        setQrCode(qrData.data.data.qr_code);
      }
    } catch (error) {
      // Silent fail for QR code updates
    }
  };

  const fetchConsoleLogs = async () => {
    try {
      setLogsLoading(true);
      const bridgeUrl = 'http://localhost:3001';
      const response = await fetch(`${bridgeUrl}/logs?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setConsoleLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching console logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const clearConsoleLogs = async () => {
    try {
      const bridgeUrl = 'http://localhost:3001';
      const response = await fetch(`${bridgeUrl}/clear-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setConsoleLogs([]);
        alert('✅ Console logs cleared successfully!');
      } else {
        alert('❌ Failed to clear console logs');
      }
    } catch (error) {
      console.error('Error clearing console logs:', error);
      alert('❌ Error clearing console logs');
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

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await whatsappAPI.getSettings();
      const settingsData = response.data.data;
      setSettings(settingsData);
      setFormData({
        session_name: settingsData.session_name || '',
        is_active: settingsData.is_active || false,
        default_message_template: settingsData.default_message_template || '',
        department_mappings: settingsData.department_mappings || {}
      });
    } catch (error) {
      console.error('Error loading WhatsApp settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDepartmentChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      department_mappings: {
        ...prev.department_mappings,
        [category]: {
          ...prev.department_mappings[category],
          [field]: value
        }
      }
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await whatsappAPI.updateSettings(formData);
      await loadSettings();
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const initializeWhatsApp = async () => {
    try {
      setConnecting(true);
      const response = await whatsappAPI.initializeSession();
      
      // Wait a moment for service to start, then get QR code
      setTimeout(async () => {
        try {
          const qrData = await whatsappAPI.getQRCode();
          setQrCode(qrData.data.data.qr_code);
          
          // Also refresh service status
          await checkServiceStatus();
          
          if (currentMode === 'puppeteer') {
            alert('Puppeteer WhatsApp browser started.\n\nPlease scan the QR code that appears below with your phone.\n\nThe system will automatically detect when you are connected.');
          } else {
            alert('WhatsApp session started. Please scan the QR code with your phone.');
          }
        } catch (qrError) {
          console.error('Error getting QR code:', qrError);
        }
      }, 3000); // Wait 3 seconds for QR code to be ready
      
    } catch (error) {
      console.error('Error initializing WhatsApp:', error);
      alert(`Failed to initialize WhatsApp session: ${error.response?.data?.error || error.message}`);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWhatsApp = async () => {
    try {
      await whatsappAPI.disconnect();
      setQrCode(null);
      await loadSettings();
      alert('WhatsApp disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
      alert('Failed to disconnect WhatsApp');
    }
  };

  const testConnection = async () => {
    try {
      const response = await whatsappAPI.testConnection();
      alert('WhatsApp connection test successful!');
    } catch (error) {
      console.error('Error testing connection:', error);
      alert('WhatsApp connection test failed');
    }
  };

  const simulateQRScan = async () => {
    try {
      // Call the mock service to simulate QR scan
      const bridgeUrl = 'http://localhost:3001';
      const response = await fetch(`${bridgeUrl}/simulate-qr-scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert('🎉 Mock QR Scan Successful!\n\nWhatsApp is now "connected" in development mode.\n\nYou can now test forwarding functionality.');
        // Reload settings to update connection status
        await loadSettings();
      } else {
        alert('Failed to simulate QR scan');
      }
    } catch (error) {
      console.error('Error simulating QR scan:', error);
      alert('Error simulating QR scan. Make sure the WhatsApp service is running.');
    }
  };

  const switchMode = async (newMode) => {
    try {
      const bridgeUrl = 'http://localhost:3001';
      const response = await fetch(`${bridgeUrl}/switch-mode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_mode: newMode })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentMode(newMode);
        alert(`✅ Switched to ${newMode} mode successfully!\n\n${data.message}`);
        await checkServiceModes();
      } else {
        const errorData = await response.json();
        alert(`Failed to switch mode: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error switching mode:', error);
      alert('Error switching mode. Make sure the WhatsApp service is running.');
    }
  };

  const confirmRealConnection = async () => {
    try {
      // Call the service to confirm connection
      const bridgeUrl = 'http://localhost:3001';
      const response = await fetch(`${bridgeUrl}/confirm-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (currentMode === 'mock') {
          alert('✅ Mock Connection Confirmed!\n\nWhatsApp is now "connected" in development mode.\n\nYou can now test forwarding functionality.');
        } else {
          alert('✅ Real WhatsApp Connection Confirmed!\n\nWhatsApp Web is now connected.\n\nYou can now send real WhatsApp messages.');
        }
        // Reload settings and status
        await loadSettings();
        await checkServiceStatus();
      } else {
        alert('Failed to confirm connection');
      }
    } catch (error) {
      console.error('Error confirming connection:', error);
      alert('Error confirming connection. Make sure the WhatsApp service is running.');
    }
  };

  const testMessage = async () => {
    try {
      setTestingMessage(true);
      
      // Get test phone number from user
      const phoneNumber = prompt('Enter phone number for test message (format: 628123456789):');
      if (!phoneNumber) {
        setTestingMessage(false);
        return;
      }
      
      const bridgeUrl = 'http://localhost:3001';
      const response = await fetch(`${bridgeUrl}/test-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          phone_number: phoneNumber 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          let message = `✅ Test Message ${currentMode === 'mock' ? 'Simulated' : 'Sent'} Successfully!\n\n`;
          message += `📱 To: ${phoneNumber}\n`;
          message += `🔧 Mode: ${currentMode}\n`;
          message += `📋 Message ID: ${data.messageId}\n\n`;
          
          if (data.instructions) {
            message += `📝 Instructions:\n${data.instructions}`;
          } else if (data.note) {
            message += `📝 Note: ${data.note}`;
          }
          
          alert(message);
        } else {
          alert(`❌ Test Message Failed:\n${data.error}`);
        }
      } else {
        const errorData = await response.json();
        alert(`❌ Test Message Failed:\n${errorData.error}`);
      }
    } catch (error) {
      console.error('Error sending test message:', error);
      alert('Error sending test message. Make sure the WhatsApp service is running.');
    } finally {
      setTestingMessage(false);
    }
  };

  const categories = ['Teknis', 'Pelayanan', 'Bantuan', 'Saran', 'Lainnya'];

  if (loading) {
    return (
      <ProtectedDashboardLayout
        currentPage="whatsapp-settings"
        pageTitle="WhatsApp Settings"
        breadcrumbs={['Settings', 'WhatsApp']}
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading WhatsApp settings...</p>
          </div>
        </div>
      </ProtectedDashboardLayout>
    );
  }

  return (
    <ProtectedDashboardLayout
      currentPage="whatsapp-settings"
      pageTitle="WhatsApp Settings"
      breadcrumbs={['Settings', 'WhatsApp']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">WhatsApp Integration</h1>
              <p className="text-green-100">Configure WhatsApp for forwarding complaints to departments</p>
            </div>
            <div className="hidden md:block">
              <MessageSquare className="w-16 h-16 text-green-200" />
            </div>
          </div>
        </div>


        {/* Connection Status */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Connection Status</h2>
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                serviceStatus?.isReady 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {serviceStatus?.isReady ? <Wifi className="w-4 h-4 mr-1" /> : <WifiOff className="w-4 h-4 mr-1" />}
                {serviceStatus?.isReady ? 'Connected' : 'Disconnected'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  serviceStatus?.isReady ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Smartphone className={`w-6 h-6 ${
                    serviceStatus?.isReady ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <p className="text-sm font-medium text-slate-900">WhatsApp Status</p>
                <p className="text-xs text-slate-600">
                  {serviceStatus?.isReady ? 'Ready to send' : 'Not connected'}
                </p>
              </div>
              
              <div className="text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  serviceStatus?.hasProcess ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Settings className={`w-6 h-6 ${
                    serviceStatus?.hasProcess ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <p className="text-sm font-medium text-slate-900">Service Status</p>
                <p className="text-xs text-slate-600">
                  {serviceStatus?.hasProcess ? 'Running' : 'Stopped'}
                </p>
              </div>
              
              <div className="text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  serviceStatus?.hasQRCode ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <QrCode className={`w-6 h-6 ${
                    serviceStatus?.hasQRCode ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                </div>
                <p className="text-sm font-medium text-slate-900">QR Code</p>
                <p className="text-xs text-slate-600">
                  {serviceStatus?.hasQRCode ? 'Available' : 'Not available'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-sm font-medium text-slate-900">Departments</p>
                <p className="text-xs text-slate-600">
                  {departments.filter(d => d.is_active).length} active departments
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          {[
            { id: 'connection', label: 'Connection', icon: Wifi },
            { id: 'logs', label: 'Console Logs', icon: QrCode },
            { id: 'templates', label: 'Templates', icon: MessageSquare }
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

        {/* Connection Tab */}
        {activeTab === 'connection' && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">WhatsApp Connection</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Session Name
                    </label>
                    <input
                      type="text"
                      value={formData.session_name}
                      onChange={(e) => handleInputChange('session_name', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="admin-session"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm text-slate-700">
                      Enable WhatsApp forwarding
                    </label>
                  </div>

                  <div className="space-y-2">
                    {!serviceStatus?.isReady ? (
                      <button
                        onClick={initializeWhatsApp}
                        disabled={connecting}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                      >
                        {connecting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Connecting...
                          </>
                        ) : (
                          <>
                            <QrCode className="w-4 h-4 mr-2" />
                            Connect WhatsApp
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <button
                          onClick={testConnection}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Test Connection
                        </button>
                        
                        {currentMode === 'mock' && (
                          <button
                            onClick={simulateQRScan}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                          >
                            <Smartphone className="w-4 h-4 mr-2" />
                            Simulate QR Scan (Mock Mode)
                          </button>
                        )}
                        
                        {(currentMode === 'real' || currentMode === 'puppeteer') && (
                          <button
                            onClick={confirmRealConnection}
                            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm {currentMode === 'puppeteer' ? 'Automated' : 'Real'} Connection
                          </button>
                        )}
                        
                        {serviceStatus?.isReady && (
                          <button
                            onClick={testMessage}
                            disabled={testingMessage}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
                          >
                            {testingMessage ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Sending Test...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Test Message
                              </>
                            )}
                          </button>
                        )}
                        
                        <button
                          onClick={disconnectWhatsApp}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
                        >
                          <WifiOff className="w-4 h-4 mr-2" />
                          Disconnect
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code Display */}
                <div className="text-center">
                  {serviceStatus?.hasQRCode && qrCode && (
                    <>
                      <h4 className="text-sm font-medium text-slate-700 mb-4">
                        Scan this QR code with WhatsApp
                      </h4>
                      <div className="inline-block p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <img 
                          src={qrCode} 
                          alt="WhatsApp QR Code" 
                          className="w-48 h-48 mx-auto"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Open WhatsApp → Settings → Linked Devices → Link a Device
                      </p>
                    </>
                  )}
                  
                  {currentMode === 'real' && serviceStatus?.hasProcess && !serviceStatus?.isReady && (
                    <>
                      <h4 className="text-sm font-medium text-slate-700 mb-4">
                        QR Code in Chrome Window
                      </h4>
                      <div className="inline-block p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="w-48 h-48 mx-auto flex items-center justify-center bg-slate-100 rounded">
                          <div className="text-center">
                            <Globe className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-600">Check Chrome Window</p>
                            <p className="text-xs text-slate-500">QR code is displayed there</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Look for the QR code in the Chrome window that opened
                      </p>
                    </>
                  )}
                  
                  {serviceStatus?.isReady && (
                    <>
                      <h4 className="text-sm font-medium text-slate-700 mb-4">
                        WhatsApp Connected Successfully
                      </h4>
                      <div className="inline-block p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="w-48 h-48 mx-auto flex items-center justify-center">
                          <div className="text-center">
                            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-2" />
                            <p className="text-lg font-medium text-green-700">Connected</p>
                            <p className="text-sm text-green-600">Ready to send messages</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        You can now send test messages and forward complaints
                      </p>
                    </>
                  )}
                  
                  {!serviceStatus?.hasProcess && !serviceStatus?.isReady && (
                    <>
                      <h4 className="text-sm font-medium text-slate-700 mb-4">
                        Connect WhatsApp to Continue
                      </h4>
                      <div className="inline-block p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="w-48 h-48 mx-auto flex items-center justify-center">
                          <div className="text-center">
                            <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-2" />
                            <p className="text-lg font-medium text-slate-600">Not Connected</p>
                            <p className="text-sm text-slate-500">Click "Connect WhatsApp" to start</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Console Logs Tab */}
        {activeTab === 'logs' && (
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Console Logs</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={fetchConsoleLogs}
                    disabled={logsLoading}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {logsLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                  <button
                    onClick={clearConsoleLogs}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Clear Logs
                  </button>
                </div>
              </div>
              
              <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
                {consoleLogs.length === 0 ? (
                  <div className="text-green-400 text-center py-8">
                    <QrCode className="w-8 h-8 mx-auto mb-2" />
                    <p>No console logs yet</p>
                    <p className="text-xs text-green-600 mt-2">
                      Start the WhatsApp service and logs will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {consoleLogs.map((log, index) => {
                      // Check if this log contains QR code URL
                      const isQRCodeURL = log.message.includes('https://api.qrserver.com/v1/create-qr-code/');
                      
                      return (
                        <div
                          key={index}
                          className={`break-all ${
                            log.type === 'error' 
                              ? 'text-red-400' 
                              : log.message.includes('✅') || log.message.includes('🎉')
                              ? 'text-green-400'
                              : log.message.includes('⚠️') || log.message.includes('❌')
                              ? 'text-yellow-400'
                              : log.message.includes('📱') || log.message.includes('🔗')
                              ? 'text-blue-400'
                              : 'text-green-300'
                          }`}
                        >
                          <span className="text-gray-500 text-xs">
                            [{new Date(log.timestamp).toLocaleString('id-ID')}]
                          </span>
                          <span className="ml-2">
                            {isQRCodeURL ? (
                              <a 
                                href={log.message} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline"
                              >
                                🔗 KLIK DI SINI UNTUK BUKA QR CODE
                              </a>
                            ) : (
                              log.message
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-xs text-slate-600">
                <p>📊 Total logs: {consoleLogs.length} | Auto-refresh: every 3 seconds when this tab is active</p>
                <p className="mt-1">
                  💡 <strong>How to use:</strong> 
                  <br />
                  1. Click "Connect WhatsApp" in Connection tab
                  <br />
                  2. Watch this console for QR code data and status messages
                  <br />
                  3. Copy QR code data and scan with WhatsApp mobile app
                  <br />
                  4. Return to Connection tab to test messaging
                </p>
              </div>
            </div>
          </Card>
        )}


        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Message Template</h3>
              <p className="text-sm text-slate-600 mb-4">
                Customize the default message template sent to departments. 
                <a href="/settings/daftar-dinas" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                  Manage departments here →
                </a>
              </p>
              
              {/* Department Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Department Integration</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      WhatsApp forwards complaints to departments based on categories configured in Daftar Dinas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-900">{departments.filter(d => d.is_active).length}</p>
                    <p className="text-xs text-blue-700">Active Departments</p>
                  </div>
                </div>
                
                {departments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-700 mb-2">Active departments:</p>
                    <div className="flex flex-wrap gap-2">
                      {departments.filter(d => d.is_active).map((dept, index) => (
                        <span key={dept.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {dept.name}
                          {dept.categories && dept.categories.length > 0 && (
                            <span className="ml-1 text-blue-600">({dept.categories.join(', ')})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Default Message Template
                  </label>
                  <textarea
                    value={formData.default_message_template}
                    onChange={(e) => handleInputChange('default_message_template', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your message template..."
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
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
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
    </ProtectedDashboardLayout>
  );
};

export default WhatsappSettingsPage;