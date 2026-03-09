import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const { isAuthenticated, user, hasRole, hasAnyRole } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if specific role is required
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user has any of the allowed roles
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
