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

// Bantuan Sosial API Services
export const bantuanSosialAPI = {
  // Get all bantuan sosial for admin
  getAll: (params = {}) => {
    return api.get('/admin/bantuan-sosial', { params })
  },

  // Get single bantuan sosial by ID
  getById: (id) => {
    return api.get(`/admin/bantuan-sosial/${id}`)
  },

  // Create new bantuan sosial
  create: (data) => {
    return api.post('/admin/bantuan-sosial', data)
  },

  // Update bantuan sosial
  update: (id, data) => {
    return api.put(`/admin/bantuan-sosial/${id}`, data)
  },

  // Delete bantuan sosial
  delete: (id) => {
    return api.delete(`/admin/bantuan-sosial/${id}`)
  },

  // Get public bantuan sosial list
  getPublic: (params = {}) => {
    return api.get('/bantuan-sosial', { params })
  },

  // Get public bantuan sosial by ID
  getPublicById: (id) => {
    return api.get(`/bantuan-sosial/${id}`)
  },
}

// Pendaftaran API Services
export const pendaftaranAPI = {
  // Get all pendaftaran for admin
  getAll: (params = {}) => {
    return api.get('/admin/pendaftaran', { params })
  },

  // Get single pendaftaran by ID
  getById: (id) => {
    return api.get(`/admin/pendaftaran/${id}`)
  },

  // Update pendaftaran status
  updateStatus: (id, status, notes = '') => {
    return api.put(`/admin/pendaftaran/${id}/status`, { 
      status, 
      catatan_admin: notes,
      reviewed_at: new Date().toISOString() 
    })
  },

  // Delete pendaftaran
  delete: (id) => {
    return api.delete(`/admin/pendaftaran/${id}`)
  },

  // Get pendaftaran statistics
  getStatistics: () => {
    return api.get('/admin/pendaftaran/statistics')
  },

  // Bulk update status
  bulkUpdateStatus: (ids, status, notes = '') => {
    return api.post('/admin/pendaftaran/bulk-status', {
      ids,
      status,
      catatan_admin: notes,
      reviewed_at: new Date().toISOString()
    })
  }
}

// Dashboard API Services
export const dashboardAPI = {
  // Get dashboard statistics
  getStatistics: () => {
    return api.get('/admin/dashboard/statistics')
  }
}

// Complaint API Services
export const complaintAPI = {
  // Get all complaints for admin
  getAll: (params = {}) => {
    return api.get('/admin/complaint', { params })
  },

  // Get complaint statistics
  getStatistics: () => {
    return api.get('/admin/complaint/statistics')
  },

  // Update complaint status
  updateStatus: (id, status, respon_admin = '') => {
    return api.put(`/admin/complaint/${id}/status`, { 
      status,
      respon_admin 
    })
  },

  // Get single complaint by ID (from admin list)
  getById: (id) => {
    return api.get('/admin/complaint').then(response => {
      const complaintsList = response.data.data?.data || [];
      const complaint = complaintsList.find(item => item.id === parseInt(id));
      if (complaint) {
        return { data: { status: 'success', data: complaint } };
      } else {
        throw new Error('Complaint not found');
      }
    });
  }
}

export default api