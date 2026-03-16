import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    // Redirect based on user role
    switch (user?.role) {
      case 'student':
        return <Navigate to="/student/dashboard" replace />;
      case 'trainer':
        return <Navigate to="/trainer/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
};

export default PublicRoute;
