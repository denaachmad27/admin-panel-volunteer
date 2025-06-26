import React, { useState } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, AlertTriangle, User, Calendar, MapPin, Phone, Mail, Eye, MessageCircle, Filter, Search, AlertCircle } from 'lucide-react';
import ProtectedDashboardLayout from '../components/layout/ProtectedDashboardLayout';
import { Card } from '../components/ui/UIComponents';

const PengaduanPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Mock data untuk pengaduan
  const complaints = [
    {
      id: 1,
      title: 'Jalan Rusak di RT 05 RW 02',
      description: 'Jalan di depan rumah saya sudah rusak parah dengan banyak lubang. Mohon segera diperbaiki karena sangat berbahaya untuk kendaraan.',
      complainant: {
        name: 'Ahmad Santoso',
        phone: '081234567890',
        email: 'ahmad.santoso@email.com',
        address: 'Jl. Merdeka No. 15, RT 05/RW 02'
      },
      category: 'Infrastruktur',
      priority: 'high',
      status: 'pending',
      submitDate: '2024-01-15',
      responseDate: null,
      assignedTo: null,
      location: 'RT 05/RW 02, Kelurahan Merdeka',
      attachments: ['foto_jalan_rusak.jpg']
    },
    {
      id: 2,
      title: 'Lampu Jalan Mati Sejak Seminggu',
      description: 'Lampu jalan di area perumahan sudah mati sejak seminggu yang lalu. Kondisi sangat gelap di malam hari dan rawan kejahatan.',
      complainant: {
        name: 'Siti Nurhaliza',
        phone: '081234567891',
        email: 'siti.nur@email.com',
        address: 'Jl. Kenanga No. 23, RT 03/RW 01'
      },
      category: 'Penerangan',
      priority: 'medium',
      status: 'in_progress',
      submitDate: '2024-01-12',
      responseDate: '2024-01-13',
      assignedTo: 'Tim Teknis Listrik',
      location: 'RT 03/RW 01, Kelurahan Kenanga',
      attachments: []
    },
    {
      id: 3,
      title: 'Saluran Air Tersumbat',
      description: 'Saluran air di depan rumah tersumbat sampah sehingga air menggenang. Kondisi ini sudah berlangsung 3 hari.',
      complainant: {
        name: 'Budi Hermawan',
        phone: '081234567892',
        email: 'budi.h@email.com',
        address: 'Jl. Melati No. 8, RT 02/RW 03'
      },
      category: 'Sanitasi',
      priority: 'medium',
      status: 'resolved',
      submitDate: '2024-01-10',
      responseDate: '2024-01-11',
      assignedTo: 'Tim Kebersihan',
      location: 'RT 02/RW 03, Kelurahan Melati',
      attachments: ['foto_saluran.jpg', 'foto_after.jpg']
    },
    {
      id: 4,
      title: 'Pohon Tumbang Menghalangi Jalan',
      description: 'Ada pohon besar yang tumbang akibat angin kencang kemarin malam. Pohon ini menghalangi akses jalan utama.',
      complainant: {
        name: 'Dewi Sartika',
        phone: '081234567893',
        email: 'dewi.sartika@email.com',
        address: 'Jl. Raya Utama No. 45, RT 01/RW 04'
      },
      category: 'Infrastruktur',
      priority: 'high',
      status: 'pending',
      submitDate: '2024-01-14',
      responseDate: null,
      assignedTo: null,
      location: 'RT 01/RW 04, Jalan Raya Utama',
      attachments: ['pohon_tumbang.jpg']
    },
    {
      id: 5,
      title: 'Kebisingan dari Pabrik',
      description: 'Pabrik di dekat rumah mengeluarkan suara bising yang mengganggu, terutama pada malam hari. Sudah berlangsung selama 2 minggu.',
      complainant: {
        name: 'Rini Marlina',
        phone: '081234567894',
        email: 'rini.marlina@email.com',
        address: 'Jl. Industri No. 12, RT 06/RW 02'
      },
      category: 'Lingkungan',
      priority: 'medium',
      status: 'in_progress',
      submitDate: '2024-01-08',
      responseDate: '2024-01-09',
      assignedTo: 'Tim Lingkungan Hidup',
      location: 'RT 06/RW 02, Kawasan Industri',
      attachments: []
    }
  ];

  const categories = [
    'Infrastruktur',
    'Penerangan',
    'Sanitasi',
    'Lingkungan',
    'Keamanan',
    'Sosial'
  ];

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        label: 'Menunggu', 
        icon: Clock 
      },
      in_progress: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        label: 'Diproses', 
        icon: MessageCircle 
      },
      resolved: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Selesai', 
        icon: CheckCircle 
      },
      rejected: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        label: 'Ditolak', 
        icon: XCircle 
      }
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { bg: 'bg-red-100', text: 'text-red-800', label: 'Tinggi' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Sedang' },
      low: { bg: 'bg-green-100', text: 'text-green-800', label: 'Rendah' }
    };
    return configs[priority] || configs.medium;
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
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.complainant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || complaint.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  return (
    <ProtectedDashboardLayout
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
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <MessageCircle className="w-6 h-6 text-blue-600" />
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
                { id: 'pending', label: 'Menunggu' },
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
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-slate-900 hover:text-orange-600 cursor-pointer">
                        {complaint.title}
                      </h3>
                      {getStatusBadge(complaint.status)}
                      {getPriorityBadge(complaint.priority)}
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {complaint.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {complaint.complainant.name}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {complaint.complainant.phone}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {complaint.location}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(complaint.submitDate).toLocaleDateString('id-ID')}
                        </div>
                        <div className="flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {complaint.category}
                        </div>
                        {complaint.assignedTo && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            Ditangani: {complaint.assignedTo}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      onClick={() => setSelectedComplaint(complaint)}
                      className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
              const complaintCount = complaints.filter(complaint => complaint.category === category).length;
              const colors = [
                'bg-orange-100 text-orange-800',
                'bg-blue-100 text-blue-800', 
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
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <MessageCircle className="w-6 h-6 text-blue-600" />
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

        {/* Temporary Page Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Halaman Sementara</p>
              <p className="text-sm text-yellow-700 mt-1">
                Ini adalah halaman sementara untuk menu Pengaduan. Fitur lengkap sedang dalam pengembangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
};

export default PengaduanPage;