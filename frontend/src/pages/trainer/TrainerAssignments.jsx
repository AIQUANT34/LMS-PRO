import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardDocumentListIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  ArrowTrendingUpIcon,
  AcademicCapIcon,
  BellIcon,
  CogIcon,
  XMarkIcon,
  ArrowPathIcon,
  FolderIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';

const TrainerAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    graded: 0,
    draft: 0,
    totalSubmissions: 0,
    avgCompletion: 0
  });

  // Fetch real data
  useEffect(() => {
    fetchAssignments();
    fetchCourses();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(API_ENDPOINTS.TRAINER.ASSIGNMENTS.GET_ALL);
      const assignmentsData = response.data?.assignments || [];
      setAssignments(assignmentsData);
      calculateStats(assignmentsData);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      toast.error('Failed to load assignments');
      // Set empty state on error
      setAssignments([]);
      setStats({
        total: 0,
        active: 0,
        graded: 0,
        draft: 0,
        totalSubmissions: 0,
        avgCompletion: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.TRAINER.GET_COURSES);
      setCourses(response.data?.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      // Fallback mock courses
      setCourses([]);
    }
  };

  const calculateStats = (assignmentsData) => {
    const total = assignmentsData.length;
    const active = assignmentsData.filter(a => a.status === 'active').length;
    const graded = assignmentsData.filter(a => a.status === 'graded').length;
    const draft = assignmentsData.filter(a => a.status === 'draft').length;
    const totalSubmissions = assignmentsData.reduce((acc, a) => acc + a.submissions, 0);
    const avgCompletion = total > 0 
      ? Math.round(assignmentsData.reduce((acc, a) => acc + (a.submissions / a.totalStudents * 100), 0) / total)
      : 0;

    setStats({ total, active, graded, draft, totalSubmissions, avgCompletion });
  };

  const filteredAndSortedAssignments = useMemo(() => {
    let filtered = assignments.filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           assignment.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
      const matchesCourse = filterCourse === 'all' || assignment.courseId === parseInt(filterCourse);
      const matchesType = filterType === 'all' || assignment.type === filterType;
      return matchesSearch && matchesStatus && matchesCourse && matchesType;
    });

    // Sort assignments
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'submissions':
          return b.submissions - a.submissions;
        case 'completion':
          return (b.submissions / b.totalStudents) - (a.submissions / a.totalStudents);
        default:
          return 0;
      }
    });
  }, [assignments, searchQuery, filterStatus, filterCourse, filterType, sortBy]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'graded': return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'draft': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default: return <XCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'graded': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'coding': return <DocumentTextIcon className="h-4 w-4" />;
      case 'quiz': return <ClipboardDocumentListIcon className="h-4 w-4" />;
      case 'project': return <FolderIcon className="h-4 w-4" />;
      default: return <BookOpenIcon className="h-4 w-4" />;
    }
  };

  const handleSelectAssignment = useCallback((assignmentId) => {
    setSelectedAssignments(prev => {
      if (prev.includes(assignmentId)) {
        return prev.filter(id => id !== assignmentId);
      } else {
        return [...prev, assignmentId];
      }
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedAssignments.length === filteredAndSortedAssignments.length) {
      setSelectedAssignments([]);
    } else {
      setSelectedAssignments(filteredAndSortedAssignments.map(a => a.id));
    }
  }, [filteredAndSortedAssignments, selectedAssignments]);

  const handleBulkAction = useCallback(async (action) => {
    try {
      setLoading(true);
      await apiService.post(API_ENDPOINTS.TRAINER.ASSIGNMENTS.BULK_ACTION, {
        assignmentIds: selectedAssignments,
        action
      });
      
      toast.success(`${selectedAssignments.length} assignments ${action}d successfully`);
      setSelectedAssignments([]);
      fetchAssignments(); // Refresh data
    } catch (error) {
      console.error('Bulk action failed:', error);
      toast.error(`Failed to ${action} assignments`);
    } finally {
      setLoading(false);
    }
  }, [selectedAssignments]);

  const handleDeleteAssignment = useCallback(async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      await apiService.delete(API_ENDPOINTS.TRAINER.ASSIGNMENTS.DELETE(assignmentId));
      toast.success('Assignment deleted successfully');
      fetchAssignments();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete assignment');
    }
  }, []);

  const handleDuplicateAssignment = useCallback(async (assignmentId) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.TRAINER.ASSIGNMENTS.DUPLICATE(assignmentId));
      toast.success('Assignment duplicated successfully');
      fetchAssignments();
    } catch (error) {
      console.error('Duplicate failed:', error);
      toast.error('Failed to duplicate assignment');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-700">Loading Assignments...</div>
          <div className="text-sm text-gray-500 mt-2">Fetching your assignments</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                <p className="text-sm text-gray-600">Manage and grade student assignments</p>
              </div>
              
              {/* Bulk Actions */}
              <AnimatePresence>
                {selectedAssignments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg"
                  >
                    <span className="text-sm text-blue-800 font-medium">
                      {selectedAssignments.length} selected
                    </span>
                    <button
                      onClick={() => handleBulkAction('publish')}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Publish
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ChartBarIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ClipboardDocumentListIcon className="h-4 w-4" />
                </button>
              </div>
              
              <button
                onClick={() => navigate('/trainer/assignments/create')}
                className="btn-premium"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Assignments</div>
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</div>
                <div className="text-sm text-gray-600">Total Submissions</div>
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.avgCompletion}%</div>
                <div className="text-sm text-gray-600">Avg. Completion</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Course Filter */}
            <div>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="graded">Graded</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="coding">Coding</option>
                <option value="quiz">Quiz</option>
                <option value="project">Project</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="title">Sort by Title</option>
                <option value="submissions">Sort by Submissions</option>
                <option value="completion">Sort by Completion</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Assignments List/Grid */}
        <AnimatePresence mode="wait">
          {filteredAndSortedAssignments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardDocumentListIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
            >
              {filteredAndSortedAssignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card-premium p-6 hover:shadow-lg transition-all relative ${
                    selectedAssignments.includes(assignment.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-4 left-4">
                    <input
                      type="checkbox"
                      checked={selectedAssignments.includes(assignment.id)}
                      onChange={() => handleSelectAssignment(assignment.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1 ml-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                            {assignment.difficulty}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 text-sm">{assignment.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          {getTypeIcon(assignment.type)}
                          <span>{assignment.course}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Due: {assignment.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{assignment.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4" />
                          <span>{assignment.points} pts</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{assignment.submissions}/{assignment.totalStudents} submitted</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => navigate(`/trainer/assignments/${assignment.id}`)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Assignment"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => navigate(`/trainer/assignments/${assignment.id}/edit`)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Assignment"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDuplicateAssignment(assignment.id)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Duplicate Assignment"
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Assignment"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrainerAssignments;
