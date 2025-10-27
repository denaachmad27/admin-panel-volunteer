import axios from 'axios'

// Base URL dari Laravel backend (gunakan env untuk prod)
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://127.0.0.1:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Helper to derive base origin (remove trailing /api)
const BASE_ORIGIN = API_BASE_URL.replace(/\/?api\/?$/, '')

export const webApi = axios.create({
  baseURL: BASE_ORIGIN,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
})

// Response interceptor for webApi (dev-only verbose logs)
webApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const isProd = !(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV)
    if (!isProd) {
      console.error('Web API Error:', error.response?.status, error.response?.data?.message || error.message)
    }
    return Promise.reject(error)
  }
)

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
    // Log ringkas saat dev, hindari membocorkan data di produksi
    const isProd = !(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV)
    if (!isProd) {
      console.error('API Error:', error.response?.status, error.response?.data?.message || error.message)
    }
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

// Aleg API Services
export const alegAPI = {
  // Get aleg-specific dashboard (relawan + warga counts)
  getDashboard: () => {
    return api.get('/dashboard/aleg')
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

// Email API Services
export const emailAPI = {
  // Send complaint forwarding email
  sendComplaintEmail: (data) => {
    return api.post('/admin/email/send-complaint', data)
  },

  // Send test email
  sendTestEmail: (data) => {
    return api.post('/admin/email/send-test', data)
  },

  // Get email configuration status
  getEmailStatus: () => {
    return api.get('/admin/email/status')
  }
}

// Forwarding Settings API Services
export const forwardingAPI = {
  // Get all forwarding settings
  getSettings: () => {
    return api.get('/admin/forwarding/settings')
  },

  // Update forwarding settings
  updateSettings: (data) => {
    return api.put('/admin/forwarding/settings', data)
  },

  // Get all departments
  getDepartments: () => {
    return api.get('/admin/forwarding/departments')
  },

  // Create new department
  createDepartment: (data) => {
    return api.post('/admin/forwarding/departments', data)
  },

  // Update department
  updateDepartment: (id, data) => {
    return api.put(`/admin/forwarding/departments/${id}`, data)
  },

  // Delete department
  deleteDepartment: (id) => {
    return api.delete(`/admin/forwarding/departments/${id}`)
  },

  // Get department by category
  getDepartmentByCategory: (category) => {
    return api.get(`/admin/forwarding/departments/category/${category}`)
  }
}

// Department API Services
export const departmentAPI = {
  // Get all departments
  getAll: (params = {}) => {
    return api.get('/admin/departments', { params })
  },

  // Create new department
  create: (data) => {
    return api.post('/admin/departments', data)
  },

  // Get single department
  getById: (id) => {
    return api.get(`/admin/departments/${id}`)
  },

  // Update department
  update: (id, data) => {
    return api.put(`/admin/departments/${id}`, data)
  },

  // Delete department
  delete: (id) => {
    return api.delete(`/admin/departments/${id}`)
  },

  // Toggle department status
  toggleStatus: (id) => {
    return api.patch(`/admin/departments/${id}/toggle-status`)
  },

  // Get department by category
  getByCategory: (category) => {
    return api.get(`/admin/departments/category/${category}`)
  },

  // Get active departments with categories
  getActiveWithCategories: () => {
    return api.get('/admin/departments/active-with-categories')
  }
}

// WhatsApp API Services
export const whatsappAPI = {
  // Get WhatsApp settings
  getSettings: () => {
    return api.get('/admin/whatsapp/settings')
  },

  // Update WhatsApp settings
  updateSettings: (data) => {
    return api.put('/admin/whatsapp/settings', data)
  },

  // Get QR Code for WhatsApp login
  getQRCode: () => {
    return api.get('/admin/whatsapp/qr-code')
  },

  // Initialize WhatsApp session
  initializeSession: () => {
    return api.post('/admin/whatsapp/initialize')
  },

  // Disconnect WhatsApp session
  disconnect: () => {
    return api.post('/admin/whatsapp/disconnect')
  },

  // Test WhatsApp connection
  testConnection: () => {
    return api.post('/admin/whatsapp/test-connection')
  },

  // Send message to department
  sendToDepartment: (complaintId, data) => {
    return api.post(`/admin/whatsapp/send/${complaintId}`, data)
  }
}

// Warga Binaan API Services
export const wargaBinaanAPI = {
  // Get all warga binaan
  getAll: (params = {}) => {
    return api.get('/admin/warga-binaan', { params })
  },

  // Get single warga binaan by ID
  getById: (id) => {
    return api.get(`/admin/warga-binaan/${id}`)
  },

  // Create new warga binaan
  create: (data) => {
    return api.post('/admin/warga-binaan', data)
  },

  // Update warga binaan
  update: (id, data) => {
    return api.put(`/admin/warga-binaan/${id}`, data)
  },

  // Delete warga binaan
  delete: (id) => {
    return api.delete(`/admin/warga-binaan/${id}`)
  },

  // Get statistics
  getStatistics: (params = {}) => {
    return api.get('/admin/warga-binaan/statistics', { params })
  },

  // Get relawan options for dropdown
  getRelawanOptions: () => {
    return api.get('/admin/warga-binaan/relawan-options')
  },

  // Download CSV template
  downloadTemplate: () => {
    return api.get('/admin/warga-binaan/download-template', {
      responseType: 'blob'
    })
  },

  // Mass upload CSV
  massUpload: (formData) => {
    return api.post('/admin/warga-binaan/mass-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Bulk delete
  bulkDelete: (ids) => {
    return api.post('/admin/warga-binaan/bulk-delete', { ids })
  },

  // Preview CSV
  previewCsv: (formData) => {
    return api.post('/admin/warga-binaan/preview-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}

// General Settings API Services
export const generalSettingsAPI = {
  // Get general settings
  getSettings: () => {
    return api.get('/admin/general/settings')
  },

  // Update general settings
  updateSettings: (data) => {
    // If data is FormData, send as multipart
    if (data instanceof FormData) {
      return api.put('/admin/general/settings', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } else {
      // If data is regular object, send as JSON
      return api.put('/admin/general/settings', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  },

  // Upload logo only
  uploadLogo: (logoFile) => {
    const formData = new FormData()
    formData.append('logo', logoFile)
    return api.post('/admin/general/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete logo
  deleteLogo: () => {
    return api.delete('/admin/general/logo')
  },

  // Get available options for dropdowns
  getOptions: () => {
    return api.get('/admin/general/options')
  },

  // Debug endpoint to test what data is received
  debugSettings: (data) => {
    return api.post('/admin/general/debug', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}

export default api
