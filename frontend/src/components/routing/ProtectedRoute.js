import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute component that checks authentication and role-based access
 */
export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to dashboard based on user role
    const roleDashboard = {
      admin: '/admin/dashboard',
      qa: '/qa/dashboard',
      user: '/user/dashboard',
    };
    return <Navigate to={roleDashboard[user.role] || '/login'} replace />;
  }

  return children;
}

