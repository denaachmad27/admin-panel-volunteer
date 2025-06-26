import React from 'react';
import { Users, Heart, MessageSquare, FileText, TrendingUp, Calendar } from 'lucide-react';

// 🔧 FIXED: Import ProtectedDashboardLayout (BUKAN DashboardLayout)
import ProtectedDashboardLayout from '../../components/layout/ProtectedDashboardLayout';
import { StatsCardTemplate } from '../../components/templates/PageTemplates';
import { Card } from '../../components/ui/UIComponents';

const Dashboard = () => {
  // Langsung gunakan mock data tanpa loading untuk konsistensi dengan halaman lain
  const dashboardData = {
    total_users: 1248,
    total_programs: 24,
    total_complaints: 89,
    total_news: 156,
    pending_applications: 15,
    active_programs: 18
  };

  // Prepare stats data for StatsCardTemplate
  const statsData = [
    {
      label: 'Total Users',
      value: dashboardData?.total_users || 0,
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      change: {
        type: 'increase',
        value: '+12% dari bulan lalu'
      }
    },
    {
      label: 'Program Bantuan',
      value: dashboardData?.total_programs || 0,
      icon: Heart,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      change: {
        type: 'increase',
        value: '+3 program baru'
      }
    },
    {
      label: 'Pengaduan',
      value: dashboardData?.total_complaints || 0,
      icon: MessageSquare,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      change: {
        type: 'decrease',
        value: '5 menunggu review'
      }
    },
    {
      label: 'Berita Published',
      value: dashboardData?.total_news || 0,
      icon: FileText,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      change: {
        type: 'increase',
        value: '12 artikel minggu ini'
      }
    }
  ];

  // Recent activities data
  const recentActivities = [
    {
      id: 1,
      action: 'User baru mendaftar',
      details: 'Ahmad Wijaya mendaftar ke sistem',
      time: '5 menit lalu',
      type: 'user',
      icon: Users,
      iconColor: 'text-blue-600'
    },
    {
      id: 2,
      action: 'Bantuan sosial disetujui',
      details: 'Program bantuan pangan untuk RT 05',
      time: '1 jam lalu',
      type: 'bantuan',
      icon: Heart,
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      action: 'Pengaduan baru',
      details: 'Laporan infrastruktur jalan rusak',
      time: '2 jam lalu',
      type: 'complaint',
      icon: MessageSquare,
      iconColor: 'text-yellow-600'
    },
    {
      id: 4,
      action: 'Berita dipublikasi',
      details: 'Artikel: Tips menjaga kesehatan di musim hujan',
      time: '3 jam lalu',
      type: 'news',
      icon: FileText,
      iconColor: 'text-purple-600'
    }
  ];

  // Quick actions data
  const quickActions = [
    {
      title: 'Tambah Program Bantuan',
      description: 'Buat program bantuan sosial baru',
      icon: Heart,
      color: 'bg-green-500',
      href: '/bantuan-sosial/create'
    },
    {
      title: 'Tulis Berita Baru',
      description: 'Publikasikan artikel atau berita',
      icon: FileText,
      color: 'bg-blue-500',
      href: '/news/create'
    },
    {
      title: 'Kelola Pengguna',
      description: 'Manajemen user dan permissions',
      icon: Users,
      color: 'bg-purple-500',
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
    <ProtectedDashboardLayout
      currentPage="dashboard"
      pageTitle="Dashboard Overview"
      breadcrumbs={['Overview']}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Selamat Datang, Admin!</h1>
              <p className="text-blue-100">Berikut adalah ringkasan aktivitas sistem bantuan sosial hari ini.</p>
            </div>
            <div className="hidden md:block">
              <Calendar className="w-16 h-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCardTemplate stats={statsData} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card title="Aktivitas Terbaru" subtitle="Pantau aktivitas sistem secara real-time">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className={`p-2 rounded-lg bg-slate-100`}>
                        <Icon className={`w-4 h-4 ${activity.iconColor}`} />
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
              
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
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
    </ProtectedDashboardLayout>
  );
};

export default Dashboard;