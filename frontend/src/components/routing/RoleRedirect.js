import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Redirects authenticated users to their role-specific dashboard
 */
export function RoleRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const roleDashboard = {
    admin: '/admin/dashboard',
    qa: '/qa/dashboard',
    user: '/user/dashboard',
  };

  return <Navigate to={roleDashboard[user.role] || '/login'} replace />;
}

