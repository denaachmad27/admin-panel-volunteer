import React, { useState, useEffect } from 'react';
import { Users, Heart, MessageSquare, FileText, TrendingUp, Calendar, RefreshCw, AlertCircle } from 'lucide-react';

// 🔧 FIXED: Import DashboardLayout (BUKAN DashboardLayout)
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatsCardTemplate } from '../../components/templates/PageTemplates';
import { Card } from '../../components/ui/UIComponents';
import { dashboardAPI } from '../../services/api';

// Cache configuration
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes for dashboard stats

// Create per-user cache keys to prevent cross-account leakage
const getUserCacheSuffix = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return 'guest';
    const user = JSON.parse(userStr);
    const role = user.role || 'unknown';
    const id = user.id || '0';
    const alegId = user.anggota_legislatif_id ?? 'none';
    return `${role}_${id}_${alegId}`;
  } catch {
    return 'guest';
  }
};

const getCacheKey = () => `dashboard_stats_cache_${getUserCacheSuffix()}`;
const getCacheTimestampKey = () => `${getCacheKey()}_timestamp`;

// Cache utilities
const getCachedData = () => {
  try {
    const cached = localStorage.getItem(getCacheKey());
    const timestamp = localStorage.getItem(getCacheTimestampKey());
    
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      if (age < CACHE_DURATION) {
        console.log('Dashboard: Using cached data');
        return JSON.parse(cached);
      }
    }
  } catch (error) {
    console.error('Dashboard: Error reading cache:', error);
  }
  return null;
};

const setCachedData = (data) => {
  try {
    localStorage.setItem(getCacheKey(), JSON.stringify(data));
    localStorage.setItem(getCacheTimestampKey(), Date.now().toString());
    console.log('Dashboard: Data cached');
  } catch (error) {
    console.error('Dashboard: Error caching data:', error);
  }
};

const Dashboard = () => {
  // Initialize dengan cached data jika ada
  const [dashboardData, setDashboardData] = useState(() => {
    const cached = getCachedData();
    return cached?.dashboardData || null;
  });
  const [recentActivities, setRecentActivities] = useState(() => {
    const cached = getCachedData();
    return cached?.recentActivities || [];
  });
  const [loading, setLoading] = useState(false); // Mulai false jika ada cache
  const [error, setError] = useState(null);
  const [lastLoadTime, setLastLoadTime] = useState(null);

  useEffect(() => {
    // Hanya load jika tidak ada cached data
    const cached = getCachedData();
    if (!cached) {
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async (forceRefresh = false) => {
    try {
      // Check if we need to refresh
      const now = Date.now();
      if (!forceRefresh && lastLoadTime && (now - lastLoadTime) < CACHE_DURATION) {
        console.log('Dashboard: Skipping load (recently loaded)');
        return;
      }

      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedData = getCachedData();
        if (cachedData) {
          console.log('Dashboard: Using cached data');
          setDashboardData(cachedData.dashboardData);
          setRecentActivities(cachedData.recentActivities);
          setLastLoadTime(now);
          return;
        }
      }

      console.log('Dashboard: Loading fresh data from API');
      setLoading(true);
      const response = await dashboardAPI.getStatistics();
      console.log('Dashboard API Response:', response.data);
      
      if (response.data.status === 'success') {
        const newDashboardData = response.data.data.overview;
        const newRecentActivities = response.data.data.recent_activities || [];
        
        setDashboardData(newDashboardData);
        setRecentActivities(newRecentActivities);
        setError(null);
        setLastLoadTime(now);
        
        // Cache the new data
        setCachedData({
          dashboardData: newDashboardData,
          recentActivities: newRecentActivities
        });
      } else {
        throw new Error(response.data.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError(err.message || 'Gagal memuat data dashboard');
      // Fallback to mock data if API fails and no cache available
      if (!dashboardData) {
        setDashboardData({
          total_users: 0,
          total_programs: 0,
          total_complaints: 0,
          published_news: 0,
          pending_applications: 0,
          active_programs: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Prepare stats data for StatsCardTemplate
  const statsData = dashboardData ? [
    {
      label: 'Total Users',
      value: dashboardData.total_users || 0,
      icon: Users,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      change: {
        type: 'increase',
        value: `${dashboardData.new_users_this_month || 0} user baru bulan ini`
      }
    },
    {
      label: 'Program Bantuan',
      value: dashboardData.total_programs || 0,
      icon: Heart,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      change: {
        type: 'increase',
        value: `${dashboardData.active_programs || 0} program aktif`
      }
    },
    {
      label: 'Pengaduan',
      value: dashboardData.total_complaints || 0,
      icon: MessageSquare,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      change: {
        type: dashboardData.pending_complaints > 0 ? 'warning' : 'success',
        value: `${dashboardData.pending_complaints || 0} menunggu review`
      }
    },
    {
      label: 'Berita Published',
      value: dashboardData.published_news || 0,
      icon: FileText,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      change: {
        type: 'increase',
        value: `${dashboardData.total_news || 0} total artikel`
      }
    }
  ] : [];

  // Icon mapping for activity types
  const getActivityIcon = (type) => {
    const iconMap = {
      'user': { icon: Users, color: 'text-orange-600' },
      'complaint': { icon: MessageSquare, color: 'text-orange-600' },
      'news': { icon: FileText, color: 'text-orange-600' },
      'application': { icon: Heart, color: 'text-orange-600' },
    };
    return iconMap[type] || { icon: AlertCircle, color: 'text-gray-600' };
  };

  // Quick actions data
  const quickActions = [
    {
      title: 'Tambah Program Bantuan',
      description: 'Buat program bantuan sosial baru',
      icon: Heart,
      color: 'bg-orange-500',
      href: '/tambah-bantuan'
    },
    {
      title: 'Tulis Berita Baru',
      description: 'Publikasikan artikel atau berita',
      icon: FileText,
      color: 'bg-orange-500',
      href: '/news/create'
    },
    {
      title: 'Kelola Pengguna',
      description: 'Manajemen user dan permissions',
      icon: Users,
      color: 'bg-orange-500',
      href: '/users'
    },
    {
      title: 'Lihat Statistik',
      description: 'Analisis data dan laporan',
      icon: TrendingUp,
      color: 'bg-orange-500',
      href: '/statistics'
    }
  ];

  return (
    <DashboardLayout
      currentPage="dashboard"
      pageTitle="Dashboard Overview"
      breadcrumbs={['Overview']}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Selamat Datang, Admin!</h1>
              <p className="text-orange-100">Berikut adalah ringkasan aktivitas sistem bantuan sosial hari ini.</p>
            </div>
            <div className="hidden md:block">
              <Calendar className="w-16 h-16 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <p className="text-red-800 font-medium">Error loading dashboard data</p>
                <p className="text-red-600 text-sm">{error}</p>
                <button 
                  onClick={loadDashboardData}
                  className="mt-2 text-red-600 hover:text-red-700 underline text-sm"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : (
          <StatsCardTemplate stats={statsData} />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card 
              title="Aktivitas Terbaru" 
              subtitle="Pantau aktivitas sistem secara real-time"
              action={
                <button 
                  onClick={loadDashboardData}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              }
            >
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start space-x-4 p-4 animate-pulse">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600">Tidak ada aktivitas terbaru</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const iconConfig = getActivityIcon(activity.type);
                    const Icon = iconConfig.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="p-2 rounded-lg bg-slate-100">
                          <Icon className={`w-4 h-4 ${iconConfig.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900">{activity.action}</p>
                          <p className="text-sm text-slate-600 mt-1">{activity.details}</p>
                          <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium">
                  Lihat Semua Aktivitas →
                </button>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card title="Quick Actions" subtitle="Akses cepat fitur utama">
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => window.location.href = action.href}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm">{action.title}</p>
                        <p className="text-xs text-slate-500">{action.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* System Status */}
            <Card title="Status Sistem">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Server Status</span>
                  <span className="flex items-center text-sm font-medium text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Database</span>
                  <span className="flex items-center text-sm font-medium text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">API Status</span>
                  <span className="flex items-center text-sm font-medium text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Last Update</span>
                  <span className="text-sm text-slate-500">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
