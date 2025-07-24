import React, { createContext, useContext, useState, useEffect } from 'react';
import { generalSettingsAPI } from '../services/api';
import { getCachedSettings, setCachedSettings, clearCache } from '../utils/settingsCache';

const GeneralSettingsContext = createContext();

// Cache keys


// Default settings
const DEFAULT_SETTINGS = {
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
};

export const useGeneralSettings = () => {
  const context = useContext(GeneralSettingsContext);
  if (!context) {
    throw new Error('useGeneralSettings must be used within a GeneralSettingsProvider');
  }
  return context;
};

export const GeneralSettingsProvider = ({ children }) => {
  // Initialize dengan cached settings jika ada, fallback ke default
  const [settings, setSettings] = useState(() => {
    const cachedSettings = getCachedSettings();
    return cachedSettings || DEFAULT_SETTINGS;
  });
  const [loading, setLoading] = useState(false); // Mulai dengan false karena kita ada cache
  const [error, setError] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const loadSettings = async (forceRefresh = false) => {
    try {
      // Jika sudah pernah load dan tidak force refresh, skip
      if (hasLoadedOnce && !forceRefresh) {
        console.log('GeneralSettingsContext: Skipping load (already loaded)');
        return;
      }

      // Cek cache terlebih dahulu jika tidak force refresh
      if (!forceRefresh) {
        const cachedSettings = getCachedSettings();
        if (cachedSettings) {
          console.log('GeneralSettingsContext: Using cached settings');
          setSettings(cachedSettings);
          setHasLoadedOnce(true);
          return;
        }
      }

      console.log('GeneralSettingsContext: Loading settings from API');
      setLoading(true);
      setError(null);
      
      const response = await generalSettingsAPI.getSettings();
      if (response.data.status === 'success') {
        console.log('GeneralSettingsContext: Settings loaded:', response.data.data);
        const newSettings = response.data.data;
        setSettings(newSettings);
        setCachedSettings(newSettings); // Cache the result
        setHasLoadedOnce(true);
      }
    } catch (err) {
      console.error('GeneralSettingsContext: Error loading settings:', err);
      setError(err);
      // Keep current settings on error (don't reset to default)
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
    
    // Update cache immediately
    setCachedSettings(updatedSettings);
    
    // Force a small delay to ensure state propagation
    setTimeout(() => {
      console.log('GeneralSettingsContext: Settings should now be updated');
    }, 100);
  };

  useEffect(() => {
    // Hanya load jika belum pernah load
    if (!hasLoadedOnce) {
      loadSettings();
    }
  }, [hasLoadedOnce]);

  const value = {
    settings,
    loading,
    error,
    refreshSettings: () => loadSettings(true), // Force refresh
    updateSettings,
    clearCache
  };

  return (
    <GeneralSettingsContext.Provider value={value}>
      {children}
    </GeneralSettingsContext.Provider>
  );
};

export default GeneralSettingsContext;