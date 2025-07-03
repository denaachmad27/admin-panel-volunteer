import axios from 'axios'

// Base URL dari Laravel backend Anda
const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - HAPUS AUTO REDIRECT!
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error untuk debugging
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // JANGAN auto-redirect, biarkan component yang handle
    // if (error.response?.status === 401) {
    //   localStorage.removeItem('token')
    //   window.location.href = '/login'
    // }
    
    return Promise.reject(error)
  }
)

// News API Services
export const newsAPI = {
  // Get all news for admin
  getAll: (params = {}) => {
    return api.get('/admin/news', { params })
  },

  // Get single news by ID for admin
  getById: (id) => {
    return api.get(`/admin/news/${id}`)
  },

  // Get single news by ID (alternative method)
  getByIdForEdit: (id) => {
    // Since we don't have a specific endpoint, we'll get from the list and filter
    return api.get('/admin/news').then(response => {
      const newsList = response.data.data?.data || [];
      const news = newsList.find(item => item.id === parseInt(id));
      if (news) {
        return { data: { status: 'success', data: news } };
      } else {
        throw new Error('News not found');
      }
    });
  },

  // Create new news
  create: (data) => {
    return api.post('/admin/news', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Update news
  update: (id, data) => {
    // Laravel doesn't handle multipart/form-data well with PUT
    // Use POST with method spoofing instead
    data.append('_method', 'PUT');
    return api.post(`/admin/news/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete news
  delete: (id) => {
    return api.delete(`/admin/news/${id}`)
  },

  // Toggle publish status
  togglePublish: (id) => {
    return api.patch(`/admin/news/${id}/toggle-publish`)
  },

  // Get public news list
  getPublic: (params = {}) => {
    return api.get('/news', { params })
  },

  // Get public news by slug
  getBySlug: (slug) => {
    return api.get(`/news/${slug}`)
  },
}

export default api