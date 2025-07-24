import React, { useState, useEffect } from 'react';
import { X, Save, Loader, Shield, Users, Eye, Edit3, Trash2, Settings } from 'lucide-react';

const PermissionModal = ({ isOpen, onClose, user = null }) => {
  const [permissions, setPermissions] = useState({
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false
    },
    bantuan: {
      view: false,
      create: false,
      edit: false,
      delete: false
    },
    news: {
      view: false,
      create: false,
      edit: false,
      delete: false
    },
    complaints: {
      view: false,
      create: false,
      edit: false,
      delete: false
    },
    reports: {
      view: false,
      create: false,
      edit: false,
      delete: false
    }
  });
  const [loading, setLoading] = useState(false);

  const modules = [
    { 
      key: 'users', 
      name: 'Manajemen User', 
      icon: Users,
      description: 'Kelola pengguna sistem'
    },
    { 
      key: 'bantuan', 
      name: 'Bantuan Sosial', 
      icon: Shield,
      description: 'Kelola program bantuan'
    },
    { 
      key: 'news', 
      name: 'Berita & Artikel', 
      icon: Edit3,
      description: 'Kelola konten berita'
    },
    { 
      key: 'complaints', 
      name: 'Pengaduan', 
      icon: Settings,
      description: 'Kelola pengaduan masyarakat'
    },
    { 
      key: 'reports', 
      name: 'Laporan', 
      icon: Eye,
      description: 'Akses laporan dan statistik'
    }
  ];

  const actions = [
    { key: 'view', name: 'Lihat', icon: Eye },
    { key: 'create', name: 'Tambah', icon: Users },
    { key: 'edit', name: 'Edit', icon: Edit3 },
    { key: 'delete', name: 'Hapus', icon: Trash2 }
  ];

  // Set default permissions based on role
  useEffect(() => {
    if (isOpen && user) {
      let defaultPermissions = { ...permissions };
      
      if (user.role === 'admin') {
        // Admin has all permissions
        Object.keys(defaultPermissions).forEach(module => {
          Object.keys(defaultPermissions[module]).forEach(action => {
            defaultPermissions[module][action] = true;
          });
        });
      } else if (user.role === 'staff') {
        // Staff has limited permissions
        Object.keys(defaultPermissions).forEach(module => {
          defaultPermissions[module].view = true;
          if (module !== 'users') {
            defaultPermissions[module].create = true;
            defaultPermissions[module].edit = true;
          }
        });
      } else {
        // User has minimal permissions
        defaultPermissions.bantuan.view = true;
        defaultPermissions.news.view = true;
        defaultPermissions.complaints.view = true;
        defaultPermissions.complaints.create = true;
      }
      
      setPermissions(defaultPermissions);
    }
  }, [isOpen, user]);

  const handlePermissionChange = (module, action, checked) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: checked
      }
    }));
  };

  const handleSelectAll = (module, checked) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        view: checked,
        create: checked,
        edit: checked,
        delete: checked
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Permissions updated:', permissions);
      onClose();
    } catch (error) {
      console.error('Error updating permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Atur Permissions</h2>
            <p className="text-sm text-slate-600 mt-1">
              Kelola hak akses untuk <strong>{user.name}</strong> ({user.role})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              const modulePermissions = permissions[module.key];
              const allSelected = Object.values(modulePermissions).every(p => p);
              const someSelected = Object.values(modulePermissions).some(p => p);

              return (
                <div key={module.key} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                        <Icon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{module.name}</h3>
                        <p className="text-sm text-slate-500">{module.description}</p>
                      </div>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={input => {
                          if (input) input.indeterminate = someSelected && !allSelected;
                        }}
                        onChange={(e) => handleSelectAll(module.key, e.target.checked)}
                        className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-medium text-slate-700">
                        Pilih Semua
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {actions.map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <label
                          key={action.key}
                          className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={modulePermissions[action.key]}
                            onChange={(e) => handlePermissionChange(module.key, action.key, e.target.checked)}
                            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                          />
                          <ActionIcon className="w-4 h-4 ml-2 mr-1 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">
                            {action.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-all duration-200 font-medium"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-200 flex items-center disabled:opacity-50 font-medium shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan Permissions
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;