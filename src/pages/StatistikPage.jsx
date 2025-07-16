import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, Heart, MessageSquare, FileText, Calendar, Download, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';

const StatistikPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2024');

  // Mock data untuk statistik
  const overallStats = {
    totalUsers: 1248,
    totalPrograms: 24,
    totalComplaints: 89,
    totalNews: 156,
    growthUsers: 12.5,
    growthPrograms: 8.3,
    growthComplaints: -5.2,
    growthNews: 15.7
  };

  const monthlyData = [
    { month: 'Jan', users: 95, programs: 2, complaints: 12, news: 8 },
    { month: 'Feb', users: 108, programs: 1, complaints: 15, news: 12 },
    { month: 'Mar', users: 132, programs: 3, complaints: 8, news: 15 },
    { month: 'Apr', users: 156, programs: 2, complaints: 10, news: 11 },
    { month: 'May', users: 189, programs: 4, complaints: 7, news: 18 },
    { month: 'Jun', users: 201, programs: 1, complaints: 9, news: 14 },
    { month: 'Jul', users: 223, programs: 3, complaints: 11, news: 16 },
    { month: 'Aug', users: 245, programs: 2, complaints: 6, news: 13 },
    { month: 'Sep', users: 267, programs: 2, complaints: 8, news: 17 },
    { month: 'Oct', users: 289, programs: 1, complaints: 4, news: 19 },
    { month: 'Nov', users: 312, programs: 3, complaints: 5, news: 21 },
    { month: 'Dec', users: 98, programs: 0, complaints: 3, news: 8 }
  ];

  const programStats = [
    { name: 'Bantuan Pangan', recipients: 650, budget: 2500000000, status: 'Aktif' },
    { name: 'Bantuan Pendidikan', recipients: 320, budget: 1800000000, status: 'Aktif' },
    { name: 'Bantuan Kesehatan', recipients: 450, budget: 1200000000, status: 'Aktif' },
    { name: 'Bantuan Usaha', recipients: 180, budget: 950000000, status: 'Aktif' },
    { name: 'Bantuan Lansia', recipients: 220, budget: 750000000, status: 'Selesai' }
  ];

  const regionStats = [
    { region: 'Kelurahan Merdeka', population: 8500, programs: 6, coverage: 75 },
    { region: 'Kelurahan Kenanga', population: 7200, programs: 5, coverage: 68 },
    { region: 'Kelurahan Melati', population: 6800, programs: 4, coverage: 62 },
    { region: 'Kelurahan Mawar', population: 5900, programs: 4, coverage: 70 },
    { region: 'Kelurahan Dahlia', population: 4800, programs: 3, coverage: 58 }
  ];

  const complaintCategories = [
    { category: 'Infrastruktur', count: 35, percentage: 39.3 },
    { category: 'Sanitasi', count: 18, percentage: 20.2 },
    { category: 'Penerangan', count: 15, percentage: 16.9 },
    { category: 'Lingkungan', count: 12, percentage: 13.5 },
    { category: 'Keamanan', count: 9, percentage: 10.1 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getGrowthIcon = (growth) => {
    return growth > 0 ? TrendingUp : TrendingDown;
  };

  const getGrowthColor = (growth) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <DashboardLayout
      currentPage="statistics"
      pageTitle="Statistik"
      breadcrumbs={['Statistik']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Statistik & Analisis</h1>
              <p className="text-purple-100">Analisis data dan laporan komprehensif sistem</p>
            </div>
            <div className="hidden md:block">
              <BarChart3 className="w-16 h-16 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="daily">Harian</option>
              <option value="weekly">Mingguan</option>
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
            </select>
            
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{formatNumber(overallStats.totalUsers)}</p>
                  <p className="text-sm text-slate-600">Total Users</p>
                </div>
              </div>
              <div className={`flex items-center text-sm font-medium ${getGrowthColor(overallStats.growthUsers)}`}>
                {React.createElement(getGrowthIcon(overallStats.growthUsers), { className: "w-4 h-4 mr-1" })}
                {Math.abs(overallStats.growthUsers)}%
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{overallStats.totalPrograms}</p>
                  <p className="text-sm text-slate-600">Program Bantuan</p>
                </div>
              </div>
              <div className={`flex items-center text-sm font-medium ${getGrowthColor(overallStats.growthPrograms)}`}>
                {React.createElement(getGrowthIcon(overallStats.growthPrograms), { className: "w-4 h-4 mr-1" })}
                {Math.abs(overallStats.growthPrograms)}%
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 mr-4">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{overallStats.totalComplaints}</p>
                  <p className="text-sm text-slate-600">Pengaduan</p>
                </div>
              </div>
              <div className={`flex items-center text-sm font-medium ${getGrowthColor(overallStats.growthComplaints)}`}>
                {React.createElement(getGrowthIcon(overallStats.growthComplaints), { className: "w-4 h-4 mr-1" })}
                {Math.abs(overallStats.growthComplaints)}%
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{overallStats.totalNews}</p>
                  <p className="text-sm text-slate-600">Artikel</p>
                </div>
              </div>
              <div className={`flex items-center text-sm font-medium ${getGrowthColor(overallStats.growthNews)}`}>
                {React.createElement(getGrowthIcon(overallStats.growthNews), { className: "w-4 h-4 mr-1" })}
                {Math.abs(overallStats.growthNews)}%
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <Card title="Tren Bulanan 2024" subtitle="Data registrasi pengguna per bulan">
            <div className="space-y-4">
              <div className="h-64 flex items-end justify-between space-x-1 border-b border-slate-200 pb-4">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="flex flex-col items-center space-y-2">
                    <div 
                      className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-sm w-6 transition-all hover:from-purple-600 hover:to-purple-500"
                      style={{ 
                        height: `${(data.users / Math.max(...monthlyData.map(d => d.users))) * 200}px`,
                        minHeight: '4px'
                      }}
                    />
                    <span className="text-xs text-slate-600">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Tertinggi: {Math.max(...monthlyData.map(d => d.users))} users</span>
                <span>Rata-rata: {Math.round(monthlyData.reduce((sum, d) => sum + d.users, 0) / monthlyData.length)} users</span>
              </div>
            </div>
          </Card>

          {/* Complaint Categories */}
          <Card title="Kategori Pengaduan" subtitle="Distribusi pengaduan berdasarkan kategori">
            <div className="space-y-4">
              {complaintCategories.map((category, index) => {
                const colors = ['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500'];
                return (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                      <span className="text-sm font-medium text-slate-900">{category.category}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[index]}`}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600 w-12 text-right">{category.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Program Statistics */}
        <Card title="Statistik Program Bantuan" subtitle="Overview program bantuan dan anggaran">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Program</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Penerima</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Anggaran</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {programStats.map((program, index) => (
                  <tr key={program.name} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{program.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-600">{formatNumber(program.recipients)} orang</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-600">{formatCurrency(program.budget)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        program.status === 'Aktif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {program.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-900">Total Anggaran:</span>
              <span className="font-bold text-slate-900">
                {formatCurrency(programStats.reduce((sum, program) => sum + program.budget, 0))}
              </span>
            </div>
          </div>
        </Card>

        {/* Regional Coverage */}
        <Card title="Cakupan Wilayah" subtitle="Distribusi program bantuan per kelurahan">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regionStats.map((region) => (
              <div key={region.region} className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-900">{region.region}</h4>
                  <span className="text-sm text-slate-600">{region.coverage}%</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Populasi:</span>
                    <span>{formatNumber(region.population)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Program:</span>
                    <span>{region.programs}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      style={{ width: `${region.coverage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Pertumbuhan Positif</h3>
              <p className="text-sm text-slate-600">Registrasi pengguna naik 12.5% bulan ini</p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Program Efektif</h3>
              <p className="text-sm text-slate-600">1,820 penerima bantuan aktif</p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Respon Cepat</h3>
              <p className="text-sm text-slate-600">Pengaduan turun 5.2% bulan ini</p>
            </div>
          </Card>
        </div>

        {/* Temporary Page Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Halaman Sementara</p>
              <p className="text-sm text-yellow-700 mt-1">
                Ini adalah halaman sementara untuk menu Statistik. Fitur lengkap dan chart interaktif sedang dalam pengembangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StatistikPage;