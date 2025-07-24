const CACHE_KEY = 'general_settings_cache';
const CACHE_TIMESTAMP_KEY = 'general_settings_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache utilities
export const getCachedSettings = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      if (age < CACHE_DURATION) {
        console.log('GeneralSettingsContext: Using cached settings');
        return JSON.parse(cached);
      }
    }
  } catch (error) {
    console.error('GeneralSettingsContext: Error reading cache:', error);
  }
  return null;
};

export const setCachedSettings = (settings) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(settings));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    console.log('GeneralSettingsContext: Settings cached');
  } catch (error) {
    console.error('GeneralSettingsContext: Error caching settings:', error);
  }
};

export const clearCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    console.log('GeneralSettingsContext: Cache cleared');
  } catch (error) {
    console.error('GeneralSettingsContext: Error clearing cache:', error);
  }
};