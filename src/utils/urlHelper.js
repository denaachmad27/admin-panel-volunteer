// Get base URL from environment variable
const getBaseUrl = () => {
  const apiBaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://127.0.0.1:8000/api';

  // Remove /api suffix to get base origin
  return apiBaseUrl.replace(/\/?api\/?$/, '');
};

// Export BASE_URL for use in components
export const BASE_URL = getBaseUrl();

// URL Helper untuk mengatasi masalah localhost vs 127.0.0.1
export const constructImageUrl = (url, baseUrl = null) => {
  if (!url) return null;

  // Use environment-based base URL if not provided
  const finalBaseUrl = baseUrl || BASE_URL;

  // Jika sudah URL lengkap, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Jika relative path, tambahkan base URL
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${finalBaseUrl}${cleanPath}`;
};

export const fixImageUrl = (url) => {
  return constructImageUrl(url);
};