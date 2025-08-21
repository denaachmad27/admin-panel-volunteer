import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, Button, InputField, SelectField, TextareaField } from '../components/ui/UIComponents';
import anggotaLegislatifService from '../services/anggotaLegislatifService';

const EditAnggotaLegislatif = () => {
  // Get ID from URL path
  const pathParts = window.location.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
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
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const data = await anggotaLegislatifService.getAnggotaLegislatifById(id);
      
      setFormData({
        kode_aleg: data.kode_aleg || '',
        nama_lengkap: data.nama_lengkap || '',
        jenis_kelamin: data.jenis_kelamin || '',
        tempat_lahir: data.tempat_lahir || '',
        tanggal_lahir: data.tanggal_lahir || '',
        alamat: data.alamat || '',
        kelurahan: data.kelurahan || '',
        kecamatan: data.kecamatan || '',
        kota: data.kota || '',
        provinsi: data.provinsi || '',
        kode_pos: data.kode_pos || '',
        no_telepon: data.no_telepon || '',
        email: data.email || '',
        jabatan_saat_ini: data.jabatan_saat_ini || '',
        partai_politik: data.partai_politik || '',
        daerah_pemilihan: data.daerah_pemilihan || '',
        riwayat_jabatan: data.riwayat_jabatan || '',
        foto_profil: null,
        status: data.status || 'Aktif'
      });

      if (data.foto_profil) {
        setCurrentImage(`/storage/${data.foto_profil}`);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    setError('');
    setSuccess('');

    try {
      await anggotaLegislatifService.updateAnggotaLegislatif(id, formData);
      setSuccess('Anggota legislatif berhasil diperbarui!');

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/anggota-legislatif';
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <DashboardLayout currentPage="anggota-legislatif">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="anggota-legislatif">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a
              href="/anggota-legislatif"
              className="inline-flex items-center px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </a>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Edit Anggota Legislatif</h1>
              <p className="text-slate-600 mt-1">Perbarui data anggota legislatif</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Informasi Dasar</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Kode Aleg *"
                  name="kode_aleg"
                  value={formData.kode_aleg}
                  onChange={handleInputChange}
                  placeholder="Masukkan kode anggota legislatif"
                  required
                />

                <InputField
                  label="Nama Lengkap *"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  required
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
                />

                <InputField
                  label="Tempat Lahir *"
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleInputChange}
                  placeholder="Masukkan tempat lahir"
                  required
                />

                <InputField
                  label="Tanggal Lahir *"
                  name="tanggal_lahir"
                  type="date"
                  value={formData.tanggal_lahir}
                  onChange={handleInputChange}
                  required
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
                />
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Informasi Kontak</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="No. Telepon *"
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleInputChange}
                  placeholder="Masukkan nomor telepon"
                  required
                />

                <InputField
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat email"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card>
            <div className="p-6">
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
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Kelurahan *"
                    name="kelurahan"
                    value={formData.kelurahan}
                    onChange={handleInputChange}
                    placeholder="Masukkan kelurahan"
                    required
                  />

                  <InputField
                    label="Kecamatan *"
                    name="kecamatan"
                    value={formData.kecamatan}
                    onChange={handleInputChange}
                    placeholder="Masukkan kecamatan"
                    required
                  />

                  <InputField
                    label="Kota *"
                    name="kota"
                    value={formData.kota}
                    onChange={handleInputChange}
                    placeholder="Masukkan kota"
                    required
                  />

                  <InputField
                    label="Provinsi *"
                    name="provinsi"
                    value={formData.provinsi}
                    onChange={handleInputChange}
                    placeholder="Masukkan provinsi"
                    required
                  />

                  <InputField
                    label="Kode Pos *"
                    name="kode_pos"
                    value={formData.kode_pos}
                    onChange={handleInputChange}
                    placeholder="Masukkan kode pos"
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Political Information */}
          <Card>
            <div className="p-6">
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
                  />

                  <InputField
                    label="Partai Politik *"
                    name="partai_politik"
                    value={formData.partai_politik}
                    onChange={handleInputChange}
                    placeholder="Masukkan partai politik"
                    required
                  />

                  <div className="md:col-span-2">
                    <InputField
                      label="Daerah Pemilihan *"
                      name="daerah_pemilihan"
                      value={formData.daerah_pemilihan}
                      onChange={handleInputChange}
                      placeholder="Masukkan daerah pemilihan"
                      required
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
                />
              </div>
            </div>
          </Card>

          {/* Photo Upload */}
          <Card>
            <div className="p-6">
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
                ) : currentImage ? (
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600">Foto saat ini:</p>
                    <img
                      src={currentImage}
                      alt="Current"
                      className="w-32 h-32 rounded-lg object-cover border-2 border-slate-300"
                    />
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
                {!previewImage && currentImage && (
                  <p className="text-sm text-slate-500">Pilih file baru untuk mengganti foto yang ada</p>
                )}
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              icon={Save}
            >
              {loading ? 'Menyimpan...' : 'Perbarui'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditAnggotaLegislatif;
