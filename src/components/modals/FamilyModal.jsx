import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, User, Calendar, Briefcase, GraduationCap, DollarSign, Heart } from 'lucide-react';
import userService from '../../services/userService';

const FamilyModal = ({ isOpen, onClose, onSave, family, title = "Tambah Anggota Keluarga" }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    nama_anggota: '',
    hubungan: '',
    jenis_kelamin: '',
    tanggal_lahir: '',
    pekerjaan: '',
    pendidikan: '',
    penghasilan: '',
    tanggungan: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const hubunganOptions = [
    { value: 'Suami', label: 'Suami' },
    { value: 'Istri', label: 'Istri' },
    { value: 'Anak', label: 'Anak' },
    { value: 'Orang Tua', label: 'Orang Tua' },
    { value: 'Saudara', label: 'Saudara' },
    { value: 'Lainnya', label: 'Lainnya' }
  ];

  const jenisKelaminOptions = [
    { value: 'Laki-laki', label: 'Laki-laki' },
    { value: 'Perempuan', label: 'Perempuan' }
  ];

  const pendidikanOptions = [
    { value: 'Tidak Sekolah', label: 'Tidak Sekolah' },
    { value: 'SD', label: 'SD' },
    { value: 'SMP', label: 'SMP' },
    { value: 'SMA', label: 'SMA' },
    { value: 'D3', label: 'D3' },
    { value: 'S1', label: 'S1' },
    { value: 'S2', label: 'S2' },
    { value: 'S3', label: 'S3' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      if (family) {
        setFormData({
          user_id: family.user_id || '',
          nama_anggota: family.nama_anggota || '',
          hubungan: family.hubungan || '',
          jenis_kelamin: family.jenis_kelamin || '',
          tanggal_lahir: family.tanggal_lahir || '',
          pekerjaan: family.pekerjaan || '',
          pendidikan: family.pendidikan || '',
          penghasilan: family.penghasilan || '',
          tanggungan: family.tanggungan || false
        });
      } else {
        setFormData({
          user_id: '',
          nama_anggota: '',
          hubungan: '',
          jenis_kelamin: '',
          tanggal_lahir: '',
          pekerjaan: '',
          pendidikan: '',
          penghasilan: '',
          tanggungan: false
        });
      }
      setErrors({});
    }
  }, [isOpen, family]);

  const loadUsers = async () => {
    try {
      const response = await userService.getUsers({ per_page: 1000 });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.user_id) newErrors.user_id = 'User harus dipilih';
    if (!formData.nama_anggota.trim()) newErrors.nama_anggota = 'Nama anggota harus diisi';
    if (!formData.hubungan) newErrors.hubungan = 'Hubungan keluarga harus dipilih';
    if (!formData.jenis_kelamin) newErrors.jenis_kelamin = 'Jenis kelamin harus dipilih';
    if (!formData.tanggal_lahir) newErrors.tanggal_lahir = 'Tanggal lahir harus diisi';
    if (!formData.pekerjaan.trim()) newErrors.pekerjaan = 'Pekerjaan harus diisi';
    if (!formData.pendidikan) newErrors.pendidikan = 'Pendidikan harus dipilih';
    if (!formData.penghasilan || formData.penghasilan < 0) newErrors.penghasilan = 'Penghasilan harus diisi dan valid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving family:', error);
      if (typeof error === 'object' && error !== null) {
        setErrors(error);
      } else {
        setErrors({ general: typeof error === 'string' ? error : 'Terjadi kesalahan saat menyimpan' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Pilih User
              </label>
              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.user_id ? 'border-red-500' : 'border-slate-300'
                }`}
              >
                <option value="">Pilih User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Anggota Keluarga
              </label>
              <input
                type="text"
                name="nama_anggota"
                value={formData.nama_anggota}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nama_anggota ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Masukkan nama anggota keluarga"
              />
              {errors.nama_anggota && <p className="text-red-500 text-sm mt-1">{errors.nama_anggota}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Heart className="w-4 h-4 inline mr-2" />
                Hubungan Keluarga
              </label>
              <select
                name="hubungan"
                value={formData.hubungan}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.hubungan ? 'border-red-500' : 'border-slate-300'
                }`}
              >
                <option value="">Pilih Hubungan</option>
                {hubunganOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.hubungan && <p className="text-red-500 text-sm mt-1">{errors.hubungan}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Jenis Kelamin
              </label>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.jenis_kelamin ? 'border-red-500' : 'border-slate-300'
                }`}
              >
                <option value="">Pilih Jenis Kelamin</option>
                {jenisKelaminOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.jenis_kelamin && <p className="text-red-500 text-sm mt-1">{errors.jenis_kelamin}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.tanggal_lahir ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.tanggal_lahir && <p className="text-red-500 text-sm mt-1">{errors.tanggal_lahir}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Pekerjaan
              </label>
              <input
                type="text"
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.pekerjaan ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Masukkan pekerjaan"
              />
              {errors.pekerjaan && <p className="text-red-500 text-sm mt-1">{errors.pekerjaan}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <GraduationCap className="w-4 h-4 inline mr-2" />
                Pendidikan
              </label>
              <select
                name="pendidikan"
                value={formData.pendidikan}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.pendidikan ? 'border-red-500' : 'border-slate-300'
                }`}
              >
                <option value="">Pilih Pendidikan</option>
                {pendidikanOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.pendidikan && <p className="text-red-500 text-sm mt-1">{errors.pendidikan}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Penghasilan (Rp)
              </label>
              <input
                type="number"
                name="penghasilan"
                value={formData.penghasilan}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.penghasilan ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="0"
                min="0"
                step="0.01"
              />
              {errors.penghasilan && <p className="text-red-500 text-sm mt-1">{errors.penghasilan}</p>}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="tanggungan"
              checked={formData.tanggungan}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
            />
            <label className="ml-2 block text-sm text-slate-700">
              Termasuk tanggungan
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FamilyModal;