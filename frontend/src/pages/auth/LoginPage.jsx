import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  UserIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      toast.success('Welcome back! 🎉');
      
      // Redirect based on role
      switch (result.user.role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'instructor':
          navigate('/instructor/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/student/dashboard');
      }
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl shadow-lg mb-4"
          >
            <AcademicCapIcon className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to <span className="text-gradient-premium">LMS Pro</span>
          </h1>
          <p className="text-gray-600">Sign in to access your learning journey</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-premium-xl p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="input-premium pl-10"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-premium pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner-premium mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Sign In
                </div>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to LMS Pro?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Create an account →
            </Link>
          </div>
        </motion.div>

        {/* Demo Accounts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 mb-2">Demo Accounts:</p>
          <div className="flex justify-center space-x-4 text-xs">
            <div className="bg-gray-100 px-3 py-2 rounded-lg">
              <strong>Student:</strong> student@example.com
            </div>
            <div className="bg-gray-100 px-3 py-2 rounded-lg">
              <strong>Instructor:</strong> instructor@example.com
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
