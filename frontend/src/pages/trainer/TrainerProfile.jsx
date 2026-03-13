import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowUpTrayIcon,
  ShieldCheckIcon,
  CogIcon,
  StarIcon,
  KeyIcon,
  LockClosedIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CameraIcon,
  TrophyIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  MinusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  AcademicCapIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ServerIcon,
  BeakerIcon,
  SparklesIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  LinkIcon,
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
  XMarkIcon,
  ListBulletIcon,
  TableCellsIcon,
  ChartPieIcon,
  ChartBarIcon,
  CubeIcon,
  CircleStackIcon,
  ArchiveBoxIcon,
  InboxIcon,
  BriefcaseIcon,
  BellIcon,
  HandRaisedIcon,
  LightBulbIcon,
  BrainIcon,
  CpuChipIcon,
  GiftIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const InstructorProfile = () => {
  const [instructorData, setInstructorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);

  // Mock instructor data
  const mockInstructorData = {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://via.placeholder.com/150x150',
    bio: 'Experienced software developer with 10+ years in React, Node.js, and cloud technologies. Passionate about teaching and helping others learn programming.',
    location: 'San Francisco, CA',
    website: 'https://johnsmith.dev',
    linkedin: 'https://linkedin.com/in/johnsmith',
    twitter: 'https://twitter.com/johnsmith',
    youtube: 'https://youtube.com/c/johnsmith',
    expertise: ['React', 'JavaScript', 'Node.js', 'Cloud Computing'],
    experience: [
      {
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        duration: '2018 - Present',
        description: 'Leading development of enterprise applications'
      },
      {
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        duration: '2015 - 2018',
        description: 'Built scalable web applications'
      }
    ],
    education: [
      {
        institution: 'Stanford University',
        degree: 'Bachelor of Science in Computer Science',
        duration: '2011 - 2015'
      }
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'Google Cloud Professional',
      'MongoDB Certified Developer'
    ],
    languages: ['English (Native)', 'Spanish (Fluent)'],
    teachingExperience: '2 years of corporate training experience',
    availability: 'Part-time',
    timezone: 'America/Los_Angeles',
    joinedAt: '2023-01-15',
    lastLogin: '2024-03-07T14:30:00Z',
    status: 'active',
    isVerified: true,
    isPremium: true,
    subscription: 'annual',
    subscriptionEnds: '2025-01-15',
    courses: [
      {
        id: 1,
        title: 'Advanced React Patterns',
        enrolledStudents: 1234,
        revenue: 45678.90,
        rating: 4.8,
        reviews: 234,
        status: 'published',
        createdAt: '2024-01-15',
        updatedAt: '2024-03-01'
      },
      {
        id: 2,
        title: 'Node.js Fundamentals',
        enrolledStudents: 567,
        revenue: 23456.78,
        rating: 4.6,
        reviews: 123,
        status: 'published',
        createdAt: '2024-02-01',
        updatedAt: '2024-02-28'
      }
    ],
    stats: {
      totalStudents: 1801,
      totalRevenue: 69135.68,
      averageRating: 4.7,
      totalReviews: 357,
      completionRate: 78.5,
      averageCompletionTime: 18.5,
      totalHours: 2340,
      certificates: 156,
      activeStudents: 1234,
      newStudents: 156,
      thisMonthRevenue: 15678.90,
      thisMonthStudents: 89
    },
    preferences: {
      language: 'en',
      timezone: 'America/Los_Angeles',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      twoFactorAuth: true,
      sessionTimeout: 30,
      theme: 'light',
      autoSave: true,
      emailDigest: 'weekly',
      pushDigest: 'daily'
    },
    social: {
      website: 'https://johnsmith.dev',
      linkedin: 'https://linkedin.com/in/johnsmith',
      twitter: 'https://twitter.com/johnsmith',
      youtube: 'https://youtube.com/c/johnsmith',
      github: 'https://github.com/johnsmith'
    },
    availability: {
      monday: ['09:00-12:00', '14:00-18:00'],
      tuesday: ['09:00-12:00', '14:00-18:00'],
      wednesday: ['09:00-12:00', '14:00-18:00'],
      thursday: ['09:00-12:00', '14:00-18:00'],
      friday: ['09:00-12:00', '14:00-18:00'],
      saturday: ['Flexible'],
      sunday: ['Flexible']
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInstructorData(mockInstructorData);
      setFormData({
        firstName: mockInstructorData.firstName,
        lastName: mockInstructorData.lastName,
        email: mockInstructorData.email,
        phone: mockInstructorData.phone,
        bio: mockInstructorData.bio,
        location: mockInstructorData.location,
        website: mockInstructorData.website,
        linkedin: mockInstructorData.linkedin,
        twitter: mockInstructorData.twitter,
        youtube: mockInstructorData.youtube,
        expertise: mockInstructorData.expertise.join(', '),
        teachingExperience: mockInstructorData.teachingExperience,
        availability: mockInstructorData.availability,
        timezone: mockInstructorData.timezone,
        languages: mockInstructorData.languages.join(', ')
      });
    }, 500);
  }, []);

  const handleSaveProfile = () => {
    // Simulate API call
    setInstructorData({
      ...instructorData,
      ...formData
    });
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    // Simulate API call
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleDeleteAccount = () => {
    // Simulate API call
    setShowDeleteModal(false);
    // Redirect to login or show confirmation
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={instructorData?.avatar}
                alt={`${instructorData?.firstName} ${instructorData?.lastName}`}
                className="w-24 h-24 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                <CameraIcon className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {instructorData?.firstName} {instructorData?.lastName}
              </h2>
              <p className="text-gray-600">Instructor</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  INSTRUCTOR
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {instructorData?.status?.toUpperCase()}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(true)}
              className="btn-premium"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <UserGroupIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{instructorData?.stats?.totalStudents.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <BookOpenIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{instructorData?.courses?.length}</div>
              <div className="text-sm text-gray-600">Courses Created</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(instructorData?.stats?.totalRevenue)}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <StarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{instructorData?.stats?.averageRating}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CoursesTab = () => (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Courses</h3>
        <div className="space-y-4">
          {instructorData?.courses?.map((course) => (
            <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/100x100"
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <div className="text-sm text-gray-600">{course.enrolledStudents} students</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <StarIconSolid className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-900">{course.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({course.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{formatCurrency(course.revenue)}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(instructorData?.stats?.totalRevenue)}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{instructorData?.stats?.averageRating}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{formatPercentage(instructorData?.stats?.completionRate)}</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{instructorData?.stats?.totalHours}</div>
            <div className="text-sm text-gray-600">Total Hours</div>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              value={`${instructorData?.firstName} ${instructorData?.lastName}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={instructorData?.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>
        </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Instructor Profile</h1>
              <p className="text-gray-600">Manage your profile and account settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {['overview', 'courses', 'analytics', 'settings'].map((tab) => (
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
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'courses' && <CoursesTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
