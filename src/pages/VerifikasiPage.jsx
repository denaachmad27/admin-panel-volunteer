import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Eye, Clock, User, FileText, MapPin, Phone, Calendar, 
  Star, ThumbsUp, ThumbsDown, MessageSquare, AlertTriangle, AlertCircle, 
  Loader, RefreshCw, Filter, Search, Download, Edit3, Award, Users, Mail,
  Heart, Info, ChevronRight, ChevronDown, Plus, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import { pendaftaranAPI } from '../services/api';

const VerifikasiPage = () => {
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [selectedScore, setSelectedScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  
  // Filter states
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Data states
  const [applications, setApplications] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    highPriority: 0,
    fieldVerified: 0,
    validDocuments: 0,
    averageScore: 0
  });

  // Load data on component mount
  useEffect(() => {
    loadVerificationData();
  }, []);

  // Reload when filters change
  useEffect(() => {
    if (!loading) {
      applyFilters();
    }
  }, [priorityFilter, programFilter, searchQuery]);

  const loadVerificationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get applications that need verification (Pending status)
      const response = await pendaftaranAPI.getAll({ status: 'Pending' });
      
      if (response.data.status === 'success') {
        const pendaftaranData = response.data.data.data || [];
        
        // Process and enhance data for verification
        const processedApplications = pendaftaranData.map(app => ({
          ...app,
          priority: calculatePriority(app),
          verificationScore: calculateVerificationScore(app),
          documentStatus: analyzeDocuments(app),
          familyScore: calculateFamilyScore(app)
        }));

        setApplications(processedApplications);
        calculateStats(processedApplications);
        
        // Auto-select first application
        if (processedApplications.length > 0) {
          setSelectedApplication(processedApplications[0]);
        }
      }
    } catch (err) {
      console.error('Error loading verification data:', err);
      setError('Gagal memuat data verifikasi');
    } finally {
      setLoading(false);
    }
  };

  const calculatePriority = (application) => {
    // Simple priority calculation based on various factors
    let score = 0;
    
    // Family factors
    const profile = application.user?.profile;
    if (profile) {
      // More children = higher priority
      if (profile.jumlah_tanggungan > 3) score += 3;
      else if (profile.jumlah_tanggungan > 1) score += 2;
      else score += 1;
      
      // Lower income = higher priority  
      if (profile.penghasilan_bulanan < 1000000) score += 3;
      else if (profile.penghasilan_bulanan < 2000000) score += 2;
      else score += 1;
    }
    
    // Application age (older = higher priority)
    const daysSinceSubmit = Math.floor((new Date() - new Date(application.created_at)) / (1000 * 60 * 60 * 24));
    if (daysSinceSubmit > 7) score += 2;
    else if (daysSinceSubmit > 3) score += 1;
    
    // Convert score to priority
    if (score >= 6) return 'high';
    else if (score >= 4) return 'medium';
    else return 'low';
  };

  const calculateVerificationScore = (application) => {
    let totalScore = 0;
    let maxScore = 0;
    
    // Document completeness (30%)
    const docScore = analyzeDocuments(application);
    totalScore += docScore.score;
    maxScore += docScore.maxScore;
    
    // Family need assessment (40%)
    const familyScore = calculateFamilyScore(application);
    totalScore += familyScore.score;
    maxScore += familyScore.maxScore;
    
    // Application quality (30%)
    const appScore = assessApplicationQuality(application);
    totalScore += appScore.score;
    maxScore += appScore.maxScore;
    
    return {
      totalScore,
      maxScore,
      percentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
    };
  };

  const analyzeDocuments = (application) => {
    // Mock document analysis - in real app, this would check actual documents
    const requiredDocs = ['KTP', 'KK', 'Surat Keterangan'];
    let validDocs = 0;
    
    // Simulate document validation
    validDocs = Math.floor(Math.random() * requiredDocs.length) + 1;
    
    return {
      score: validDocs * 10,
      maxScore: requiredDocs.length * 10,
      validCount: validDocs,
      totalCount: requiredDocs.length,
      status: validDocs === requiredDocs.length ? 'complete' : validDocs > 0 ? 'partial' : 'incomplete'
    };
  };

  const calculateFamilyScore = (application) => {
    const profile = application.user?.profile;
    if (!profile) return { score: 0, maxScore: 40 };
    
    let score = 0;
    
    // Income assessment (0-15 points)
    if (profile.penghasilan_bulanan < 1000000) score += 15;
    else if (profile.penghasilan_bulanan < 2000000) score += 10;
    else if (profile.penghasilan_bulanan < 3000000) score += 5;
    
    // Family size and dependents (0-15 points)
    if (profile.jumlah_tanggungan > 4) score += 15;
    else if (profile.jumlah_tanggungan > 2) score += 10;
    else if (profile.jumlang_tanggungan > 0) score += 5;
    
    // Employment status (0-10 points)
    if (profile.pekerjaan === 'Tidak Bekerja' || profile.pekerjaan === 'Pengangguran') score += 10;
    else if (profile.pekerjaan === 'Buruh' || profile.pekerjaan === 'Petani') score += 7;
    else score += 3;
    
    return { score, maxScore: 40 };
  };

  const assessApplicationQuality = (application) => {
    let score = 0;
    
    // Application completeness (0-15 points)
    if (application.user?.name) score += 3;
    if (application.user?.email) score += 3;
    if (application.user?.profile?.alamat) score += 3;
    if (application.user?.profile?.no_telepon) score += 3;
    if (application.catatan_tambahan) score += 3;
    
    // Program relevance (0-15 points)
    score += 10; // Base relevance score
    
    return { score, maxScore: 30 };
  };

  const calculateStats = (data) => {
    const total = data.length;
    const highPriority = data.filter(app => app.priority === 'high').length;
    const fieldVerified = data.filter(app => Math.random() > 0.5).length; // Mock field verification
    const validDocuments = data.reduce((sum, app) => sum + app.documentStatus.validCount, 0);
    const averageScore = total > 0 ? Math.round(data.reduce((sum, app) => sum + app.verificationScore.percentage, 0) / total) : 0;
    
    setStats({ total, highPriority, fieldVerified, validDocuments, averageScore });
  };

  const applyFilters = () => {
    let filtered = [...applications];
    
    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(app => app.priority === priorityFilter);
    }
    
    // Program filter
    if (programFilter !== 'all') {
      filtered = filtered.filter(app => app.bantuan_sosial?.nama_bantuan === programFilter);
    }
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.bantuan_sosial?.nama_bantuan?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleStatusUpdate = async (applicationId, status, notes = '') => {
    try {
      await pendaftaranAPI.updateStatus(applicationId, status, notes);
      setMessage(`Aplikasi berhasil ${status === 'Disetujui' ? 'disetujui' : 'ditolak'}`);
      
      // Remove from list and select next application
      const updatedApps = applications.filter(app => app.id !== applicationId);
      setApplications(updatedApps);
      
      if (updatedApps.length > 0) {
        setSelectedApplication(updatedApps[0]);
      } else {
        setSelectedApplication(null);
      }
      
      calculateStats(updatedApps);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.message || 'Gagal mengubah status aplikasi');
    }
  };

  const handleApprove = () => {
    if (selectedApplication) {
      handleStatusUpdate(selectedApplication.id, 'Disetujui', verificationNotes);
    }
  };

  const handleReject = () => {
    if (selectedApplication) {
      handleStatusUpdate(selectedApplication.id, 'Ditolak', verificationNotes);
    }
  };

  const handleHold = () => {
    if (selectedApplication) {
      const holdNotes = verificationNotes || 'Dokumen perlu dilengkapi. Silakan lengkapi persyaratan yang dibutuhkan.';
      handleStatusUpdate(selectedApplication.id, 'Perlu Dilengkapi', holdNotes);
    }
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      'high': { bg: 'bg-red-100', text: 'text-red-800', label: 'Tinggi', icon: AlertTriangle },
      'medium': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Sedang', icon: Clock },
      'low': { bg: 'bg-green-100', text: 'text-green-800', label: 'Rendah', icon: CheckCircle }
    };
    return configs[priority] || configs['medium'];
  };

  const getPriorityBadge = (priority) => {
    const config = getPriorityConfig(priority);
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
  };

  const filteredApplications = applyFilters();

  return (
    <DashboardLayout
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
              <p className="text-indigo-100">Review dan verifikasi aplikasi bantuan sosial dengan sistem scoring</p>
            </div>
            <div className="hidden md:block">
              <Award className="w-16 h-16 text-indigo-200" />
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {message && (
          <div className="p-4 rounded-lg bg-green-100 text-green-700 border border-green-200 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-red-100 text-red-700 border border-red-200 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 mr-4">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
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
                <p className="text-2xl font-bold text-slate-900">{stats.highPriority}</p>
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
                <p className="text-2xl font-bold text-slate-900">{stats.fieldVerified}</p>
                <p className="text-sm text-slate-600">Terverifikasi</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.validDocuments}</p>
                <p className="text-sm text-slate-600">Dokumen Valid</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.averageScore}%</p>
                <p className="text-sm text-slate-600">Rata-rata Score</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Filter & Pencarian</h3>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                <Settings className="w-4 h-4 mr-1" />
                {showAdvancedFilters ? 'Sembunyikan' : 'Tampilkan'} Filter
                {showAdvancedFilters ? <ChevronDown className="w-4 h-4 ml-1" /> : <ChevronRight className="w-4 h-4 ml-1" />}
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama, email, atau program..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              {/* Priority Filter */}
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Semua Prioritas</option>
                <option value="high">Prioritas Tinggi</option>
                <option value="medium">Prioritas Sedang</option>
                <option value="low">Prioritas Rendah</option>
              </select>
              
              {/* Refresh Button */}
              <button
                onClick={loadVerificationData}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Aplikasi Menunggu Verifikasi</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {filteredApplications.length} dari {applications.length} aplikasi
                </p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center">
                    <Loader className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                    <p className="text-sm text-slate-600">Memuat data...</p>
                  </div>
                ) : filteredApplications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600">Tidak ada aplikasi yang perlu diverifikasi</p>
                  </div>
                ) : (
                  <div className="space-y-2 p-3">
                    {filteredApplications.map((app) => (
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
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-slate-900">{app.user?.name || 'Nama tidak tersedia'}</h4>
                              {app.is_resubmission && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Pengajuan Ke-{app.resubmission_count || 1}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">{app.bantuan_sosial?.nama_bantuan || 'Program tidak tersedia'}</p>
                          </div>
                          {getPriorityBadge(app.priority)}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">
                            {formatDate(app.created_at)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-slate-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  app.verificationScore.percentage >= 80 ? 'bg-green-500' :
                                  app.verificationScore.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${app.verificationScore.percentage}%` }}
                              />
                            </div>
                            <span className={`text-xs font-medium ${getScoreColor(app.verificationScore.percentage)}`}>
                              {app.verificationScore.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                      <div className="flex items-center space-x-3">
                        <h2 className="text-lg font-semibold text-slate-900">{selectedApplication.user?.name || 'Nama tidak tersedia'}</h2>
                        {selectedApplication.is_resubmission && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Pengajuan Ulang #{selectedApplication.resubmission_count || 1}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{selectedApplication.bantuan_sosial?.nama_bantuan || 'Program tidak tersedia'}</p>
                      <p className="text-sm text-slate-500 mt-1">ID: {selectedApplication.id}</p>
                      {selectedApplication.is_resubmission && selectedApplication.resubmitted_at && (
                        <p className="text-sm text-orange-600 mt-1">
                          Diajukan ulang: {new Date(selectedApplication.resubmitted_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(selectedApplication.priority)}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedApplication.verificationScore.percentage >= 80 ? 'bg-green-100 text-green-800' :
                        selectedApplication.verificationScore.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        Score: {selectedApplication.verificationScore.percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Contact & Basic Info */}
                  <div>
                    <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Informasi Dasar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-slate-400 mr-2" />
                        {selectedApplication.user?.email || 'Email tidak tersedia'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                        Daftar: {formatDate(selectedApplication.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-slate-400 mr-2" />
                        {selectedApplication.user?.profile?.no_telepon || 'Telepon tidak tersedia'}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                        {selectedApplication.user?.profile?.alamat?.substring(0, 30)}...
                      </div>
                    </div>
                  </div>

                  {/* Family Data */}
                  {selectedApplication.user?.profile && (
                    <div>
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Data Keluarga & Ekonomi
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <div className="text-lg font-bold text-slate-900">
                            {selectedApplication.user.profile.jumlah_tanggungan || 0}
                          </div>
                          <div className="text-xs text-slate-600">Tanggungan</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-700">
                            {selectedApplication.user.profile.pekerjaan || 'Tidak Ada'}
                          </div>
                          <div className="text-xs text-blue-600">Pekerjaan</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-sm font-bold text-green-700">
                            {formatCurrency(selectedApplication.user.profile.penghasilan_bulanan)}
                          </div>
                          <div className="text-xs text-green-600">Penghasilan</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-700">
                            {selectedApplication.user.profile.status_perkawinan || 'Tidak Ada'}
                          </div>
                          <div className="text-xs text-purple-600">Status</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Program Information */}
                  <div>
                    <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Informasi Program
                    </h3>
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <h4 className="font-medium text-indigo-900">{selectedApplication.bantuan_sosial?.nama_bantuan}</h4>
                      <p className="text-sm text-indigo-700 mt-1">{selectedApplication.bantuan_sosial?.jenis_bantuan}</p>
                      {selectedApplication.bantuan_sosial?.nominal && (
                        <p className="text-sm text-indigo-700 mt-1">
                          Nominal: {formatCurrency(selectedApplication.bantuan_sosial.nominal)}
                        </p>
                      )}
                      <p className="text-xs text-indigo-600 mt-2">
                        {selectedApplication.bantuan_sosial?.deskripsi?.substring(0, 100)}...
                      </p>
                    </div>
                  </div>

                  {/* Applicant Message */}
                  {selectedApplication.alasan_pengajuan && (
                    <div>
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Pesan Pemohon
                      </h3>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{selectedApplication.alasan_pengajuan}</p>
                      </div>
                    </div>
                  )}

                  {/* Verification Score Breakdown */}
                  <div>
                    <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Analisis Verifikasi
                    </h3>
                    <div className="space-y-3">
                      {/* Document Score */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-900">Kelengkapan Dokumen</div>
                          <div className="text-sm text-slate-600">
                            {selectedApplication.documentStatus.validCount}/{selectedApplication.documentStatus.totalCount} dokumen valid
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">
                            {selectedApplication.documentStatus.score}/{selectedApplication.documentStatus.maxScore}
                          </div>
                          <div className="flex">
                            {[...Array(selectedApplication.documentStatus.maxScore / 10)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < (selectedApplication.documentStatus.score / 10) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Family Need Score */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-900">Tingkat Kebutuhan Keluarga</div>
                          <div className="text-sm text-slate-600">
                            Berdasarkan ekonomi dan tanggungan
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">
                            {selectedApplication.familyScore.score}/{selectedApplication.familyScore.maxScore}
                          </div>
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(selectedApplication.familyScore.score / 10) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Total Score */}
                      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-indigo-900">Total Score Verifikasi</span>
                          <span className="text-2xl font-bold text-indigo-900">
                            {selectedApplication.verificationScore.totalScore}/{selectedApplication.verificationScore.maxScore}
                            <span className="text-lg"> ({selectedApplication.verificationScore.percentage}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-indigo-200 rounded-full h-3 mt-2">
                          <div 
                            className={`h-3 rounded-full ${
                              selectedApplication.verificationScore.percentage >= 80 ? 'bg-green-600' :
                              selectedApplication.verificationScore.percentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${selectedApplication.verificationScore.percentage}%` }}
                          />
                        </div>
                        <div className="text-sm text-indigo-700 mt-2">
                          Rekomendasi: {selectedApplication.verificationScore.percentage >= 80 ? 'Sangat Layak' :
                          selectedApplication.verificationScore.percentage >= 60 ? 'Layak' : 'Perlu Review Lebih Lanjut'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Catatan Verifikasi
                    </h3>
                    <textarea
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      placeholder="Tambahkan catatan untuk verifikasi ini..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
                    <button 
                      onClick={handleApprove}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Setujui
                    </button>
                    <button 
                      onClick={handleHold}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Perlu Dilengkapi
                    </button>
                    <button 
                      onClick={handleReject}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Tolak
                    </button>
                    <button 
                      onClick={() => navigate(`/pendaftaran/${selectedApplication.id}?from=verifikasi`)}
                      className="border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center px-4 py-3"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Detail Lengkap
                    </button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <Award className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium">Pilih Aplikasi untuk Verifikasi</p>
                  <p className="text-sm">Klik salah satu aplikasi di sebelah kiri untuk melihat detail verifikasi</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VerifikasiPage;