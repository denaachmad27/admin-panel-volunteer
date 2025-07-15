// URL Helper untuk mengatasi masalah localhost vs 127.0.0.1
export const constructImageUrl = (url, baseUrl = 'http://127.0.0.1:8000') => {
  if (!url) return null;
  
  // Jika sudah URL lengkap
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Replace localhost dengan 127.0.0.1:8000 untuk konsistensi
    return url
      .replace('http://localhost', baseUrl)
      .replace('https://localhost', baseUrl.replace('http:', 'https:'));
  }
  
  // Jika relative path, tambahkan base URL
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};

export const fixImageUrl = (url) => {
  return constructImageUrl(url);
};