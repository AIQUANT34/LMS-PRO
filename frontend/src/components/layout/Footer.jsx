import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon,
  BookOpenIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">ProTrain</h3>
              <p className="text-gray-300 mb-2">
                Empowering learners with comprehensive training solutions.
              </p>
              <div className="flex space-x-4">
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  <AcademicCapIcon className="h-5 w-5 inline-block mr-2" />
                  About
                </Link>
                <Link to="/courses" className="text-gray-300 hover:text-white transition-colors">
                  <BookOpenIcon className="h-5 w-5 inline-block mr-2" />
                  Courses
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-md font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/employee/dashboard" className="text-gray-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/employee/courses" className="text-gray-300 hover:text-white transition-colors">
                    My Courses
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="text-gray-300 hover:text-white transition-colors">
                    Browse All Courses
                  </Link>
                </li>
                <li>
                  <Link to="/employee/certificates" className="text-gray-300 hover:text-white transition-colors">
                    Certificates
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-md font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className="text-gray-300 hover:text-white transition-colors">
                    <BriefcaseIcon className="h-5 w-5 inline-block mr-2" />
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                    <UserGroupIcon className="h-5 w-5 inline-block mr-2" />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-md font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 ProTrain. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <ShieldCheckIcon className="h-5 w-5 inline-block mr-2" />
                  Privacy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <UserGroupIcon className="h-5 w-5 inline-block mr-2" />
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
