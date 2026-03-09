import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpenIcon,
  PlayIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  AcademicCapIcon,
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
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
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
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  BellIcon,
  Cog6TootIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ArrowRightIcon as ArrowRightIconOutline,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock courses data
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
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-03-01',
      publishedAt: '2024-01-20',
      revenue: 45678.90,
      isPublished: true,
      isFeatured: true,
      tags: ['React', 'JavaScript', 'Frontend', 'Advanced'],
      requirements: ['Basic React knowledge', 'JavaScript ES6+', 'HTML/CSS'],
      objectives: ['Master advanced patterns', 'Build scalable apps', 'Performance optimization']
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
      price: 49.99,
      originalPrice: 79.99,
      currency: 'USD',
      language: 'English',
      duration: 16,
      lessons: 32,
      enrolledStudents: 890,
      completedStudents: 234,
      rating: 4.6,
      reviews: 123,
      thumbnail: 'https://via.placeholder.com/400x225',
      status: 'published',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-28',
      publishedAt: '2024-02-05',
      revenue: 23456.78,
      isPublished: true,
      isFeatured: false,
      tags: ['UI', 'UX', 'Design', 'Figma'],
      requirements: ['No prior experience needed'],
      objectives: ['Learn design principles', 'Master Figma', 'Create portfolios']
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
      price: 69.99,
      originalPrice: 99.99,
      currency: 'USD',
      language: 'English',
      duration: 20,
      lessons: 38,
      enrolledStudents: 567,
      completedStudents: 123,
      rating: 4.5,
      reviews: 89,
      thumbnail: 'https://via.placeholder.com/400x225',
      status: 'draft',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-06',
      publishedAt: null,
      revenue: 0,
      isPublished: false,
      isFeatured: false,
      tags: ['Marketing', 'SEO', 'Social Media', 'Analytics'],
      requirements: ['Basic marketing knowledge'],
      objectives: ['Master digital marketing', 'Learn SEO', 'Social media strategies']
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
      status: 'published',
      createdAt: '2024-01-10',
      updatedAt: '2024-02-20',
      publishedAt: '2024-01-15',
      revenue: 67890.12,
      isPublished: true,
      isFeatured: true,
      tags: ['Python', 'Data Science', 'Machine Learning', 'Analytics'],
      requirements: ['Basic Python knowledge', 'Statistics basics'],
      objectives: ['Master data science', 'Machine learning basics', 'Data visualization']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter courses based on search and filters
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort courses
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'rating') {
        comparison = a.rating - b.rating;
      } else if (sortBy === 'enrollments') {
        comparison = a.enrolledStudents - b.enrolledStudents;
      } else if (sortBy === 'revenue') {
        comparison = a.revenue - b.revenue;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredCourses(sorted);
  }, [courses, searchQuery, filterStatus, filterCategory, sortBy, sortOrder]);

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      setCourses(courses.filter(course => course.id !== courseToDelete.id));
      setCourseToDelete(null);
      setShowDeleteModal(false);
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
      case 'archived': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100';
      case 'draft': return 'bg-gray-100';
      case 'archived': return 'bg-red-100';
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
          <Link
            to={`/instructor/courses/${course.id}/player`}
            className="btn-premium-outline text-sm"
          >
            <PlayIcon className="h-4 w-4 mr-1" />
            View
          </Link>
          <Link
            to={`/instructor/courses/${course.id}/edit`}
            className="btn-premium-outline text-sm"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </Link>
          <Link
            to={`/instructor/courses/${course.id}/analytics`}
            className="btn-premium-outline text-sm"
          >
            <ChartBarIcon className="h-4 w-4 mr-1" />
            Analytics
          </Link>
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

  const DeleteModal = () => (
    <AnimatePresence>
      {showDeleteModal && courseToDelete && (
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
                Are you sure you want to delete <strong>{courseToDelete.title}</strong>? This action cannot be undone.
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
                onClick={confirmDeleteCourse}
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-600">Manage and monitor your course content</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                to="/instructor/courses/create"
                className="btn-premium"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Course
              </Link>
            </div>
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
              placeholder="Search courses by title, description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Data Science">Data Science</option>
              <option value="Photography">Photography</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Sort by Created</option>
              <option value="title">Sort by Title</option>
              <option value="rating">Sort by Rating</option>
              <option value="enrollments">Sort by Enrollments</option>
              <option value="revenue">Sort by Revenue</option>
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
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find courses.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <DeleteModal />
    </div>
  );
};

export default MyCourses;
