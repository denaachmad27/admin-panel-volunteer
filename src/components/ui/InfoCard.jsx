import React from 'react';

// Komponen Info Card yang dapat digunakan kembali
const InfoCard = ({ 
  title, 
  children, 
  icon: Icon,
  variant = 'default',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-sm hover:shadow-md transition-shadow',
    primary: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow',
    success: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow',
    warning: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow-md transition-shadow',
    danger: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-sm hover:shadow-md transition-shadow'
  };

  const iconColors = {
    default: 'text-slate-600',
    primary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
  };

  return (
    <div className={`border rounded-xl p-4 ${variants[variant]} ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-200/50">
          {Icon && (
            <div className={`p-1.5 rounded-lg ${variant === 'default' ? 'bg-slate-100' : `bg-white/50`}`}>
              <Icon className={`h-4 w-4 ${iconColors[variant]}`} />
            </div>
          )}
          {title && <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>}
        </div>
      )}
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};

// Komponen Info Item untuk di dalam InfoCard
export const InfoItem = ({ 
  label, 
  value, 
  icon: Icon,
  className = '' 
}) => (
  <div className={`flex items-center space-x-3 py-1 ${className}`}>
    {Icon && (
      <div className="p-1 rounded-md bg-slate-100">
        <Icon className="h-3 w-3 text-slate-500 flex-shrink-0" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
        <span className="text-sm font-medium text-slate-900 break-words">{value || '-'}</span>
      </div>
    </div>
  </div>
);

export default InfoCard;