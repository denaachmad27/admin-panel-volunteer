import React from 'react';
import { Heart, Users, FileText, Calendar, AlertCircle } from 'lucide-react';
import ProtectedDashboardLayout from '../components/layout/ProtectedDashboardLayout';
import { Card } from '../components/ui/UIComponents';

const BantuanSosialPage = () => {
  return (
    <ProtectedDashboardLayout
      currentPage="bantuan"
      pageTitle="Bantuan Sosial"
      breadcrumbs={['Bantuan Sosial']}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Bantuan Sosial</h1>
              <p className="text-green-100">Kelola program bantuan sosial untuk masyarakat</p>
            </div>
            <div className="hidden md:block">
              <Heart className="w-16 h-16 text-green-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">24</p>
                <p className="text-sm text-slate-600">Program Aktif</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">1,248</p>
                <p className="text-sm text-slate-600">Penerima Bantuan</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">89</p>
                <p className="text-sm text-slate-600">Pengajuan Pending</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">12</p>
                <p className="text-sm text-slate-600">Program Bulan Ini</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Program Bantuan Aktif */}
          <Card title="Program Bantuan Aktif" subtitle="Daftar program yang sedang berjalan">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-900">Bantuan Pangan</h3>
                  <p className="text-sm text-slate-600">Program bantuan beras untuk keluarga kurang mampu</p>
                  <p className="text-xs text-green-600 mt-1">500 penerima aktif</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Aktif
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-900">Bantuan Pendidikan</h3>
                  <p className="text-sm text-slate-600">Beasiswa untuk siswa berprestasi kurang mampu</p>
                  <p className="text-xs text-blue-600 mt-1">150 penerima aktif</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Aktif
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-900">Bantuan Kesehatan</h3>
                  <p className="text-sm text-slate-600">Bantuan biaya pengobatan untuk masyarakat</p>
                  <p className="text-xs text-purple-600 mt-1">320 penerima aktif</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Aktif
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <button className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium">
                Lihat Semua Program →
              </button>
            </div>
          </Card>

          {/* Pengajuan Terbaru */}
          <Card title="Pengajuan Terbaru" subtitle="Pengajuan bantuan yang perlu direview">
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">Ahmad Santoso</p>
                  <p className="text-sm text-slate-600 mt-1">Mengajukan bantuan pangan untuk keluarga</p>
                  <p className="text-xs text-slate-400 mt-1">2 jam yang lalu</p>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">Siti Nurhaliza</p>
                  <p className="text-sm text-slate-600 mt-1">Mengajukan beasiswa pendidikan anak</p>
                  <p className="text-xs text-slate-400 mt-1">4 jam yang lalu</p>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Review
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Heart className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">Budi Hermawan</p>
                  <p className="text-sm text-slate-600 mt-1">Mengajukan bantuan kesehatan</p>
                  <p className="text-xs text-slate-400 mt-1">1 hari yang lalu</p>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Review
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                Lihat Semua Pengajuan →
              </button>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Tambah Program Baru
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Review Pengajuan
          </button>
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Laporan Bantuan
          </button>
        </div>

        {/* Temporary Page Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Halaman Sementara</p>
              <p className="text-sm text-yellow-700 mt-1">
                Ini adalah halaman sementara untuk menu Bantuan Sosial. Fitur lengkap sedang dalam pengembangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
};

export default BantuanSosialPage;