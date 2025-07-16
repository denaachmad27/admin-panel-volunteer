import React from 'react';

// Komponen StatCard yang dapat digunakan kembali
const StatCard = ({ title, value, icon: Icon, color, subtitle, className = '' }) => (
  <div className={`bg-white rounded-lg p-6 shadow-sm border border-slate-200 ${className}`}>
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export default StatCard;