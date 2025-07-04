import React, { useState } from 'react';
import { ArrowLeft, Save, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProtectedDashboardLayout from '../components/layout/ProtectedDashboardLayout';
import { Card } from '../components/ui/UIComponents';
import { bantuanSosialAPI } from '../services/api';

const TambahBantuanPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    nama_bantuan: '',
    deskripsi: '',
    jenis_bantuan: '',
    nominal: '',
    kuota: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    syarat_bantuan: '',
    dokumen_diperlukan: ''
  });

  const jenisOptions = [
    'Uang Tunai',
    'Sembako',
    'Peralatan',
    'Pelatihan',
    'Kesehatan',
    'Pendidikan'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.nama_bantuan.trim()) {
      newErrors.nama_bantuan = 'Nama bantuan wajib diisi';
    }

    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Deskripsi wajib diisi';
    }

    if (!formData.jenis_bantuan) {
      newErrors.jenis_bantuan = 'Jenis bantuan wajib dipilih';
    }

    if (!formData.kuota) {
      newErrors.kuota = 'Kuota wajib diisi';
    } else if (parseInt(formData.kuota) < 1) {
      newErrors.kuota = 'Kuota minimal 1';
    }

    if (!formData.tanggal_mulai) {
      newErrors.tanggal_mulai = 'Tanggal mulai wajib diisi';
    }

    if (!formData.tanggal_selesai) {
      newErrors.tanggal_selesai = 'Tanggal selesai wajib diisi';
    } else if (formData.tanggal_mulai && formData.tanggal_selesai <= formData.tanggal_mulai) {
      newErrors.tanggal_selesai = 'Tanggal selesai harus setelah tanggal mulai';
    }

    if (!formData.syarat_bantuan.trim()) {
      newErrors.syarat_bantuan = 'Syarat bantuan wajib diisi';
    }

    if (!formData.dokumen_diperlukan.trim()) {
      newErrors.dokumen_diperlukan = 'Dokumen yang diperlukan wajib diisi';
    }

    // Nominal validation (optional)
    if (formData.nominal && parseFloat(formData.nominal) < 0) {
      newErrors.nominal = 'Nominal tidak boleh negatif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage('Harap perbaiki kesalahan pada form');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Convert nominal to number if provided
      const submitData = {
        ...formData,
        nominal: formData.nominal ? parseFloat(formData.nominal) : null,
        kuota: parseInt(formData.kuota)
      };

      const response = await bantuanSosialAPI.create(submitData);

      if (response.data.status === 'success') {
        setMessage('Program bantuan berhasil dibuat!');
        setTimeout(() => {
          navigate('/daftar-bantuan');
        }, 2000);
      } else {
        setMessage('Gagal membuat program bantuan');
      }
    } catch (err) {
      console.error('Error creating bantuan sosial:', err);
      
      if (err.response?.status === 422) {
        // Handle validation errors from backend
        const backendErrors = err.response.data.errors || {};
        setErrors(backendErrors);
        setMessage('Terdapat kesalahan validasi pada form');
      } else {
        setMessage(err.response?.data?.message || 'Gagal membuat program bantuan');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nama_bantuan: '',
      deskripsi: '',
      jenis_bantuan: '',
      nominal: '',
      kuota: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      syarat_bantuan: '',
      dokumen_diperlukan: ''
    });
    setErrors({});
    setMessage('');
  };

  return (
    <ProtectedDashboardLayout
      currentPage="bantuan"
      pageTitle="Tambah Program Bantuan"
      breadcrumbs={['Bantuan Sosial', 'Tambah Program']}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/daftar-bantuan')}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Tambah Program Bantuan</h1>
              <p className="text-slate-600">Buat program bantuan sosial baru untuk masyarakat</p>
            </div>
          </div>
        </div>

        {/* Alert Message */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center ${
            message.includes('berhasil') 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : message.includes('kesalahan') || message.includes('Gagal')
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
          }`}>
            {message.includes('berhasil') && <CheckCircle className="w-5 h-5 mr-2" />}
            {(message.includes('kesalahan') || message.includes('Gagal')) && <AlertCircle className="w-5 h-5 mr-2" />}
            {message.includes('validasi') && <Info className="w-5 h-5 mr-2" />}
            {message}
          </div>
        )}

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Informasi Dasar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Bantuan */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Program Bantuan *
                  </label>
                  <input
                    type="text"
                    name="nama_bantuan"
                    value={formData.nama_bantuan}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.nama_bantuan ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Contoh: Program Bantuan Sembako Ramadan 2024"
                  />
                  {errors.nama_bantuan && (
                    <p className="text-sm text-red-600 mt-1">{errors.nama_bantuan}</p>
                  )}
                </div>

                {/* Jenis Bantuan */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Jenis Bantuan *
                  </label>
                  <select
                    name="jenis_bantuan"
                    value={formData.jenis_bantuan}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.jenis_bantuan ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Pilih jenis bantuan</option>
                    {jenisOptions.map(jenis => (
                      <option key={jenis} value={jenis}>{jenis}</option>
                    ))}
                  </select>
                  {errors.jenis_bantuan && (
                    <p className="text-sm text-red-600 mt-1">{errors.jenis_bantuan}</p>
                  )}
                </div>

                {/* Nominal */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nominal (Opsional)
                  </label>
                  <input
                    type="number"
                    name="nominal"
                    value={formData.nominal}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.nominal ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Contoh: 500000"
                  />
                  {errors.nominal && (
                    <p className="text-sm text-red-600 mt-1">{errors.nominal}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">Kosongkan jika tidak ada nominal tetap</p>
                </div>

                {/* Kuota */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kuota Penerima *
                  </label>
                  <input
                    type="number"
                    name="kuota"
                    value={formData.kuota}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.kuota ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Contoh: 100"
                  />
                  {errors.kuota && (
                    <p className="text-sm text-red-600 mt-1">{errors.kuota}</p>
                  )}
                </div>

                {/* Tanggal Mulai */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tanggal Mulai *
                  </label>
                  <input
                    type="date"
                    name="tanggal_mulai"
                    value={formData.tanggal_mulai}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.tanggal_mulai ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.tanggal_mulai && (
                    <p className="text-sm text-red-600 mt-1">{errors.tanggal_mulai}</p>
                  )}
                </div>

                {/* Tanggal Selesai */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tanggal Selesai *
                  </label>
                  <input
                    type="date"
                    name="tanggal_selesai"
                    value={formData.tanggal_selesai}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.tanggal_selesai ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.tanggal_selesai && (
                    <p className="text-sm text-red-600 mt-1">{errors.tanggal_selesai}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deskripsi Program *
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.deskripsi ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
                placeholder="Jelaskan tujuan, manfaat, dan detail program bantuan..."
              />
              {errors.deskripsi && (
                <p className="text-sm text-red-600 mt-1">{errors.deskripsi}</p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Persyaratan</h2>
              <div className="space-y-4">
                {/* Syarat Bantuan */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Syarat Bantuan *
                  </label>
                  <textarea
                    name="syarat_bantuan"
                    value={formData.syarat_bantuan}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.syarat_bantuan ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Contoh: Warga miskin dengan pendapatan di bawah UMR, memiliki KTP aktif, tidak sedang menerima bantuan lain..."
                  />
                  {errors.syarat_bantuan && (
                    <p className="text-sm text-red-600 mt-1">{errors.syarat_bantuan}</p>
                  )}
                </div>

                {/* Dokumen Diperlukan */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Dokumen yang Diperlukan *
                  </label>
                  <textarea
                    name="dokumen_diperlukan"
                    value={formData.dokumen_diperlukan}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.dokumen_diperlukan ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Contoh: Fotokopi KTP, Surat Keterangan Tidak Mampu, Kartu Keluarga..."
                  />
                  {errors.dokumen_diperlukan && (
                    <p className="text-sm text-red-600 mt-1">{errors.dokumen_diperlukan}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-6 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Form
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/daftar-bantuan')}
                  disabled={loading}
                  className="px-6 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Program
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </ProtectedDashboardLayout>
  );
};

export default TambahBantuanPage;