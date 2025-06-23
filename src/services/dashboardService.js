import api from './api';

class DashboardService {
  // Get dashboard statistics
  async getStats() {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // Return mock data for development
      return {
        status: 'success',
        data: {
          total_users: 1248,
          total_programs: 24,
          total_complaints: 89,
          total_news: 156,
          pending_applications: 15,
          active_programs: 18
        }
      };
    }
  }

  // Get recent activities
  async getRecentActivities() {
    try {
      const response = await api.get('/admin/dashboard/activities');
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      
      // Return mock data for development
      return {
        status: 'success',
        data: [
          {
            id: 1,
            action: 'User baru mendaftar',
            details: 'Ahmad Wijaya mendaftar ke sistem',
            time: '5 menit lalu',
            type: 'user'
          },
          {
            id: 2,
            action: 'Bantuan sosial disetujui',
            details: 'Program bantuan pangan untuk RT 05',
            time: '1 jam lalu',
            type: 'bantuan'
          },
          {
            id: 3,
            action: 'Pengaduan baru',
            details: 'Laporan infrastruktur jalan rusak',
            time: '2 jam lalu',
            type: 'complaint'
          }
        ]
      };
    }
  }

  // Get notifications
  async getNotifications() {
    try {
      const response = await api.get('/admin/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Return mock data for development
      return {
        status: 'success',
        data: [
          {
            id: 1,
            title: 'Pengaduan Baru',
            message: 'Ada pengaduan baru dari warga RT 05',
            time: '5 menit lalu',
            unread: true
          },
          {
            id: 2,
            title: 'Pendaftaran Bantuan',
            message: '3 pendaftaran baru menunggu verifikasi',
            time: '1 jam lalu',
            unread: true
          },
          {
            id: 3,
            title: 'Sistem Update',
            message: 'Update sistem berhasil dilakukan',
            time: '2 jam lalu',
            unread: false
          }
        ]
      };
    }
  }
}

export default new DashboardService();