import { useState, useCallback } from 'react';

/**
 * Custom hook for caching data with automatic expiration
 * @param {string} cacheKey - Unique key for the cache
 * @param {number} cacheDuration - Duration in milliseconds (default: 5 minutes)
 * @param {*} initialData - Initial data to use (default: null)
 */
export const useCache = (cacheKey, cacheDuration = 5 * 60 * 1000, initialData = null) => {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      const timestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < cacheDuration) {
          console.log(`useCache: Using cached data for ${cacheKey}`);
          return JSON.parse(cached);
        }
      }
    } catch (error) {
      console.error(`useCache: Error reading cache for ${cacheKey}:`, error);
    }
    return initialData;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastLoadTime, setLastLoadTime] = useState(null);

  // Cache utilities
  const getCachedData = useCallback((key) => {
    try {
      const cached = localStorage.getItem(key);
      const timestamp = localStorage.getItem(`${key}_timestamp`);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < cacheDuration) {
          console.log(`useCache: Using cached data for ${key}`);
          return JSON.parse(cached);
        }
      }
    } catch (error) {
      console.error(`useCache: Error reading cache for ${key}:`, error);
    }
    return null;
  }, [cacheDuration]);

  const setCachedData = useCallback((key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      localStorage.setItem(`${key}_timestamp`, Date.now().toString());
      console.log(`useCache: Data cached for ${key}`);
    } catch (error) {
      console.error(`useCache: Error caching data for ${key}:`, error);
    }
  }, []);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(`${cacheKey}_timestamp`);
      console.log(`useCache: Cache cleared for ${cacheKey}`);
    } catch (error) {
      console.error(`useCache: Error clearing cache for ${cacheKey}:`, error);
    }
  }, [cacheKey]);

  // Load data with caching
  const loadData = useCallback(async (fetchFunction, forceRefresh = false) => {
    try {
      // Check if we need to refresh
      const now = Date.now();
      if (!forceRefresh && lastLoadTime && (now - lastLoadTime) < cacheDuration) {
        console.log(`useCache: Skipping load for ${cacheKey} (recently loaded)`);
        return data;
      }

      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          console.log(`useCache: Using cached data for ${cacheKey}`);
          setData(cachedData);
          setLastLoadTime(now);
          return cachedData;
        }
      }

      console.log(`useCache: Loading fresh data for ${cacheKey}`);
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction();
      
      setData(result);
      setLastLoadTime(now);
      setCachedData(cacheKey, result);
      
      return result;
    } catch (err) {
      console.error(`useCache: Error loading data for ${cacheKey}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cacheKey, cacheDuration, getCachedData, setCachedData, lastLoadTime, data]);

  // Update data and cache
  const updateData = useCallback((newData) => {
    setData(newData);
    setCachedData(cacheKey, newData);
  }, [cacheKey, setCachedData]);

  // Refresh data
  const refreshData = useCallback((fetchFunction) => {
    return loadData(fetchFunction, true);
  }, [loadData]);

  return {
    data,
    loading,
    error,
    loadData,
    updateData,
    refreshData,
    clearCache
  };
};

/**
 * Cache utilities for direct use
 */
export const cacheUtils = {
  get: (key, cacheDuration = 5 * 60 * 1000) => {
    try {
      const cached = localStorage.getItem(key);
      const timestamp = localStorage.getItem(`${key}_timestamp`);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < cacheDuration) {
          return JSON.parse(cached);
        }
      }
    } catch (error) {
      console.error(`cacheUtils: Error reading cache for ${key}:`, error);
    }
    return null;
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      localStorage.setItem(`${key}_timestamp`, Date.now().toString());
    } catch (error) {
      console.error(`cacheUtils: Error caching data for ${key}:`, error);
    }
  },

  clear: (key) => {
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_timestamp`);
    } catch (error) {
      console.error(`cacheUtils: Error clearing cache for ${key}:`, error);
    }
  },

  clearAll: () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.endsWith('_timestamp') || key.endsWith('_cache')) {
          localStorage.removeItem(key);
        }
      });
      console.log('cacheUtils: All cache cleared');
    } catch (error) {
      console.error('cacheUtils: Error clearing all cache:', error);
    }
  }
};

export default useCache;