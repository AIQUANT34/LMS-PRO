import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const TrainerLayout = () => {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar role="trainer" />
        <main className="flex-1 lg:ml-64">
          <div className="p-6 relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrainerLayout;
