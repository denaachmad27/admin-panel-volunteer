import React, { useState, useEffect, useRef } from 'react';
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
  ChevronRight,
  LogOut,
  User,
  Shield,
  BarChart3,
  Calendar,
  HelpCircle,
  Building,
  UserPlus,
  UserCheck,
  Lightbulb,
  CalendarCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useGeneralSettings } from '../../contexts/GeneralSettingsContext';

// Menu items utama aplikasi
const MENU_ITEMS = [
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
    title: 'Manajemen Relawan',
    icon: UserPlus,
    path: '/volunteers',
    id: 'volunteers'
  },
  {
    title: 'Manajemen Anggota Legislatif',
    icon: UserCheck,
    path: '/anggota-legislatif',
    id: 'anggota-legislatif',
    submenu: [
      { title: 'Daftar Anggota Legislatif', path: '/anggota-legislatif' },
      { title: 'Tambah Anggota Legislatif', path: '/anggota-legislatif/create' }
    ]
  },
  {
    title: 'Bantuan Sosial',
    icon: Heart,
    path: '/daftar-bantuan',
    id: 'bantuan',
    submenu: [
      { title: 'Daftar Program', path: '/daftar-bantuan' },
      { title: 'Tambah Program', path: '/tambah-bantuan' },
      { title: 'Pendaftaran', path: '/pendaftaran' },
      { title: 'Verifikasi', path: '/pendaftaran/verify' }
    ]
  },
  {
    title: 'Reses',
    icon: CalendarCheck,
    path: '/reses',
    id: 'reses',
    submenu: [
      { title: 'Daftar Reses', path: '/reses' },
      { title: 'Tambah Reses', path: '/reses/create' }
    ]
  },
  {
    title: 'Pokir',
    icon: Lightbulb,
    path: '/pokir',
    id: 'pokir',
    submenu: [
      { title: 'Daftar Pokir', path: '/pokir' },
      { title: 'Tambah Pokir', path: '/pokir/create' }
    ]
  },
  {
    title: 'Berita & Artikel',
    icon: FileText,
    path: '/berita-artikel',
    id: 'news',
    submenu: [
      { title: 'Daftar Berita', path: '/berita-artikel' },
      { title: 'Tambah Berita', path: '/tambah-berita' },
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
  },
  {
    title: 'Pengaturan',
    icon: Settings,
    path: '/settings',
    id: 'settings',
    submenu: [
      { title: 'Pengaturan Umum', path: '/settings' },
      { title: 'Daftar Dinas', path: '/settings/daftar-dinas' },
      { title: 'WhatsApp', path: '/settings/whatsapp' },
      { title: 'Email', path: '/settings/email' }
    ]
  }
];

const DashboardLayout = ({ 
  children, 
  currentPage = 'dashboard',
  additionalMenuItems = [], // Fitur baru bisa ditambah di sini
  pageTitle,
  breadcrumbs = []
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  // Get general settings for logo and site name
  const { settings: generalSettings } = useGeneralSettings();

  // Refs for click outside detection
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle functions that close other dropdowns
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setNotificationDropdownOpen(false); // Close notification dropdown
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setProfileDropdownOpen(false); // Close profile dropdown
  };

  // User data structure
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const defaultUserData = {
    name: userData.name || 'Admin User',
    email: userData.email || 'admin@example.com',
    role: userData.role || 'Administrator',
    avatar: userData.avatar || null,
    anggota_legislatif: userData.anggota_legislatif || null,
    is_admin_aleg: userData.role === 'admin_aleg'
  };

  // Combine menu items dengan cara yang aman
  const allMenuItems = [
    ...MENU_ITEMS,
    // Separator untuk menu tambahan
    ...(additionalMenuItems.length > 0 ? [{
      type: 'separator',
      id: 'additional-separator'
    }] : []),
    // Menu tambahan dari props (fitur baru)
    ...additionalMenuItems
  ];

  // Filter menu for admin_aleg (hide Manajemen Anggota Legislatif)
  const visibleMenuItems = allMenuItems.filter(item => {
    const isAdminAleg = defaultUserData.is_admin_aleg;
    if (isAdminAleg && item.id === 'anggota-legislatif') return false;
    return true;
  });

  // Notifications structure
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


  

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        generalSettings={generalSettings}
        allMenuItems={visibleMenuItems}
        currentPage={currentPage}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              
              {/* Empty space where breadcrumbs were */}
              <div className="hidden md:block">
                {/* Intentionally empty - removed breadcrumbs from header */}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari..."
                  className="pl-10 pr-4 py-2 w-64 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationDropdownRef}>
                <button
                  onClick={toggleNotificationDropdown}
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
                          notification.unread ? 'bg-orange-50/50' : ''
                        }`}>
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.unread ? 'bg-orange-500' : 'bg-slate-300'
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
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-900">{defaultUserData.name}</p>
                    <p className="text-xs text-slate-500">
                      {defaultUserData.is_admin_aleg && defaultUserData.anggota_legislatif 
                        ? `Admin ${defaultUserData.anggota_legislatif.nama}`
                        : defaultUserData.role
                      }
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                    <div className="p-4 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                        <p className="font-medium text-slate-900">{defaultUserData.name}</p>
                        <p className="text-sm text-slate-500">{defaultUserData.email}</p>
                        <p className="text-xs text-slate-400">
                          {defaultUserData.is_admin_aleg && defaultUserData.anggota_legislatif 
                            ? `Admin ${defaultUserData.anggota_legislatif.nama}`
                            : defaultUserData.role
                          }
                        </p>
                        </div>
                    </div>
                    </div>
                    <div className="p-2">
                    <Link 
                        to='/admin/profile'
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Profil Saya 2</span>
                    </Link>
                    
                    <Link 
                        to='/settings'
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Pengaturan</span>
                    </Link>
                    
                    <Link 
                        to='/help'
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <HelpCircle className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Bantuan</span>
                    </Link>
                    
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

        {/* Content Area */}
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

          {/* Children akan dirender di sini */}
          <div className="content-area">
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

    </div>
  );
};

export default DashboardLayout;
