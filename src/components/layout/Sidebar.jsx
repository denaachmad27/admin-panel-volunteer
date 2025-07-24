
import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
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
  UserCheck
} from 'lucide-react';
import LogoDisplay from '../ui/LogoDisplay';

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  generalSettings,
  allMenuItems,
  currentPage,
}) => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const isSubmenuActive = (item) => {
    if (!item.submenu) return false;
    return item.submenu.some(subItem => window.location.pathname === subItem.path);
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
    const isSubmenuItemActive = isSubmenuActive(item);
    const isExpanded = expandedMenus[item.id] || isSubmenuItemActive; // Auto-expand if submenu is active
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
      <div key={item.id}>
        {/* Main Menu Item */}
        {hasSubmenu ? (
          <div
            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer ${
              isActive 
                ? 'bg-orange-500 text-white shadow-lg' 
                : isSubmenuItemActive
                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            onClick={(e) => {
              e.preventDefault();
              toggleSubmenu(item.id);
            }}
          >
            <div className="flex items-center space-x-3">
              <Icon className={`w-5 h-5 ${
                isActive ? 'text-white' : 
                isSubmenuItemActive ? 'text-orange-600' :
                'text-slate-400 group-hover:text-slate-600'
              }`} />
              <span className="font-medium">{item.title}</span>
              {item.badge && (
                <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                  item.badgeColor || 'bg-orange-100 text-orange-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </div>
            {hasSubmenu && (
              <div className="ml-auto">
                {isExpanded ? (
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-white' : 
                    isSubmenuItemActive ? 'text-orange-600' :
                    'text-slate-400 group-hover:text-slate-600'
                  }`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-white' : 
                    isSubmenuItemActive ? 'text-orange-600' :
                    'text-slate-400 group-hover:text-slate-600'
                  }`} />
                )}
              </div>
            )}
          </div>
        ) : (
          <Link
            to={item.path}
            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer ${
              isActive 
                ? 'bg-orange-500 text-white shadow-lg' 
                : isSubmenuItemActive
                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon className={`w-5 h-5 ${
                isActive ? 'text-white' : 
                isSubmenuItemActive ? 'text-orange-600' :
                'text-slate-400 group-hover:text-slate-600'
              }`} />
              <span className="font-medium">{item.title}</span>
              {item.badge && (
                <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                  item.badgeColor || 'bg-orange-100 text-orange-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </div>
          </Link>
        )}
        
        {/* Submenu Items */}
        {hasSubmenu && isExpanded && (
          <div className="mt-1 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.submenu.map((subItem, index) => {
              const isSubItemActive = window.location.pathname === subItem.path;
              return (
                <Link
                  key={index}
                  to={subItem.path}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                    isSubItemActive
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700'
                  }`}
                  onClick={(e) => {
                    // Don't close submenu when clicking submenu item
                    e.stopPropagation();
                  }}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      isSubItemActive ? 'bg-white' : 'bg-slate-400'
                    }`}></div>
                  </div>
                  <span>{subItem.title}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <LogoDisplay
          logoUrl={generalSettings.logo_url}
          siteName={generalSettings.site_name || 'Admin Panel'}
          organization={generalSettings.organization}
          size="sm"
          textColor="text-slate-800"
          showText={true}
        />
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
      </nav>
    </div>
  );
};

export default memo(Sidebar);
