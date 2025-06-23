import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('ProtectedRoute check:', { 
    hasToken: !!token, 
    hasUser: !!user,
    tokenStart: token?.substring(0, 20) + '...',
    currentPath: window.location.pathname
  });
  
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('Token found, allowing access to protected route');
  return children;
};

export default ProtectedRoute;