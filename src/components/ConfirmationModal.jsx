import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Konfirmasi', 
  cancelText = 'Batal',
  type = 'warning' // 'warning', 'danger', 'success', 'info'
}) => {
  if (!isOpen) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          iconBgColor: 'bg-red-100',
          confirmButtonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          borderColor: 'border-red-200'
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          iconBgColor: 'bg-green-100',
          confirmButtonColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
          borderColor: 'border-green-200'
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-600',
          iconBgColor: 'bg-blue-100',
          confirmButtonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          borderColor: 'border-blue-200'
        };
      default: // warning
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          iconBgColor: 'bg-yellow-100',
          confirmButtonColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          borderColor: 'border-yellow-200'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${config.iconBgColor}`}>
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.confirmButtonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;