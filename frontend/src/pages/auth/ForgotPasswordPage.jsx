import React from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl shadow-lg mb-4">
            <EnvelopeIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-premium-xl p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                className="input-premium"
                placeholder="Enter your email"
              />
            </div>
            <button type="submit" className="w-full btn-premium">
              Send Reset Link
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Back to Login →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
