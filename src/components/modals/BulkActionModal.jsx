import React, { useState } from 'react';
import { X, Users, CheckCircle, XCircle, Trash2, Loader, AlertTriangle } from 'lucide-react';

const BulkActionModal = ({ isOpen, onClose, users = [], onBulkAction }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedAction, setSelectedAction] = useState('');
  const [loading, setLoading] = useState(false);

  const actions = [
    {
      value: 'activate',
      label: 'Aktifkan Users',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Mengaktifkan akun pengguna yang dipilih'
    },
    {
      value: 'deactivate',
      label: 'Nonaktifkan Users',
      icon: XCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Menonaktifkan akun pengguna yang dipilih'
    },
    {
      value: 'delete',
      label: 'Hapus Users',
      icon: Trash2,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Menghapus permanen pengguna yang dipilih'
    }
  ];

  const handleUserSelect = (userId, checked) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAction || selectedUsers.length === 0) return;

    setLoading(true);
    try {
      await onBulkAction(selectedAction, selectedUsers);
      onClose();
      // Reset state
      setSelectedUsers([]);
      setSelectedAction('');
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Gagal melakukan bulk action: ' + (typeof error === 'string' ? error : 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  const selectedAction_obj = actions.find(action => action.value === selectedAction);
  const allSelected = selectedUsers.length === users.length && users.length > 0;
  const someSelected = selectedUsers.length > 0 && selectedUsers.length < users.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Bulk Actions</h2>
            <p className="text-sm text-slate-600 mt-1">
              Lakukan aksi massal untuk beberapa pengguna sekaligus
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
        <div className="p-6 space-y-6">
          {/* Action Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Pilih Aksi yang Akan Dilakukan
            </label>
            <div className="grid gap-3">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <label
                    key={action.value}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedAction === action.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bulkAction"
                      value={action.value}
                      checked={selectedAction === action.value}
                      onChange={(e) => setSelectedAction(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${action.bgColor}`}>
                      <Icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{action.label}</h3>
                      <p className="text-sm text-slate-500">{action.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* User Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700">
                Pilih Pengguna ({selectedUsers.length}/{users.length})
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={input => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-slate-700">
                  Pilih Semua
                </span>
              </label>
            </div>

            <div className="border border-slate-200 rounded-xl max-h-60 overflow-y-auto">
              {users.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>Tidak ada pengguna tersedia</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {users.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => handleUserSelect(user.id, e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center ml-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-medium text-xs mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{user.name}</div>
                          <div className="text-xs text-slate-500">
                            {user.email} • {user.role}
                            {user.is_active ? (
                              <span className="text-green-600 ml-2">Aktif</span>
                            ) : (
                              <span className="text-red-600 ml-2">Tidak Aktif</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Warning */}
          {selectedAction === 'delete' && selectedUsers.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Peringatan!</p>
                  <p className="text-sm text-red-700 mt-1">
                    Tindakan ini akan menghapus {selectedUsers.length} pengguna secara permanen. 
                    Data yang terkait dengan pengguna tersebut juga akan ikut terhapus dan tidak dapat dikembalikan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedAction && selectedUsers.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Ringkasan:</strong> {selectedAction_obj?.label} untuk {selectedUsers.length} pengguna
              </p>
            </div>
          )}
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
            onClick={handleSubmit}
            disabled={loading || !selectedAction || selectedUsers.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center disabled:opacity-50 font-medium shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                {selectedAction_obj?.icon && <selectedAction_obj.icon className="w-4 h-4 mr-2" />}
                Jalankan Aksi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionModal;