import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpenIcon,
  TrophyIcon,
  ClockIcon,
  ChartBarIcon,
  FireIcon,
  SparklesIcon,
  AcademicCapIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  BellIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  StarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { useEnrollmentStore } from '../../store/enrollmentStore';
import { apiService } from '../../services/apiService';
import { aiService } from '../../services/aiService';
import ProfilePictureUpload from '../../components/common/ProfilePictureUpload';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    enrolledCourses, 
    fetchEnrollments, 
    isEnrolled, 
    isLoading 
  } = useEnrollmentStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [progressSummary, setProgressSummary] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine active tab based on current route
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/student/dashboard')) return 'overview';
    if (path.includes('/student/courses')) return 'courses';
    if (path.includes('/student/achievements')) return 'achievements';
    if (path.includes('/student/ai-assistant')) return 'ai-assistant';
    return 'overview';
  };

  const activeTab = getActiveTabFromPath();

 

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch real data using enrollment store
      await fetchEnrollments();
      
      // Don't calculate stats here - wait for enrolledCourses to update
      // The stats will be calculated in the useEffect below
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  // Calculate stats when enrolledCourses changes
  useEffect(() => {
    if (enrolledCourses.length >= 0) {
      const stats = {
        enrolledCourses: enrolledCourses.length,
        completedCourses: enrolledCourses.filter(course => course.progress >= 100).length,
        totalHours: enrolledCourses.reduce((total, course) => total + (course.completedHours || 0), 0),
        currentStreak: calculateStreak(enrolledCourses),
        averageProgress: enrolledCourses.length > 0 
          ? Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length)
          : 0
      };

      setDashboardData(stats);
    }
  }, [enrolledCourses]); // This will run when enrolledCourses updates

  const calculateStreak = (courses) => {
    // Calculate learning streak based on last accessed dates
    const today = new Date();
    const lastWeek = courses
      .filter(course => course.lastAccessed)
      .map(course => new Date(course.lastAccessed))
      .filter(date => (today - date) / (1000 * 60 * 60 * 24) <= 7);
    
    return lastWeek.length;
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchEnrollments]); // Remove enrolledCourses to prevent infinite loop

if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-700">Loading Dashboard...</div>
          <div className="text-sm text-gray-500 mt-2">Preparing your learning space</div>
        </div>
      </div>
    );
  }

  const stats = dashboardData || {
    enrolledCourses: enrolledCourses.length,
    completedCourses: 0,
    totalHours: 0,
    currentStreak: 0,
    averageProgress: 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="h-5 w-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-500">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
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

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Student'}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                <CogIcon className="h-5 w-5 text-gray-600" />
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


      <div className='flex min-h-screen'>

     
      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed inset-0 z-30 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <XMarkIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div> 
          </div>
          <nav className="p-4 space-y-1">
            {[
              { key: 'overview', label: 'Overview', path: '/student/dashboard' },
              { key: 'courses', label: 'Courses', path: '/student/courses' },
              { key: 'achievements', label: 'Achievements', path: '/student/achievements' },
              { key: 'trainer-application', label: 'Become Trainer', path: '/student/trainer-application' },
              { key: 'ai-assistant', label: 'AI Assistant', path: '/student/ai-assistant' }
            ].map((tab) => (
              <Link
                key={tab.key}
                to={tab.path}
                className={`flex w-full text-left px-4 py-3 rounded-lg capitalize transition-colors ${
                  activeTab === tab.key
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Desktop Tabs */}
        <div className="hidden lg:block mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
            <div className="flex space-x-1">
              {[
                { key: 'overview', label: 'Overview', path: '/student/dashboard' },
                { key: 'courses', label: 'Courses', path: '/student/courses' },
                { key: 'achievements', label: 'Achievements', path: '/student/achievements' },
                { key: 'trainer-application', label: 'Become Trainer', path: '/student/trainer-application' },
                { key: 'ai-assistant', label: 'AI Assistant', path: '/student/ai-assistant' }
              ].map((tab) => (
                <Link
                  key={tab.key}
                  to={tab.path}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium capitalize transition-all ${
                    activeTab === tab.key
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Enrolled Courses', value: enrolledCourses.length || 0, icon: BookOpenIcon, color: 'purple', trend: '+2 this month' },
                { label: 'Completed', value: dashboardData?.completedCourses || 0, icon: CheckCircleIcon, color: 'green', trend: 'Great progress!' },
                { label: 'Hours Learned', value: dashboardData?.totalHours || 0, icon: ClockIcon, color: 'blue', trend: '+12h this week' },
                { label: 'Achievements', value: 8, icon: TrophyIcon, color: 'yellow', trend: '2 new badges' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 rounded-2xl flex items-center justify-center shadow-lg relative`}>
                        <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
                        <stat.icon className={`h-7 w-7 text-${stat.color}-100 relative z-10`} />
                      </div>
                      <span className="text-xs text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-1.5 rounded-full border border-gray-200 font-medium">
                        {stat.trend}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Become Trainer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <AcademicCapIcon className="h-8 w-8 text-white" />
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">New Opportunity</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Become a Trainer</h3>
                    <p className="text-blue-100 mb-6 max-w-md">
                      Share your expertise, inspire thousands of learners, and earn while doing what you love. Join our community of expert trainers.
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-blue-100 mb-6">
                      <div className="flex items-center space-x-2">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        <span>Up to 70% revenue share</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UsersIcon className="h-4 w-4" />
                        <span>Global reach</span>
                      </div>
                    </div>
                    <Link
                      to="/student/trainer-application"
                      className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Apply Now
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center">
                      <TrophyIcon className="h-16 w-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Continue Learning */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Continue Learning</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.slice(0, 3).map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                  >
                    {/* Premium gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 to-pink-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg relative">
                          <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
                          <BookOpenIcon className="h-10 w-10 text-white relative z-10" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-lg mb-2">{course.courseId?.title || course.title}</h4>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-600">{course.progress || 0}% Complete</p>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full mb-4 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold py-3 rounded-full transition-all duration-500 relative overflow-hidden"
                          style={{ width: `${course.progress || 0}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-30"></div>
                          <span className="relative z-10">{course.progress || 0}%</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/student/courses/${course.id}`)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-2xl hover:shadow-lg transition-all duration-300 text-base font-semibold"
                      >
                        Continue
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

       </div>

      {/* AI Chat Modal */}
      {aiChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
              <button onClick={() => setAiChatOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <XMarkIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
                <div className="text-sm text-gray-600">
                  <div className="mb-2">
                    <span className="font-semibold text-purple-600">AI:</span> Hello! I'm your personal learning assistant. How can I help you today?
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
