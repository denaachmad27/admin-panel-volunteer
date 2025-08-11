import React from 'react';
import { Navigate } from 'react-router-dom';

// RoleGuard wraps a protected route and ensures the current user has one of the allowed roles.
// Usage: <RoleGuard allowedRoles={['admin']}>{children}</RoleGuard>
const RoleGuard = ({ allowedRoles = [], children, redirectTo = '/dashboard' }) => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return <Navigate to={redirectTo} replace />;
    const user = JSON.parse(userStr);
    const role = user?.role;

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return <Navigate to={redirectTo} replace />;
    }
    return children;
  } catch (e) {
    return <Navigate to={redirectTo} replace />;
  }
};

export default RoleGuard;

