import React, { useState } from 'react';
import { FileText, Plus, Eye, Edit3, CheckCircle, XCircle, Clock, User, Calendar, MapPin, Phone, Mail, Search, Filter, AlertCircle, Download } from 'lucide-react';
import ProtectedDashboardLayout from '../components/layout/ProtectedDashboardLayout';
import { Card } from '../components/ui/UIComponents';

const PendaftaranPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');

  // Mock data untuk pendaftaran
  const registrations = [
    {
      id: 1,
      applicantName: 'Ahmad Santoso',
      email: 'ahmad.santoso@email.com',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 15, RT 05/RW 02',
      program: 'Bantuan Pangan',
      submitDate: '2024-01-15',
      status: 'pending',
      documents: ['KTP', 'KK', 'Surat Keterangan'],
      notes: 'Keluarga dengan 3 anak, suami pengangguran',
      score: null,
      reviewedBy: null,
      reviewDate: null
    },
    {
      id: 2,
      applicantName: 'Siti Nurhaliza',
      email: 'siti.nur@email.com',
      phone: '081234567891',
      address: 'Jl. Kenanga No. 23, RT 03/RW 01',
      program: 'Bantuan Pendidikan',
      submitDate: '2024-01-12',
      status: 'approved',
      documents: ['KTP', 'KK', 'Ijazah', 'Surat Sekolah'],
      notes: 'Anak berprestasi, keluarga kurang mampu',
      score: 85,
      reviewedBy: 'Admin Pendidikan',
      reviewDate: '2024-01-13'
    },
    {
      id: 3,
      applicantName: 'Budi Hermawan',
      email: 'budi.h@email.com',
      phone: '081234567892',
      address: 'Jl. Melati No. 8, RT 02/RW 03',
      program: 'Bantuan Kesehatan',
      submitDate: '2024-01-10',
      status: 'rejected',
      documents: ['KTP', 'KK'],
      notes: 'Riwayat penyakit kronis, biaya pengobatan tinggi',
      score: 45,
      reviewedBy: 'Admin Kesehatan',
      reviewDate: '2024-01-11'
    },
    {
      id: 4,
      applicantName: 'Dewi Sartika',
      email: 'dewi.sartika@email.com',
      phone: '081234567893',
      address: 'Jl. Raya Utama No. 45, RT 01/RW 04',
      program: 'Bantuan Usaha',
      submitDate: '2024-01-14',
      status: 'under_review',
      documents: ['KTP', 'KK', 'Proposal Usaha'],
      notes: 'Usaha mikro warung kelontong, modal terbatas',
      score: null,
      reviewedBy: 'Tim Verifikasi',
      reviewDate: null
    },
    {
      id: 5,
      applicantName: 'Rini Marlina',
      email: 'rini.marlina@email.com',
      phone: '081234567894',
      address: 'Jl. Industri No. 12, RT 06/RW 02',
      program: 'Bantuan Pangan',
      submitDate: '2024-01-08',
      status: 'pending',
      documents: ['KTP', 'KK'],
      notes: 'Ibu tunggal dengan 2 anak balita',
      score: null,
      reviewedBy: null,
      reviewDate: null
    }
  ];

  const programs = [
    { value: 'all', label: 'Semua Program' },
    { value: 'Bantuan Pangan', label: 'Bantuan Pangan' },
    { value: 'Bantuan Pendidikan', label: 'Bantuan Pendidikan' },
    { value: 'Bantuan Kesehatan', label: 'Bantuan Kesehatan' },
    { value: 'Bantuan Usaha', label: 'Bantuan Usaha' }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        label: 'Menunggu', 
        icon: Clock 
      },
      under_review: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        label: 'Direview', 
        icon: Eye 
      },
      approved: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Disetujui', 
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

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reg.phone.includes(searchQuery);
    const matchesTab = activeTab === 'all' || reg.status === activeTab;
    const matchesProgram = selectedProgram === 'all' || reg.program === selectedProgram;
    return matchesSearch && matchesTab && matchesProgram;
  });

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    under_review: registrations.filter(r => r.status === 'under_review').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length
  };

  return (
    <ProtectedDashboardLayout
      currentPage="bantuan"
      pageTitle="Pendaftaran Bantuan"
      breadcrumbs={['Bantuan Sosial', 'Pendaftaran']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Pendaftaran Bantuan Sosial</h1>
              <p className="text-emerald-100">Kelola pendaftaran dan aplikasi bantuan sosial</p>
            </div>
            <div className="hidden md:block">
              <FileText className="w-16 h-16 text-emerald-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-emerald-100 mr-4">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-600">Total</p>
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
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.under_review}</p>
                <p className="text-sm text-slate-600">Review</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.approved}</p>
                <p className="text-sm text-slate-600">Disetujui</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.rejected}</p>
                <p className="text-sm text-slate-600">Ditolak</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Daftar Pendaftaran</h2>
              <p className="text-sm text-slate-600 mt-1">Kelola semua pendaftaran bantuan sosial</p>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pendaftaran
              </button>
              <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-6 border-b border-slate-200">
            {/* Search and Program Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari pendaftar (nama, email, telepon)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <select 
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {programs.map(program => (
                  <option key={program.value} value={program.value}>{program.label}</option>
                ))}
              </select>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'pending', label: 'Menunggu' },
                { id: 'under_review', label: 'Review' },
                { id: 'approved', label: 'Disetujui' },
                { id: 'rejected', label: 'Ditolak' }
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

          {/* Registrations Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Pendaftar</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Program</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-900">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-900">Tanggal</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-900">Dokumen</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRegistrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-slate-50 transition-colors">
                    {/* Applicant Info */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{registration.applicantName}</div>
                        <div className="text-xs text-slate-500">{registration.email}</div>
                        <div className="text-xs text-slate-500">{registration.phone}</div>
                      </div>
                    </td>
                    
                    {/* Program */}
                    <td className="py-3 px-4">
                      <div className="text-sm text-slate-900">{registration.program}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">
                        {registration.notes}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(registration.status)}
                      {registration.score && (
                        <div className="text-xs text-slate-500 mt-1">
                          Score: {registration.score}
                        </div>
                      )}
                    </td>
                    
                    {/* Date */}
                    <td className="py-3 px-4 text-center">
                      <div className="text-sm text-slate-900">
                        {new Date(registration.submitDate).toLocaleDateString('id-ID')}
                      </div>
                      {registration.reviewDate && (
                        <div className="text-xs text-slate-500">
                          Review: {new Date(registration.reviewDate).toLocaleDateString('id-ID')}
                        </div>
                      )}
                    </td>
                    
                    {/* Documents */}
                    <td className="py-3 px-4 text-center">
                      <div className="text-sm text-slate-900">{registration.documents.length} file</div>
                      <div className="text-xs text-slate-500">
                        {registration.documents.join(', ')}
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-1">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Lihat Detail">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {registration.status === 'pending' && (
                          <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Verifikasi">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Menampilkan {filteredRegistrations.length} dari {registrations.length} pendaftaran
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-md">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-emerald-100 mr-4">
                <Plus className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Pendaftaran Baru</h3>
                <p className="text-sm text-slate-600">Tambah pendaftaran manual</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Review Batch</h3>
                <p className="text-sm text-slate-600">Review multiple aplikasi</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Laporan Pendaftaran</h3>
                <p className="text-sm text-slate-600">Export data pendaftaran</p>
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
                Ini adalah halaman sementara untuk submenu Pendaftaran. Fitur lengkap sedang dalam pengembangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
};

export default PendaftaranPage;