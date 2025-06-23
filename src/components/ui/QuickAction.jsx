import React from 'react';

const QuickAction = ({ title, icon: Icon, color = 'blue', onClick }) => {
  const colorClasses = {
    blue: {
      button: 'hover:border-blue-300 hover:bg-blue-50',
      icon: 'group-hover:text-blue-600',
      text: 'group-hover:text-blue-700'
    },
    green: {
      button: 'hover:border-green-300 hover:bg-green-50',
      icon: 'group-hover:text-green-600',
      text: 'group-hover:text-green-700'
    },
    purple: {
      button: 'hover:border-purple-300 hover:bg-purple-50',
      icon: 'group-hover:text-purple-600',
      text: 'group-hover:text-purple-700'
    },
    yellow: {
      button: 'hover:border-yellow-300 hover:bg-yellow-50',
      icon: 'group-hover:text-yellow-600',
      text: 'group-hover:text-yellow-700'
    }
  };

  const currentColor = colorClasses[color];

  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center space-x-3 p-3 rounded-lg border border-slate-200 transition-all group ${currentColor.button}`}
    >
      {Icon && (
        <Icon className={`w-5 h-5 text-slate-600 ${currentColor.icon}`} />
      )}
      <span className={`text-sm font-medium text-slate-700 ${currentColor.text}`}>
        {title}
      </span>
    </button>
  );
};

export default QuickAction;