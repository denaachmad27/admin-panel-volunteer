import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import axios from 'axios';

const ResesFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    lokasi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    status: 'scheduled',
    anggota_legislatif_id: '',
    foto_kegiatan: null
  });
  const [anggotaLegislatifs, setAnggotaLegislatifs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnggotaLegislatifs();
    if (isEdit) {
      fetchReses();
    }
  }, [id]);

  const fetchAnggotaLegislatifs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/anggota-legislatif/options`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnggotaLegislatifs(response.data.data || []);
    } catch (err) {
      console.error('Error fetching anggota legislatif:', err);
    }
  };

  const fetchReses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/reses/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data.data;
      setFormData({
        judul: data.judul,
        deskripsi: data.deskripsi,
        lokasi: data.lokasi,
        tanggal_mulai: data.tanggal_mulai,
        tanggal_selesai: data.tanggal_selesai,
        status: data.status,
        anggota_legislatif_id: data.legislative_member_id || '',
        foto_kegiatan: null
      });
    } catch (err) {
      console.error('Error fetching reses:', err);
      alert('Gagal memuat data reses');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        // Skip anggota_legislatif_id if empty (let it be null)
        if (key === 'anggota_legislatif_id' && formData[key] === '') {
          return;
        }
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (isEdit) {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/admin/reses/${id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        alert('Reses berhasil diperbarui');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/admin/reses`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        alert('Reses berhasil ditambahkan');
      }

      navigate('/reses');
    } catch (err) {
      console.error('Error saving reses:', err);
      alert(err.response?.data?.message || 'Gagal menyimpan reses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout currentPage="reses">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/reses')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEdit ? 'Edit Reses' : 'Tambah Reses'}
            </h1>
            <p className="text-slate-600 mt-1">
              {isEdit ? 'Perbarui data reses' : 'Tambahkan kegiatan reses baru'}
            </p>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Judul <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows="4"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Anggota Legislatif
                </label>
                <select
                  value={formData.anggota_legislatif_id}
                  onChange={(e) => setFormData({ ...formData, anggota_legislatif_id: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Pilih Anggota Legislatif</option>
                  {anggotaLegislatifs.map(aleg => (
                    <option key={aleg.id} value={aleg.id}>{aleg.nama_lengkap}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.tanggal_mulai}
                  onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tanggal Selesai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.tanggal_selesai}
                  onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="scheduled">Dijadwalkan</option>
                  <option value="ongoing">Berlangsung</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Foto Kegiatan
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, foto_kegiatan: e.target.files[0] })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-slate-500 mt-1">Format: JPG, PNG, GIF. Maksimal 2MB</p>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Menyimpan...' : 'Simpan'}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/reses')}
                className="px-6 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResesFormPage;
