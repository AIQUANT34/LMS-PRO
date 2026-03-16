import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';
import { PLACEHOLDERS } from '../../utils/placeholders';
import {
  BookOpenIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
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
  XMarkIcon,
  ListBulletIcon,
  TableCellsIcon,
  ChartPieIcon,
  CircleStackIcon,
  ArchiveBoxIcon,
  InboxIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  BellIcon,
  CogIcon,
  ArrowPathIcon,
  ArrowLeftIcon,

  // ✅ ADD THESE
  StarIcon,
  PlayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon

} from '@heroicons/react/24/outline';

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
  const [error, setError] = useState(null);

  // Utility functions to eliminate duplication
  const getCourseId = (course) => course._id || course.id;
  
  const getStatusStyles = (status) => {
    const styles = {
      published: { color: 'text-green-600', bg: 'bg-green-100' },
      draft: { color: 'text-gray-600', bg: 'bg-gray-100' },
      pending_review: { color: 'text-yellow-600', bg: 'bg-yellow-100' },
      rejected: { color: 'text-red-600', bg: 'bg-red-100' },
      archived: { color: 'text-red-600', bg: 'bg-red-100' }
    };
    return styles[status] || styles.draft;
  };

  const getLevelStyles = (level) => {
    const styles = {
      Beginner: { color: 'text-green-600', bg: 'bg-green-100' },
      Intermediate: { color: 'text-blue-600', bg: 'bg-blue-100' },
      Advanced: { color: 'text-red-600', bg: 'bg-red-100' }
    };
    return styles[level] || styles.Beginner;
  };

  const updateCourseStatus = (coursesList, courseIds, status, additionalFields = {}) => {
    return coursesList.map(course => 
      courseIds.has(getCourseId(course)) 
        ? { ...course, status, ...additionalFields }
        : course
    );
  };

  const filterCourses = (coursesList, search, status, category) => {
    return coursesList.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
                           course.description.toLowerCase().includes(search.toLowerCase()) ||
                           course.trainer?.name?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'all' || course.status === status;
      const matchesCategory = category === 'all' || course.category === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  };

  const sortCourses = (coursesList, sortBy, sortOrder) => {
    return [...coursesList].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'enrollments':
          comparison = (a.enrolledStudents || 0) - (b.enrolledStudents || 0);
          break;
        case 'revenue':
          comparison = (a.revenue || 0) - (b.revenue || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  // Fetch real courses data
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let response;
        console.log('=== MY COURSES DEBUG ===');
        
        // Try trainer endpoint first (for users with 'trainer' role)
        try {
          console.log('Trying trainer endpoint:', API_ENDPOINTS.TRAINER.GET_COURSES);
          response = await apiService.get(API_ENDPOINTS.TRAINER.GET_COURSES);
          console.log('Trainer endpoint response:', response);
        } catch (trainerError) {
          // If trainer endpoint fails, try instructor endpoint (backward compatibility)
          console.log('Trainer endpoint failed, trying instructor endpoint:', trainerError.message);
          console.log('Trying instructor endpoint:', API_ENDPOINTS.COURSES.GET_TRAINER_COURSES);
          response = await apiService.get(API_ENDPOINTS.COURSES.GET_TRAINER_COURSES);
          console.log('Instructor endpoint response:', response);
        }
        
        // Handle different response structures
        let coursesData = [];
        if (response && response.data && response.data.courses) {
          coursesData = response.data.courses;
          console.log('Using response.data.courses');
        } else if (response && response.courses) {
          coursesData = response.courses;
          console.log('Using response.courses');
        } else if (response && Array.isArray(response.data)) {
          coursesData = response.data;
          console.log('Using response.data as array');
        } else if (Array.isArray(response)) {
          coursesData = response;
          console.log('Using response as array');
        } else {
          console.warn('Unexpected response structure:', response);
          coursesData = [];
        }
        
        console.log('Final courses data:', coursesData);
        console.log('Courses data length:', coursesData.length);
        
        // Fetch lessons data for each course to get accurate status and lesson count
        const coursesWithLessons = await Promise.all(
          coursesData.map(async (course) => {
            try {
              const lessonsResponse = await apiService.get(API_ENDPOINTS.LEARNING.LESSONS.GET_BY_COURSE(course._id || course.id));
              const lessons = lessonsResponse.data || lessonsResponse.lessons || [];
              
              // Calculate actual lesson count and determine status based on lessons
              const lessonCount = lessons.length;
              const hasLessons = lessonCount > 0;
              const publishedLessons = lessons.filter(lesson => lesson.isPublished).length;
              
              return {
                ...course,
                lessons: lessonCount,
                lessonsData: lessons,
                // Update status based on actual lesson data
                status: hasLessons ? (publishedLessons === lessonCount ? 'published' : 'draft') : 'draft',
                lessonCount,
                publishedLessons
              };
            } catch (lessonError) {
              console.warn(`Failed to fetch lessons for course ${course._id || course.id}:`, lessonError);
              return {
                ...course,
                lessons: course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0,
                lessonsData: [],
                status: course.status || 'draft'
              };
            }
          })
        );
        
        setCourses(coursesWithLessons);
        setFilteredCourses(coursesWithLessons);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setError('Failed to load courses');
        toast.error('Failed to load courses');
        
        // Set empty state on error
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter and sort courses using utility functions
    const filtered = filterCourses(courses, searchQuery, filterStatus, filterCategory);
    const sorted = sortCourses(filtered, sortBy, sortOrder);
    setFilteredCourses(sorted);
  }, [courses, searchQuery, filterStatus, filterCategory, sortBy, sortOrder]);

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      const courseIdToDelete = getCourseId(courseToDelete);
      setCourses(courses.filter(course => getCourseId(course) !== courseIdToDelete));
      setFilteredCourses(prev => prev.filter(course => getCourseId(course) !== courseIdToDelete));
      setCourseToDelete(null);
      setShowDeleteModal(false);
      toast.success('Course deleted successfully');
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
    const selectedCourseIds = new Set(courses.filter(course => selectedCourses.has(getCourseId(course))).map(getCourseId));
    
    if (action === 'delete') {
      const updatedCourses = courses.filter(course => !selectedCourseIds.has(getCourseId(course)));
      setCourses(updatedCourses);
      setFilteredCourses(prev => prev.filter(course => !selectedCourseIds.has(getCourseId(course))));
      setSelectedCourses(new Set());
      toast.success('Selected courses deleted successfully');
    } else if (action === 'publish') {
      const updatedCourses = updateCourseStatus(courses, selectedCourseIds, 'published', { publishedAt: new Date().toISOString() });
      setCourses(updatedCourses);
      setFilteredCourses(prev => updateCourseStatus(prev, selectedCourseIds, 'published', { publishedAt: new Date().toISOString() }));
      setSelectedCourses(new Set());
      toast.success('Selected courses published successfully');
    } else if (action === 'unpublish') {
      const updatedCourses = updateCourseStatus(courses, selectedCourseIds, 'draft', { publishedAt: null });
      setCourses(updatedCourses);
      setFilteredCourses(prev => updateCourseStatus(prev, selectedCourseIds, 'draft', { publishedAt: null }));
      setSelectedCourses(new Set());
      toast.success('Selected courses unpublished successfully');
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
            checked={selectedCourses.has(getCourseId(course))}
            onChange={(e) => {
              e.stopPropagation();
              handleToggleCourseSelection(getCourseId(course));
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <img 
            src={course.thumbnail || null} 
            alt={course.title}
            className="w-16 h-12 rounded-lg object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div 
            className="w-16 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white"
            style={{ display: course.thumbnail ? 'none' : 'flex' }}
          >
            <BookOpenIcon className="h-6 w-6" />
          </div>
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
          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusStyles(course.status).bg}`}>
            <span className={getStatusStyles(course.status).color}>
              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
            </span>
          </span>
          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getLevelStyles(course.level).bg}`}>
            <span className={getLevelStyles(course.level).color}>
              {course.level}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Trainer</div>
          <div className="font-medium text-gray-900 text-sm">{course.trainer?.name || 'You'}</div>
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
          <div className="font-medium text-gray-900 text-sm">{(course.enrolledStudents || course.enrollmentCount || 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Duration</div>
          <div className="font-medium text-gray-900 text-sm">{course.duration}h</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Lessons</div>
          <div className="font-medium text-gray-900 text-sm">{course.lessons || course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Rating</div>
          <div className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="font-medium text-gray-900 text-sm">{course.rating || course.ratings?.average || '0.0'}</span>
            <span className="text-gray-500 text-sm">({course.reviews || course.ratings?.count || 0})</span>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Revenue</div>
          <div className="font-medium text-gray-900 text-sm">${(course.revenue || course.totalRevenue || 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Created: {new Date(course.createdAt || course.created_at).toLocaleDateString()}
          </span>
          {(course.updatedAt || course.updated_at) !== (course.createdAt || course.created_at) && (
            <span className="text-xs text-gray-500">
              Updated: {new Date(course.updatedAt || course.updated_at).toLocaleDateString()}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            to={`/trainer/courses/${getCourseId(course)}/player`}
            className="btn-premium-outline text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <PlayIcon className="h-4 w-4 mr-1" />
            View
          </Link>
          <Link
            to={`/trainer/courses/${getCourseId(course)}/edit`}
            className="btn-premium-outline text-sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit button clicked for course:', getCourseId(course));
              console.log('Navigating to:', `/trainer/courses/${getCourseId(course)}/edit`);
            }}
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </Link>
          <Link
            to={`/trainer/courses/${getCourseId(course)}/analytics`}
            className="btn-premium-outline text-sm"
            onClick={(e) => e.stopPropagation()}
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
                to="/trainer/courses/create"
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
              <option value="pending_review">Pending Review</option>
              <option value="rejected">Rejected</option>
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
            <CourseCard key={course._id || course.id} course={course} index={index} />
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
