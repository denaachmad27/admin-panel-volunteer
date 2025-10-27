import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, Button, SelectField } from '../components/ui/UIComponents';
import { wargaBinaanAPI } from '../services/api';

const WargaBinaanUploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [relawanId, setRelawanId] = useState('');
  const [relawanOptions, setRelawanOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [skipFirstRow, setSkipFirstRow] = useState(true); // Default true karena biasanya ada header
  const [startRow, setStartRow] = useState(2); // Default baris 2 (data mulai setelah header)
  const [startColumn, setStartColumn] = useState(0); // Default kolom 0 (kolom pertama)
  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    fetchRelawanOptions();
  }, []);

  const fetchRelawanOptions = async () => {
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
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await wargaBinaanAPI.downloadTemplate();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'template_warga_binaan.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Gagal mengunduh template');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      // Validate file type
      const validTypes = ['text/csv', 'application/vnd.ms-excel'];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.csv')) {
        alert('Format file tidak valid. Silakan upload file CSV.');
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
      }

      setFile(selectedFile);
      setUploadResult(null);

      // Auto preview after file is selected
      fetchPreview(selectedFile, startRow, startColumn);
    }
  };

  const fetchPreview = async (selectedFile, row, column) => {
    if (!selectedFile) return;

    setLoadingPreview(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('start_row', row);
      formData.append('start_column', column);

      const response = await wargaBinaanAPI.previewCsv(formData);
      if (response.data.status === 'success') {
        setPreview(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching preview:', error);
      setPreview(null);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleStartRowChange = (newStartRow) => {
    const row = parseInt(newStartRow);
    if (row < 1) return;

    setStartRow(row);

    // Fetch new preview when start row changes
    if (file) {
      fetchPreview(file, row, startColumn);
    }
  };

  const handleStartColumnChange = (newStartColumn) => {
    const column = parseInt(newStartColumn);
    if (column < 0) return;

    setStartColumn(column);

    // Fetch new preview when start column changes
    if (file) {
      fetchPreview(file, startRow, column);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Silakan pilih file terlebih dahulu');
      return;
    }

    if (!relawanId) {
      alert('Silakan pilih relawan terlebih dahulu');
      return;
    }

    setLoading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('relawan_id', relawanId);
      formData.append('skip_first_row', skipFirstRow ? '1' : '0');
      formData.append('start_row', startRow);
      formData.append('start_column', startColumn);

      const response = await wargaBinaanAPI.massUpload(formData);

      if (response.data.status === 'success') {
        setUploadResult(response.data.data);

        if (response.data.data.failed_count === 0) {
          alert(`Berhasil mengupload ${response.data.data.success_count} data warga binaan`);
          setTimeout(() => {
            navigate('/warga-binaan');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(error.response?.data?.message || 'Gagal mengupload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout currentPage="warga-binaan">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Upload Warga Binaan</h1>
            <p className="text-slate-500 mt-1">Upload data warga binaan dalam bentuk file CSV</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate('/warga-binaan')}
          >
            <X className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>

        {/* Instructions */}
        <Card>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Petunjuk Upload</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>Download template CSV dengan klik tombol "Download Template" di bawah</li>
                <li>Isi data warga binaan sesuai dengan format template</li>
                <li><strong>PENTING:</strong> Jangan hapus baris pertama (header/judul kolom) di file CSV</li>
                <li>Pastikan format tanggal lahir menggunakan format: YYYY-MM-DD (contoh: 1990-01-15)</li>
                <li>Untuk Status KTA gunakan: "Sudah punya" atau "Belum punya"</li>
                <li>Untuk Hasil Verifikasi gunakan: "Bersedia ikut UPA 1 kali per bulan" atau "Bersedia ikut UPA 1 kali per minggu" atau "Tidak bersedia"</li>
                <li>Field yang kosong akan diisi otomatis dengan nilai default</li>
                <li>Simpan file dalam format CSV</li>
                <li>Centang opsi "Baris pertama adalah header" saat upload (default sudah tercentang)</li>
                <li>Upload file CSV yang sudah diisi</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Download Template */}
          <Card>
            <div className="text-center py-6">
              <FileText className="w-16 h-16 mx-auto text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Template CSV</h3>
              <p className="text-sm text-slate-600 mb-4">
                Download template untuk memudahkan pengisian data
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={handleDownloadTemplate}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template CSV
              </Button>
            </div>
          </Card>

          {/* Relawan Selection */}
          <Card>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Pilih Relawan</h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Relawan Pembina
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={relawanId}
                onChange={(e) => setRelawanId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors bg-white"
              >
                <option value="">Pilih Relawan</option>
                {relawanOptions.map(relawan => (
                  <option key={relawan.id} value={relawan.id}>
                    {relawan.name} - {relawan.email}
                  </option>
                ))}
              </select>
              {relawanOptions.length > 0 && (
                <p className="text-xs text-slate-500">
                  {relawanOptions.length} relawan tersedia
                </p>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Semua data warga binaan yang diupload akan terhubung dengan relawan yang dipilih
            </p>
          </Card>

          {/* File Upload */}
          <Card>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Upload File CSV</h3>

            {/* Start Row Input */}
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-2">
                    Data dimulai dari baris ke berapa?
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={startRow}
                    onChange={(e) => handleStartRowChange(e.target.value)}
                    className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-slate-600 mt-2">
                    Masukkan nomor baris di mana data warga binaan dimulai.
                    Baris sebelumnya (termasuk header) akan dilewati.
                    <br />
                    <strong>Contoh:</strong> Jika header di baris 1 dan data di baris 2, isi dengan <strong>2</strong>.
                    Jika header di baris 1, ada baris kosong di baris 2, data di baris 3, isi dengan <strong>3</strong>.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-2">
                    Data dimulai dari kolom ke berapa?
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={startColumn}
                    onChange={(e) => handleStartColumnChange(e.target.value)}
                    className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-slate-600 mt-2">
                    Masukkan nomor kolom tempat data pertama berada. Gunakan <strong>0</strong> untuk kolom pertama (A), <strong>1</strong> untuk kolom kedua (B), dan seterusnya.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-orange-500 bg-orange-50'
                  : file
                  ? 'border-green-500 bg-green-50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                  <div>
                    <p className="text-lg font-medium text-slate-800">{file.name}</p>
                    <p className="text-sm text-slate-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    Ganti File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-16 h-16 mx-auto text-slate-400" />
                  <div>
                    <p className="text-lg font-medium text-slate-800 mb-1">
                      Drag & drop file CSV di sini
                    </p>
                    <p className="text-sm text-slate-500 mb-4">atau</p>
                    <label className="inline-block">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileChange(e.target.files[0])}
                        className="hidden"
                      />
                      <span className="cursor-pointer inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                        Pilih File
                      </span>
                    </label>
                  </div>
                  <p className="text-xs text-slate-500">
                    File CSV, maksimal 5MB
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Preview Data */}
          {file && preview && (
            <Card>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Preview Data (3 data pertama)
              </h3>

              {loadingPreview ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="text-sm text-slate-600 mt-2">Memuat preview...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-slate-700">
                      <strong>Total baris di file:</strong> {preview.total_rows} baris
                      <br />
                      <strong>Data dimulai dari baris:</strong> {preview.start_row}
                      <br />
                      <strong>Data dimulai dari kolom:</strong> {preview.start_column ?? startColumn}
                      <br />
                      <strong>Preview:</strong> Menampilkan 3 data pertama yang akan diupload
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-slate-200">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-slate-700 border-b">Baris</th>
                          {preview.headers.slice(0, 13).map((header, index) => (
                            <th key={index} className="px-3 py-2 text-left font-medium text-slate-700 border-b">
                              {header || `Kolom ${index + 1}`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.preview.map((row, rowIndex) => (
                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="px-3 py-2 border-b font-medium text-orange-600">
                              {row.row_number}
                            </td>
                            {row.data.slice(0, 13).map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2 border-b text-slate-700">
                                {cell || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ Periksa data di atas!</strong> Pastikan data yang ditampilkan sudah benar sebelum melanjutkan upload.
                      Jika data belum benar, ubah nomor "Data dimulai dari baris ke" di atas.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <Card>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Hasil Upload</h3>

              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Berhasil</p>
                        <p className="text-2xl font-bold text-green-900">{uploadResult.success_count}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <XCircle className="w-8 h-8 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Gagal</p>
                        <p className="text-2xl font-bold text-red-900">{uploadResult.failed_count}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Errors */}
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-3">Detail Error:</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {uploadResult.errors.map((error, index) => (
                        <div key={index} className="bg-white rounded p-3 text-sm">
                          <p className="font-medium text-red-700">Baris {error.row}:</p>
                          <ul className="list-disc list-inside text-red-600 mt-1">
                            {error.errors.map((err, errIndex) => (
                              <li key={errIndex}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

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
              disabled={loading || !file || !relawanId}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mengupload...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default WargaBinaanUploadPage;
