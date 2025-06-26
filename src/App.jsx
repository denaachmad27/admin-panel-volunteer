import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

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
import KategoriPage from './pages/KategoriPage';
import PengaturanPage from './pages/PengaturanPage';

function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
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
            
            {/* Bantuan Sosial Route */}
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
            
            {/* Berita & Artikel Route */}
            <Route 
              path="/news" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <BeritaArtikelPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
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
            
            {/* Pendaftaran Route */}
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
              path="/news/create" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <TambahBeritaPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
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
    </ErrorBoundary>
  );
}

export default App;