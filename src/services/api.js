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

export default api