import api from './api';

class VolunteerService {
  // Get all volunteers with pagination and filters
  async getVolunteers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.search) queryParams.append('search', params.search);
      if (params.status && params.status !== 'all') queryParams.append('status', params.status);
      if (params.profile_complete && params.profile_complete !== 'all') queryParams.append('profile_complete', params.profile_complete);
      if (params.city) queryParams.append('city', params.city);

      const response = await api.get(`/admin/volunteers?${queryParams.toString()}`);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch volunteers');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Get volunteer statistics
  async getVolunteerStatistics() {
    try {
      const response = await api.get('/admin/volunteers/statistics');
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch statistics');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Get single volunteer with complete profile
  async getVolunteer(id) {
    try {
      const response = await api.get(`/admin/volunteers/${id}`);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch volunteer');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Update volunteer status
  async updateVolunteerStatus(id, isActive) {
    try {
      const response = await api.patch(`/admin/volunteers/${id}/status`, {
        is_active: isActive
      });
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update volunteer status');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Delete volunteer
  async deleteVolunteer(id) {
    try {
      const response = await api.delete(`/admin/volunteers/${id}`);
      
      if (response.data.status === 'success') {
        return response.data;
      }
      
      throw new Error(response.data.message || 'Failed to delete volunteer');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Get volunteers with incomplete profiles
  async getIncompleteProfiles() {
    try {
      const response = await api.get('/admin/volunteers/incomplete-profiles');
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch incomplete profiles');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Helper methods for formatting
  formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount) {
    if (!amount || amount === 0) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  calculateAge(birthDate) {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  getCompletionBadgeColor(percentage) {
    if (percentage === 100) return 'bg-green-100 text-green-800';
    if (percentage >= 75) return 'bg-blue-100 text-blue-800';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  getStatusBadgeColor(isActive) {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }
}

export default new VolunteerService();