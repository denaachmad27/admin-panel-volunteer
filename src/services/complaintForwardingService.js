// Complaint Forwarding Service
// Centralized service for handling complaint forwarding functionality

import { emailAPI, forwardingAPI } from './api';

class ComplaintForwardingService {
  constructor() {
    this.settings = this.loadSettings();
  }

  // Load settings from database
  async loadSettings() {
    try {
      const response = await forwardingAPI.getSettings();
      return response.data.data;
    } catch (error) {
      console.error('Error loading settings from database:', error);
      // Fallback to default settings if database fails
      return this.getDefaultSettings();
    }
  }

  // Get default settings (fallback)
  getDefaultSettings() {
    return {
      emailForwarding: true,
      whatsappForwarding: false,
      forwardingMode: 'auto',
      adminEmail: 'admin@bantuan-sosial.gov.id',
      adminWhatsapp: '+62 812 9999 9999',
      departments: [
        {
          id: 1,
          name: 'Dinas Sosial',
          email: 'dinsos@bantuan-sosial.gov.id',
          whatsapp: '+62 812 1111 1111',
          categories: ['Bantuan', 'Pelayanan']
        },
        {
          id: 2,
          name: 'Dinas Kesehatan',
          email: 'dinkes@bantuan-sosial.gov.id',
          whatsapp: '+62 812 2222 2222',
          categories: ['Kesehatan']
        },
        {
          id: 3,
          name: 'Dinas Pendidikan',
          email: 'disdik@bantuan-sosial.gov.id',
          whatsapp: '+62 812 3333 3333',
          categories: ['Pendidikan']
        },
        {
          id: 4,
          name: 'IT Support',
          email: 'it@bantuan-sosial.gov.id',
          whatsapp: '+62 812 4444 4444',
          categories: ['Teknis']
        }
      ]
    };
  }

  // Save settings to database
  async saveSettings(settings) {
    try {
      const response = await forwardingAPI.updateSettings(settings);
      this.settings = await this.loadSettings();
      return response.data;
    } catch (error) {
      console.error('Error saving settings to database:', error);
      throw error;
    }
  }

  // Get current settings
  async getSettings() {
    try {
      this.settings = await this.loadSettings();
      return this.settings;
    } catch (error) {
      console.error('Error getting settings:', error);
      return this.getDefaultSettings();
    }
  }

  // Update specific setting
  async updateSetting(key, value) {
    try {
      const updateData = { [key]: value };
      await forwardingAPI.updateSettings(updateData);
      this.settings = await this.loadSettings();
      return this.settings;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  }

  // Get department by category
  async getDepartmentByCategory(category) {
    try {
      const response = await forwardingAPI.getDepartmentByCategory(category);
      return response.data.data;
    } catch (error) {
      console.error('Error getting department by category:', error);
      return null;
    }
  }

  // Get all departments
  async getDepartments() {
    try {
      const response = await forwardingAPI.getDepartments();
      return response.data.data;
    } catch (error) {
      console.error('Error getting departments:', error);
      return [];
    }
  }

  // Add department
  async addDepartment(department) {
    try {
      console.log('🔧 Adding department via API:', department);
      const response = await forwardingAPI.createDepartment(department);
      console.log('✅ Department added successfully:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error adding department:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }

  // Update department
  async updateDepartment(id, updates) {
    try {
      console.log('Updating department:', id, updates);
      const response = await forwardingAPI.updateDepartment(id, updates);
      console.log('Department updated:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  }

  // Remove department
  async removeDepartment(id) {
    try {
      await forwardingAPI.deleteDepartment(id);
      return true;
    } catch (error) {
      console.error('Error removing department:', error);
      throw error;
    }
  }

  // Forward complaint to department
  async forwardComplaint(complaint, options = {}) {
    const { 
      departmentId, 
      customMessage, 
      forceEmail = false, 
      forceWhatsapp = false 
    } = options;

    try {
      let targetDepartment;
      
      if (departmentId) {
        // Manual forwarding to specific department
        targetDepartment = this.settings.departments.find(dept => dept.id === departmentId);
      } else {
        // Auto forwarding based on category
        targetDepartment = this.getDepartmentByCategory(complaint.kategori);
      }

      if (!targetDepartment) {
        throw new Error('Tidak dapat menentukan dinas tujuan');
      }

      const results = [];

      // Send email if enabled
      if (this.settings.emailForwarding || forceEmail) {
        const emailResult = await this.sendEmail(complaint, targetDepartment, customMessage);
        results.push({ type: 'email', success: emailResult.success, message: emailResult.message });
      }

      // Send WhatsApp if enabled
      if (this.settings.whatsappForwarding || forceWhatsapp) {
        const whatsappResult = await this.sendWhatsApp(complaint, targetDepartment, customMessage);
        results.push({ type: 'whatsapp', success: whatsappResult.success, message: whatsappResult.message });
      }

      // Log forwarding activity
      this.logForwardingActivity(complaint, targetDepartment, results);

      return {
        success: true,
        department: targetDepartment,
        results: results,
        message: `Pengaduan berhasil diteruskan ke ${targetDepartment.name}`
      };

    } catch (error) {
      console.error('Error forwarding complaint:', error);
      return {
        success: false,
        error: error.message,
        message: 'Gagal meneruskan pengaduan'
      };
    }
  }

  // Send email (REAL IMPLEMENTATION)
  async sendEmail(complaint, department, customMessage) {
    try {
      const subject = `[PENGADUAN] ${complaint.judul}`;
      const message = customMessage || this.generateDefaultMessage(complaint);
      
      // Prepare email data
      const emailData = {
        to: department.email,
        subject: subject,
        message: message,
        complaint_id: complaint.id,
        department_name: department.name,
        priority: complaint.prioritas || 'Normal'
      };
      
      console.log('📧 Mengirim email real ke:', department.email);
      
      // Send real email via API
      const response = await emailAPI.sendComplaintEmail(emailData);
      
      console.log('📧 Email berhasil dikirim:', response.data);
      
      return {
        success: true,
        message: `✅ Email berhasil dikirim ke ${department.email}`,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error mengirim email:', error);
      
      // Handle different error types
      if (error.response?.status === 500) {
        return {
          success: false,
          message: `❌ Gagal mengirim email ke ${department.email}:\n\n${error.response?.data?.message || 'Server error'}\n\n💡 Kemungkinan penyebab:\n- Konfigurasi SMTP belum benar\n- Email server tidak dapat diakses\n- Kredensial email salah`
        };
      } else if (error.response?.status === 422) {
        return {
          success: false,
          message: `❌ Data email tidak valid:\n\n${JSON.stringify(error.response?.data?.errors, null, 2)}`
        };
      } else {
        return {
          success: false,
          message: `❌ Gagal mengirim email: ${error.message}`
        };
      }
    }
  }

  // Send WhatsApp
  async sendWhatsApp(complaint, department, customMessage) {
    try {
      // Simulate WhatsApp sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const message = customMessage || this.generateDefaultMessage(complaint);
      
      // Log untuk debugging
      console.log('📱 SIMULASI WHATSAPP BERHASIL');
      console.log('📱 Tujuan:', department.whatsapp);
      console.log('📱 Message:', message);
      console.log('📱 CATATAN: Ini adalah simulasi. Untuk WhatsApp sungguhan, integrasikan dengan WhatsApp API.');
      
      return {
        success: true,
        message: `✅ SIMULASI: WhatsApp berhasil dikirim ke ${department.whatsapp}\n\n⚠️ CATATAN: Ini adalah simulasi. Pesan tidak benar-benar dikirim.\n\nUntuk implementasi nyata, perlu konfigurasi:\n- WhatsApp Business API\n- WhatsApp Cloud API\n- Twilio WhatsApp API\n- API dari penyedia layanan lainnya`
      };
    } catch (error) {
      return {
        success: false,
        message: `Gagal mengirim WhatsApp: ${error.message}`
      };
    }
  }

  // Generate default message
  generateDefaultMessage(complaint) {
    return `
🚨 PENGADUAN BARU

Judul: ${complaint.judul}
Kategori: ${complaint.kategori}
Prioritas: ${complaint.prioritas}
Tanggal: ${new Date(complaint.tanggal).toLocaleDateString('id-ID')}
Pelapor: ${complaint.nama}

Deskripsi:
${complaint.deskripsi}

Lokasi: ${complaint.lokasi || 'Tidak disebutkan'}

Mohon segera ditindaklanjuti.

---
Sistem Bantuan Sosial
${new Date().toLocaleString('id-ID')}
    `.trim();
  }

  // Log forwarding activity
  logForwardingActivity(complaint, department, results) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      complaintId: complaint.id,
      complaintTitle: complaint.judul,
      departmentId: department.id,
      departmentName: department.name,
      results: results
    };

    // Get existing logs
    const logs = JSON.parse(localStorage.getItem('forwardingLogs') || '[]');
    logs.push(logEntry);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('forwardingLogs', JSON.stringify(logs));
  }

  // Get forwarding logs
  getForwardingLogs() {
    return JSON.parse(localStorage.getItem('forwardingLogs') || '[]');
  }

  // Test forwarding (for admin testing)
  async testForwarding(type, recipient) {
    try {
      if (type === 'email') {
        console.log('📧 Mengirim test email ke:', recipient);
        
        const testEmailData = {
          to: recipient,
          type: 'admin'
        };
        
        const response = await emailAPI.sendTestEmail(testEmailData);
        
        console.log('📧 Test email berhasil dikirim:', response.data);
        
        return {
          success: true,
          message: `✅ Test email berhasil dikirim ke ${recipient}!\n\n🔍 Silakan cek inbox email Anda.\n\n⚠️ Jika tidak ada email yang masuk:\n- Cek folder spam/junk\n- Pastikan konfigurasi SMTP sudah benar\n- Periksa log Laravel untuk error details`
        };
      } else if (type === 'whatsapp') {
        // WhatsApp masih simulasi (akan diubah nanti)
        const testComplaint = {
          id: 'test-' + Date.now(),
          judul: 'Test Pengaduan WhatsApp',
          kategori: 'Teknis',
          prioritas: 'Normal',
          tanggal: new Date().toISOString(),
          nama: 'Administrator',
          deskripsi: 'Ini adalah test pengaduan untuk menguji sistem forwarding WhatsApp.',
          lokasi: 'Kantor Pusat'
        };
        
        return await this.sendWhatsApp(testComplaint, { whatsapp: recipient, name: 'Test Department' });
      }

      return { success: false, message: 'Tipe test tidak valid' };
    } catch (error) {
      console.error('❌ Error test forwarding:', error);
      
      if (error.response?.status === 500) {
        return {
          success: false,
          message: `❌ Gagal mengirim test email ke ${recipient}:\n\n${error.response?.data?.message || 'Server error'}\n\n💡 Kemungkinan penyebab:\n- Konfigurasi SMTP belum benar\n- Email server tidak dapat diakses\n- Kredensial email salah`
        };
      } else {
        return {
          success: false,
          message: `❌ Gagal mengirim test: ${error.message}`
        };
      }
    }
  }

  // Send notification to admin
  async notifyAdmin(complaint, priority = 'normal') {
    const results = [];

    // Send to admin email
    if (this.settings.adminEmail) {
      const emailResult = await this.sendEmail(
        complaint, 
        { email: this.settings.adminEmail, name: 'Administrator' },
        this.generateAdminNotificationMessage(complaint, priority)
      );
      results.push({ type: 'admin_email', ...emailResult });
    }

    // Send to admin WhatsApp
    if (this.settings.adminWhatsapp) {
      const whatsappResult = await this.sendWhatsApp(
        complaint, 
        { whatsapp: this.settings.adminWhatsapp, name: 'Administrator' },
        this.generateAdminNotificationMessage(complaint, priority)
      );
      results.push({ type: 'admin_whatsapp', ...whatsappResult });
    }

    return results;
  }

  // Generate admin notification message
  generateAdminNotificationMessage(complaint, priority) {
    const priorityEmoji = priority === 'high' ? '🚨' : priority === 'medium' ? '⚠️' : 'ℹ️';
    
    return `
${priorityEmoji} NOTIFIKASI ADMIN

Pengaduan baru telah masuk:

ID: ${complaint.id}
Judul: ${complaint.judul}
Kategori: ${complaint.kategori}
Prioritas: ${complaint.prioritas}
Pelapor: ${complaint.nama}

${priority === 'high' ? '⚠️ PERHATIAN: Pengaduan ini memerlukan penanganan segera!' : ''}

Silakan cek dashboard untuk detail lengkap.

---
Sistem Bantuan Sosial
${new Date().toLocaleString('id-ID')}
    `.trim();
  }

  // Real email implementation (untuk referensi)
  async sendEmailReal(complaint, department, customMessage) {
    try {
      const subject = `[PENGADUAN] ${complaint.judul}`;
      const message = customMessage || this.generateDefaultMessage(complaint);
      
      // Contoh implementasi dengan backend API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          to: department.email,
          subject: subject,
          message: message,
          complaint_id: complaint.id
        })
      });
      
      if (!response.ok) {
        throw new Error('Email sending failed');
      }
      
      return {
        success: true,
        message: `Email berhasil dikirim ke ${department.email}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Gagal mengirim email: ${error.message}`
      };
    }
  }

  // Real WhatsApp implementation (untuk referensi)
  async sendWhatsAppReal(complaint, department, customMessage) {
    try {
      const message = customMessage || this.generateDefaultMessage(complaint);
      
      // Contoh implementasi dengan WhatsApp API
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          to: department.whatsapp,
          message: message,
          complaint_id: complaint.id
        })
      });
      
      if (!response.ok) {
        throw new Error('WhatsApp sending failed');
      }
      
      return {
        success: true,
        message: `WhatsApp berhasil dikirim ke ${department.whatsapp}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Gagal mengirim WhatsApp: ${error.message}`
      };
    }
  }
}

// Export singleton instance
export default new ComplaintForwardingService();