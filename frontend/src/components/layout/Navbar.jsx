import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  AcademicCapIcon,
  SparklesIcon,
  HeartIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { formatCurrency } from '../../utils/helpers';
import logo from '../../assets/images/logo.png'

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, notifications } = useUIStore();
  // local states
  const [isScrolled, setIsScrolled] = useState(false);  //navbar style chnges on scroll
  const [searchQuery, setSearchQuery] = useState('');   //search i/p val
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); //profile menu open/close

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: AcademicCapIcon },
    { name: 'Courses', href: '/courses', icon: BookOpenIcon },
    { name: 'Instructors', href: '/instructors', icon: UserCircleIcon },
    { name: 'About', href: '/about', icon: HeartIcon },
  ];

  const isActiveLink = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-premium shadow-lg border-b border-gray-100' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img src={logo} alt="Logo" className='h-10 w-auto object-contain'/>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <HeartIcon className="h-2 w-2 text-white" />
                </div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gradient-premium">ProTrain</span>
                <span className="text-xs text-gray-500 font-medium">Learn Without Limits</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`nav-link flex items-center space-x-1 ${
                    isActiveLink(link.href) ? 'nav-link-active' : ''
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses, topics, or instructors..."
                  className="input-premium pl-10 pr-4 text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </form>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* Notifications */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                  >
                    <BellIcon className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </motion.button>

                  {/* Cart */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      3
                    </span>
                  </motion.button>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                          {user?.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user?.name || 'User'} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserCircleIcon className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <SparklesIcon className="h-2 w-2 text-white" />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name?.split(' ')[0] || 'User'}
                      </span>
                    </motion.button>

                    <AnimatePresence>
                      {showProfileDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-premium-xl border border-gray-100 py-2"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg mt-1">
                              {user?.role || 'Student'}
                            </span>
                          </div>
                          
                          <div className="py-2">
                            <Link
                              to={`/${user?.role}/dashboard`}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                              onClick={() => setShowProfileDropdown(false)}
                            >
                              <BookOpenIcon className="h-4 w-4" />
                              <span>Dashboard</span>
                            </Link>
                            <Link
                              to={`/${user?.role}/profile`}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                              onClick={() => setShowProfileDropdown(false)}
                            >
                              <UserCircleIcon className="h-4 w-4" />
                              <span>Profile Settings</span>
                            </Link>
                            <Link
                              to={`/${user?.role}/courses`}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                              onClick={() => setShowProfileDropdown(false)}
                            >
                              <BookOpenIcon className="h-4 w-4" />
                              <span>My Courses</span>
                            </Link>
                          </div>
                          
                          <hr className="my-2 border-gray-100" />
                          
                          <button
                            onClick={() => {
                              handleLogout();
                              setShowProfileDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                          >
                            <XMarkIcon className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-200"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-premium text-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={toggleSidebar}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Bars3Icon className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <AcademicCapIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">LMS Pro</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-600" />
                </motion.button>
              </div>

              <nav className="space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActiveLink(link.href)
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700'
                      }`}
                      onClick={toggleSidebar}
                    >
                      <link.icon 
                        className={`h-5 w-5 transition-colors ${
                          isActiveLink(link.href) ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'
                        }`} 
                      />
                      <span className="font-medium">{link.name}</span>
                      {isActiveLink(link.href) && (
                        <motion.div
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {!isAuthenticated && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { navigate('/login'); toggleSidebar(); }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200"
                  >
                    <span className="font-medium">Log In</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { navigate('/register'); toggleSidebar(); }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    <span className="font-medium">Get Started</span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
