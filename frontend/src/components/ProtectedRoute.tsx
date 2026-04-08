import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  allowedRoles: ('admin' | 'teacher' | 'student')[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (user.role && allowedRoles.includes(user.role)) {
    // Authorized
    return <Outlet />;
  }

  // Not authorized, redirect somewhere safe
  return <Navigate to="/unauthorized" replace />;
}
