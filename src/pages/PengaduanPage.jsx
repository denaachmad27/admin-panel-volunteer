import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, AlertTriangle, User, Calendar, MapPin, Phone, Mail, Eye, MessageCircle, Filter, Search, AlertCircle, RefreshCw, Send } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import { complaintAPI } from '../services/api';
import ComplaintDetailModal from '../components/modals/ComplaintDetailModal';
import complaintForwardingService from '../services/complaintForwardingService';

const PengaduanPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickForwardComplaint, setQuickForwardComplaint] = useState(null);

  // Load data from API
  useEffect(() => {
    loadComplaints();
    loadStatistics();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintAPI.getAll();
      setComplaints(response.data.data?.data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading complaints:', err);
      setError('Gagal memuat data pengaduan');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await complaintAPI.getStatistics();
      setStatistics(response.data.data);
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  const handleRefresh = () => {
    loadComplaints();
    loadStatistics();
  };

  const categories = [
    'Teknis',
    'Pelayanan', 
    'Bantuan',
    'Saran',
    'Lainnya'
  ];

  const getStatusConfig = (status) => {
    const configs = {
      'Baru': { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        label: 'Baru', 
        icon: AlertTriangle 
      },
      'Diproses': { 
        bg: 'bg-orange-100', 
        text: 'text-orange-800', 
        label: 'Diproses', 
        icon: MessageCircle 
      },
      'Selesai': { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Selesai', 
        icon: CheckCircle 
      },
      'Ditutup': { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800', 
        label: 'Ditutup', 
        icon: XCircle 
      }
    };
    return configs[status] || configs['Baru'];
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      'Urgent': { bg: 'bg-red-100', text: 'text-red-800', label: 'Urgent' },
      'Tinggi': { bg: 'bg-red-100', text: 'text-red-800', label: 'Tinggi' },
      'Sedang': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Sedang' },
      'Rendah': { bg: 'bg-green-100', text: 'text-green-800', label: 'Rendah' }
    };
    return configs[priority] || configs['Sedang'];
  };

  const handleQuickForward = async (complaint) => {
    try {
      const department = await complaintForwardingService.getDepartmentByCategory(complaint.kategori);
      
      if (!department) {
        alert(`Tidak ada dinas yang terkonfigurasi untuk kategori "${complaint.kategori}". Silakan gunakan forward manual.`);
        return;
      }

      const confirmed = window.confirm(`Forward pengaduan "${complaint.judul}" ke ${department.name}?`);
      if (confirmed) {
        const result = await complaintForwardingService.forwardComplaint(complaint);
        
        if (result.success) {
          alert(`✅ ${result.message}\n\nDetail:\n${result.results.map(r => `• ${r.type}: ${r.message}`).join('\n')}`);
          
          // Notify admin if high priority
          if (complaint.prioritas === 'Tinggi') {
            await complaintForwardingService.notifyAdmin(complaint, 'high');
          }
        } else {
          alert(`❌ ${result.message}`);
        }
      }
    } catch (error) {
      console.error('Error in quick forward:', error);
      alert('Gagal meneruskan pengaduan. Silakan coba lagi.');
    }
  };

  const getStatusBadge = (status) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = getPriorityConfig(priority);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'pending') {
      matchesTab = complaint.status === 'Baru';
    } else if (activeTab === 'in_progress') {
      matchesTab = complaint.status === 'Diproses';
    } else if (activeTab === 'resolved') {
      matchesTab = complaint.status === 'Selesai';
    }
    
    return matchesSearch && matchesTab;
  });

  const stats = statistics ? {
    total: statistics.overview?.total_complaint || 0,
    pending: statistics.overview?.baru || 0,
    in_progress: statistics.overview?.diproses || 0,
    resolved: statistics.overview?.selesai || 0
  } : {
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0
  };

  return (
    <DashboardLayout
      currentPage="complaints"
      pageTitle="Pengaduan"
      breadcrumbs={['Pengaduan']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Pengaduan Masyarakat</h1>
              <p className="text-orange-100">Kelola dan tanggapi pengaduan dari masyarakat</p>
            </div>
            <div className="hidden md:block">
              <MessageSquare className="w-16 h-16 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-600">Total Pengaduan</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                <p className="text-sm text-slate-600">Menunggu</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.in_progress}</p>
                <p className="text-sm text-slate-600">Diproses</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
                <p className="text-sm text-slate-600">Selesai</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Daftar Pengaduan</h2>
                <p className="text-sm text-slate-600 mt-1">Kelola semua pengaduan masyarakat</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="mt-2 sm:mt-0 inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-6 border-b border-slate-200">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari pengaduan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'pending', label: 'Baru' },
                { id: 'in_progress', label: 'Diproses' },
                { id: 'resolved', label: 'Selesai' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Complaints List */}
          <div className="divide-y divide-slate-200">
            {loading ? (
              <div className="p-6 text-center">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                <p className="text-slate-600">Memuat data pengaduan...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Coba Lagi
                </button>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                <p className="text-slate-600">Tidak ada pengaduan yang ditemukan</p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      {/* Image thumbnail */}
                      {complaint.image_path && (
                        <div className="flex-shrink-0">
                          <img
                            src={`http://127.0.0.1:8000/storage/${complaint.image_path}`}
                            alt="Complaint"
                            className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                            onError={(e) => {
                              console.log('Image failed to load:', `http://127.0.0.1:8000/storage/${complaint.image_path}`);
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 
                            className="text-lg font-medium text-slate-900 hover:text-orange-600 cursor-pointer"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            {complaint.judul}
                          </h3>
                          {getStatusBadge(complaint.status)}
                          {getPriorityBadge(complaint.prioritas)}
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-xs text-slate-500 font-medium">
                            Tiket: {complaint.no_tiket}
                          </span>
                        </div>
                        
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                          {complaint.deskripsi}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {complaint.user?.name || 'N/A'}
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {complaint.user?.email || 'N/A'}
                            </div>
                            <div className="flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              {complaint.kategori}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(complaint.created_at).toLocaleDateString('id-ID')}
                            </div>
                            {complaint.tanggal_respon && (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Direspon: {new Date(complaint.tanggal_respon).toLocaleDateString('id-ID')}
                              </div>
                            )}
                            {complaint.respon_admin && (
                              <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Ada Respon Admin
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => handleQuickForward(complaint)}
                        className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Quick Forward ke Dinas"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setSelectedComplaint(complaint)}
                        className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Lihat Detail & Tanggapi"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Menampilkan {filteredComplaints.length} dari {complaints.length} pengaduan
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-orange-600 text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50">
                  2
                </button>
                <button className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Categories Overview */}
        <Card title="Kategori Pengaduan" subtitle="Distribusi pengaduan berdasarkan kategori">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category, index) => {
              const complaintCount = statistics?.by_category?.[category] || 0;
              const colors = [
                'bg-orange-100 text-orange-800',
                'bg-orange-100 text-orange-800', 
                'bg-green-100 text-green-800',
                'bg-purple-100 text-purple-800',
                'bg-red-100 text-red-800',
                'bg-yellow-100 text-yellow-800'
              ];
              
              return (
                <div key={category} className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900">{category}</h4>
                      <p className="text-sm text-slate-600">{complaintCount} pengaduan</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[index % colors.length]}`}>
                      {complaintCount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Pengaduan Prioritas</h3>
                <p className="text-sm text-slate-600">Lihat pengaduan prioritas tinggi</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Respon Cepat</h3>
                <p className="text-sm text-slate-600">Template respon otomatis</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Laporan Penyelesaian</h3>
                <p className="text-sm text-slate-600">Laporan pengaduan selesai</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Complaint Detail Modal */}
        <ComplaintDetailModal
          complaint={selectedComplaint}
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusUpdate={() => {
            console.log('Status updated, refreshing data...');
            handleRefresh();
            // Don't close the modal immediately, let the modal handle it
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default PengaduanPage;