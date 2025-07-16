import React from 'react';

// Komponen Empty State yang dapat digunakan kembali
const EmptyState = ({ 
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
  className = '' 
}) => {
  const variants = {
    default: 'text-slate-400',
    primary: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400'
  };

  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <Icon className={`mx-auto h-16 w-16 ${variants[variant]} mb-4`} />
      )}
      <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;