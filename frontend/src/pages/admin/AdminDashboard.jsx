import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheckIcon,
  UserGroupIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CogIcon,
  BellIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  BanknotesIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  DocumentTextIcon,
  FolderIcon,
  ServerIcon,
  GlobeAltIcon,
  LockClosedIcon,
  KeyIcon,
  FlagIcon,
  StarIcon,
  FireIcon,
  SparklesIcon,
  BeakerIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PrinterIcon,
  ShareIcon,
  LinkIcon,
  CameraIcon,
  VideoCameraIcon,
  PhotoIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  DocumentIcon,
  CurrencyDollarIcon as CurrencyDollarIconOutline,
  UsersIcon,
  BuildingOfficeIcon,
  TruckIcon,
  PackageIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  ChartPieIcon,
  ChartLineIcon,
  CubeIcon,
  CircleStackIcon,
  ArchiveBoxIcon,
  InboxIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Mock data
  const mockStats = {
    totalUsers: 45678,
    activeUsers: 38234,
    totalCourses: 1234,
    publishedCourses: 987,
    totalInstructors: 567,
    activeInstructors: 423,
    totalRevenue: 2456789,
    thisMonthRevenue: 156789,
    totalEnrollments: 89012,
    thisMonthEnrollments: 5432,
    completionRate: 78.5,
    averageRating: 4.6,
    totalReviews: 12345,
    pendingApprovals: 23,
    systemUptime: 99.9,
    serverLoad: 45.2,
    storageUsed: 78.5,
    bandwidthUsed: 62.3
  };

  const mockRecentActivity = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New user registration spike detected',
      user: 'Sarah Johnson',
      time: '2 hours ago',
      severity: 'info',
      icon: <UserGroupIcon className="h-5 w-5 text-blue-600" />
    },
    {
      id: 2,
      type: 'course_approval',
      message: 'Course "Advanced React Patterns" pending approval',
      instructor: 'John Smith',
      time: '4 hours ago',
      severity: 'warning',
      icon: <AcademicCapIcon className="h-5 w-5 text-yellow-600" />
    },
    {
      id: 3,
      type: 'system_alert',
      message: 'High server load on database server',
      server: 'DB-01',
      time: '6 hours ago',
      severity: 'error',
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
    },
    {
      id: 4,
      type: 'payment',
      message: 'Monthly revenue target achieved',
      amount: '$156,789',
      time: '8 hours ago',
      severity: 'success',
      icon: <CurrencyDollarIconOutline className="h-5 w-5 text-green-600" />
    }
  ];

  const mockSystemHealth = {
    overall: 'healthy',
    services: [
      { name: 'Web Server', status: 'healthy', uptime: 99.9, responseTime: '45ms' },
      { name: 'Database', status: 'healthy', uptime: 99.8, responseTime: '23ms' },
      { name: 'CDN', status: 'healthy', uptime: 99.95, responseTime: '12ms' },
      { name: 'Email Service', status: 'warning', uptime: 98.5, responseTime: '156ms' },
      { name: 'Payment Gateway', status: 'healthy', uptime: 99.9, responseTime: '89ms' },
      { name: 'Storage', status: 'healthy', uptime: 99.7, responseTime: '34ms' }
    ],
    alerts: [
      { type: 'warning', message: 'Email service experiencing delays', time: '15 minutes ago' },
      { type: 'info', message: 'Scheduled maintenance in 2 hours', time: '1 hour ago' }
    ]
  };

  const mockRevenueData = [
    { month: 'Jan', revenue: 125000, enrollments: 3421 },
    { month: 'Feb', revenue: 145000, enrollments: 3892 },
    { month: 'Mar', revenue: 156789, enrollments: 5432 },
    { month: 'Apr', revenue: 167000, enrollments: 5678 },
    { month: 'May', revenue: 178000, enrollments: 6234 },
    { month: 'Jun', revenue: 189000, enrollments: 6891 }
  ];

  const mockUserGrowth = [
    { month: 'Jan', users: 35000, newUsers: 2341 },
    { month: 'Feb', users: 38000, newUsers: 3000 },
    { month: 'Mar', users: 42000, newUsers: 4000 },
    { month: 'Apr', users: 45000, newUsers: 3000 },
    { month: 'May', users: 48000, newUsers: 3000 },
    { month: 'Jun', users: 52000, newUsers: 4000 }
  ];

  const mockCourseStats = [
    { category: 'Development', courses: 456, students: 23456, revenue: 890000 },
    { category: 'Design', courses: 234, students: 12345, revenue: 456000 },
    { category: 'Marketing', courses: 189, students: 8901, revenue: 234000 },
    { category: 'Business', courses: 167, students: 6789, revenue: 189000 },
    { category: 'Data Science', courses: 123, students: 4567, revenue: 123000 },
    { category: 'Photography', courses: 65, students: 2345, revenue: 67000 }
  ];

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setStats(mockStats);
      setRecentActivity(mockRecentActivity);
      setSystemHealth(mockSystemHealth);
      setRevenueData(mockRevenueData);
      setUserGrowth(mockUserGrowth);
      setCourseStats(mockCourseStats);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100';
      case 'warning': return 'bg-yellow-100';
      case 'error': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'success': return 'bg-green-100';
      case 'warning': return 'bg-yellow-100';
      case 'error': return 'bg-red-100';
      case 'info': return 'bg-blue-100';
      default: return 'bg-gray-100';
    }
  };

  const OverviewStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <UserGroupIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <TrendingUpIcon className="h-4 w-4" />
          <span>+{Math.floor(stats.totalUsers * 0.05)} this month</span>
        </div>
      </div>

      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <BookOpenIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <TrendingUpIcon className="h-4 w-4" />
          <span>+{stats.pendingApprovals} pending</span>
        </div>
      </div>

      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <AcademicCapIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{stats.totalInstructors}</div>
            <div className="text-sm text-gray-600">Total Instructors</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <TrendingUpIcon className="h-4 w-4" />
          <span>{stats.activeInstructors} active</span>
        </div>
      </div>

      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <CurrencyDollarIconOutline className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <TrendingUpIcon className="h-4 w-4" />
          <span>+${stats.thisMonthRevenue.toLocaleString()} this month</span>
        </div>
      </div>
    </div>
  );

  const SystemHealth = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusBg(systemHealth.overall)}`}></div>
              <span className="font-medium text-gray-900">Overall Status</span>
            </div>
            <span className={`font-semibold ${getStatusColor(systemHealth.overall)}`}>
              {systemHealth.overall.charAt(0).toUpperCase() + systemHealth.overall.slice(1)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">System Uptime</span>
            <span className="font-semibold text-gray-900">{stats.systemUptime}%</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Server Load</span>
            <span className="font-semibold text-gray-900">{stats.serverLoad}%</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Storage Used</span>
            <span className="font-semibold text-gray-900">{stats.storageUsed}%</span>
          </div>
        </div>
      </div>

      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
        
        <div className="space-y-3">
          {systemHealth.services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${getStatusBg(service.status)}`}></div>
                <div>
                  <div className="font-medium text-gray-900">{service.name}</div>
                  <div className="text-sm text-gray-600">{service.responseTime} response time</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${getStatusColor(service.status)}`}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </div>
                <div className="text-sm text-gray-600">{service.uptime}% uptime</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const RecentActivity = () => (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-3">
        {recentActivity.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityBg(activity.severity)}`}>
              {activity.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-900">{activity.message}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{activity.user || activity.instructor || activity.server}</span>
                <span>•</span>
                <span>{activity.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const RevenueChart = () => (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">+${stats.thisMonthRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {revenueData.map((data, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{data.month}</div>
              <div className="text-sm text-gray-600">{data.enrollments.toLocaleString()} enrollments</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">${data.revenue.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UserGrowthChart = () => (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">+{Math.floor(stats.totalUsers * 0.05).toLocaleString()}</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {userGrowth.map((data, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{data.month}</div>
              <div className="text-sm text-gray-600">{data.newUsers.toLocaleString()} new users</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{data.users.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CourseCategoryStats = () => (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Categories</h3>
      
      <div className="space-y-3">
        {courseStats.map((category, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{category.category}</div>
              <div className="text-sm text-gray-600">{category.courses} courses</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">${category.revenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{category.students.toLocaleString()} students</div>
            </div>
          </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">System management and analytics</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
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
            {['overview', 'users', 'courses', 'instructors', 'analytics', 'settings'].map((tab) => (
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
              <OverviewStats />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SystemHealth />
                <RecentActivity />
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-8">
              <UserGrowthChart />
              <div className="card-premium p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                  <button className="btn-premium">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add User
                  </button>
                </div>
                <p className="text-gray-600">Manage user accounts, permissions, and access controls.</p>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-8">
              <CourseCategoryStats />
              <div className="card-premium p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Management</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
                    <div className="text-sm text-gray-600">Total Courses</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="badge-warning">{stats.pendingApprovals} pending</span>
                    <button className="btn-premium">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Review All
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">Review and approve course submissions, manage course content.</p>
              </div>
            </div>
          )}

          {activeTab === 'instructors' && (
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor Management</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalInstructors}</div>
                  <div className="text-sm text-gray-600">Total Instructors</div>
                </div>
                <button className="btn-premium">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Instructor
                </button>
              </div>
              <p className="text-gray-600">Manage instructor applications, verify credentials, and handle payouts.</p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <RevenueChart />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <UserGrowthChart />
                <CourseCategoryStats />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Platform Configuration</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Maintenance Mode</span>
                      <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md absolute left-0.5 top-0.5"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">User Registration</span>
                      <button className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Course Creation</span>
                      <button className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Security Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                      <button className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Email Verification</span>
                      <button className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Session Timeout</span>
                      <input
                        type="number"
                        defaultValue="30"
                        className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                      />
                      <span className="text-sm text-gray-600">minutes</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notification Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Email Notifications</span>
                      <button className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">System Alerts</span>
                      <button className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
