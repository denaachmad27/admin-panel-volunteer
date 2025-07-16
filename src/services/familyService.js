import api from './api';

class FamilyService {
  // Get all families with pagination and filters
  async getFamilies(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.search) queryParams.append('search', params.search);
      if (params.user_id) queryParams.append('user_id', params.user_id);
      if (params.hubungan && params.hubungan !== 'all') queryParams.append('hubungan', params.hubungan);
      if (params.jenis_kelamin && params.jenis_kelamin !== 'all') queryParams.append('jenis_kelamin', params.jenis_kelamin);

      const response = await api.get(`/admin/families?${queryParams.toString()}`);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch families');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Get family statistics
  async getFamilyStatistics() {
    try {
      const response = await api.get('/admin/families/statistics');
      
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

  // Get single family
  async getFamily(id) {
    try {
      const response = await api.get(`/admin/families/${id}`);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch family');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Get families by user ID
  async getFamiliesByUser(userId) {
    try {
      const response = await api.get(`/admin/families/user/${userId}`);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch user families');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Create new family
  async createFamily(familyData) {
    try {
      const response = await api.post('/admin/families', familyData);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to create family');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Update family
  async updateFamily(id, familyData) {
    try {
      const response = await api.put(`/admin/families/${id}`, familyData);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update family');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Delete family
  async deleteFamily(id) {
    try {
      const response = await api.delete(`/admin/families/${id}`);
      
      if (response.data.status === 'success') {
        return response.data;
      }
      
      throw new Error(response.data.message || 'Failed to delete family');
    } catch (error) {
      if (error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(error.response?.data?.message || 'Network error');
    }
  }

  // Bulk actions
  async bulkAction(action, familyIds) {
    try {
      const response = await api.post('/admin/families/bulk-action', {
        action: action,
        family_ids: familyIds
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

export default new FamilyService();