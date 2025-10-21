# Admin Panel Reses & Pokir - Setup Guide

## ✅ File yang Sudah Dibuat

### Pages
1. ✅ `src/pages/ResesPage.jsx` - Halaman daftar reses
2. ✅ `src/pages/ResesFormPage.jsx` - Form tambah/edit reses
3. ✅ `src/pages/PokirPage.jsx` - Halaman daftar pokir
4. ⏳ `src/pages/PokirFormPage.jsx` - Form tambah/edit pokir (perlu dibuat)

### Components
1. ✅ Menu sidebar sudah ditambahkan di `src/components/layout/DashboardLayout.jsx`
2. ✅ Icon sudah ditambahkan di `src/components/layout/Sidebar.jsx`

## 📝 Langkah Selanjutnya

### 1. Buat File PokirFormPage.jsx

Salin file `ResesFormPage.jsx` dan modifikasi untuk Pokir:

```jsx
// src/pages/PokirFormPage.jsx
// Ganti field-field berikut:
// - judul, deskripsi (sama)
// - kategori (dropdown: Infrastruktur, Pendidikan, Kesehatan, Ekonomi, Sosial, Lingkungan)
// - prioritas (dropdown: high, medium, low)
// - status (dropdown: proposed, approved, in_progress, completed, rejected)
// - lokasi_pelaksanaan
// - target_pelaksanaan (date)
// - anggota_legislatif_id
// - TIDAK ADA foto_kegiatan
```

### 2. Tambahkan Routes di App.jsx

Tambahkan routes berikut di file `src/App.jsx`:

```jsx
import ResesPage from './pages/ResesPage';
import ResesFormPage from './pages/ResesFormPage';
import PokirPage from './pages/PokirPage';
import PokirFormPage from './pages/PokirFormPage';

// Di dalam Routes:
<Route path="/reses" element={<ResesPage />} />
<Route path="/reses/create" element={<ResesFormPage />} />
<Route path="/reses/:id/edit" element={<ResesFormPage />} />

<Route path="/pokir" element={<PokirPage />} />
<Route path="/pokir/create" element={<PokirFormPage />} />
<Route path="/pokir/:id/edit" element={<PokirFormPage />} />
```

### 3. Template PokirFormPage.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/UIComponents';
import axios from 'axios';

const PokirFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    kategori: '',
    prioritas: 'medium',
    status: 'proposed',
    lokasi_pelaksanaan: '',
    target_pelaksanaan: '',
    anggota_legislatif_id: ''
  });
  const [anggotaLegislatifs, setAnggotaLegislatifs] = useState([]);
  const [loading, setLoading] = useState(false);

  const kategoriOptions = [
    'Infrastruktur',
    'Pendidikan',
    'Kesehatan',
    'Ekonomi',
    'Sosial',
    'Lingkungan'
  ];

  useEffect(() => {
    fetchAnggotaLegislatifs();
    if (isEdit) {
      fetchPokir();
    }
  }, [id]);

  const fetchAnggotaLegislatifs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/anggota-legislatif/options`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnggotaLegislatifs(response.data.data || []);
    } catch (err) {
      console.error('Error fetching anggota legislatif:', err);
    }
  };

  const fetchPokir = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/pokir/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data.data;
      setFormData({
        judul: data.judul,
        deskripsi: data.deskripsi,
        kategori: data.kategori,
        prioritas: data.prioritas,
        status: data.status,
        lokasi_pelaksanaan: data.lokasi_pelaksanaan || '',
        target_pelaksanaan: data.target_pelaksanaan || '',
        anggota_legislatif_id: data.legislative_member_id || ''
      });
    } catch (err) {
      console.error('Error fetching pokir:', err);
      alert('Gagal memuat data pokir');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (isEdit) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/pokir/${id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Pokir berhasil diperbarui');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/pokir`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Pokir berhasil ditambahkan');
      }

      navigate('/pokir');
    } catch (err) {
      console.error('Error saving pokir:', err);
      alert(err.response?.data?.message || 'Gagal menyimpan pokir');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout currentPage="pokir">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/pokir')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEdit ? 'Edit Pokir' : 'Tambah Pokir'}
            </h1>
            <p className="text-slate-600 mt-1">
              {isEdit ? 'Perbarui data pokir' : 'Tambahkan pokok pikiran baru'}
            </p>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Judul */}
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

            {/* Deskripsi */}
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

            {/* Kategori, Prioritas, Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriOptions.map(kat => (
                    <option key={kat} value={kat}>{kat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Prioritas <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.prioritas}
                  onChange={(e) => setFormData({ ...formData, prioritas: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="high">Tinggi</option>
                  <option value="medium">Sedang</option>
                  <option value="low">Rendah</option>
                </select>
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
                  <option value="proposed">Diusulkan</option>
                  <option value="approved">Disetujui</option>
                  <option value="in_progress">Dalam Proses</option>
                  <option value="completed">Selesai</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
            </div>

            {/* Lokasi & Target */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Lokasi Pelaksanaan
                </label>
                <input
                  type="text"
                  value={formData.lokasi_pelaksanaan}
                  onChange={(e) => setFormData({ ...formData, lokasi_pelaksanaan: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Pelaksanaan
                </label>
                <input
                  type="date"
                  value={formData.target_pelaksanaan}
                  onChange={(e) => setFormData({ ...formData, target_pelaksanaan: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Anggota Legislatif */}
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

            {/* Buttons */}
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
                onClick={() => navigate('/pokir')}
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

export default PokirFormPage;
```

## 🚀 Cara Menggunakan

### 1. Pastikan Backend Running
```bash
cd volunteer-management-backend
php artisan serve
```

### 2. Pastikan Admin Panel Running
```bash
cd admin-panel-bantuan-sosial
npm run dev
```

### 3. Akses Menu
- Buka admin panel di browser
- Login sebagai admin
- Klik menu **Reses** atau **Pokir** di sidebar kiri
- Menu akan expand dan menampilkan:
  - Daftar Reses / Daftar Pokir
  - Tambah Reses / Tambah Pokir

## 📋 Fitur yang Tersedia

### Halaman Reses
✅ Tampilan daftar dengan tabel
✅ Tab filter (Semua, Dijadwalkan, Berlangsung, Selesai)
✅ Search
✅ Quick stats (Total, Dijadwalkan, Berlangsung, Selesai)
✅ Status badges dengan warna
✅ Aksi: Detail, Edit, Hapus
✅ Form tambah/edit dengan upload foto

### Halaman Pokir
✅ Tampilan daftar dengan tabel
✅ Tab filter (Semua, Diusulkan, Disetujui, Dalam Proses, Selesai)
✅ Search
✅ Quick stats (Total, Diusulkan, Disetujui, Dalam Proses)
✅ Badge untuk status, prioritas, dan kategori
✅ Aksi: Detail, Edit, Hapus
✅ Form tambah/edit dengan kategori dan prioritas

## 🎨 UI Components

- Modern card-based layout
- Responsive table
- Color-coded status badges
- Icon indicators (Lucide React icons)
- Loading states
- Empty states
- Quick statistics row

## ⚠️ Catatan Penting

1. Pastikan `.env` sudah dikonfigurasi dengan benar:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

2. Backend API harus sudah running dan accessible

3. User harus login sebagai admin untuk akses menu ini

4. Database migrations harus sudah dijalankan

## 📞 Troubleshooting

### Menu tidak muncul?
- Refresh halaman (Ctrl + F5)
- Check console browser untuk errors
- Pastikan DashboardLayout.jsx sudah diupdate

### Data tidak muncul?
- Check network tab di browser developer tools
- Pastikan backend API running
- Check token di localStorage
- Check CORS settings di backend

### Upload foto error?
- Pastikan folder `storage/app/public/reses` ada
- Jalankan `php artisan storage:link`
- Check permissions folder storage

## ✨ Next Steps (Opsional)

1. Tambahkan halaman detail view
2. Tambahkan export to Excel/PDF
3. Tambahkan filter by anggota legislatif
4. Tambahkan bulk actions
5. Tambahkan notifikasi real-time
