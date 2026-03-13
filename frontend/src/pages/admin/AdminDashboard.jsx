import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';
import ProfilePictureUpload from '../../components/common/ProfilePictureUpload';
import { useAuthStore } from '../../store/authStore';
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
  UsersIcon,
  BuildingOfficeIcon,
  TruckIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  ListBulletIcon,
  TableCellsIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import { 
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
  const { user } = useAuthStore();
  // Updated to fix TrendingUpIcon issue
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

  // Settings state
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    userRegistration: true,
    courseCreation: true,
    twoFactorAuth: true,
    emailVerification: true,
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
  });

  const handleToggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const ToggleSwitch = ({ isOn, onClick }) => (
    <button
      onClick={onClick}
      className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${
        isOn ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
          isOn ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
      
      // Transform the backend data to match the frontend structure
      setStats({
        totalUsers: response.totalUsers || 0,
        activeUsers: response.activeUsers || 0,
        totalCourses: response.totalCourses || 0,
        totalRevenue: response.totalRevenue || 0,
        pendingApplications: response.pendingApplications || 0,
        systemHealth: response.systemHealth || 'good'
      });
      
      setRecentActivity(response.recentActivity || []);
      setSystemHealth(response.systemHealth || { overall: 'healthy', services: [] });
      setRevenueData(response.revenueData || []);
      setUserGrowth(response.userGrowth || []);
      setCourseStats(response.courseStats || []);
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Set some default values in case API fails
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        totalCourses: 0,
        totalRevenue: 0,
        pendingApplications: 0,
        systemHealth: 'unknown'
      });
    }
  };

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

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
