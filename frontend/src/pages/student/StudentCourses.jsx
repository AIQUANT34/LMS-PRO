import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpenIcon,
  PlayIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  CheckCircleIcon,
  TrophyIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';

const StudentCourses = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      const response = await apiService.get(API_ENDPOINTS.ENROLLMENTS.MY_COURSES);
      
      //FIX: The enrollment data is directly in response.data, not nested
      const coursesData = response.data || [];
      
      setCourses(coursesData);
    } catch (error) {
      console.error('🔍 Error fetching courses:', error);
      toast.error('Failed to load enrolled courses');
    } finally {
      setLoading(false);
    }
  };

  // Update last accessed when course is clicked
  const handleCourseClick = async (course) => {
    try {
      //  Use configured endpoint instead of hardcoded
      await apiService.post(API_ENDPOINTS.ENROLLMENTS.UPDATE_LAST_ACCESSED(course.courseId), {
        courseId: course.courseId
      });
      
      // Navigate to course
      navigate(`/student/courses/${course.courseId}`);
    } catch (error) {
      //  Better error handling with user feedback
      toast.error('Failed to update course access');
      console.error('Failed to update last accessed:', error);
      // Still navigate even if update fails
      navigate(`/student/courses/${course.courseId}`);
    }
  };

  const filteredCourses = courses.filter(course => {
    // FIX: Course data is flat, not nested - use course directly
    const courseTitle = course?.title?.toLowerCase() || '';
    const matchesSearch = courseTitle.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'active': return 'In Progress';
      case 'paused': return 'Paused';
      default: return 'Not Started';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <button
          onClick={() => navigate('/courses')}
          className="btn-premium"
        >
          Browse More Courses
        </button>
      </div>

      {/* Debug Info */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Debug Information</h3>
        <div className="text-xs text-blue-600 space-y-1">
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Total Courses: {courses.length}</p>
          <p>Filtered Courses: {filteredCourses.length}</p>
          <p>Search Term: "{searchTerm}"</p>
          <p>Filter Status: {filterStatus}</p>
        </div>
      </div> */}

      {/* Search and Filter */}
      <div className="card-premium p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">In Progress</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by browsing our course catalog'}
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="btn-premium mt-4"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleCourseClick(course)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            >
              <div className="relative">
                <img 
                  src={course.thumbnail || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect fill="%23f3f4f6" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14" font-family="Arial"%3ECourse%3C/text%3E%3C/svg%3E'} 
                  alt={course.title || 'untitled course'}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                    {getStatusText(course.status)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title || 'Untitled Course'}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Trainer: {course.trainerName || 'Unknown'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>
                    {course.completedLessons || 0}/
                    {course.totalLessons || 0} lessons
                  </span>
                  <span>Progress: {course.progress || 0}%</span>
                  <span>
                    Last accessed: {course.lastAccessed ? new Date(course.lastAccessed).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full mb-3">
                  <div 
                    className="bg-green-600 text-white text-xs font-semibold py-1 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress || 0}%` }}
                  >
                    {course.progress || 0}%
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{course.duration || 'Self-paced'}</span>
                  </div>
                  {course.status === 'completed' && (
                    <div className="flex items-center text-green-600">
                      <TrophyIcon className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                </div>
                
                <Link 
                  to={`/student/courses/${course.courseId}/lesson`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent click
                    handleCourseClick(course);
                  }}
                  className="w-full btn-premium-outline text-sm mt-3 block text-center"
                >
                  {course.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
