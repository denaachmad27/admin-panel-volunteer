import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Check, X, Upload } from 'lucide-react';

// 🧩 Input Field Standard
export const InputField = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  disabled = false,
  icon,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <icon className="w-4 h-4 text-slate-400" />
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            icon ? 'pl-10' : ''
          } ${
            error ? 'border-red-300 bg-red-50' : 'border-slate-300'
          } ${
            disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'
          }`}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

// 🧩 Textarea Standard
export const TextareaField = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  disabled = false,
  rows = 4,
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical ${
          error ? 'border-red-300 bg-red-50' : 'border-slate-300'
        } ${
          disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'
        }`}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

// 🧩 Select Field Standard
export const SelectField = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  error, 
  required = false,
  disabled = false,
  placeholder = "Pilih opsi...",
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          error ? 'border-red-300 bg-red-50' : 'border-slate-300'
        } ${
          disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'
        }`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

// 🧩 File Upload Standard
export const FileUploadField = ({ 
  label, 
  accept, 
  onChange, 
  error, 
  required = false,
  disabled = false,
  multiple = false,
  maxSize = 5 // MB
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    setFiles(newFiles);
    if (onChange) onChange(multiple ? newFiles : newFiles[0]);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-300'
        } ${
          error ? 'border-red-300 bg-red-50' : ''
        } ${
          disabled ? 'bg-slate-100 cursor-not-allowed' : 'hover:border-slate-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-600">
          Drag & drop file di sini, atau <span className="text-blue-600 font-medium">browse</span>
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Max {maxSize}MB {accept && `• ${accept}`}
        </p>
        
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-100 rounded">
                <span className="text-sm text-slate-700">{file.name}</span>
                <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)}MB</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

// 🧩 Button Standard
export const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  loading = false, 
  disabled = false,
  icon,
  onClick,
  type = "button",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
      )}
      {icon && !loading && <icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

// 🧩 Alert Standard
export const Alert = ({ 
  type = "info", 
  title, 
  message, 
  onClose, 
  className = "" 
}) => {
  const types = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: Check,
      iconColor: "text-green-600",
      titleColor: "text-green-800",
      messageColor: "text-green-700"
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: X,
      iconColor: "text-red-600",
      titleColor: "text-red-800",
      messageColor: "text-red-700"
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: AlertCircle,
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-800",
      messageColor: "text-yellow-700"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: AlertCircle,
      iconColor: "text-blue-600",
      titleColor: "text-blue-800",
      messageColor: "text-blue-700"
    }
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`border rounded-lg p-4 ${config.bg} ${config.border} ${className}`}>
      <div className="flex">
        <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5`} />
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.titleColor}`}>
              {title}
            </h3>
          )}
          {message && (
            <p className={`text-sm ${config.messageColor} ${title ? 'mt-1' : ''}`}>
              {message}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 ${config.iconColor} hover:opacity-70`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// 🧩 Badge Standard
export const Badge = ({ 
  children, 
  variant = "default", 
  size = "md" 
}) => {
  const variants = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

// 🧩 Modal Standard
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md",
  hideCloseButton = false 
}) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4"
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizes[size]} sm:w-full`}>
          {/* Header */}
          {(title || !hideCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              {title && (
                <h3 className="text-lg font-semibold text-slate-900">
                  {title}
                </h3>
              )}
              {!hideCloseButton && (
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// 🧩 Loading Spinner Standard
export const LoadingSpinner = ({ size = "md", text }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizes[size]}`}></div>
      {text && <p className="text-slate-600 mt-4 text-sm">{text}</p>}
    </div>
  );
};

// 🧩 Card Standard
export const Card = ({ 
  title, 
  subtitle, 
  children, 
  actions,
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 ${className}`}>
      {(title || subtitle || actions) && (
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
              {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
            </div>
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

// 🧩 Tabs Standard
export const Tabs = ({ 
  tabs = [], 
  activeTab, 
  onChange 
}) => {
  return (
    <div className="border-b border-slate-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange && onChange(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="ml-2 px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

// 🧩 Progress Bar Standard
export const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  label, 
  showPercentage = true,
  color = "blue" 
}) => {
  const percentage = Math.round((value / max) * 100);
  
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500"
  };

  return (
    <div className="space-y-2">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
          {showPercentage && <span className="text-sm text-slate-600">{percentage}%</span>}
        </div>
      )}
      
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// 🧩 Export semua components
export default {
  InputField,
  TextareaField,
  SelectField,
  FileUploadField,
  Button,
  Alert,
  Badge,
  Modal,
  LoadingSpinner,
  Card,
  Tabs,
  ProgressBar
};