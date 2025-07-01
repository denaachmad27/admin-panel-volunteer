import api from './api';

class UserService {
  // Get all users with pagination and filters
  async getUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.search) queryParams.append('search', params.search);
      if (params.role && params.role !== 'all') queryParams.append('role', params.role);
      if (params.status && params.status !== 'all') queryParams.append('status', params.status);

      const response = await api.get(`/admin/users?${queryParams.toString()}`);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch users');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Get user statistics
  async getUserStatistics() {
    try {
      const response = await api.get('/admin/users/statistics');
      
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

  // Get single user
  async getUser(id) {
    try {
      const response = await api.get(`/admin/users/${id}`);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch user');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Create new user
  async createUser(userData) {
    try {
      const response = await api.post('/admin/users', userData);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to create user');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Update user
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update user');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Delete user
  async deleteUser(id) {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      
      if (response.data.status === 'success') {
        return response.data;
      }
      
      throw new Error(response.data.message || 'Failed to delete user');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Update user status
  async updateUserStatus(id, isActive) {
    try {
      const response = await api.patch(`/admin/users/${id}/status`, {
        is_active: isActive
      });
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update user status');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Bulk actions
  async bulkAction(action, userIds) {
    try {
      const response = await api.post('/admin/users/bulk-action', {
        action: action,
        user_ids: userIds
      });
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to perform bulk action');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }
}

export default new UserService();