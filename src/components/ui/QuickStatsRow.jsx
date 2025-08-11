import React from 'react';
import { Card } from './UIComponents';

// Reusable quick stats row to keep cards consistent across pages
// items: [{ icon: Icon, value: any, label: string, bgClass: string, iconClass: string }]
const QuickStatsRow = ({ items = [], className = 'grid grid-cols-1 md:grid-cols-4 gap-4' }) => {
  return (
    <div className={className}>
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx} className="p-4">
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-4 ${item.bgClass || 'bg-orange-100'}`}>
                {Icon && <Icon className={`w-6 h-6 ${item.iconClass || 'text-orange-600'}`} />}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                <p className="text-sm text-slate-600">{item.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickStatsRow;

