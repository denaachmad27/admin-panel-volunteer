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

// 🔒 PROTECTED: Menu items yang sudah fix, jangan diubah
const PROTECTED_MENU_ITEMS = [
  {
    title: 'Dashboard',
    icon: Home,
    path: '/dashboard',
    id: 'dashboard'
  },
  {
    title: 'Manajemen User',
    icon: Users,
    path: '/users',
    id: 'users'
  },
  {
    title: 'Bantuan Sosial',
    icon: Heart,
    path: '/bantuan-sosial',
    id: 'bantuan',
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
    id: 'news',
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
    id: 'complaints'
  },
  {
    title: 'Statistik',
    icon: BarChart3,
    path: '/statistics',
    id: 'statistics'
  }
];

const ProtectedDashboardLayout = ({ 
  children, 
  currentPage = 'dashboard',
  additionalMenuItems = [], // Fitur baru bisa ditambah di sini
  pageTitle,
  breadcrumbs = []
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  // 🔒 PROTECTED: User data structure yang fix
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const defaultUserData = {
    name: userData.name || 'Admin User',
    email: userData.email || 'admin@example.com',
    role: userData.role || 'Administrator',
    avatar: userData.avatar || null
  };

  // 🔒 PROTECTED: Combine menu items dengan cara yang aman
  const allMenuItems = [
    ...PROTECTED_MENU_ITEMS,
    // Separator untuk menu tambahan
    ...(additionalMenuItems.length > 0 ? [{
      type: 'separator',
      id: 'additional-separator'
    }] : []),
    // Menu tambahan dari props (fitur baru)
    ...additionalMenuItems
  ];

  // 🔒 PROTECTED: Notifications structure yang fix
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
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const renderMenuItem = (item) => {
    if (item.type === 'separator') {
      return (
        <div key={item.id} className="my-2">
          <hr className="border-slate-200" />
        </div>
      );
    }

    const Icon = item.icon;
    const isActive = currentPage === item.id;

    return (
      <div key={item.id}>
        <a
          href={item.path}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            isActive 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Icon className={`w-5 h-5 ${
            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
          }`} />
          <span className="font-medium">{item.title}</span>
          {item.badge && (
            <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
              item.badgeColor || 'bg-blue-100 text-blue-600'
            }`}>
              {item.badge}
            </span>
          )}
        </a>
        
        {/* Submenu */}
        {item.submenu && isActive && (
          <div className="mt-2 ml-4 space-y-1">
            {item.submenu.map((subItem, index) => (
              <a
                key={index}
                href={subItem.path}
                className="block px-4 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {subItem.title}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 🔒 PROTECTED: Sidebar yang tidak boleh diubah struktur utamanya */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {allMenuItems.map(renderMenuItem)}
          
          {/* Settings - Always at bottom */}
          <div className="pt-4 mt-4 border-t border-slate-200">
            <a
              href="/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-400" />
              <span className="font-medium">Pengaturan</span>
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* 🔒 PROTECTED: Top Header yang structure-nya fix */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              
              {/* Breadcrumbs */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <span className="text-slate-500">Dashboard</span>
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    <span className="text-slate-300">/</span>
                    <span className={index === breadcrumbs.length - 1 ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                      {item}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari..."
                  className="pl-10 pr-4 py-2 w-64 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                </button>

                {notificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                    <div className="p-4 border-b border-slate-200">
                      <h3 className="font-semibold text-slate-900">Notifikasi</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
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
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-900">{defaultUserData.name}</p>
                    <p className="text-xs text-slate-500">{defaultUserData.role}</p>
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
                        <p className="font-medium text-slate-900">{defaultUserData.name}</p>
                        <p className="text-sm text-slate-500">{defaultUserData.email}</p>
                        </div>
                    </div>
                    </div>
                    <div className="p-2">
                    {/* 🎯 FIXED: Menggunakan onClick untuk navigation */}
                    <button 
                        onClick={() => window.location.href = '/admin/profile'}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Profil Saya 2</span>
                    </button>
                    
                    <button 
                        onClick={() => window.location.href = '/settings'}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Pengaturan</span>
                    </button>
                    
                    <button 
                        onClick={() => window.location.href = '/help'}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-slate-100 transition-colors"
                    >
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

        {/* 🔒 PROTECTED: Content Area Structure */}
        <main className="p-6">
          {/* Page Header - Optional */}
          {pageTitle && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
              {breadcrumbs.length > 0 && (
                <nav className="flex mt-2 text-sm text-slate-500">
                  <span>Dashboard</span>
                  {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                      <span className="mx-2">/</span>
                      <span className={index === breadcrumbs.length - 1 ? 'text-slate-900 font-medium' : ''}>
                        {item}
                      </span>
                    </React.Fragment>
                  ))}
                </nav>
              )}
            </div>
          )}

          {/* 🔒 PROTECTED: Children akan dirender di sini */}
          <div className="protected-content-area">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔒 PROTECTED: Development indicator */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            🔒 Protected Layout Active
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtectedDashboardLayout;