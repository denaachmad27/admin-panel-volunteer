import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  X,
  User,
  Calendar,
  MapPin,
  Phone,
  IdCard,
  CheckCircle
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, Button, InputField, SelectField, TextareaField } from '../components/ui/UIComponents';
import { wargaBinaanAPI } from '../services/api';

const WargaBinaanFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingRelawan, setLoadingRelawan] = useState(true);
  const [relawanOptions, setRelawanOptions] = useState([]);
  const [formData, setFormData] = useState({
    relawan_id: '',
    no_kta: '',
    nama: '',
    tanggal_lahir: '',
    usia: '',
    jenis_kelamin: '',
    alamat: '',
    kecamatan: '',
    kelurahan: '',
    rt: '',
    rw: '',
    no_hp: '',
    status_kta: 'Belum punya',
    hasil_verifikasi: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchRelawanOptions();
    if (isEdit) {
      fetchWargaBinaan();
    }
  }, [id]);


  const fetchRelawanOptions = async () => {
    setLoadingRelawan(true);
    try {
      const response = await wargaBinaanAPI.getRelawanOptions();

      if (response.data.status === 'success') {
        const options = Array.isArray(response.data.data)
          ? [...response.data.data]
          : [];
        setRelawanOptions(options);
      }
    } catch (error) {
      console.error('Error fetching relawan options:', error);
      alert('Gagal memuat daftar relawan');
    } finally {
      setLoadingRelawan(false);
    }
  };

  const fetchWargaBinaan = async () => {
    setLoading(true);
    try {
      const response = await wargaBinaanAPI.getById(id);
      if (response.data.status === 'success') {
        const warga = response.data.data;
        setFormData({
          relawan_id: warga.relawan_id,
          no_kta: warga.no_kta || '',
          nama: warga.nama,
          tanggal_lahir: warga.tanggal_lahir,
          usia: warga.usia,
          jenis_kelamin: warga.jenis_kelamin,
          alamat: warga.alamat,
          kecamatan: warga.kecamatan,
          kelurahan: warga.kelurahan,
          rt: warga.rt,
          rw: warga.rw,
          no_hp: warga.no_hp || '',
          status_kta: warga.status_kta,
          hasil_verifikasi: warga.hasil_verifikasi || ''
        });
      }
    } catch (error) {
      console.error('Error fetching warga binaan:', error);
      alert('Gagal memuat data warga binaan');
      navigate('/warga-binaan');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // Auto calculate age when date of birth changes
    if (name === 'tanggal_lahir' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      setFormData(prev => ({
        ...prev,
        usia: age >= 0 ? age : ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.relawan_id) newErrors.relawan_id = 'Relawan harus dipilih';
    if (!formData.nama) newErrors.nama = 'Nama harus diisi';
    if (!formData.tanggal_lahir) newErrors.tanggal_lahir = 'Tanggal lahir harus diisi';
    if (!formData.usia) newErrors.usia = 'Usia harus diisi';
    if (!formData.jenis_kelamin) newErrors.jenis_kelamin = 'Jenis kelamin harus dipilih';
    if (!formData.alamat) newErrors.alamat = 'Alamat harus diisi';
    if (!formData.kecamatan) newErrors.kecamatan = 'Kecamatan harus diisi';
    if (!formData.kelurahan) newErrors.kelurahan = 'Kelurahan harus diisi';
    if (!formData.rt) newErrors.rt = 'RT harus diisi';
    if (!formData.rw) newErrors.rw = 'RW harus diisi';
    if (!formData.status_kta) newErrors.status_kta = 'Status KTA harus dipilih';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await wargaBinaanAPI.update(id, formData);
        alert('Warga binaan berhasil diperbarui');
      } else {
        await wargaBinaanAPI.create(formData);
        alert('Warga binaan berhasil ditambahkan');
      }
      navigate('/warga-binaan');
    } catch (error) {
      console.error('Error saving warga binaan:', error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      alert(error.response?.data?.message || 'Gagal menyimpan data warga binaan');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <DashboardLayout currentPage="warga-binaan">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="warga-binaan">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {isEdit ? 'Edit Warga Binaan' : 'Tambah Warga Binaan'}
            </h1>
            <p className="text-slate-500 mt-1">
              {isEdit ? 'Perbarui informasi warga binaan' : 'Tambahkan warga binaan baru'}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate('/warga-binaan')}
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Relawan */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-orange-500" />
              Informasi Relawan
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Relawan Pembina
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="relawan_id"
                  value={formData.relawan_id}
                  onChange={handleChange}
                  disabled={loadingRelawan}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.relawan_id ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  } ${
                    loadingRelawan ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'
                  }`}
                  required
                >
                  <option value="">
                    {loadingRelawan ? 'Memuat data relawan...' : 'Pilih Relawan'}
                  </option>
                  {relawanOptions.map((relawan) => (
                    <option key={relawan.id} value={relawan.id}>
                      {relawan.name} - {relawan.email}
                    </option>
                  ))}
                </select>
                {errors.relawan_id && (
                  <p className="text-sm text-red-600">{errors.relawan_id}</p>
                )}
                {!loadingRelawan && relawanOptions.length > 0 && (
                  <p className="text-xs text-slate-500">
                    {relawanOptions.length} relawan tersedia
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Informasi Pribadi */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <IdCard className="w-5 h-5 mr-2 text-orange-500" />
              Informasi Pribadi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="No KTA"
                name="no_kta"
                value={formData.no_kta}
                onChange={handleChange}
                error={errors.no_kta}
                placeholder="Masukkan nomor KTA"
              />
              <InputField
                label="Nama Lengkap"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                error={errors.nama}
                placeholder="Masukkan nama lengkap"
                required
              />
              <InputField
                label="Tanggal Lahir"
                name="tanggal_lahir"
                type="date"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                error={errors.tanggal_lahir}
                required
              />
              <InputField
                label="Usia"
                name="usia"
                type="number"
                value={formData.usia}
                onChange={handleChange}
                error={errors.usia}
                placeholder="Akan terisi otomatis"
                required
                readOnly
              />
              <SelectField
                label="Jenis Kelamin"
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                error={errors.jenis_kelamin}
                required
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </SelectField>
              <InputField
                label="No HP"
                name="no_hp"
                type="tel"
                value={formData.no_hp}
                onChange={handleChange}
                error={errors.no_hp}
                placeholder="08xx xxxx xxxx"
                icon={Phone}
              />
            </div>
          </Card>

          {/* Alamat */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-orange-500" />
              Alamat
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <TextareaField
                  label="Alamat Lengkap"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  error={errors.alamat}
                  placeholder="Masukkan alamat lengkap"
                  required
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Kelurahan"
                  name="kelurahan"
                  value={formData.kelurahan}
                  onChange={handleChange}
                  error={errors.kelurahan}
                  placeholder="Masukkan kelurahan"
                  required
                />
                <InputField
                  label="Kecamatan"
                  name="kecamatan"
                  value={formData.kecamatan}
                  onChange={handleChange}
                  error={errors.kecamatan}
                  placeholder="Masukkan kecamatan"
                  required
                />
                <InputField
                  label="RT"
                  name="rt"
                  value={formData.rt}
                  onChange={handleChange}
                  error={errors.rt}
                  placeholder="001"
                  required
                />
                <InputField
                  label="RW"
                  name="rw"
                  value={formData.rw}
                  onChange={handleChange}
                  error={errors.rw}
                  placeholder="002"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Status & Verifikasi */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-orange-500" />
              Status & Verifikasi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Status KTA"
                name="status_kta"
                value={formData.status_kta}
                onChange={handleChange}
                error={errors.status_kta}
                required
              >
                <option value="Sudah punya">Sudah Punya</option>
                <option value="Belum punya">Belum Punya</option>
              </SelectField>
              <SelectField
                label="Hasil Verifikasi UPA"
                name="hasil_verifikasi"
                value={formData.hasil_verifikasi}
                onChange={handleChange}
                error={errors.hasil_verifikasi}
              >
                <option value="">Pilih Hasil Verifikasi</option>
                <option value="Bersedia ikut UPA 1 kali per bulan">Bersedia ikut UPA 1 kali per bulan</option>
                <option value="Bersedia ikut UPA 1 kali per minggu">Bersedia ikut UPA 1 kali per minggu</option>
                <option value="Tidak bersedia">Tidak bersedia</option>
              </SelectField>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/warga-binaan')}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEdit ? 'Perbarui' : 'Simpan'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default WargaBinaanFormPage;
