import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';
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
  XMarkIcon,
  ListBulletIcon,
  TableCellsIcon,
  ChartPieIcon,
  ChartBarIcon,
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
  const [viewMode, setViewMode] = useState('view'); // 'view', 'edit', 'create'
  const [editFormData, setEditFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  const coursesPerPage = 12;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.COURSES.GET_ALL);
      
      // Check if response is an array, if not handle appropriately
      let coursesData = [];
      if (Array.isArray(response)) {
        coursesData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        coursesData = response.data;
      } else if (response && Array.isArray(response.courses)) {
        coursesData = response.courses;
      } else {
        console.warn('Unexpected API response structure:', response);
        coursesData = [];
      }
      
      // Transform the backend data to match the frontend structure
      const transformedCourses = coursesData.map(course => ({
        id: course._id || course.id,
        title: course.title || 'Untitled Course',
        description: course.description || 'No description available',
        category: course.category || 'General',
        level: course.level || 'beginner',
        status: course.isPublished ? 'published' : 'draft',
        trainer: {
          id: course.trainerId?._id || course.trainerId || course.trainer?.id,
          name: course.trainerId?.name || course.trainer?.name || 'Unknown Trainer',
          email: course.trainerId?.email || course.trainer?.email || '',
          avatar: course.trainerId?.avatar || course.trainer?.avatar || 'https://via.placeholder.com/100x100'
        },
        price: course.price || 0,
        currency: course.currency || 'USD',
        duration: course.duration || 0,
        lessons: course.lessons || [],
        enrolledStudents: course.enrolledStudents || course.students || [],
        rating: course.averageRating || course.rating || 0,
        reviews: course.reviews || [],
        thumbnail: course.thumbnail || course.image || 'https://via.placeholder.com/300x200',
        createdAt: course.createdAt || course.created_at,
        updatedAt: course.updatedAt || course.updated_at,
        tags: course.tags || [],
        requirements: course.requirements || [],
        objectives: course.objectives || []
      }));
      
      setCourses(transformedCourses);
      setTotalPages(Math.ceil(transformedCourses.length / coursesPerPage));
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
      // Set empty courses array to prevent crashes
      setCourses([]);
      setTotalPages(0);
    }
  };

  // Button handler functions
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setViewMode('view');
    setShowCourseModal(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setViewMode('edit');
    setEditFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      price: course.price,
      duration: course.duration
    });
    setShowCourseModal(true);
  };

  const handleDeleteCourse = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const confirmDeleteCourse = async () => {
    try {
      await apiService.delete(API_ENDPOINTS.COURSES.DELETE(selectedCourse.id));
      toast.success('Course deleted successfully');
      setShowDeleteModal(false);
      setSelectedCourse(null);
      fetchCourses(); // Refresh the list
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault(); // Prevent form submission and page reload
    
    try {
      if (viewMode === 'edit') {
        await apiService.patch(API_ENDPOINTS.COURSES.UPDATE(selectedCourse.id), editFormData);
        toast.success('Course updated successfully');
      } else {
        await apiService.post(API_ENDPOINTS.COURSES.CREATE, editFormData);
        toast.success('Course created successfully');
      }
      setShowCourseModal(false);
      setSelectedCourse(null);
      setEditFormData({});
      fetchCourses(); // Refresh the list
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(`Failed to ${viewMode === 'edit' ? 'update' : 'create'} course`);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.trainer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    return matchesSearch && matchesStatus && matchesCategory && matchesLevel;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'trainer') {
      comparison = a.trainer.name.localeCompare(b.trainer.name);
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (sortBy === 'level') {
      comparison = a.level.localeCompare(b.level);
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === 'enrolledStudents') {
      comparison = a.enrolledStudents.length - b.enrolledStudents.length;
    } else if (sortBy === 'rating') {
      comparison = a.rating - b.rating;
    } else if (sortBy === 'createdAt') {
      comparison = new Date(a.createdAt) - new Date(b.createdAt);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const paginatedCourses = sortedCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-purple-100 text-purple-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="mt-2 text-gray-600">Manage and monitor all courses in the system</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
            <div>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortBy(sort);
                  setSortOrder(order);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="trainer-asc">Trainer (A-Z)</option>
                <option value="enrolledStudents-desc">Students (High-Low)</option>
                <option value="rating-desc">Rating (High-Low)</option>
                <option value="createdAt-desc">Created (Newest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {paginatedCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <img 
                      src={course.trainer.avatar} 
                      alt={course.trainer.name}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-700">{course.trainer.name}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span className="font-medium">{course.enrolledStudents.length} students</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{course.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ${course.price}
                  </span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewCourse(course)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Course"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleEditCourse(course)}
                      className="text-green-600 hover:text-green-800"
                      title="Edit Course"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Course"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * coursesPerPage) + 1} to{' '}
            {Math.min(currentPage * coursesPerPage, filteredCourses.length)} of{' '}
            {filteredCourses.length} courses
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Course View/Edit Modal */}
      {showCourseModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {viewMode === 'view' ? 'Course Details' : viewMode === 'edit' ? 'Edit Course' : 'Create Course'}
                </h2>
                <button
                  onClick={() => {
                    setShowCourseModal(false);
                    setSelectedCourse(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              {viewMode === 'view' ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedCourse.thumbnail}
                      alt={selectedCourse.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedCourse.title}</h3>
                      <p className="text-gray-600">{selectedCourse.description}</p>
                      <div className="flex space-x-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCourse.status)}`}>
                          {selectedCourse.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(selectedCourse.level)}`}>
                          {selectedCourse.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Trainer</h4>
                      <div className="flex items-center mt-1">
                        <img
                          src={selectedCourse.trainer.avatar}
                          alt={selectedCourse.trainer.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span>{selectedCourse.trainer.name}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Price</h4>
                      <p className="text-gray-600">{selectedCourse.currency} {selectedCourse.price}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Category</h4>
                      <p className="text-gray-600">{selectedCourse.category}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Duration</h4>
                      <p className="text-gray-600">{selectedCourse.duration} hours</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Enrolled Students</h4>
                      <p className="text-gray-600">{selectedCourse.enrolledStudents.length}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Rating</h4>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>{selectedCourse.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {selectedCourse.requirements && selectedCourse.requirements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {selectedCourse.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedCourse.objectives && selectedCourse.objectives.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {selectedCourse.objectives.map((obj, index) => (
                          <li key={index}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSaveCourse} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={editFormData.description || ''}
                      onChange={handleEditFormChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        name="category"
                        value={editFormData.category || 'Development'}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Development">Development</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Data Science">Data Science</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                      <select
                        name="level"
                        value={editFormData.level || 'beginner'}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price || 0}
                        onChange={handleEditFormChange}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                      <input
                        type="number"
                        name="duration"
                        value={editFormData.duration || 0}
                        onChange={handleEditFormChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCourseModal(false);
                        setSelectedCourse(null);
                        setEditFormData({});
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {viewMode === 'edit' ? 'Update Course' : 'Create Course'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Course</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedCourse.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCourse(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCourse}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
