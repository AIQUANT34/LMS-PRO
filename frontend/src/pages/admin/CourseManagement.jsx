import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpenIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  ArrowUpTrayIcon,
  CalendarIcon,
  UserGroupIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
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
  StarIcon,
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
  BellIcon,
  CogIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ArrowRightIcon as ArrowRightIconOutline,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const coursesPerPage = 12;

  // Mock course data
  const mockCourses = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      description: 'Master advanced React patterns and techniques for building scalable applications',
      instructor: {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@example.com',
        avatar: 'https://via.placeholder.com/100x100'
      },
      category: 'Development',
      level: 'Advanced',
      status: 'published',
      price: 89.99,
      originalPrice: 129.99,
      currency: 'USD',
      language: 'English',
      duration: 24, // hours
      lessons: 45,
      enrolledStudents: 1234,
      completedStudents: 567,
      rating: 4.8,
      reviews: 234,
      thumbnail: 'https://via.placeholder.com/400x225',
      previewVideo: 'https://example.com/preview.mp4',
      tags: ['React', 'JavaScript', 'Frontend', 'Advanced'],
      requirements: ['Basic React knowledge', 'JavaScript ES6+', 'HTML/CSS'],
      objectives: ['Master advanced patterns', 'Build scalable apps', 'Performance optimization'],
      createdAt: '2024-01-15',
      updatedAt: '2024-03-01',
      publishedAt: '2024-01-20',
      lastEnrolled: '2024-03-07T14:30:00Z',
      revenue: 45678.90,
      isFeatured: true,
      isBestseller: true,
      isNew: false,
      certificate: {
        enabled: true,
        template: 'default'
      },
      analytics: {
        views: 5678,
        clicks: 1234,
        conversionRate: 21.7,
        averageCompletionTime: 18.5,
        dropoutRate: 12.3
      }
    },
    {
      id: 2,
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the fundamentals of user interface and user experience design',
      instructor: {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        avatar: 'https://via.placeholder.com/100x100'
      },
      category: 'Design',
      level: 'Beginner',
      status: 'pending',
      price: 49.99,
      originalPrice: 79.99,
      currency: 'USD',
      language: 'English',
      duration: 16,
      lessons: 32,
      enrolledStudents: 0,
      completedStudents: 0,
      rating: 0,
      reviews: 0,
      thumbnail: 'https://via.placeholder.com/400x225',
      previewVideo: 'https://example.com/preview.mp4',
      tags: ['UI', 'UX', 'Design', 'Figma'],
      requirements: ['No prior experience needed'],
      objectives: ['Learn design principles', 'Master Figma', 'Create portfolios'],
      createdAt: '2024-03-05',
      updatedAt: '2024-03-05',
      publishedAt: null,
      lastEnrolled: null,
      revenue: 0,
      isFeatured: false,
      isBestseller: false,
      isNew: true,
      certificate: {
        enabled: true,
        template: 'design'
      },
      analytics: {
        views: 123,
        clicks: 45,
        conversionRate: 36.6,
        averageCompletionTime: 0,
        dropoutRate: 0
      }
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      description: 'Complete guide to digital marketing strategies and techniques',
      instructor: {
        id: 3,
        name: 'Mike Wilson',
        email: 'mike.wilson@example.com',
        avatar: 'https://via.placeholder.com/100x100'
      },
      category: 'Marketing',
      level: 'Intermediate',
      status: 'published',
      price: 69.99,
      originalPrice: 99.99,
      currency: 'USD',
      language: 'English',
      duration: 20,
      lessons: 38,
      enrolledStudents: 890,
      completedStudents: 234,
      rating: 4.6,
      reviews: 123,
      thumbnail: 'https://via.placeholder.com/400x225',
      previewVideo: 'https://example.com/preview.mp4',
      tags: ['Marketing', 'SEO', 'Social Media', 'Analytics'],
      requirements: ['Basic marketing knowledge'],
      objectives: ['Master digital marketing', 'Learn SEO', 'Social media strategies'],
      createdAt: '2024-02-01',
      updatedAt: '2024-02-28',
      publishedAt: '2024-02-05',
      lastEnrolled: '2024-03-06T10:15:00Z',
      revenue: 23456.78,
      isFeatured: true,
      isBestseller: false,
      isNew: false,
      certificate: {
        enabled: true,
        template: 'marketing'
      },
      analytics: {
        views: 3456,
        clicks: 890,
        conversionRate: 25.8,
        averageCompletionTime: 16.2,
        dropoutRate: 18.5
      }
    },
    {
      id: 4,
      title: 'Python for Data Science',
      description: 'Learn Python programming for data science and machine learning',
      instructor: {
        id: 4,
        name: 'Emily Chen',
        email: 'emily.chen@example.com',
        avatar: 'https://via.placeholder.com/100x100'
      },
      category: 'Data Science',
      level: 'Intermediate',
      status: 'published',
      price: 79.99,
      originalPrice: 119.99,
      currency: 'USD',
      language: 'English',
      duration: 28,
      lessons: 52,
      enrolledStudents: 1567,
      completedStudents: 789,
      rating: 4.9,
      reviews: 345,
      thumbnail: 'https://via.placeholder.com/400x225',
      previewVideo: 'https://example.com/preview.mp4',
      tags: ['Python', 'Data Science', 'Machine Learning', 'Analytics'],
      requirements: ['Basic Python knowledge', 'Statistics basics'],
      objectives: ['Master data science', 'Machine learning basics', 'Data visualization'],
      createdAt: '2024-01-10',
      updatedAt: '2024-02-20',
      publishedAt: '2024-01-15',
      lastEnrolled: '2024-03-07T16:45:00Z',
      revenue: 67890.12,
      isFeatured: false,
      isBestseller: true,
      isNew: false,
      certificate: {
        enabled: true,
        template: 'data-science'
      },
      analytics: {
        views: 7890,
        clicks: 1567,
        conversionRate: 19.9,
        averageCompletionTime: 22.3,
        dropoutRate: 15.2
      }
    },
    {
      id: 5,
      title: 'Photography Basics',
      description: 'Learn the fundamentals of photography and photo editing',
      instructor: {
        id: 5,
        name: 'David Brown',
        email: 'david.brown@example.com',
        avatar: 'https://via.placeholder.com/100x100'
      },
      category: 'Photography',
      level: 'Beginner',
      status: 'draft',
      price: 39.99,
      originalPrice: 59.99,
      currency: 'USD',
      language: 'English',
      duration: 12,
      lessons: 24,
      enrolledStudents: 0,
      completedStudents: 0,
      rating: 0,
      reviews: 0,
      thumbnail: 'https://via.placeholder.com/400x225',
      previewVideo: 'https://example.com/preview.mp4',
      tags: ['Photography', 'Photo Editing', 'Camera', 'Lightroom'],
      requirements: ['No prior experience needed', 'Camera recommended'],
      objectives: ['Learn photography basics', 'Master composition', 'Photo editing'],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-06',
      publishedAt: null,
      lastEnrolled: null,
      revenue: 0,
      isFeatured: false,
      isBestseller: false,
      isNew: true,
      certificate: {
        enabled: true,
        template: 'photography'
      },
      analytics: {
        views: 234,
        clicks: 67,
        conversionRate: 28.6,
        averageCompletionTime: 0,
        dropoutRate: 0
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses(mockCourses);
      setTotalPages(Math.ceil(mockCourses.length / coursesPerPage));
    }, 500);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    return matchesSearch && matchesStatus && matchesCategory && matchesLevel;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'instructor') {
      comparison = a.instructor.name.localeCompare(b.instructor.name);
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === 'price') {
      comparison = a.price - b.price;
    } else if (sortBy === 'rating') {
      comparison = a.rating - b.rating;
    } else if (sortBy === 'enrolledStudents') {
      comparison = a.enrolledStudents - b.enrolledStudents;
    } else if (sortBy === 'revenue') {
      comparison = a.revenue - b.revenue;
    } else if (sortBy === 'createdAt') {
      comparison = new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'updatedAt') {
      comparison = new Date(a.updatedAt) - new Date(b.updatedAt);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const paginatedCourses = sortedCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleDeleteCourse = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCourse) {
      setCourses(courses.filter(course => course.id !== selectedCourse.id));
      setShowDeleteModal(false);
      setSelectedCourse(null);
    }
  };

  const handleApproveCourse = (course) => {
    setSelectedCourse(course);
    setShowApprovalModal(true);
  };

  const handleConfirmApproval = () => {
    if (selectedCourse) {
      const updatedCourses = courses.map(course => 
        course.id === selectedCourse.id 
          ? { ...course, status: 'published', publishedAt: new Date().toISOString() }
          : course
      );
      setCourses(updatedCourses);
      setShowApprovalModal(false);
      setSelectedCourse(null);
    }
  };

  const handleToggleCourseSelection = (courseId) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
    } else {
      newSelected.add(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const handleBulkAction = (action) => {
    const selectedCoursesList = courses.filter(course => selectedCourses.has(course.id));
    
    if (action === 'delete') {
      setCourses(courses.filter(course => !selectedCourses.has(course.id)));
      setSelectedCourses(new Set());
    } else if (action === 'publish') {
      const updatedCourses = courses.map(course => 
        selectedCourses.has(course.id) 
          ? { ...course, status: 'published', publishedAt: new Date().toISOString() }
          : course
      );
      setCourses(updatedCourses);
      setSelectedCourses(new Set());
    } else if (action === 'unpublish') {
      const updatedCourses = courses.map(course => 
        selectedCourses.has(course.id) 
          ? { ...course, status: 'draft', publishedAt: null }
          : course
      );
      setCourses(updatedCourses);
      setSelectedCourses(new Set());
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-600';
      case 'draft': return 'text-gray-600';
      case 'pending': return 'text-yellow-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100';
      case 'draft': return 'bg-gray-100';
      case 'pending': return 'bg-yellow-100';
      case 'rejected': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'text-green-600';
      case 'Intermediate': return 'text-blue-600';
      case 'Advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getLevelBg = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100';
      case 'Intermediate': return 'bg-blue-100';
      case 'Advanced': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const CourseCard = ({ course, index }) => (
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
            checked={selectedCourses.has(course.id)}
            onChange={() => handleToggleCourseSelection(course.id)}
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-16 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
              {course.isFeatured && (
                <StarIcon className="h-4 w-4 text-yellow-500" />
              )}
              {course.isBestseller && (
                <FireIcon className="h-4 w-4 text-orange-500" />
              )}
              {course.isNew && (
                <SparklesIcon className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusBg(course.status)}`}>
            <span className={getStatusColor(course.status)}>
              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
            </span>
          </span>
          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getLevelBg(course.level)}`}>
            <span className={getLevelColor(course.level)}>
              {course.level}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Instructor</div>
          <div className="font-medium text-gray-900 text-sm">{course.instructor.name}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Category</div>
          <div className="font-medium text-gray-900 text-sm">{course.category}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Price</div>
          <div className="font-medium text-gray-900 text-sm">
            ${course.price}
            {course.originalPrice > course.price && (
              <span className="text-gray-500 line-through ml-1">${course.originalPrice}</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Students</div>
          <div className="font-medium text-gray-900 text-sm">{course.enrolledStudents.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Duration</div>
          <div className="font-medium text-gray-900 text-sm">{course.duration}h</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Lessons</div>
          <div className="font-medium text-gray-900 text-sm">{course.lessons}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Rating</div>
          <div className="flex items-center gap-1">
            <StarIconSolid className="h-4 w-4 text-yellow-400" />
            <span className="font-medium text-gray-900 text-sm">{course.rating}</span>
            <span className="text-gray-500 text-sm">({course.reviews})</span>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Revenue</div>
          <div className="font-medium text-gray-900 text-sm">${course.revenue.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Created: {new Date(course.createdAt).toLocaleDateString()}
          </span>
          {course.updatedAt !== course.createdAt && (
            <span className="text-xs text-gray-500">
              Updated: {new Date(course.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectCourse(course)}
            className="btn-premium-outline text-sm"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            View
          </button>
          <button
            onClick={() => handleSelectCourse(course)}
            className="btn-premium-outline text-sm"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </button>
          {course.status === 'pending' && (
            <button
              onClick={() => handleApproveCourse(course)}
              className="btn-premium-outline text-sm text-green-600 hover:bg-green-50"
            >
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Approve
            </button>
          )}
          <button
            onClick={() => handleDeleteCourse(course)}
            className="btn-premium-outline text-sm text-red-600 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );

  const CourseModal = () => (
    <AnimatePresence>
      {showCourseModal && selectedCourse && (
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
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Course Details</h2>
                <button
                  onClick={() => setShowCourseModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <img 
                    src={selectedCourse.thumbnail} 
                    alt={selectedCourse.title}
                    className="w-full h-48 rounded-lg object-cover mb-4"
                  />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h3>
                  <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src={selectedCourse.instructor.avatar} 
                        alt={selectedCourse.instructor.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{selectedCourse.instructor.name}</div>
                        <div className="text-sm text-gray-600">{selectedCourse.instructor.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Category</div>
                      <div className="font-medium text-gray-900">{selectedCourse.category}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Level</div>
                      <div className="font-medium text-gray-900">{selectedCourse.level}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Language</div>
                      <div className="font-medium text-gray-900">{selectedCourse.language}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-medium text-gray-900">{selectedCourse.duration} hours</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {selectedCourse.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {selectedCourse.objectives.map((obj, index) => (
                        <li key={index}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="card-premium p-6 mb-4">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-gray-900">${selectedCourse.price}</div>
                      {selectedCourse.originalPrice > selectedCourse.price && (
                        <div className="text-lg text-gray-500 line-through">${selectedCourse.originalPrice}</div>
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusBg(selectedCourse.status)}`}>
                          <span className={getStatusColor(selectedCourse.status)}>
                            {selectedCourse.status.charAt(0).toUpperCase() + selectedCourse.status.slice(1)}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Students</span>
                        <span className="font-medium text-gray-900">{selectedCourse.enrolledStudents.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Completed</span>
                        <span className="font-medium text-gray-900">{selectedCourse.completedStudents.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Lessons</span>
                        <span className="font-medium text-gray-900">{selectedCourse.lessons}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rating</span>
                        <div className="flex items-center gap-1">
                          <StarIconSolid className="h-4 w-4 text-yellow-400" />
                          <span className="font-medium text-gray-900">{selectedCourse.rating}</span>
                          <span className="text-gray-500 text-sm">({selectedCourse.reviews})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Revenue</span>
                        <span className="font-medium text-gray-900">${selectedCourse.revenue.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        {selectedCourse.isFeatured && (
                          <span className="badge-warning">Featured</span>
                        )}
                        {selectedCourse.isBestseller && (
                          <span className="badge-success">Bestseller</span>
                        )}
                        {selectedCourse.isNew && (
                          <span className="badge-info">New</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-premium p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Analytics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Views</span>
                        <span className="font-medium text-gray-900">{selectedCourse.analytics.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Clicks</span>
                        <span className="font-medium text-gray-900">{selectedCourse.analytics.clicks.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Conversion Rate</span>
                        <span className="font-medium text-gray-900">{selectedCourse.analytics.conversionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg. Completion</span>
                        <span className="font-medium text-gray-900">{selectedCourse.analytics.averageCompletionTime}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Dropout Rate</span>
                        <span className="font-medium text-gray-900">{selectedCourse.analytics.dropoutRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Certificate Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Certificate Enabled</span>
                      <button className={`w-12 h-6 rounded-full relative ${
                        selectedCourse.certificate.enabled ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        <div className="w-5 h-5 bg-white rounded-full shadow-md absolute left-0.5 top-0.5"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Template</span>
                      <span className="font-medium text-gray-900">{selectedCourse.certificate.template}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Created</span>
                      <span className="font-medium text-gray-900">{new Date(selectedCourse.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Updated</span>
                      <span className="font-medium text-gray-900">{new Date(selectedCourse.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {selectedCourse.publishedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Published</span>
                        <span className="font-medium text-gray-900">{new Date(selectedCourse.publishedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedCourse.lastEnrolled && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last Enrollment</span>
                        <span className="font-medium text-gray-900">{new Date(selectedCourse.lastEnrolled).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCourseModal(false)}
                className="btn-premium-outline"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Save course logic here
                  setShowCourseModal(false);
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
      {showDeleteModal && selectedCourse && (
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Course?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedCourse.title}</strong>? This action cannot be undone.
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
                Delete Course
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ApprovalModal = () => (
    <AnimatePresence>
      {showApprovalModal && selectedCourse && (
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Approve Course?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to approve <strong>{selectedCourse.title}</strong>? This will make it available to students.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="btn-premium-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                className="btn-premium text-green-600 hover:bg-green-50"
              >
                Approve Course
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
              <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
              <p className="text-gray-600">Review and manage course content, approvals, and analytics</p>
            </div>
            
            <button className="btn-premium">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Course
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
              placeholder="Search courses by title, instructor..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Data Science">Data Science</option>
              <option value="Photography">Photography</option>
            </select>
            
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="title">Sort by Title</option>
              <option value="instructor">Sort by Instructor</option>
              <option value="category">Sort by Category</option>
              <option value="status">Sort by Status</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
              <option value="enrolledStudents">Sort by Students</option>
              <option value="revenue">Sort by Revenue</option>
              <option value="createdAt">Sort by Created</option>
              <option value="updatedAt">Sort by Updated</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCourses.size > 0 && (
          <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-600">
                {selectedCourses.size} course{selectedCourses.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="btn-premium-outline text-sm"
              >
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Publish
              </button>
              <button
                onClick={() => handleBulkAction('unpublish')}
                className="btn-premium-outline text-sm text-yellow-600 hover:bg-yellow-50"
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
                Unpublish
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

        {/* Course Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {paginatedCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
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

        {paginatedCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find courses.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CourseModal />
      <DeleteModal />
      <ApprovalModal />
    </div>
  );
};

export default CourseManagement;
