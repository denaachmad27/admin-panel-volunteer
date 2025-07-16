import React from 'react';
import { X } from 'lucide-react';

// Komponen Modal yang dapat digunakan kembali
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  size = 'lg',
  className = '' 
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    '5xl': 'max-w-7xl'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-slate-600 mt-1 text-sm">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-200 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;