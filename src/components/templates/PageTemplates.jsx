import React from 'react';
import { ChevronRight, Plus, Search, Filter, Download, Upload, Edit, Trash2, Eye } from 'lucide-react';

// 🎨 TEMPLATE 1: Standard Page Layout
export const StandardPageTemplate = ({ 
  title, 
  subtitle, 
  children,
  actions = [],
  tabs = [],
  activeTab = null
}) => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
          </div>
          
          {/* Action Buttons */}
          {actions.length > 0 && (
            <div className="flex items-center space-x-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    action.variant === 'primary' 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : action.variant === 'danger'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {action.icon && <action.icon className="w-4 h-4" />}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        {tabs.length > 0 && (
          <div className="mt-6 border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => tab.onClick && tab.onClick(tab.id)}
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
        )}
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

// 🎨 TEMPLATE 2: Table Page (untuk daftar data)
export const TablePageTemplate = ({ 
  title,
  subtitle,
  data = [],
  columns = [],
  searchable = true,
  filterable = false,
  actions = [],
  onSearch,
  onFilter,
  loading = false
}) => {
  return (
    <StandardPageTemplate
      title={title}
      subtitle={subtitle}
      actions={actions}
    >
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari data..."
                onChange={(e) => onSearch && onSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            {filterable && (
              <button 
                onClick={onFilter}
                className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">Filter</span>
              </button>
            )}
            <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-700">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-500 mt-2">Memuat data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-slate-500">
                      Tidak ada data yang ditemukan
                    </td>
                  </tr>
                ) : (
                  data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-slate-50">
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </StandardPageTemplate>
  );
};

// 🎨 TEMPLATE 3: Form Page (untuk create/edit)
export const FormPageTemplate = ({ 
  title,
  subtitle,
  children,
  onSubmit,
  onCancel,
  submitLabel = "Simpan",
  cancelLabel = "Batal",
  loading = false,
  backUrl
}) => {
  return (
    <StandardPageTemplate
      title={title}
      subtitle={subtitle}
    >
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {children}
          
          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <div>
              {backUrl && (
                <a 
                  href={backUrl}
                  className="text-sm text-slate-500 hover:text-slate-700 flex items-center space-x-1"
                >
                  <span>← Kembali ke daftar</span>
                </a>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                <span>{submitLabel}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </StandardPageTemplate>
  );
};

// 🎨 TEMPLATE 4: Detail Page (untuk view detail)
export const DetailPageTemplate = ({ 
  title,
  subtitle,
  data = {},
  sections = [],
  actions = [],
  backUrl
}) => {
  return (
    <StandardPageTemplate
      title={title}
      subtitle={subtitle}
      actions={actions}
    >
      {backUrl && (
        <div className="mb-4">
          <a 
            href={backUrl}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center space-x-1"
          >
            <span>← Kembali</span>
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{section.title}</h3>
              <div className="space-y-4">
                {section.fields?.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-slate-500">{field.label}</dt>
                    <dd className="text-sm text-slate-900 col-span-2">
                      {field.render ? field.render(data[field.key], data) : data[field.key] || '-'}
                    </dd>
                  </div>
                ))}
                {section.content && section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Info Cepat</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Status</span>
                <span className="text-sm font-medium text-green-600">Aktif</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Dibuat</span>
                <span className="text-sm text-slate-900">15 Jan 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Diupdate</span>
                <span className="text-sm text-slate-900">20 Jan 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StandardPageTemplate>
  );
};

// 🎨 TEMPLATE 5: Stats Cards (untuk dashboard/statistik)
export const StatsCardTemplate = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              {stat.change && (
                <p className={`text-sm ${
                  stat.change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change.type === 'increase' ? '↗' : '↘'} {stat.change.value}
                </p>
              )}
            </div>
            {stat.icon && (
              <div className={`p-3 rounded-lg ${stat.iconBg || 'bg-blue-100'}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor || 'text-blue-600'}`} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// 🎨 Export default untuk mudah import
export default {
  StandardPageTemplate,
  TablePageTemplate,
  FormPageTemplate,
  DetailPageTemplate,
  StatsCardTemplate
};