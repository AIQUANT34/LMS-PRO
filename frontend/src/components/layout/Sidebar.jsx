import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ClipboardDocumentListIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const Sidebar = ({ role }) => {
  const { user, logout } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  const studentLinks = [
    { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
    { name: 'My Courses', href: '/student/courses', icon: BookOpenIcon },
    { name: 'Assignments', href: '/student/assignments', icon: DocumentTextIcon },
    { name: 'Certificates', href: '/student/certificates', icon: TrophyIcon },
    { name: 'Profile', href: '/student/profile', icon: UserCircleIcon },
  ];

  const instructorLinks = [
    { name: 'Dashboard', href: '/instructor/dashboard', icon: HomeIcon },
    { name: 'My Courses', href: '/instructor/courses', icon: BookOpenIcon },
    { name: 'Create Course', href: '/instructor/courses/create', icon: VideoCameraIcon },
    { name: 'Assignments', href: '/instructor/assignments', icon: ClipboardDocumentListIcon },
    { name: 'Analytics', href: '/instructor/analytics', icon: ChartBarIcon },
    { name: 'Earnings', href: '/instructor/earnings', icon: CurrencyDollarIcon },
    { name: 'Profile', href: '/instructor/profile', icon: UserCircleIcon },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'User Management', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Course Management', href: '/admin/courses', icon: BookOpenIcon },
    { name: 'Instructor Approval', href: '/admin/instructors', icon: ShieldCheckIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  ];

  const getLinks = () => {
    switch (role) {
      case 'student':
        return studentLinks;
      case 'instructor':
        return instructorLinks;
      case 'admin':
        return adminLinks;
      default:
        return [];
    }
  };

  const links = getLinks();
  const currentPath = window.location.pathname;

  const isActiveLink = (href) => {
    if (href === '/student/dashboard' || href === '/instructor/dashboard' || href === '/admin/dashboard') {
      return currentPath === href;
    }
    return currentPath.startsWith(href);
  };

  return (
    <aside className={`sidebar-premium fixed left-0 top-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-30 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl shadow-lg mb-3">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">LMS Pro</h2>
            <p className="text-xs text-gray-500 capitalize">{role} Portal</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={link.href}
                className={`sidebar-link ${isActiveLink(link.href) ? 'sidebar-link-active' : ''}`}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.name}</span>
                {isActiveLink(link.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-0 top-0 bottom-0 w-0.5 bg-primary-600"
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
