import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // Izinkan jika ada token ATAU minimal ada user tersimpan (cookie session)
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
