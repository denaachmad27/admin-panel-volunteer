import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { GeneralSettingsProvider } from './contexts/GeneralSettingsContext';

// Existing Pages (sesuai dengan struktur project asli)
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';

// NEW: Admin Profile Page (PASTIKAN IMPORT DARI PAGES, BUKAN COMPONENTS!)
import AdminProfilePage from './pages/AdminProfilePage';
import BantuanSosialPage from './pages/BantuanSosialPage';
import BeritaArtikelPage from './pages/BeritaArtikelPage';
import PengaduanPage from './pages/PengaduanPage';
import StatistikPage from './pages/StatistikPage';
import ManajemenUserPage from './pages/ManajemenUserPage';
import PendaftaranPage from './pages/PendaftaranPage';
import VerifikasiPage from './pages/VerifikasiPage';
import TambahBeritaPage from './pages/TambahBeritaPage';
import TambahBantuanPage from './pages/TambahBantuanPage';
import EditBantuanPage from './pages/EditBantuanPage';
import DetailBantuanPage from './pages/DetailBantuanPage';
import DetailPendaftaranPage from './pages/DetailPendaftaranPage';
import KategoriPage from './pages/KategoriPage';
import PengaturanPage from './pages/PengaturanPage';
import WhatsappSettingsPage from './pages/WhatsappSettingsPage';
import EmailSettingsPage from './pages/EmailSettingsPage';
import DaftarDinasPage from './pages/DaftarDinasPage';
import ManajemenKeluargaPage from './pages/ManajemenKeluargaPage';
import ManajemenRelawan from './pages/ManajemenRelawan';

function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <GeneralSettingsProvider>
        <Router>
          <div className="min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Manajemen User Route */}
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <ManajemenUserPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Manajemen Keluarga Route */}
            <Route 
              path="/families" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <ManajemenKeluargaPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Manajemen Relawan Route */}
            <Route 
              path="/volunteers" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <ManajemenRelawan />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* 🎯 FIXED: Admin Profile Route - PASTIKAN MENGGUNAKAN AdminProfilePage */}
            <Route 
              path="/admin/profile" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminProfilePage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Bantuan Sosial Routes */}
            <Route 
              path="/bantuan-sosial" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <BantuanSosialPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/daftar-bantuan" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <BantuanSosialPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tambah-bantuan" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <TambahBantuanPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-bantuan/:id" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <EditBantuanPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bantuan/:id" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <DetailBantuanPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Berita & Artikel Route */}
            <Route 
              path="/berita-artikel" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <BeritaArtikelPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Alternative path */}
            <Route 
              path="/news" 
              element={<Navigate to="/berita-artikel" replace />} 
            />
            
            {/* Pengaduan Route */}
            <Route 
              path="/complaints" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <PengaduanPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Statistik Route */}
            <Route 
              path="/statistics" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <StatistikPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Pendaftaran Routes */}
            <Route 
              path="/pendaftaran" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <PendaftaranPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pendaftaran/:id" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <DetailPendaftaranPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Verifikasi Route */}
            <Route 
              path="/pendaftaran/verify" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <VerifikasiPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Tambah Berita Route */}
            <Route 
              path="/tambah-berita" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <TambahBeritaPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Edit Berita Route */}
            <Route 
              path="/edit-berita/:id" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <TambahBeritaPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Alternative paths for consistency */}
            <Route 
              path="/news/create" 
              element={<Navigate to="/tambah-berita" replace />} 
            />
            <Route 
              path="/news/:id/edit" 
              element={<Navigate to="/edit-berita/:id" replace />} 
            />
            
            {/* Kategori Route */}
            <Route 
              path="/news/categories" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <KategoriPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Pengaturan Route */}
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <PengaturanPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* WhatsApp Settings Route */}
            <Route 
              path="/settings/whatsapp" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <WhatsappSettingsPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Email Settings Route */}
            <Route 
              path="/settings/email" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <EmailSettingsPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Daftar Dinas Route */}
            <Route 
              path="/settings/daftar-dinas" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <DaftarDinasPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* 🔄 ALTERNATIVE: Jika ada route lama, redirect ke yang baru */}
            <Route 
              path="/profile" 
              element={<Navigate to="/admin/profile" replace />} 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          </div>
        </Router>
      </GeneralSettingsProvider>
    </ErrorBoundary>
  );
}

export default App;