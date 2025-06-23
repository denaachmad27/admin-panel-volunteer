import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Heart, 
  FileText, 
  MessageSquare, 
  Settings, 
  Bell, 
  Search, 
  ChevronDown,
  LogOut,
  User,
  Shield,
  BarChart3,
  Calendar,
  HelpCircle
} from 'lucide-react';

const DashboardLayout = ({ data }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  // Menu items berdasarkan API Laravel yang sudah ada
  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      active: true
    },
    {
      title: 'Manajemen User',
      icon: Users,
      path: '/users',
      badge: '24'
    },
    {
      title: 'Bantuan Sosial',
      icon: Heart,
      path: '/bantuan-sosial',
      submenu: [
        { title: 'Daftar Program', path: '/bantuan-sosial' },
        { title: 'Pendaftaran', path: '/pendaftaran' },
        { title: 'Verifikasi', path: '/pendaftaran/verify' }
      ]
    },
    {
      title: 'Berita & Artikel',
      icon: FileText,
      path: '/news',
      submenu: [
        { title: 'Daftar Berita', path: '/news' },
        { title: 'Tambah Berita', path: '/news/create' },
        { title: 'Kategori', path: '/news/categories' }
      ]
    },
    {
      title: 'Pengaduan',
      icon: MessageSquare,
      path: '/complaints',
      badge: '5',
      badgeColor: 'bg-red-500'
    },
    {
      title: 'Statistik',
      icon: BarChart3,
      path: '/statistics'
    },
    {
      title: 'Pengaturan',
      icon: Settings,
      path: '/settings'
    }
  ];

  const notifications = [
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
  ];

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Admin Portal</h1>
            <p className="text-slate-400 text-xs">Bantuan Sosial v1.0</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index}>
              <div className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                item.active 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 shadow-lg' 
                  : 'hover:bg-slate-700/50 hover:border-slate-600/50 border border-transparent'
              }`}>
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${item.active ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`} />
                  <span className={`font-medium ${item.active ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.badgeColor || 'bg-blue-500'
                    } text-white`}>
                      {item.badge}
                    </span>
                  )}
                  {item.submenu && (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
              
              {/* Submenu */}
              {item.submenu && item.active && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.submenu.map((subitem, subindex) => (
                    <div key={subindex} className="px-4 py-2 text-sm text-slate-400 hover:text-white cursor-pointer rounded-lg hover:bg-slate-700/30 transition-colors">
                      {subitem.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">{userData.name || 'Admin User'}</p>
            <p className="text-slate-400 text-xs">{userData.email || 'admin@example.com'}</p>
          </div>
          <HelpCircle className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-6 h-6 text-slate-600" />
              </button>

              {/* Breadcrumb */}
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <div className="flex items-center">
                      <Home className="w-4 h-4 text-slate-400" />
                      <span className="ml-2 text-sm font-medium text-slate-700">Dashboard</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <ChevronDown className="w-4 h-4 text-slate-400 rotate-[-90deg]" />
                      <span className="ml-2 text-sm font-medium text-slate-900">Overview</span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari data..."
                  className="w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Notification Dropdown */}
                {notificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                    <div className="p-4 border-b border-slate-200">
                      <h3 className="font-semibold text-slate-900">Notifikasi</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                          notification.unread ? 'bg-blue-50/50' : ''
                        }`}>
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.unread ? 'bg-blue-500' : 'bg-slate-300'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 text-sm">{notification.title}</p>
                              <p className="text-slate-600 text-sm mt-1">{notification.message}</p>
                              <p className="text-slate-400 text-xs mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-slate-200">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Lihat Semua Notifikasi
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-900">{userData.name || 'Admin User'}</p>
                    <p className="text-xs text-slate-500">{userData.role || 'Administrator'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                    <div className="p-4 border-b border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{userData.name || 'Admin User'}</p>
                          <p className="text-sm text-slate-500">{userData.email || 'admin@example.com'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-slate-100 transition-colors">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Profil Saya</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-slate-100 transition-colors">
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Pengaturan</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-slate-100 transition-colors">
                        <HelpCircle className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Bantuan</span>
                      </button>
                      <hr className="my-2 border-slate-200" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-red-50 transition-colors text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{data?.total_users || '1,248'}</p>
                  <p className="text-xs text-green-600 mt-1">+12% dari bulan lalu</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Program Bantuan</p>
                  <p className="text-2xl font-bold text-slate-900">{data?.total_programs || '24'}</p>
                  <p className="text-xs text-green-600 mt-1">+3 program baru</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pengaduan</p>
                  <p className="text-2xl font-bold text-slate-900">{data?.total_complaints || '89'}</p>
                  <p className="text-xs text-yellow-600 mt-1">5 menunggu review</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Berita Published</p>
                  <p className="text-2xl font-bold text-slate-900">{data?.total_news || '156'}</p>
                  <p className="text-xs text-blue-600 mt-1">12 artikel minggu ini</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Aktivitas Terbaru</h3>
              <div className="space-y-4">
                {[
                  {
                    action: 'User baru mendaftar',
                    details: 'Ahmad Wijaya mendaftar ke sistem',
                    time: '5 menit lalu',
                    icon: Users,
                    color: 'text-blue-600'
                  },
                  {
                    action: 'Bantuan sosial disetujui',
                    details: 'Program bantuan pangan untuk RT 05',
                    time: '1 jam lalu',
                    icon: Heart,
                    color: 'text-green-600'
                  },
                  {
                    action: 'Pengaduan baru',
                    details: 'Laporan infrastruktur jalan rusak',
                    time: '2 jam lalu',
                    icon: MessageSquare,
                    color: 'text-yellow-600'
                  },
                  {
                    action: 'Berita dipublish',
                    details: 'Artikel: Tips menjaga kesehatan di musim hujan',
                    time: '3 jam lalu',
                    icon: FileText,
                    color: 'text-purple-600'
                  }
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm">{activity.action}</p>
                        <p className="text-slate-600 text-sm">{activity.details}</p>
                        <p className="text-slate-400 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                  <Heart className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">Tambah Program Bantuan</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all group">
                  <FileText className="w-5 h-5 text-slate-600 group-hover:text-green-600" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-green-700">Tulis Berita Baru</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all group">
                  <Users className="w-5 h-5 text-slate-600 group-hover:text-purple-600" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">Kelola Pengguna</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all group">
                  <BarChart3 className="w-5 h-5 text-slate-600 group-hover:text-yellow-600" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-yellow-700">Lihat Statistik</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;