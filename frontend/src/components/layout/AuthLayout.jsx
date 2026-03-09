import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
