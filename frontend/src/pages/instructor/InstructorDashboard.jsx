import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  PlayIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  BellIcon,
  CogIcon,
  ArrowPathIcon,
  Squares2X2Icon,
  CreditCardIcon,
  UsersIcon,
  TrophyIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const InstructorDashboard = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  // Mock data
  const mockStats = {
    totalCourses: 12,
    publishedCourses: 8,
    draftCourses: 4,
    totalStudents: 45678,
    totalRevenue: 125678,
    averageRating: 4.7,
    totalReviews: 2341,
    completionRate: 78.5,
    engagementRate: 85.2,
    thisMonthRevenue: 15678,
    topPerformingCourse: 'Advanced React Development',
    recentActivity: 23
  };

  const mockCourses = [
    {
      id: 1,
      title: 'Complete React Development Course - 2024',
      description: 'Master React from scratch to advanced concepts including Redux, Next.js, and deployment',
      category: 'Development',
      level: 'Intermediate',
      price: 89.99,
      originalPrice: 199.99,
      thumbnail: 'https://via.placeholder.com/400x250',
      status: 'published',
      publishedAt: '2024-01-15',
      students: 15234,
      rating: 4.8,
      reviews: 2341,
      revenue: 125678,
      completionRate: 78.5,
      engagementRate: 85.2,
      modules: 12,
      totalLessons: 234,
      totalDuration: '42 hours',
      lastUpdated: '2024-01-20',
      tags: ['React', 'JavaScript', 'TypeScript', 'Next.js', 'Redux'],
      bestseller: true,
      hot: true,
      featured: true
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts & ES6+',
      description: 'Deep dive into JavaScript advanced concepts, async programming, and modern ES6+ features',
      category: 'Development',
      level: 'Advanced',
      price: 79.99,
      originalPrice: 179.99,
      thumbnail: 'https://via.placeholder.com/400x250',
      status: 'published',
      publishedAt: '2024-01-10',
      students: 12456,
      rating: 4.9,
      reviews: 1876,
      revenue: 98654,
      completionRate: 82.3,
      engagementRate: 88.7,
      modules: 10,
      totalLessons: 198,
      totalDuration: '38 hours',
      lastUpdated: '2024-01-18',
      tags: ['JavaScript', 'ES6+', 'Async', 'Promises', 'Modules'],
      bestseller: true
    },
    {
      id: 3,
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js, Express, MongoDB and REST APIs',
      category: 'Development',
      level: 'Intermediate',
      price: 94.99,
      originalPrice: 199.99,
      thumbnail: 'https://via.placeholder.com/400x250',
      status: 'draft',
      publishedAt: null,
      students: 0,
      rating: 0,
      reviews: 0,
      revenue: 0,
      completionRate: 0,
      engagementRate: 0,
      modules: 8,
      totalLessons: 267,
      totalDuration: '45 hours',
      lastUpdated: '2024-02-01',
      tags: ['Node.js', 'Express', 'MongoDB', 'REST API', 'Backend'],
      bestseller: false,
      hot: true
    }
  ];

  const mockRecentActivity = [
    {
      id: 1,
      type: 'enrollment',
      message: 'New student enrolled in Complete React Development Course',
      student: 'Sarah Johnson',
      time: '2 hours ago',
      icon: <UserGroupIcon className="h-5 w-5 text-blue-600" />
    },
    {
      id: 2,
      type: 'review',
      message: '5-star review received for Advanced JavaScript Concepts',
      course: 'Advanced JavaScript Concepts & ES6+',
      student: 'Mike Chen',
      time: '4 hours ago',
      icon: <StarIcon className="h-5 w-5 text-yellow-500" />
    },
    {
      id: 3,
      type: 'completion',
      message: 'Student completed React Components & Props module',
      course: 'Complete React Development Course',
      student: 'Emily Davis',
      time: '6 hours ago',
      icon: <TrophyIcon className="h-5 w-5 text-green-600" />
    }
  ];

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setCourses(mockCourses);
      setStats(mockStats);
    }, 500);
  }, []);

  const handleCreateCourse = () => {
    setShowCreateModal(true);
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handlePublishCourse = (courseId) => {
    // Simulate API call
    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? { ...course, status: 'published', publishedAt: new Date().toISOString() }
        : course
    );
    setCourses(updatedCourses);
  };

  const handleDeleteCourse = (courseId) => {
    // Simulate API call
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpenIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <ArrowTrendingUpIcon className="h-4 w-4" />
          <span>+{stats.draftCourses} this month</span>
        </div>
      </div>

      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{stats.publishedCourses}</div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <ArrowTrendingUpIcon className="h-4 w-4" />
          <span>+{stats.draftCourses} pending review</span>
        </div>
      </div>

      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <UserGroupIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <ArrowTrendingUpIcon className="h-4 w-4" />
          <span>+{Math.floor(stats.totalStudents * 0.05)} this month</span>
        </div>
      </div>

      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <ArrowTrendingUpIcon className="h-4 w-4" />
          <span>+${stats.thisMonthRevenue.toLocaleString()} this month</span>
        </div>
      </div>
    </div>
  );

  const RecentActivity = () => (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {mockRecentActivity.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              {activity.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-900">{activity.message}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{activity.student}</span>
                <span>•</span>
                <span>{activity.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const CourseList = () => (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Courses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          
          <button
            onClick={handleCreateCourse}
            className="btn-premium"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Course
          </button>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-premium overflow-hidden group cursor-pointer"
            onClick={() => handleViewCourse(course)}
          >
            <div className="relative">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Course Badges */}
              <div className="absolute top-2 left-2 flex gap-2">
                {course.bestseller && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <FireIcon className="h-3 w-3" />
                    Bestseller
                  </span>
                )}
                {course.hot && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <SparklesIcon className="h-3 w-3" />
                    Hot
                  </span>
                )}
                {course.featured && (
                  <span className="bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                    Featured
                  </span>
                )}
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  course.status === 'published' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  {course.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <StarIconSolid className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-600">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <UserGroupIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{course.students.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{course.modules} modules</span>
                <span>{course.totalLessons} lessons</span>
                <span>{course.totalDuration}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  {course.originalPrice > course.price && (
                    <span className="text-sm text-gray-400 line-through mr-2">
                      ${course.originalPrice}
                    </span>
                  )}
                  <span className="text-xl font-bold text-gray-900">
                    ${course.price}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (course.status === 'draft') {
                        handlePublishCourse(course.id);
                      } else {
                        handleDeleteCourse(course.id);
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      course.status === 'draft'
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {course.status === 'draft' ? (
                      <ArrowUpTrayIcon className="h-4 w-4" />
                    ) : (
                      <TrashIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
              <p className="text-gray-600">Manage your courses and track student progress</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <BellIcon className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <CogIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {['overview', 'courses', 'analytics', 'students'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <DashboardStats />
              <RecentActivity />
            </div>
          )}

          {activeTab === 'courses' && <CourseList />}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="card-premium p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                    <div className="flex items-center justify-center gap-2 text-green-600 mt-2">
                      <TrendingUpIcon className="h-4 w-4" />
                      <span>+${stats.thisMonthRevenue.toLocaleString()} this month</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{stats.averageRating}</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                    <div className="flex items-center justify-center gap-2 text-blue-600 mt-2">
                      <TrendingUpIcon className="h-4 w-4" />
                      <span>+0.2 this month</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{stats.completionRate}%</div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="card-premium p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Student Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stats.engagementRate}%</div>
                  <div className="text-sm text-gray-600">Engagement Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stats.completionRate}%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Create New Course</h2>
                <p className="text-gray-600">Start building your course with our intuitive course builder.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                  <input
                    type="text"
                    placeholder="Enter course title..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select a category</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="data-science">Data Science</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select a level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Describe your course..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn-premium-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Create course logic here
                    setShowCreateModal(false);
                  }}
                  className="btn-premium"
                >
                  Create Course
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstructorDashboard;
