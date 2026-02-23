import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold">LMS Pro</span>
            </div>
            <p className="text-gray-300 text-sm">
              Empowering learners worldwide with quality education and professional courses. 
              Your journey to success starts here.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Instructors
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300 text-sm">support@lmspro.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300 text-sm">123 Education St, Learning City, LC 12345</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold mb-2">Subscribe to Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-lg transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 LMS Pro. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
