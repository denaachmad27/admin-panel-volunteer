import api from './api';

class AuthService {
  // Login function
  async login(credentials) {
  try {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.status === 'success') {
      const { token, user } = response.data.data;
      
      // Simpan token dan user data dengan info lebih lengkap
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        name: user.name || 'Admin User',
        email: user.email,
        role: user.role || 'admin',
        avatar: user.avatar || null,
        created_at: user.created_at,
        anggota_legislatif_id: user.anggota_legislatif_id || null,
        anggota_legislatif: user.anggota_legislatif || null
      }));
      
      return response.data;
    }
    
    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    if (error.response?.data?.errors) {
      throw error.response.data.errors;
    }
    throw new Error(error.response?.data?.message || 'Network error');
  }
}

  // Logout function
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();