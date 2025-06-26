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