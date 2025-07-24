import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

// Komponen Tab Navigation yang dapat digunakan kembali
const TabNavigation = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  completionData = {},
  className = '' 
}) => {
  const getCompletionIcon = (tabId) => {
    const isCompleted = completionData[tabId];
    if (isCompleted) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-400" />;
  };

  const getTabStyles = (tab, isActive) => {
    const isCompleted = completionData[tab.id];
    
    if (isActive) {
      return {
        border: 'border-orange-500',
        text: 'text-orange-600',
        bg: 'bg-orange-50'
      };
    }
    
    if (isCompleted) {
      return {
        border: 'border-transparent',
        text: 'text-slate-700 hover:text-slate-900',
        bg: 'hover:bg-slate-50'
      };
    }
    
    return {
      border: 'border-transparent',
      text: 'text-slate-500 hover:text-slate-700',
      bg: 'hover:bg-slate-50'
    };
  };

  return (
    <div className={`border-b border-slate-200 ${className}`}>
      <nav className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const styles = getTabStyles(tab, isActive);
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${styles.border} ${styles.text} ${styles.bg}`}
            >
              <Icon className={`h-4 w-4 ${isActive ? tab.color : 'text-slate-400'}`} />
              <span>{tab.name}</span>
              {getCompletionIcon(tab.id)}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNavigation;