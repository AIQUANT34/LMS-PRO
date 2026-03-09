import React from 'react';
import { motion } from 'framer-motion';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const MyCourses = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <div className="flex items-center space-x-2">
          <BookOpenIcon className="h-5 w-5 text-gray-400" />
          <span className="text-gray-600">12 courses enrolled</span>
        </div>
      </motion.div>
      
      <div className="card-premium p-8 text-center">
        <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Courses Coming Soon</h2>
        <p className="text-gray-600">Your enrolled courses will appear here.</p>
      </div>
    </div>
  );
};

export default MyCourses;
