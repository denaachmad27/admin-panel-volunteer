import api from './api';

class AnggotaLegislatifService {
  async getAnggotaLegislatif(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          queryParams.append(key, params[key]);
        }
      });

      const response = await api.get(`/admin/anggota-legislatif?${queryParams.toString()}`);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Gagal memuat data anggota legislatif');
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Terjadi kesalahan saat memuat data anggota legislatif');
    }
  }

  async getAnggotaLegislatifStatistics() {
    try {
      const response = await api.get('/admin/anggota-legislatif/statistics');
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Gagal memuat statistik anggota legislatif');
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Terjadi kesalahan saat memuat statistik anggota legislatif');
    }
  }

  async getAnggotaLegislatifById(id) {
    try {
      const response = await api.get(`/admin/anggota-legislatif/${id}`);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Anggota legislatif tidak ditemukan');
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Terjadi kesalahan saat memuat detail anggota legislatif');
    }
  }

  async createAnggotaLegislatif(data) {
    try {
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });

      const response = await api.post('/admin/anggota-legislatif', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Gagal membuat anggota legislatif');
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        throw new Error(errorMessages.join(', '));
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Terjadi kesalahan saat membuat anggota legislatif');
    }
  }

  async updateAnggotaLegislatif(id, data) {
    try {
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });

      const response = await api.post(`/admin/anggota-legislatif/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PUT'
        },
      });
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Gagal mengupdate anggota legislatif');
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        throw new Error(errorMessages.join(', '));
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Terjadi kesalahan saat mengupdate anggota legislatif');
    }
  }

  async deleteAnggotaLegislatif(id) {
    try {
      const response = await api.delete(`/admin/anggota-legislatif/${id}`);
      
      if (response.data.status === 'success') {
        return response.data;
      }
      throw new Error(response.data.message || 'Gagal menghapus anggota legislatif');
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Terjadi kesalahan saat menghapus anggota legislatif');
    }
  }

  async getAnggotaLegislatifOptions() {
    try {
      const response = await api.get('/admin/anggota-legislatif/options');
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Gagal memuat opsi anggota legislatif');
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Terjadi kesalahan saat memuat opsi anggota legislatif');
    }
  }
}

export default new AnggotaLegislatifService();