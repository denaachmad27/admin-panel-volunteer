import React, { createContext, useContext, useState, useEffect } from 'react';
import { generalSettingsAPI } from '../services/api';

const GeneralSettingsContext = createContext();

export const useGeneralSettings = () => {
  const context = useContext(GeneralSettingsContext);
  if (!context) {
    throw new Error('useGeneralSettings must be used within a GeneralSettingsProvider');
  }
  return context;
};

export const GeneralSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    site_name: 'Admin Panel Bantuan Sosial',
    site_description: '',
    site_url: '',
    admin_email: '',
    contact_phone: '',
    address: '',
    organization: 'Bantuan Sosial',
    logo_path: null,
    logo_url: null,
    timezone: 'Asia/Jakarta',
    language: 'id'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await generalSettingsAPI.getSettings();
      if (response.data.status === 'success') {
        console.log('GeneralSettingsContext: Settings loaded:', response.data.data);
        setSettings(response.data.data);
      }
    } catch (err) {
      console.error('GeneralSettingsContext: Error loading settings:', err);
      setError(err);
      // Keep default settings on error
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (newSettings) => {
    console.log('GeneralSettingsContext: Updating settings:', newSettings);
    console.log('GeneralSettingsContext: Previous settings:', settings);
    const updatedSettings = {
      ...settings,
      ...newSettings
    };
    console.log('GeneralSettingsContext: New settings will be:', updatedSettings);
    setSettings(updatedSettings);
    
    // Force a small delay to ensure state propagation
    setTimeout(() => {
      console.log('GeneralSettingsContext: Settings should now be updated');
    }, 100);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const value = {
    settings,
    loading,
    error,
    refreshSettings: loadSettings,
    updateSettings
  };

  return (
    <GeneralSettingsContext.Provider value={value}>
      {children}
    </GeneralSettingsContext.Provider>
  );
};

export default GeneralSettingsContext;