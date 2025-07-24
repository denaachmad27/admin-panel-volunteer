import React, { useState } from 'react';
import { ArrowLeft, Save, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, Button, InputField, SelectField, TextareaField } from '../components/ui/UIComponents';
import anggotaLegislatifService from '../services/anggotaLegislatifService';

const TambahAnggotaLegislatif = () => {
  const [formData, setFormData] = useState({
    kode_aleg: '',
    nama_lengkap: '',
    jenis_kelamin: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    kelurahan: '',
    kecamatan: '',
    kota: '',
    provinsi: '',
    kode_pos: '',
    no_telepon: '',
    email: '',
    jabatan_saat_ini: '',
    partai_politik: '',
    daerah_pemilihan: '',
    riwayat_jabatan: '',
    foto_profil: null,
    status: 'Aktif'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        foto_profil: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      foto_profil: null
    }));
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage('');

    try {
      await anggotaLegislatifService.createAnggotaLegislatif(formData);
      setMessage('Anggota legislatif berhasil ditambahkan!');
      
      // Reset form
      setFormData({
        kode_aleg: '',
        nama_lengkap: '',
        jenis_kelamin: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        alamat: '',
        kelurahan: '',
        kecamatan: '',
        kota: '',
        provinsi: '',
        kode_pos: '',
        no_telepon: '',
        email: '',
        jabatan_saat_ini: '',
        partai_politik: '',
        daerah_pemilihan: '',
        riwayat_jabatan: '',
        foto_profil: null,
        status: 'Aktif'
      });
      setPreviewImage(null);

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/anggota-legislatif';
      }, 2000);

    } catch (err) {
      if (err.message.includes(',')) {
        // Multiple validation errors
        const errorArray = err.message.split(',');
        const errorObj = {};
        errorArray.forEach(error => {
          const trimmedError = error.trim();
          if (trimmedError.includes('kode_aleg')) errorObj.kode_aleg = trimmedError;
          else if (trimmedError.includes('nama_lengkap')) errorObj.nama_lengkap = trimmedError;
          else if (trimmedError.includes('email')) errorObj.email = trimmedError;
          else if (trimmedError.includes('no_telepon')) errorObj.no_telepon = trimmedError;
        });
        setErrors(errorObj);
      } else {
        setMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout 
      currentPage="anggota-legislatif"
      pageTitle="Tambah Anggota Legislatif"
      breadcrumbs={['Manajemen Anggota Legislatif', 'Tambah Anggota Legislatif']}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Tambah Anggota Legislatif</h1>
              <p className="text-slate-600">Tambahkan data anggota legislatif baru ke sistem</p>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center ${
            message.includes('berhasil') 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message.includes('berhasil') ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message}
          </div>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Informasi Dasar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Kode Aleg *"
                  name="kode_aleg"
                  value={formData.kode_aleg}
                  onChange={handleInputChange}
                  placeholder="Masukkan kode anggota legislatif"
                  required
                  error={errors.kode_aleg}
                />

                <InputField
                  label="Nama Lengkap *"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  required
                  error={errors.nama_lengkap}
                />

                <SelectField
                  label="Jenis Kelamin *"
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Pilih Jenis Kelamin' },
                    { value: 'Laki-laki', label: 'Laki-laki' },
                    { value: 'Perempuan', label: 'Perempuan' }
                  ]}
                  required
                  error={errors.jenis_kelamin}
                />

                <InputField
                  label="Tempat Lahir *"
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleInputChange}
                  placeholder="Masukkan tempat lahir"
                  required
                  error={errors.tempat_lahir}
                />

                <InputField
                  label="Tanggal Lahir *"
                  name="tanggal_lahir"
                  type="date"
                  value={formData.tanggal_lahir}
                  onChange={handleInputChange}
                  required
                  error={errors.tanggal_lahir}
                />

                <SelectField
                  label="Status *"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Aktif', label: 'Aktif' },
                    { value: 'Tidak Aktif', label: 'Tidak Aktif' }
                  ]}
                  required
                  error={errors.status}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Informasi Kontak</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="No. Telepon *"
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleInputChange}
                  placeholder="Masukkan nomor telepon"
                  required
                  error={errors.no_telepon}
                />

                <InputField
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat email"
                  required
                  error={errors.email}
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Alamat</h2>
              <div className="space-y-4">
                <TextareaField
                  label="Alamat Lengkap *"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                  required
                  error={errors.alamat}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Kelurahan *"
                    name="kelurahan"
                    value={formData.kelurahan}
                    onChange={handleInputChange}
                    placeholder="Masukkan kelurahan"
                    required
                    error={errors.kelurahan}
                  />

                  <InputField
                    label="Kecamatan *"
                    name="kecamatan"
                    value={formData.kecamatan}
                    onChange={handleInputChange}
                    placeholder="Masukkan kecamatan"
                    required
                    error={errors.kecamatan}
                  />

                  <InputField
                    label="Kota *"
                    name="kota"
                    value={formData.kota}
                    onChange={handleInputChange}
                    placeholder="Masukkan kota"
                    required
                    error={errors.kota}
                  />

                  <InputField
                    label="Provinsi *"
                    name="provinsi"
                    value={formData.provinsi}
                    onChange={handleInputChange}
                    placeholder="Masukkan provinsi"
                    required
                    error={errors.provinsi}
                  />

                  <InputField
                    label="Kode Pos *"
                    name="kode_pos"
                    value={formData.kode_pos}
                    onChange={handleInputChange}
                    placeholder="Masukkan kode pos"
                    required
                    error={errors.kode_pos}
                  />
                </div>
              </div>
            </div>

            {/* Political Information */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Informasi Politik</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Jabatan Saat Ini *"
                    name="jabatan_saat_ini"
                    value={formData.jabatan_saat_ini}
                    onChange={handleInputChange}
                    placeholder="Masukkan jabatan saat ini"
                    required
                    error={errors.jabatan_saat_ini}
                  />

                  <InputField
                    label="Partai Politik *"
                    name="partai_politik"
                    value={formData.partai_politik}
                    onChange={handleInputChange}
                    placeholder="Masukkan partai politik"
                    required
                    error={errors.partai_politik}
                  />

                  <div className="md:col-span-2">
                    <InputField
                      label="Daerah Pemilihan *"
                      name="daerah_pemilihan"
                      value={formData.daerah_pemilihan}
                      onChange={handleInputChange}
                      placeholder="Masukkan daerah pemilihan"
                      required
                      error={errors.daerah_pemilihan}
                    />
                  </div>
                </div>

                <TextareaField
                  label="Riwayat Jabatan"
                  name="riwayat_jabatan"
                  value={formData.riwayat_jabatan}
                  onChange={handleInputChange}
                  placeholder="Masukkan riwayat jabatan (opsional)"
                  rows={4}
                  error={errors.riwayat_jabatan}
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Foto Profil</h2>
              <div className="space-y-4">
                {previewImage ? (
                  <div className="relative inline-block">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-32 h-32 rounded-lg object-cover border-2 border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500 mb-2">Pilih foto profil (opsional)</p>
                    <p className="text-sm text-slate-400">Format: JPG, PNG (max 2MB)</p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Batal
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TambahAnggotaLegislatif;