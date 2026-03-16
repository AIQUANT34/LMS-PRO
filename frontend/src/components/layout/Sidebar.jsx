import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HomeIcon,
  BookOpenIcon,
  DocumentTextIcon,
  TrophyIcon,
  UserCircleIcon,
  VideoCameraIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CogIcon,
  SparklesIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const Sidebar = ({ role, onClose }) => {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, closeSidebar } = useUIStore();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        closeSidebar(); // Close sidebar on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [closeSidebar]);

  const studentLinks = [
    { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
    { name: 'Browse Courses', href: '/courses', icon: BookOpenIcon },
    { name: 'My Courses', href: '/student/courses', icon: DocumentTextIcon },
    { name: 'Achievements', href: '/student/achievements', icon: TrophyIcon },
    { name: 'AI Assistant', href: '/student/ai-assistant', icon: SparklesIcon },
    { name: 'Assignments', href: '/employee/assignments', icon: DocumentTextIcon },
    { name: 'Certificates', href: '/employee/certificates', icon: TrophyIcon },
    { name: 'Profile', href: '/student/profile', icon: UserCircleIcon },

  ];

  const trainerLinks = [
    { name: 'Dashboard', href: '/trainer/dashboard', icon: HomeIcon },
    { name: 'My Programs', href: '/trainer/courses', icon: BookOpenIcon },
    { name: 'Create Program', href: '/trainer/courses/create', icon: VideoCameraIcon },
    { name: 'Assignments', href: '/trainer/assignments', icon: ClipboardDocumentListIcon },
    { name: 'Analytics', href: '/trainer/analytics', icon: ChartBarIcon },
    { name: 'Earnings', href: '/trainer/earnings', icon: CurrencyDollarIcon },
    { name: 'Profile', href: '/trainer/profile', icon: UserCircleIcon },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'User Management', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Program Management', href: '/admin/courses', icon: BookOpenIcon },
    { name: 'Trainer Approval', href: '/admin/trainers', icon: ShieldCheckIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  ];

  const getLinks = () => {
    switch (role) {
      case 'student':
        return studentLinks;
      case 'trainer':
        return trainerLinks;
      case 'admin':
        return adminLinks;
      default:
        return studentLinks; // Default to student links
    }
  };

  const links = getLinks();
  const currentPath = window.location.pathname;

  const isActiveLink = (href) => {
    const currentPath = window.location.pathname;
    return currentPath === href || currentPath.startsWith(href);
  };

  // Mobile sidebar variants
  const sidebarVariants = {
    hidden: {
      x: -320,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Overlay for mobile
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeSidebar}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate={isMobile ? (sidebarOpen ? "visible" : "hidden") : "visible"}
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 lg:relative lg:top-0 lg:h-auto lg:flex lg:flex-shrink-0 lg:shadow-lg lg:border-r lg:border-gray-200 lg:z-auto lg:block ${
          isMobile ? 'block' : ''
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="text-center flex-1">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md mb-3 transform transition-transform hover:scale-105">
                <BriefcaseIcon className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-base font-bold text-gray-900">ProTrain</h2>
              <p className="text-xs text-gray-500 capitalize font-medium">{role} Portal</p>
            </div>
            
            {/* Mobile Close Button */}
            {isMobile && (
              <button
                onClick={onClose || closeSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <XMarkIcon className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white ring-offset-2 ring-offset-gray-50 overflow-hidden">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.name || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {links.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={link.href}
                  onClick={() => isMobile && (onClose || closeSidebar())}
                  className={`group relative flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActiveLink(link.href)
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <link.icon 
                    className={`h-4 w-4 transition-colors ${
                      isActiveLink(link.href) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                    }`} 
                  />
                  <span className="font-medium text-sm">{link.name}</span>
                  {isActiveLink(link.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
