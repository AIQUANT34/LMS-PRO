import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  UserGroupIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ArrowUpTrayIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  MinusIcon,
  DocumentTextIcon,
  ServerIcon,
  GlobeAltIcon,
  LockClosedIcon,
  KeyIcon,
  FlagIcon,
  FireIcon,
  SparklesIcon,
  BeakerIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  LinkIcon,
  CameraIcon,
  VideoCameraIcon,
  PhotoIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  DocumentIcon,
  CurrencyDollarIcon,
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
  AcademicCapIcon,
  StarIcon,
  BellIcon,
  CogIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ArrowRightIcon as ArrowRightIconOutline
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const usersPerPage = 10;

  // Mock user data
  const mockUsers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'student',
      status: 'active',
      avatar: 'https://via.placeholder.com/100x100',
      bio: 'Passionate learner and technology enthusiast',
      location: 'New York, USA',
      joinedAt: '2024-01-15',
      lastLogin: '2024-03-07T14:30:00Z',
      courses: 12,
      completedCourses: 8,
      totalSpent: 890.50,
      averageRating: 4.7,
      reviews: 23,
      isVerified: true,
      isPremium: false,
      subscription: 'monthly',
      subscriptionEnds: '2024-04-15',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      timezone: 'America/New_York',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false
      }
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      role: 'instructor',
      status: 'active',
      avatar: 'https://via.placeholder.com/100x100',
      bio: 'Experienced software developer and educator',
      location: 'San Francisco, USA',
      joinedAt: '2024-01-10',
      lastLogin: '2024-03-07T16:45:00Z',
      courses: 6,
      students: 2345,
      totalRevenue: 45678.90,
      averageRating: 4.9,
      reviews: 156,
      isVerified: true,
      isPremium: true,
      subscription: 'annual',
      subscriptionEnds: '2025-01-10',
      phone: '+1 (555) 987-6543',
      dateOfBirth: '1985-08-22',
      gender: 'female',
      timezone: 'America/Los_Angeles',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: true
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: true,
        showPhone: false
      }
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      role: 'admin',
      status: 'active',
      avatar: 'https://via.placeholder.com/100x100',
      bio: 'System administrator and security specialist',
      location: 'Chicago, USA',
      joinedAt: '2024-01-05',
      lastLogin: '2024-03-07T09:20:00Z',
      courses: 0,
      completedCourses: 0,
      totalSpent: 0,
      averageRating: 0,
      reviews: 0,
      isVerified: true,
      isPremium: true,
      subscription: 'lifetime',
      subscriptionEnds: null,
      phone: '+1 (555) 456-7890',
      dateOfBirth: '1982-11-30',
      gender: 'male',
      timezone: 'America/Chicago',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: true
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: true,
        showPhone: true
      }
    },
    {
      id: 4,
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@example.com',
      role: 'student',
      status: 'suspended',
      avatar: 'https://via.placeholder.com/100x100',
      bio: 'Creative designer and artist',
      location: 'Austin, USA',
      joinedAt: '2024-02-01',
      lastLogin: '2024-03-05T11:30:00Z',
      courses: 3,
      completedCourses: 1,
      totalSpent: 156.75,
      averageRating: 4.2,
      reviews: 5,
      isVerified: false,
      isPremium: false,
      subscription: 'monthly',
      subscriptionEnds: '2024-03-01',
      phone: '+1 (555) 234-5678',
      dateOfBirth: '1995-03-18',
      gender: 'female',
      timezone: 'America/Chicago',
      language: 'en',
      notifications: {
        email: false,
        push: true,
        sms: false
      },
      privacy: {
        profileVisibility: 'private',
        showEmail: false,
        showPhone: false
      }
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@example.com',
      role: 'instructor',
      status: 'pending',
      avatar: 'https://via.placeholder.com/100x100',
      bio: 'Aspiring educator and content creator',
      location: 'Seattle, USA',
      joinedAt: '2024-03-01',
      lastLogin: '2024-03-07T12:15:00Z',
      courses: 0,
      students: 0,
      totalRevenue: 0,
      averageRating: 0,
      reviews: 0,
      isVerified: false,
      isPremium: false,
      subscription: 'trial',
      subscriptionEnds: '2024-03-15',
      phone: '+1 (555) 345-6789',
      dateOfBirth: '1988-07-12',
      gender: 'male',
      timezone: 'America/Los_Angeles',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: true,
        showPhone: false
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setTotalPages(Math.ceil(mockUsers.length / usersPerPage));
    }, 500);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.firstName.localeCompare(b.firstName);
    } else if (sortBy === 'email') {
      comparison = a.email.localeCompare(b.email);
    } else if (sortBy === 'role') {
      comparison = a.role.localeCompare(b.role);
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === 'joinedAt') {
      comparison = new Date(a.joinedAt) - new Date(b.joinedAt);
    } else if (sortBy === 'lastLogin') {
      comparison = new Date(a.lastLogin) - new Date(b.lastLogin);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const handleToggleUserSelection = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleBulkAction = (action) => {
    const selectedUsersList = users.filter(user => selectedUsers.has(user.id));
    
    if (action === 'delete') {
      setUsers(users.filter(user => !selectedUsers.has(user.id)));
      setSelectedUsers(new Set());
    } else if (action === 'activate') {
      const updatedUsers = users.map(user => 
        selectedUsers.has(user.id) ? { ...user, status: 'active' } : user
      );
      setUsers(updatedUsers);
      setSelectedUsers(new Set());
    } else if (action === 'suspend') {
      const updatedUsers = users.map(user => 
        selectedUsers.has(user.id) ? { ...user, status: 'suspended' } : user
      );
      setUsers(updatedUsers);
      setSelectedUsers(new Set());
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'suspended': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100';
      case 'suspended': return 'bg-red-100';
      case 'pending': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-purple-600';
      case 'instructor': return 'text-blue-600';
      case 'student': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRoleBg = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100';
      case 'instructor': return 'bg-blue-100';
      case 'student': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };

  const UserCard = ({ user, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-premium p-6 hover:shadow-premium-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedUsers.has(user.id)}
            onChange={() => handleToggleUserSelection(user.id)}
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <img 
            src={user.avatar} 
            alt={`${user.firstName} ${user.lastName}`}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              {user.isVerified && (
                <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
              )}
              {user.isPremium && (
                <StarIcon className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getRoleBg(user.role)}`}>
            <span className={getRoleColor(user.role)}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </span>
          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusBg(user.status)}`}>
            <span className={getStatusColor(user.status)}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Joined</div>
          <div className="font-medium text-gray-900">{new Date(user.joinedAt).toLocaleDateString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Last Login</div>
          <div className="font-medium text-gray-900">{new Date(user.lastLogin).toLocaleDateString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Location</div>
          <div className="font-medium text-gray-900">{user.location}</div>
        </div>
      </div>

      {user.bio && (
        <div className="mb-4">
          <div className="text-sm text-gray-600">Bio</div>
          <p className="text-sm text-gray-700 line-clamp-2">{user.bio}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {user.role === 'student' && (
          <>
            <div>
              <div className="text-sm text-gray-600">Courses</div>
              <div className="font-medium text-gray-900">{user.courses}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Completed</div>
              <div className="font-medium text-gray-900">{user.completedCourses}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Spent</div>
              <div className="font-medium text-gray-900">${user.totalSpent}</div>
            </div>
          </>
        )}
        
        {user.role === 'instructor' && (
          <>
            <div>
              <div className="text-sm text-gray-600">Courses</div>
              <div className="font-medium text-gray-900">{user.courses}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Students</div>
              <div className="font-medium text-gray-900">{user.students?.toLocaleString() || 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Revenue</div>
              <div className="font-medium text-gray-900">${user.totalRevenue?.toLocaleString() || 0}</div>
            </div>
          </>
        )}
        
        {user.role === 'admin' && (
          <>
            <div>
              <div className="text-sm text-gray-600">Permissions</div>
              <div className="font-medium text-gray-900">Full Access</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Department</div>
              <div className="font-medium text-gray-900">IT Security</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Access Level</div>
              <div className="font-medium text-gray-900">Super Admin</div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          {user.averageRating > 0 && (
            <div className="flex items-center gap-1">
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-600">{user.averageRating}</span>
              <span className="text-sm text-gray-400">({user.reviews} reviews)</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectUser(user)}
            className="btn-premium-outline text-sm"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            View
          </button>
          <button
            onClick={() => handleSelectUser(user)}
            className="btn-premium-outline text-sm"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </button>
          <button
            onClick={() => handleDeleteUser(user)}
            className="btn-premium-outline text-sm text-red-600 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );

  const UserModal = () => (
    <AnimatePresence>
      {showUserModal && selectedUser && (
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
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <img 
                    src={selectedUser.avatar} 
                    alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    {selectedUser.isVerified && (
                      <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                    )}
                    {selectedUser.isPremium && (
                      <StarIcon className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium text-gray-900">{selectedUser.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium text-gray-900">{selectedUser.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-medium text-gray-900">{selectedUser.location}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Joined</div>
                    <div className="font-medium text-gray-900">{new Date(selectedUser.joinedAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Login</div>
                    <div className="font-medium text-gray-900">{new Date(selectedUser.lastLogin).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {selectedUser.bio && (
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">Bio</div>
                  <p className="text-gray-700">{selectedUser.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Account Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Role</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getRoleBg(selectedUser.role)}`}>
                        <span className={getRoleColor(selectedUser.role)}>
                          {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusBg(selectedUser.status)}`}>
                        <span className={getStatusColor(selectedUser.status)}>
                          {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Verified</span>
                      <span className={selectedUser.isVerified ? 'text-green-600' : 'text-gray-600'}>
                        {selectedUser.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Premium</span>
                      <span className={selectedUser.isPremium ? 'text-yellow-600' : 'text-gray-600'}>
                        {selectedUser.isPremium ? 'Premium' : 'Free'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Subscription</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Plan</span>
                      <span className="font-medium text-gray-900">{selectedUser.subscription}</span>
                    </div>
                    {selectedUser.subscriptionEnds && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Renews</span>
                        <span className="font-medium text-gray-900">{new Date(selectedUser.subscriptionEnds).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedUser.role === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-gray-600">Courses Enrolled</div>
                    <div className="font-medium text-gray-900">{selectedUser.courses}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Completed</div>
                    <div className="font-medium text-gray-900">{selectedUser.completedCourses}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                    <div className="font-medium text-gray-900">${selectedUser.totalSpent}</div>
                  </div>
                </div>
              )}

              {selectedUser.role === 'instructor' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-gray-600">Courses Created</div>
                    <div className="font-medium text-gray-900">{selectedUser.courses}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Students</div>
                    <div className="font-medium text-gray-900">{selectedUser.students?.toLocaleString() || 0}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                    <div className="font-medium text-gray-900">${selectedUser.totalRevenue?.toLocaleString() || 0}</div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Notification Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Notifications</span>
                    <button className={`w-12 h-6 rounded-full relative ${
                      selectedUser.notifications.email ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow-md absolute left-0.5 top-0.5"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Push Notifications</span>
                    <button className={`w-12 h-6 rounded-full relative ${
                      selectedUser.notifications.push ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow-md absolute left-0.5 top-0.5"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SMS Notifications</span>
                    <button className={`w-12 h-6 rounded-full relative ${
                      selectedUser.notifications.sms ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow-md absolute left-0.5 top-0.5"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Privacy Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Visibility</span>
                    <button className={`w-12 h-6 rounded-full relative ${
                      selectedUser.privacy.profileVisibility === 'public' ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow-md absolute left-0.5 top-0.5"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Show Email</span>
                    <button className={`w-12 h-6 rounded-full relative ${
                      selectedUser.privacy.showEmail ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow-md absolute left-0.5 top-0.5"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Show Phone</span>
                    <button className={`w-12 h-6 rounded-full relative ${
                      selectedUser.privacy.showPhone ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow-md absolute left-0.5 top-0.5"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="btn-premium-outline"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Save user logic here
                  setShowUserModal(false);
                }}
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

  const DeleteModal = () => (
    <AnimatePresence>
      {showDeleteModal && selectedUser && (
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
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-premium-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn-premium text-red-600 hover:bg-red-50"
              >
                Delete User
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
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage users, permissions, and access controls</p>
            </div>
            
            <button className="btn-premium">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name, email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="instructor">Instructors</option>
              <option value="admin">Admins</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="role">Sort by Role</option>
              <option value="status">Sort by Status</option>
              <option value="joinedAt">Sort by Join Date</option>
              <option value="lastLogin">Sort by Last Login</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.size > 0 && (
          <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-600">
                {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="btn-premium-outline text-sm"
              >
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('suspend')}
                className="btn-premium-outline text-sm text-yellow-600 hover:bg-yellow-50"
              >
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                Suspend
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="btn-premium-outline text-sm text-red-600 hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedUsers.map((user, index) => (
            <UserCard key={user.id} user={user} index={index} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn-premium-outline"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? 'btn-premium'
                      : 'btn-premium-outline'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="btn-premium-outline"
            >
              Next
            </button>
          </div>
        )}

        {paginatedUsers.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find users.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserModal />
      <DeleteModal />
    </div>
  );
};

export default UserManagement;
