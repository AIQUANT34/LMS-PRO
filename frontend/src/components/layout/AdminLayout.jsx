import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const AdminLayout = () => {
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Global Navbar */}
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Full height */}
        <Sidebar role="admin" onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* display current admin page */}
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Global Footer - Always at Bottom */}
      <Footer />
    </div>
  );
};

export default AdminLayout;
