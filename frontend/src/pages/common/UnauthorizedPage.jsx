import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <ShieldExclamationIcon className="h-8 w-8 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Unauthorized</h2>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. Please contact your administrator if you think this is an error.
        </p>
        <div className="space-y-4">
          <Link
            to="/login"
            className="btn-premium block w-full"
          >
            Go to Login
          </Link>
          <Link
            to="/"
            className="btn-premium-outline block w-full"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
