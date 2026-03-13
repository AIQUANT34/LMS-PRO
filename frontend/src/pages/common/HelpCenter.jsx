import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  CogIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpenIcon },
    { id: 'getting-started', name: 'Getting Started', icon: AcademicCapIcon },
    { id: 'courses', name: 'Courses & Content', icon: VideoCameraIcon },
    { id: 'account', name: 'Account & Billing', icon: CogIcon },
    { id: 'technical', name: 'Technical Support', icon: ChatBubbleLeftRightIcon }
  ];

  const helpArticles = [
    {
      id: 1,
      category: 'getting-started',
      title: 'How to Create Your Account',
      content: 'Learn how to sign up for ProTrain and set up your profile for the best learning experience.',
      video: false,
      readTime: '3 min read'
    },
    {
      id: 2,
      category: 'getting-started',
      title: 'Navigating Your Dashboard',
      content: 'Discover all the features available in your student dashboard and how to make the most of your learning journey.',
      video: true,
      videoUrl: '/help/dashboard-tour',
      readTime: '5 min watch'
    },
    {
      id: 3,
      category: 'courses',
      title: 'Enrolling in Courses',
      content: 'Step-by-step guide on how to browse, enroll, and start learning with our comprehensive course catalog.',
      video: true,
      videoUrl: '/help/course-enrollment',
      readTime: '4 min watch'
    },
    {
      id: 4,
      category: 'courses',
      title: 'Course Progress Tracking',
      content: 'Understanding how to monitor your learning progress, completion rates, and achievements in ProTrain.',
      video: true,
      videoUrl: '/help/progress-tracking',
      readTime: '6 min watch'
    },
    {
      id: 5,
      category: 'technical',
      title: 'Common Technical Issues',
      content: 'Troubleshooting guide for common technical problems like video playback, login issues, and certificate access.',
      video: false,
      readTime: '8 min read'
    },
    {
      id: 6,
      category: 'account',
      title: 'Managing Your Profile',
      content: 'Learn how to update your personal information, preferences, and privacy settings in your ProTrain account.',
      video: false,
      readTime: '4 min read'
    }
  ];

  const filteredArticles = helpArticles.filter(article => 
    selectedCategory === 'all' || article.category === selectedCategory
  ).filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowRightIcon className="h-5 w-5 rotate-180 mr-2" />
                <span className="text-lg font-semibold">Back to Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search help articles..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <category.icon className="h-5 w-5 mr-2" />
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link
                    to="/contact"
                    className="flex items-center p-3 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                    <span>Contact Support</span>
                  </Link>
                  <Link
                    to="/student/courses"
                    className="flex items-center p-3 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <BookOpenIcon className="h-5 w-5 mr-2" />
                    <span>My Courses</span>
                  </Link>
                  <Link
                    to="/student/profile"
                    className="flex items-center p-3 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <CogIcon className="h-5 w-5 mr-2" />
                    <span>Profile Settings</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Articles List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or browse different categories.
                  </p>
                </div>
              ) : (
                filteredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          article.category === 'getting-started' ? 'bg-green-100 text-green-800' :
                          article.category === 'courses' ? 'bg-blue-100 text-blue-800' :
                          article.category === 'technical' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {article.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {article.readTime}
                        </span>
                      </div>
                      
                      {article.video && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          <VideoCameraIcon className="h-4 w-4 mr-1" />
                          Watch Video
                        </button>
                      )}
                    </div>
                    
                    <Link
                      to={`/help/article/${article.id}`}
                      className="block group"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.content}
                      </p>
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                        <span className="text-sm font-medium">Read more</span>
                        <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
