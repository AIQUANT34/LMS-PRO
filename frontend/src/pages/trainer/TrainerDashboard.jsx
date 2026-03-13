import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  Bars3Icon,
  BellIcon,
  UserPlusIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
  StarIcon,
  ClockIcon,
  PlayIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';
import ProfilePictureUpload from '../../components/common/ProfilePictureUpload';
import { useAuthStore } from '../../store/authStore';

const TrainerDashboard = () => {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch real data from backend
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch trainer's courses
        const coursesResponse = await apiService.get(API_ENDPOINTS.COURSES.GET_INSTRUCTOR_COURSES);
        
        // Calculate stats from real courses data
        const coursesData = coursesResponse.data?.courses || [];
        const totalCourses = coursesData.length;
        const publishedCourses = coursesData.filter(course => course.status === 'published').length;
        const draftCourses = coursesData.filter(course => course.status === 'draft').length;
        const totalStudents = coursesData.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
        const totalRevenue = coursesData.reduce((sum, course) => sum + (course.totalRevenue || 0), 0);
        const averageRating = coursesData.length > 0 
          ? coursesData.reduce((sum, course) => sum + (course.ratings?.average || 0), 0) / coursesData.length 
          : 0;
        
        const statsData = {
          totalCourses,
          publishedCourses,
          draftCourses,
          totalStudents,
          totalRevenue,
          averageRating: averageRating.toFixed(1),
          totalReviews: coursesData.reduce((sum, course) => sum + (course.ratings?.count || 0), 0),
          completionRate: totalStudents > 0 ? Math.round((coursesData.reduce((sum, course) => sum + (course.progress || 0), 0) / totalStudents) * 100) : 0,
          engagementRate: 85.2, // Mock for now
          thisMonthRevenue: Math.round(totalRevenue * 0.1), // Mock for now
          topPerformingCourse: coursesData.length > 0 ? coursesData[0]?.title : 'No courses yet',
          recentActivity: 12 // Mock for now
        };
        
        setCourses(coursesData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch trainer data:', error);
        setError('Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
        
        // Fallback to empty state
        setCourses([]);
        setStats({
          totalCourses: 0,
          publishedCourses: 0,
          draftCourses: 0,
          totalStudents: 0,
          totalRevenue: 0,
          averageRating: 0,
          totalReviews: 0,
          completionRate: 0,
          engagementRate: 0,
          thisMonthRevenue: 0,
          topPerformingCourse: 'No courses yet',
          recentActivity: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-700">Loading Dashboard...</div>
          <div className="text-sm text-gray-500 mt-2">Preparing your instructor workspace</div>
        </div>
      </div>
    );
  }

 

  const filteredCourses = (courses || []).filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-500">Instructor Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <ProfilePictureUpload
                currentImage={user?.avatar}
                onImageUpdate={(newImage) => user && (user.avatar = newImage)}
                size="small"
                userId={user?.id}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your courses and track student progress</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
              </button>
              <ProfilePictureUpload
                currentImage={user?.avatar}
                onImageUpdate={(newImage) => user && (user.avatar = newImage)}
                size="small"
                userId={user?.id}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed inset-0 z-30 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <XMarkIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            {['overview', 'courses', 'analytics', 'students'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Desktop Tabs */}
        <div className="hidden lg:block mb-6">
          <div className="bg-white rounded-xl shadow-sm p-1">
            <div className="flex space-x-1">
              {['overview', 'courses', 'analytics', 'students'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Courses', value: stats?.totalCourses || 0, icon: BookOpenIcon, color: 'blue', trend: '+2 this month' },
                  { label: 'Total Students', value: (stats?.totalStudents || 0).toLocaleString(), icon: UserGroupIcon, color: 'green', trend: '+12% growth' },
                  { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: CurrencyDollarIcon, color: 'yellow', trend: '+18% vs last month' },
                  { label: 'Avg Rating', value: stats?.averageRating || 0, icon: StarIcon, color: 'purple', trend: '4.8/5.0' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {stat.trend}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { user: 'John Doe', action: 'enrolled in', course: 'React Mastery', time: '2 hours ago', icon: UserPlusIcon },
                    { user: 'Jane Smith', action: 'completed', course: 'JavaScript Basics', time: '4 hours ago', icon: CheckCircleIcon },
                    { user: 'Mike Johnson', action: 'reviewed', course: 'Node.js Backend', time: '6 hours ago', icon: StarIcon },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <activity.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                          <span className="font-medium">{activity.course}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'courses' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search courses..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.slice(0, 6).map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                      <BookOpenIcon className="h-16 w-16 text-white opacity-50" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          course.status === 'published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {course.status}
                        </span>
                        <div className="flex items-center space-x-1">
                          <StarIcon className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">{course.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">${course.price}</div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <PencilSquareIcon className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="text-2xl font-bold text-gray-900">${(stats?.totalRevenue || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">This Month</span>
                      <span className="text-lg font-semibold text-green-600">+$12,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Growth Rate</span>
                      <span className="text-lg font-semibold text-blue-600">+18.5%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="text-2xl font-bold text-gray-900">{stats?.averageRating || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Reviews</span>
                      <span className="text-lg font-semibold text-gray-900">{stats?.totalReviews || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="text-lg font-semibold text-green-600">78.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserGroupIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Management</h3>
                  <p className="text-gray-600 mb-6">Advanced student analytics and management features coming soon</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stats?.totalStudents || 0}</div>
                      <div className="text-sm text-gray-600">Total Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">89%</div>
                      <div className="text-sm text-gray-600">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">4.8</div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
