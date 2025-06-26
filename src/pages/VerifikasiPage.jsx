import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Clock, User, FileText, MapPin, Phone, Calendar, Star, ThumbsUp, ThumbsDown, MessageSquare, AlertTriangle, AlertCircle } from 'lucide-react';
import ProtectedDashboardLayout from '../components/layout/ProtectedDashboardLayout';
import { Card } from '../components/ui/UIComponents';

const VerifikasiPage = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [selectedScore, setSelectedScore] = useState(0);

  // Mock data untuk aplikasi yang perlu diverifikasi
  const applicationsToVerify = [
    {
      id: 1,
      applicantName: 'Ahmad Santoso',
      email: 'ahmad.santoso@email.com',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 15, RT 05/RW 02, Kelurahan Merdeka',
      program: 'Bantuan Pangan',
      submitDate: '2024-01-15',
      documents: [
        { name: 'KTP', status: 'valid', notes: 'Dokumen lengkap dan sesuai' },
        { name: 'Kartu Keluarga', status: 'valid', notes: 'Data keluarga sesuai' },
        { name: 'Surat Keterangan Tidak Mampu', status: 'needs_review', notes: 'Perlu konfirmasi dengan RT' }
      ],
      familyData: {
        totalMembers: 5,
        children: 3,
        workingMembers: 1,
        monthlyIncome: 1500000,
        expenses: 2000000
      },
      verificationCriteria: {
        income: { score: 8, max: 10, notes: 'Pendapatan di bawah garis kemiskinan' },
        family: { score: 9, max: 10, notes: 'Keluarga besar dengan tanggungan banyak' },
        documents: { score: 7, max: 10, notes: 'Dokumen lengkap, 1 perlu konfirmasi' },
        location: { score: 8, max: 10, notes: 'Lokasi sesuai dengan program' }
      },
      notes: 'Keluarga dengan 3 anak, suami bekerja serabutan. Kondisi rumah sederhana, layak mendapat bantuan.',
      priority: 'high',
      fieldVerification: {
        completed: true,
        date: '2024-01-16',
        verifier: 'Tim Lapangan A',
        photos: ['rumah_depan.jpg', 'kondisi_dalam.jpg'],
        notes: 'Kondisi rumah sesuai dengan aplikasi, keluarga benar-benar membutuhkan bantuan'
      }
    },
    {
      id: 2,
      applicantName: 'Dewi Sartika',
      email: 'dewi.sartika@email.com',
      phone: '081234567893',
      address: 'Jl. Raya Utama No. 45, RT 01/RW 04, Kelurahan Mawar',
      program: 'Bantuan Usaha',
      submitDate: '2024-01-14',
      documents: [
        { name: 'KTP', status: 'valid', notes: 'Dokumen valid' },
        { name: 'Kartu Keluarga', status: 'valid', notes: 'Data keluarga sesuai' },
        { name: 'Proposal Usaha', status: 'valid', notes: 'Proposal detail dan realistis' },
        { name: 'Surat Ijin Usaha', status: 'needs_review', notes: 'Surat masih dalam proses' }
      ],
      familyData: {
        totalMembers: 3,
        children: 1,
        workingMembers: 1,
        monthlyIncome: 2000000,
        expenses: 1800000
      },
      verificationCriteria: {
        income: { score: 6, max: 10, notes: 'Pendapatan cukup tapi perlu modal usaha' },
        family: { score: 6, max: 10, notes: 'Keluarga kecil dengan tanggungan sedikit' },
        documents: { score: 8, max: 10, notes: 'Dokumen lengkap dan proposal bagus' },
        business: { score: 9, max: 10, notes: 'Rencana usaha sangat realistis' }
      },
      notes: 'Usaha mikro warung kelontong, modal terbatas. Lokasi strategis dan memiliki pengalaman.',
      priority: 'medium',
      fieldVerification: {
        completed: false,
        date: null,
        verifier: null,
        photos: [],
        notes: 'Menunggu jadwal verifikasi lapangan'
      }
    },
    {
      id: 3,
      applicantName: 'Rini Marlina',
      email: 'rini.marlina@email.com',
      phone: '081234567894',
      address: 'Jl. Industri No. 12, RT 06/RW 02, Kelurahan Dahlia',
      program: 'Bantuan Pangan',
      submitDate: '2024-01-08',
      documents: [
        { name: 'KTP', status: 'valid', notes: 'Dokumen valid' },
        { name: 'Kartu Keluarga', status: 'valid', notes: 'Status janda dengan 2 anak' },
        { name: 'Surat Kematian Suami', status: 'valid', notes: 'Dokumen lengkap' }
      ],
      familyData: {
        totalMembers: 3,
        children: 2,
        workingMembers: 0,
        monthlyIncome: 800000,
        expenses: 1500000
      },
      verificationCriteria: {
        income: { score: 10, max: 10, notes: 'Tidak ada penghasilan tetap' },
        family: { score: 9, max: 10, notes: 'Ibu tunggal dengan 2 anak balita' },
        documents: { score: 9, max: 10, notes: 'Dokumen lengkap dan valid' },
        location: { score: 8, max: 10, notes: 'Lokasi sesuai dengan program' }
      },
      notes: 'Ibu tunggal dengan 2 anak balita. Suami meninggal tahun lalu, tidak ada penghasilan tetap.',
      priority: 'high',
      fieldVerification: {
        completed: true,
        date: '2024-01-10',
        verifier: 'Tim Lapangan B',
        photos: ['rumah_rini.jpg', 'kondisi_anak.jpg'],
        notes: 'Kondisi sangat memprihatinkan, sangat membutuhkan bantuan segera'
      }
    }
  ];

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'valid': return 'text-green-600 bg-green-100';
      case 'needs_review': return 'text-yellow-600 bg-yellow-100';
      case 'invalid': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateTotalScore = (criteria) => {
    const scores = Object.values(criteria);
    const totalScore = scores.reduce((sum, item) => sum + item.score, 0);
    const maxScore = scores.reduce((sum, item) => sum + item.max, 0);
    return { totalScore, maxScore, percentage: Math.round((totalScore / maxScore) * 100) };
  };

  const handleApprove = (applicationId) => {
    console.log('Menyetujui aplikasi:', applicationId);
    // Implementation for approval
  };

  const handleReject = (applicationId) => {
    console.log('Menolak aplikasi:', applicationId);
    // Implementation for rejection
  };

  return (
    <ProtectedDashboardLayout
      currentPage="bantuan"
      pageTitle="Verifikasi Bantuan"
      breadcrumbs={['Bantuan Sosial', 'Verifikasi']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Verifikasi Bantuan Sosial</h1>
              <p className="text-indigo-100">Review dan verifikasi aplikasi bantuan sosial</p>
            </div>
            <div className="hidden md:block">
              <CheckCircle className="w-16 h-16 text-indigo-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 mr-4">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{applicationsToVerify.length}</p>
                <p className="text-sm text-slate-600">Perlu Verifikasi</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {applicationsToVerify.filter(app => app.priority === 'high').length}
                </p>
                <p className="text-sm text-slate-600">Prioritas Tinggi</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {applicationsToVerify.filter(app => app.fieldVerification.completed).length}
                </p>
                <p className="text-sm text-slate-600">Verifikasi Lapangan</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {applicationsToVerify.reduce((sum, app) => 
                    sum + app.documents.filter(doc => doc.status === 'valid').length, 0
                  )}
                </p>
                <p className="text-sm text-slate-600">Dokumen Valid</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <Card title="Aplikasi Menunggu Verifikasi" subtitle="Klik untuk melihat detail">
              <div className="space-y-3">
                {applicationsToVerify.map((app) => {
                  const { percentage } = calculateTotalScore(app.verificationCriteria);
                  return (
                    <div
                      key={app.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                        selectedApplication?.id === app.id
                          ? 'border-indigo-300 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedApplication(app)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-slate-900">{app.applicantName}</h4>
                          <p className="text-sm text-slate-600">{app.program}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(app.priority)}`}>
                          {app.priority === 'high' ? 'Tinggi' : app.priority === 'medium' ? 'Sedang' : 'Rendah'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                          {new Date(app.submitDate).toLocaleDateString('id-ID')}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-slate-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-indigo-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600">{percentage}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Application Detail */}
          <div className="lg:col-span-2">
            {selectedApplication ? (
              <Card>
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{selectedApplication.applicantName}</h2>
                      <p className="text-sm text-slate-600 mt-1">{selectedApplication.program}</p>
                      <p className="text-sm text-slate-500 mt-1">{selectedApplication.address}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedApplication.priority)}`}>
                      Prioritas {selectedApplication.priority === 'high' ? 'Tinggi' : selectedApplication.priority === 'medium' ? 'Sedang' : 'Rendah'}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Contact Info */}
                  <div>
                    <h3 className="font-medium text-slate-900 mb-3">Informasi Kontak</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-slate-400 mr-2" />
                        {selectedApplication.phone}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                        {new Date(selectedApplication.submitDate).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>

                  {/* Family Data */}
                  <div>
                    <h3 className="font-medium text-slate-900 mb-3">Data Keluarga</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-lg font-bold text-slate-900">{selectedApplication.familyData.totalMembers}</div>
                        <div className="text-xs text-slate-600">Anggota Keluarga</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-lg font-bold text-slate-900">{selectedApplication.familyData.children}</div>
                        <div className="text-xs text-slate-600">Anak</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-700">
                          {new Intl.NumberFormat('id-ID').format(selectedApplication.familyData.monthlyIncome)}
                        </div>
                        <div className="text-xs text-green-600">Pendapatan</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-lg font-bold text-red-700">
                          {new Intl.NumberFormat('id-ID').format(selectedApplication.familyData.expenses)}
                        </div>
                        <div className="text-xs text-red-600">Pengeluaran</div>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="font-medium text-slate-900 mb-3">Dokumen</h3>
                    <div className="space-y-2">
                      {selectedApplication.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-slate-400 mr-3" />
                            <div>
                              <div className="font-medium text-slate-900">{doc.name}</div>
                              <div className="text-sm text-slate-500">{doc.notes}</div>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(doc.status)}`}>
                            {doc.status === 'valid' ? 'Valid' : doc.status === 'needs_review' ? 'Perlu Review' : 'Tidak Valid'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification Criteria */}
                  <div>
                    <h3 className="font-medium text-slate-900 mb-3">Kriteria Verifikasi</h3>
                    {(() => {
                      const { totalScore, maxScore, percentage } = calculateTotalScore(selectedApplication.verificationCriteria);
                      return (
                        <div className="space-y-3">
                          {Object.entries(selectedApplication.verificationCriteria).map(([key, criteria]) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium text-slate-900 capitalize">
                                  {key === 'income' ? 'Pendapatan' : 
                                   key === 'family' ? 'Keluarga' : 
                                   key === 'documents' ? 'Dokumen' :
                                   key === 'location' ? 'Lokasi' :
                                   key === 'business' ? 'Usaha' : key}
                                </div>
                                <div className="text-sm text-slate-600">{criteria.notes}</div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="text-right">
                                  <div className="font-bold text-slate-900">{criteria.score}/{criteria.max}</div>
                                </div>
                                <div className="flex">
                                  {[...Array(criteria.max)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < criteria.score ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-indigo-900">Total Score</span>
                              <span className="text-2xl font-bold text-indigo-900">{totalScore}/{maxScore} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-indigo-200 rounded-full h-3 mt-2">
                              <div 
                                className="h-3 rounded-full bg-indigo-600"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Field Verification */}
                  <div>
                    <h3 className="font-medium text-slate-900 mb-3">Verifikasi Lapangan</h3>
                    <div className={`p-4 rounded-lg border ${
                      selectedApplication.fieldVerification.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-center mb-2">
                        {selectedApplication.fieldVerification.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                        )}
                        <span className={`font-medium ${
                          selectedApplication.fieldVerification.completed ? 'text-green-900' : 'text-yellow-900'
                        }`}>
                          {selectedApplication.fieldVerification.completed ? 'Verifikasi Selesai' : 'Menunggu Verifikasi'}
                        </span>
                      </div>
                      {selectedApplication.fieldVerification.completed && (
                        <div className="text-sm space-y-1">
                          <p><strong>Tanggal:</strong> {new Date(selectedApplication.fieldVerification.date).toLocaleDateString('id-ID')}</p>
                          <p><strong>Verifikator:</strong> {selectedApplication.fieldVerification.verifier}</p>
                          <p><strong>Catatan:</strong> {selectedApplication.fieldVerification.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4 border-t border-slate-200">
                    <button 
                      onClick={() => handleApprove(selectedApplication.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Setujui
                    </button>
                    <button 
                      onClick={() => handleReject(selectedApplication.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      Tolak
                    </button>
                    <button className="px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Minta Info Tambahan
                    </button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium">Pilih Aplikasi untuk Verifikasi</p>
                  <p className="text-sm">Klik salah satu aplikasi di sebelah kiri untuk melihat detail</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Temporary Page Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Halaman Sementara</p>
              <p className="text-sm text-yellow-700 mt-1">
                Ini adalah halaman sementara untuk submenu Verifikasi. Fitur lengkap sedang dalam pengembangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
};

export default VerifikasiPage;