import React from 'react';
import { motion } from 'framer-motion';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const StudentProfile = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="flex items-center space-x-2">
          <UserCircleIcon className="h-5 w-5 text-gray-400" />
          <span className="text-gray-600">Account Settings</span>
        </div>
      </motion.div>
      
      <div className="card-premium p-8 text-center">
        <UserCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Settings Coming Soon</h2>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>
    </div>
  );
};

export default StudentProfile;
