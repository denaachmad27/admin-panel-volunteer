import React from 'react';

// Komponen Progress Bar yang dapat digunakan kembali
const ProgressBar = ({ 
  percentage, 
  size = 'md', 
  variant = 'primary',
  showLabel = true,
  className = '' 
}) => {
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variants = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };

  const getVariantByPercentage = (percent) => {
    if (percent === 100) return 'success';
    if (percent >= 75) return 'primary';
    if (percent >= 50) return 'warning';
    return 'danger';
  };

  const actualVariant = variant === 'auto' ? getVariantByPercentage(percentage) : variant;

  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-slate-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div 
          className={`${variants[actualVariant]} ${sizes[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-slate-500">Kelengkapan Profil</span>
          <span className="text-xs font-medium text-slate-700">{percentage}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;