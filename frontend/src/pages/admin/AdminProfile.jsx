import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  ShieldCheckIcon,
  Cog6TootIcon,
  BellIcon,
  KeyIcon,
  LockClosedIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CameraIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  PlusIcon,
  MinusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ArrowRightIcon as ArrowRightIconOutline,
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
  FireIcon,
  StarIcon,
  FlagIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PrinterIcon,
  ShareIcon,
  LinkIcon,
  VideoCameraIcon,
  PhotoIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  FolderIcon,
  ArchiveBoxIcon,
  InboxIcon,
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
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Mock admin data
  const mockAdminData = {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@lms-pro.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://via.placeholder.com/150x150',
    bio: 'System administrator with 5+ years of experience managing educational platforms.',
    location: 'San Francisco, CA',
    department: 'IT Security',
    position: 'Super Admin',
    employeeId: 'ADM001',
    joinDate: '2020-01-15',
    lastLogin: '2024-03-07T14:30:00Z',
    status: 'active',
    role: 'super_admin',
    permissions: [
      'user_management',
      'course_management',
      'system_settings',
      'analytics',
      'security',
      'billing',
      'support'
    ],
    preferences: {
      language: 'en',
      timezone: 'America/Los_Angeles',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      twoFactorAuth: true,
      sessionTimeout: 30,
      theme: 'light'
    },
    security: {
      lastPasswordChange: '2024-02-15',
      passwordExpiry: '2024-05-15',
      failedLoginAttempts: 0,
      accountLocked: false,
      twoFactorEnabled: true,
      loginMethods: ['email', 'sso'],
      activeSessions: 3,
      securityQuestions: [
        {
          question: 'What was your first pet\'s name?',
          answer: 'encrypted_answer'
        }
      ]
    },
    activity: {
      totalLogins: 1247,
      averageSessionDuration: 45, // minutes
      lastActivity: '2024-03-07T16:45:00Z',
      devicesUsed: ['Chrome', 'Firefox', 'Mobile'],
      loginLocations: ['San Francisco', 'New York', 'Remote'],
      securityEvents: [
        {
          type: 'password_change',
          date: '2024-02-15T10:30:00Z',
          location: 'San Francisco',
          device: 'Chrome on Windows'
        },
        {
          type: '2fa_enabled',
          date: '2024-01-20T14:15:00Z',
          location: 'San Francisco',
          device: 'Firefox on Mac'
        }
      ]
    },
    stats: {
      usersManaged: 45678,
      coursesApproved: 1234,
      supportTicketsResolved: 892,
      systemUptime: 99.9,
      securityIncidents: 2
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAdminData(mockAdminData);
      setFormData({
        firstName: mockAdminData.firstName,
        lastName: mockAdminData.lastName,
        email: mockAdminData.email,
        phone: mockAdminData.phone,
        bio: mockAdminData.bio,
        location: mockAdminData.location,
        department: mockAdminData.department,
        position: mockAdminData.position
      });
    }, 500);
  }, []);

  const handleSaveProfile = () => {
    // Simulate API call
    setAdminData({
      ...adminData,
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

  const handle2FAToggle = () => {
    // Simulate API call
    setAdminData({
      ...adminData,
      preferences: {
        ...adminData.preferences,
        twoFactorAuth: !adminData.preferences.twoFactorAuth
      }
    });
    setShow2FAModal(false);
  };

  const handleDeleteAccount = () => {
    // Simulate API call
    setShowDeleteModal(false);
    // Redirect to login or show confirmation
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={adminData?.avatar}
                alt={`${adminData?.firstName} ${adminData?.lastName}`}
                className="w-24 h-24 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                <CameraIcon className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {adminData?.firstName} {adminData?.lastName}
              </h2>
              <p className="text-gray-600">{adminData?.position}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {adminData?.role?.replace('_', ' ').toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {adminData?.status?.toUpperCase()}
                </span>
              </div>
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
            <div className="text-2xl font-bold text-gray-900">{adminData?.stats?.usersManaged.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Users Managed</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <BookOpenIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{adminData?.stats?.coursesApproved}</div>
            <div className="text-sm text-gray-600">Courses Approved</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <ChatBubbleLeftIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{adminData?.stats?.supportTicketsResolved}</div>
            <div className="text-sm text-gray-600">Tickets Resolved</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <ServerIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{adminData?.stats?.systemUptime}%</div>
            <div className="text-sm text-gray-600">System Uptime</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
            <KeyIcon className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Change Password</h4>
            <p className="text-sm text-gray-600">Update your account password</p>
          </button>
          
          <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
            <ShieldCheckIcon className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">2FA Settings</h4>
            <p className="text-sm text-gray-600">Manage two-factor authentication</p>
          </button>
          
          <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
            <BellIcon className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Notifications</h4>
            <p className="text-sm text-gray-600">Configure notification preferences</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {adminData?.activity?.securityEvents?.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 capitalize">
                    {event.type.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {event.location} • {event.device}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-900">
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(event.date).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Password Security</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Changed</span>
                <span className="text-sm text-gray-900">
                  {new Date(adminData?.security?.lastPasswordChange).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expires On</span>
                <span className="text-sm text-gray-900">
                  {new Date(adminData?.security?.passwordExpiry).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Failed Attempts</span>
                <span className="text-sm text-gray-900">{adminData?.security?.failedLoginAttempts}</span>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="btn-premium-outline text-sm"
              >
                Change Password
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Two-Factor Authentication</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  adminData?.preferences?.twoFactorAuth 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {adminData?.preferences?.twoFactorAuth ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Method</span>
                <span className="text-sm text-gray-900">Authenticator App</span>
              </div>
              <button
                onClick={() => setShow2FAModal(true)}
                className="btn-premium-outline text-sm"
              >
                {adminData?.preferences?.twoFactorAuth ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
        <div className="space-y-3">
          {adminData?.activity?.devicesUsed?.map((device, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <GlobeAltIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{device}</div>
                  <div className="text-sm text-gray-600">
                    {adminData?.activity?.loginLocations[index]} • Current session
                  </div>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-700 text-sm">
                Sign Out
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Login Methods */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Methods</h3>
        <div className="space-y-3">
          {adminData?.security?.loginMethods?.map((method, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <KeyIcon className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900 capitalize">{method}</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PreferencesTab = () => (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Email Notifications</div>
              <div className="text-sm text-gray-600">Receive notifications via email</div>
            </div>
            <button className={`w-12 h-6 rounded-full relative ${
              adminData?.preferences?.emailNotifications ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <div className="w-5 h-5 bg-white rounded-full shadow-md absolute right-0.5 top-0.5"></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Push Notifications</div>
              <div className="text-sm text-gray-600">Receive browser push notifications</div>
            </div>
            <button className={`w-12 h-6 rounded-full relative ${
              adminData?.preferences?.pushNotifications ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <div className="w-5 h-5 bg-white rounded-full shadow-md absolute right-0.5 top-0.5"></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">SMS Notifications</div>
              <div className="text-sm text-gray-600">Receive notifications via SMS</div>
            </div>
            <button className={`w-12 h-6 rounded-full relative ${
              adminData?.preferences?.smsNotifications ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <div className="w-5 h-5 bg-white rounded-full shadow-md absolute right-0.5 top-0.5"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Session Settings */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              defaultValue={adminData?.preferences?.sessionTimeout}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Remember Me</div>
              <div className="text-sm text-gray-600">Keep me logged in</div>
            </div>
            <button className="w-12 h-6 rounded-full relative bg-green-500">
              <div className="w-5 h-5 bg-white rounded-full shadow-md absolute right-0.5 top-0.5"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const EditModal = () => (
    <AnimatePresence>
      {isEditing && (
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="btn-premium-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="btn-premium"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const PasswordModal = () => (
    <AnimatePresence>
      {showPasswordModal && (
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
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Change Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="btn-premium-outline"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="btn-premium"
              >
                Change Password
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const TwoFAModal = () => (
    <AnimatePresence>
      {show2FAModal && (
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
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {adminData?.preferences?.twoFactorAuth ? 'Disable 2FA' : 'Enable 2FA'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {adminData?.preferences?.twoFactorAuth 
                ? 'Are you sure you want to disable two-factor authentication? This will make your account less secure.'
                : 'Enable two-factor authentication to add an extra layer of security to your account.'
              }
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShow2FAModal(false)}
                className="btn-premium-outline"
              >
                Cancel
              </button>
              <button
                onClick={handle2FAToggle}
                className={`btn-premium ${
                  adminData?.preferences?.twoFactorAuth ? 'text-red-600 hover:bg-red-50' : ''
                }`}
              >
                {adminData?.preferences?.twoFactorAuth ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {['overview', 'security', 'preferences'].map((tab) => (
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
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'preferences' && <PreferencesTab />}
        </div>
      </div>

      {/* Modals */}
      <EditModal />
      <PasswordModal />
      <TwoFAModal />
    </div>
  );
};

export default AdminProfile;
