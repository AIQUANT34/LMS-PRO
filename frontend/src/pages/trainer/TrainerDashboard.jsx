import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpenIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  PlusIcon,
  Bars3Icon,
  BellIcon,
  UserPlusIcon,
  Cog6ToothIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
  StarIcon,
  ClockIcon,
  PlayIcon,
  ChartBarIcon,
  UsersIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  UserIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';
import ProfilePictureUpload from '../../components/common/ProfilePictureUpload';
import { useAuthStore } from '../../store/authStore';
import CertificateApprovals from './CertificateApprovals';

const TrainerDashboard = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [studentProgressData, setStudentProgressData] = useState([]); // ✅ NEW: Per-student progress data
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  // const { studentCompletions, studentProgressData } = response.data.data;
  // Generate real recent activity from courses and assignments
  const generateRecentActivity = (coursesData, assignmentsData) => {
    const activities = [];
    
    // Add course creation activities
    coursesData.forEach(course => {
      const createdDate = new Date(course.createdAt || course.updatedAt);
      const timeAgo = getTimeAgo(createdDate);
      
      activities.push({
        user: 'You',
        action: 'created',
        course: course.title,
        time: timeAgo,
        icon: BookOpenIcon,
        type: 'course_created'
      });
    });
    
    // Add assignment activities
    assignmentsData.forEach(assignment => {
      const createdDate = new Date(assignment.createdAt || assignment.updatedAt);
      const timeAgo = getTimeAgo(createdDate);
      
      activities.push({
        user: 'You',
        action: 'created assignment for',
        course: assignment.title || 'Course Assignment',
        time: timeAgo,
        icon: DocumentTextIcon,
        type: 'assignment_created',
        timestamp: createdDate,
        
      });
    });
    
    // Sort by most recent and return top 5
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  };

  // Helper function to get time ago string
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + " years ago";
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " months ago";
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + " days ago";
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + " hours ago";
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + " minutes ago";
    
    return "Just now";
  };

  // Delete course handler
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.delete(`/trainer/courses/${courseId}`);
      toast.success('Course deleted successfully');
      refreshData(); // Refresh the courses list
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  // Fetch student completion data from progress database (LMS Standard: enrollment.progress + progressModel)
  const loadStudentCompletionData = async (coursesData) => {
    try {
      console.log('🎯 Loading comprehensive student completion data...');
      const completionResponse = await apiService.get(API_ENDPOINTS.LEARNING.PROGRESS.STUDENT_COMPLETIONS);
      console.log('🎯 Comprehensive student completion response:', completionResponse);
      
      // Handle the correct response format from backend
      let studentCompletions = [];
      let studentProgressData = [];
      
      if (completionResponse?.success && completionResponse?.data) {
        // Backend returns: { success: true, data: { studentCompletions: [...], studentProgressData: [...] } }
        studentCompletions = completionResponse.data.studentCompletions || [];
        studentProgressData = completionResponse.data.studentProgressData || [];
        console.log('🎯 Using backend response format:', {
          studentCompletions: studentCompletions.length,
          studentProgressData: studentProgressData.length
        });
      } else if (completionResponse?.studentCompletions) {
        // Fallback format
        studentCompletions = completionResponse.studentCompletions;
        studentProgressData = completionResponse.studentProgressData || [];
      } else {
        console.log('🎯 No student completion data found in response');
      }
      
      if (studentCompletions && studentCompletions.length > 0) {
        // 🧠 Senior Debugging Trick - Check ID mismatches BEFORE processing
        console.log('🔍 DEBUG - ID Type Analysis:', {
          courseIdsFromCourses: coursesData.map(c => ({ 
            id: c._id, 
            type: typeof c._id,
            stringId: String(c._id)
          })),
          courseIdsFromCompletion: studentCompletions.map(c => ({ 
            courseId: c.courseId, 
            type: typeof c.courseId,
            stringCourseId: String(c.courseId)
          }))
        });
        
        console.log('🔍 DEBUG - Raw studentCompletions data:', studentCompletions);
        
        // Map completion data to courses with STRING conversion (CRITICAL FIX)
        const completionMap = {};
        studentCompletions.forEach(courseCompletion => {
          completionMap[String(courseCompletion.courseId)] = courseCompletion;
        });
        
        console.log('🔍 DEBUG - CompletionMap keys:', Object.keys(completionMap));
        
        // Update courses with comprehensive completion data - ENHANCE, don't overwrite
        const enhancedCourses = coursesData.map(course => {
          const completionData = completionMap[String(course._id)] || null;
          
          console.log(`🔍 DEBUG - Course ${course._id}:`, {
            hasCompletionData: !!completionData,
            completionData: completionData,
            stringId: String(course._id),
            existingCompletedStudents: course.completedStudents,
            existingTotalEnrolled: course.totalEnrolled
          });
          
          // 🔥 ENHANCE existing data, don't overwrite
          return {
            ...course,
            completionData: completionData,
            // Only use completion data if it exists, otherwise keep existing values
            totalCompletions: completionData?.totalCompletions ?? course.totalCompletions ?? 0,
            totalEnrolled: completionData?.totalEnrolled ?? course.totalEnrolled ?? course.enrollmentCount ?? 0,
            completionRate: completionData?.completionRate ?? course.completionRate ?? 0,
            activeStudents: completionData?.activeStudents ?? course.activeStudents ?? course.enrollmentCount ?? 0,
            completedStudents: completionData?.completedStudents ?? course.completedStudents ?? 0, // ✅ Preserve existing
            averageProgress: completionData?.averageProgress ?? course.averageProgress ?? 0,
            totalLessons: completionData?.totalLessons ?? course.totalLessons ?? 0,
            progressBreakdown: completionData?.progressBreakdown ?? course.progressBreakdown ?? [],
            lessonProgress: completionData?.lessonProgress ?? course.lessonProgress ?? {},
            recentActivity: completionData?.recentActivity ?? course.recentActivity ?? []
          };
        });
        
        // Update the courses state with enhanced data
        setCourses(enhancedCourses);
        setStudentProgressData(studentProgressData);
        
        console.log('🎯 Courses updated with comprehensive completion data:', enhancedCourses);
        console.log('🎯 Student progress data loaded:', studentProgressData.length, 'students');
        
        // Log sample data for verification
        if (enhancedCourses.length > 0) {
          const sampleCourse = enhancedCourses[0];
          console.log('🎯 Sample course with real data:', {
            title: sampleCourse.title,
            totalEnrolled: sampleCourse.totalEnrolled,
            completedStudents: sampleCourse.completedStudents,
            completionRate: sampleCourse.completionRate,
            averageProgress: sampleCourse.averageProgress,
            hasProgressBreakdown: sampleCourse.progressBreakdown?.length > 0
          });
        }
        
        // 🔥 Return enhanced courses for immediate use in stats calculation
        return enhancedCourses;
      } else {
        console.log('🎯 No student completion data available - array is empty or undefined');
        setCourses(coursesData); // Use original courses data
        setStudentProgressData([]);
        return coursesData; // Return courses for consistency
      }
    } catch (error) {
      console.error('🎯 Failed to load student completion data:', error);
      // Keep courses without completion data
      setCourses(coursesData); // Use original courses data
      setStudentProgressData([]);
      return coursesData; // Return courses for consistency
    }
  };

  // Refresh data function with enhanced logging
  const refreshData = async (showToast = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch trainer's courses
      const coursesResponse = await apiService.get(API_ENDPOINTS.COURSES.GET_TRAINER_COURSES);
      
      // Handle different response structures
      let coursesData = [];
      
      if (coursesResponse && coursesResponse.data && coursesResponse.data.courses) {
        coursesData = coursesResponse.data.courses;
      } else if (coursesResponse && coursesResponse.courses) {
        coursesData = coursesResponse.courses;
      } else if (coursesResponse && Array.isArray(coursesResponse.data)) {
        coursesData = coursesResponse.data;
      } else if (Array.isArray(coursesResponse)) {
        coursesData = coursesResponse;
      } else {
        coursesData = [];
      }
      
      // Use course database values directly for enrollment and lesson counts
      console.log('🎯 Raw course data from API:', coursesData);
      
      // 🔥 Map courses with database values FIRST, then load completion data
      const updatedCourses = coursesData.map(course => ({
        ...course,
        // Use database values directly
        totalEnrolled: course.enrollmentCount || 0,
        totalLessons: course.totalLessons || 0, // Use course database value
        // 🔥 PRESERVE real completion data - don't overwrite with defaults
        totalCompletions: course.totalCompletions || 0,
        completionRate: course.completionRate || 0,
        activeStudents: course.activeStudents || course.enrollmentCount || 0,
        completedStudents: course.completedStudents || 0, // ✅ Keep real data, don't default to 0
        averageProgress: course.averageProgress || 0,
        progressBreakdown: course.progressBreakdown || [],
        lessonProgress: course.lessonProgress || {},
        recentActivity: course.recentActivity || []
      }));
      
      console.log('🎯 Updated courses with database values:', updatedCourses);
      
      // Fetch student completion data from progress database (LMS Standard: enrollment.progress + progressModel)
      const enhancedCourses = await loadStudentCompletionData(updatedCourses); // Get the enhanced courses back
      
      console.log('🎯 Using course database values + real completion data');
      
      // setCourses is already called in loadStudentCompletionData with enhanced data
      // setStudentProgressData is already set in loadStudentCompletionData
      
      // Calculate enhanced stats from courses data with comprehensive completion information
      // Use the enhancedCourses directly instead of waiting for state update
      const currentCourses = enhancedCourses; // Use the returned enhanced courses directly
      
      console.log('🔥 DEBUG - Using enhanced courses for stats:', {
        coursesCount: currentCourses.length,
        sampleCourse: currentCourses[0] ? {
          title: currentCourses[0].title,
          completedStudents: currentCourses[0].completedStudents,
          totalEnrolled: currentCourses[0].totalEnrolled,
          completionRate: currentCourses[0].completionRate
        } : null
      });
      
      const totalCourses = currentCourses.length;
      const publishedCourses = currentCourses.filter(course => course.status === 'published').length;
      const draftCourses = currentCourses.filter(course => course.status === 'draft').length;
      
      // Calculate comprehensive student stats from REAL progress data
      const totalStudents = currentCourses.reduce((sum, course) => 
        sum + (course.totalEnrolled || course.enrollmentCount || 0), 0
      );
      
      // Use REAL active students data from progress database
      const totalActiveStudents = currentCourses.reduce((sum, course) => 
        sum + (course.activeStudents || 0), 0
      );
      
      // Calculate REAL completed students data from progress database
      const totalCompletedStudents = currentCourses.reduce((sum, course) => 
        sum + (course.completedStudents || 0), 0
      );
      
      console.log('🔥 DEBUG - Final stats calculation:', {
        totalCompletedStudents,
        totalStudents,
        averageCompletionRate: totalStudents > 0 ? (totalCompletedStudents / totalStudents) * 100 : 0,
        coursesUsed: currentCourses.map(c => ({
          title: c.title,
          completedStudents: c.completedStudents,
          totalEnrolled: c.totalEnrolled
        }))
      });
      
      // Calculate total lesson completions from REAL progress data
      const totalLessonCompletions = currentCourses.reduce((sum, course) => 
        sum + (course.totalCompletions || 0), 0
      );
      
      // Calculate course engagement metrics
      const totalLessons = currentCourses.reduce((sum, course) => 
        sum + (course.totalLessons || 0), 0
      );
      
      // Calculate average course rating from course data
      const totalRating = currentCourses.reduce((sum, course) => 
        sum + (course.ratings?.average || 0), 0
      );
      const averageRating = currentCourses.length > 0 ? totalRating / currentCourses.length : 0;
      
      // Calculate total revenue
      const totalRevenue = currentCourses.reduce((sum, course) => 
        sum + (course.totalRevenue || 0), 0
      );
      
      // Calculate REAL completion rate from actual progress data
      const averageCompletionRate = totalStudents > 0 ? (totalCompletedStudents / totalStudents) * 100 : 0;
      
      // Calculate REAL average student progress from progress database
      const averageStudentProgress = currentCourses.length > 0 
        ? currentCourses.reduce((sum, course) => sum + (course.averageProgress || 0), 0) / currentCourses.length 
        : 0;
      
      // Calculate course performance metrics
      const averageCoursePrice = currentCourses.length > 0 
        ? currentCourses.reduce((sum, course) => sum + (course.originalPrice || 0), 0) / currentCourses.length 
        : 0;
      
      // Calculate student engagement metrics
      const averageStudentsPerCourse = totalCourses > 0 ? totalStudents / totalCourses : 0;
      
      // Calculate course health metrics
      const activeCourses = currentCourses.filter(course => 
        course.status === 'published' && course.enrollmentCount > 0
      ).length;
      
      const courseEngagementRate = totalCourses > 0 ? (activeCourses / totalCourses) * 100 : 0;
      
      // Use real analytics data when available, fallback to calculated values
      setStats({
        totalCourses,
        publishedCourses,
        draftCourses,
        totalStudents,
        totalActiveStudents,
        totalCompletedStudents,
        totalRevenue,
        averageRating,
        averageCompletionRate,
        averageStudentProgress, // NEW: Real average progress
        totalLessons,
        totalLessonCompletions, // NEW: Real lesson completions
        averageCoursePrice,
        averageStudentsPerCourse,
        activeCourses,
        courseEngagementRate,
        loading: false,
        error: null,
        thisMonthRevenue: 0, // Would be calculated from real analytics
        topPerformingCourse: currentCourses.length > 0 ? 
          currentCourses.reduce((top, course) => 
            (course.totalEnrolled || course.enrollmentCount || 0) > (top.totalEnrolled || top.enrollmentCount || 0) ? course : top
          )?.title || 'No courses yet' : 'No courses yet',
        recentActivity: 0,
        studentCompletions: totalCompletedStudents
      });
      
      console.log('🎯 Enhanced trainer dashboard stats with REAL data:', {
        totalCourses,
        publishedCourses,
        draftCourses,
        totalStudents,
        totalActiveStudents,
        totalCompletedStudents,
        totalRevenue,
        averageRating,
        averageCompletionRate,
        averageStudentProgress,
        totalLessons,
        totalLessonCompletions,
        averageCoursePrice,
        averageStudentsPerCourse,
        activeCourses,
        courseEngagementRate
      });
      
      setLastRefreshTime(new Date());
      
      if (showToast) {
        toast.success('Dashboard data refreshed with latest updates');
      }
    } catch (error) {
      setError('Failed to load dashboard data');
      if (showToast) {
        toast.error('Failed to load dashboard data');
      }
      
      // Fallback to empty state
      setCourses([]);
      setStats({
        totalCourses: 0,
        publishedCourses: 0,
        draftCourses: 0,
        totalStudents: 0,
        totalRevenue: 0,
        averageRating: 0,
        totalReviews: 0,
        completionRate: 0,
        engagementRate: 0,
        thisMonthRevenue: 0,
        topPerformingCourse: 'No courses yet',
        recentActivity: 0,
        studentCompletions: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch real data from backend
  useEffect(() => {
    refreshData();
  }, []);

  // Location-based refresh - detect when returning from course editing
  useEffect(() => {
    // Check if user is returning from course editing/creation
    const previousPath = location.state?.from;
    const currentPath = location.pathname;
    
    
    // Refresh data if coming from course editing routes
    if (previousPath && (
      previousPath.includes('/trainer/courses/edit') ||
      previousPath.includes('/trainer/courses/create') ||
      previousPath.includes('/trainer/courses/') // includes course detail pages
    )) {
      refreshData(true); // Show toast notification
      
      // Clear the location state to prevent repeated refreshes
      window.history.replaceState({}, document.title, currentPath);
    }
    
    // Also refresh if there's a refresh flag in the state
    if (location.state?.refresh) {
      refreshData(true);
      
      // Clear the refresh flag
      window.history.replaceState({}, document.title, currentPath);
    }
  }, [location]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Listen for visibility changes (when user returns to the tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && lastRefreshTime) {
        const timeSinceLastRefresh = new Date() - lastRefreshTime;
        // Refresh if it's been more than 2 minutes since last refresh
        if (timeSinceLastRefresh > 2 * 60 * 1000) {
          refreshData();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [lastRefreshTime]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-700">Loading Dashboard...</div>
          <div className="text-sm text-gray-500 mt-2">Preparing your trainer workspace</div>
        </div>
      </div>
    );
  }

 

  const filteredCourses = (courses || []).filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-500">Trainer Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={refreshData}
                disabled={loading}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <ArrowPathIcon className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TRAINER Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your courses and track student progress</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={refreshData}
                disabled={loading}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <ArrowPathIcon className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
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

      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed inset-0 z-30 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <XMarkIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            {['overview', 'courses', 'analytics', 'students', 'certificates'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab === 'certificates' ? 'Certificate Approvals' : tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Desktop Tabs */}
        <div className="hidden lg:block mb-6">
          <div className="bg-white rounded-xl shadow-sm p-1">
            <div className="flex space-x-1">
              {['overview', 'courses', 'analytics', 'students', 'certificates'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'certificates' ? 'Certificate Approvals' : tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Courses', value: stats?.totalCourses || 0, icon: BookOpenIcon, color: 'blue', trend: `${stats?.publishedCourses || 0} published` },
                  { label: 'Total Students', value: (stats?.totalStudents || 0).toLocaleString(), icon: UserGroupIcon, color: 'green', trend: '+12% growth' },
                  { label: 'Active Students', value: (stats?.totalActiveStudents || 0).toLocaleString(), icon: UserIcon, color: 'indigo', trend: 'Currently learning' },
                  { label: 'Completed Students', value: (stats?.totalCompletedStudents || 0).toLocaleString(), icon: CheckCircleIcon, color: 'emerald', trend: 'Course completed' },
                  { label: 'Lesson Completions', value: (stats?.totalLessonCompletions || 0).toLocaleString(), icon: AcademicCapIcon, color: 'purple', trend: 'Total lessons' },
                  { label: 'Avg Student Progress', value: `${stats?.averageStudentProgress || 0}%`, icon: ArrowTrendingUpIcon, color: 'teal', trend: 'Per student' },
                  { label: 'Completion Rate', value: `${stats?.averageCompletionRate || 0}%`, icon: ChartBarIcon, color: 'orange', trend: 'Course success' },
                  { label: 'Avg Rating', value: stats?.averageRating?.toFixed(1) || '0.0', icon: StarIcon, color: 'yellow', trend: 'Student feedback' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {stat.trend}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {generateRecentActivity(courses, assignmentsData).length > 0 ? (
                    generateRecentActivity(courses, assignmentsData).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <activity.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                            <span className="font-medium">{activity.course}</span>
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No recent activity</p>
                      <p className="text-sm text-gray-400 mt-1">Start creating courses and assignments to see activity here</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'courses' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search courses..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                    <Link 
                      to="/trainer/create-course"
                      state={{ from: location.pathname }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Create Course
                    </Link>
                  </div>
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.length > 0 ? (
                  filteredCourses.slice(0, 6).map((course) => (
                    <motion.div
                      key={course._id || course.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center relative">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <BookOpenIcon className="h-16 w-16 text-white opacity-50" />
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            course.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : course.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {course.status || 'draft'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-1">
                            <StarIcon className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">
                              {course.rating ? course.rating.toFixed(1) : '0.0'}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({course.ratingCount || course.reviews?.length || 0})
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {course.enrolledStudents || course.enrollmentCount || 0} students
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900">
                            {course.price ? `$${course.price}` : 'Free'}
                          </div>
                          <div className="flex space-x-2">
                            <Link 
                              to={`/trainer/courses/${course._id || course.id}/edit`}
                              state={{ from: location.pathname }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit course"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </Link>
                            <button 
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete course"
                              onClick={() => handleDeleteCourse(course._id || course.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {/* ✅ ENHANCED: Comprehensive Student Progress Information */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">{course.totalEnrolled || 0}</div>
                              <div className="text-xs text-gray-600">Total Enrolled</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">{course.completedStudents || 0}</div>
                              <div className="text-xs text-gray-600">Completed</div>
                            </div>
                          </div>
                          
                          {/* Course Completion Rate with Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">Course Completion Rate</span>
                              <span className="font-semibold text-green-600">{course.completionRate || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.completionRate || 0}%` }}
              ></div>
                            </div>
                          </div>
                          
                          {/* Average Student Progress with Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">Average Student Progress</span>
                              <span className="font-semibold text-blue-600">{course.averageProgress || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.averageProgress || 0}%` }}
              ></div>
                            </div>
                          </div>
                          
                          {/* Additional Metrics */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-emerald-600">{course.activeStudents || 0}</div>
                              <div className="text-xs text-gray-600">Active Students</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-600">{course.totalCompletions || 0}</div>
                              <div className="text-xs text-gray-600">Lessons Completed</div>
                            </div>
                          </div>
                          
                          {/* Progress Breakdown - Top Students */}
                          {course.progressBreakdown && course.progressBreakdown.length > 0 && (
                            <div className="mt-4">
                              <div className="text-xs text-gray-500 mb-2 font-medium">🏆 Top Performing Students:</div>
                              <div className="space-y-2">
                                {course.progressBreakdown
                                  .sort((a, b) => b.completionRate - a.completionRate)
                                  .slice(0, 3)
                                  .map((student, index) => (
                                    <div key={student.studentId} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                          {index + 1}
                                        </div>
                                        <div>
                                          <div className="font-medium text-gray-900">{student.studentName}</div>
                                          <div className="text-gray-500">{student.lessonsCompleted}/{student.totalLessons} lessons</div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-semibold text-green-600">{student.completionRate}%</div>
                                        <div className="text-gray-400 text-xs">
                                          {student.lastAccessed ? new Date(student.lastAccessed).toLocaleDateString() : 'Never'}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Recent Activity */}
                          {course.recentActivity && course.recentActivity.length > 0 && (
                            <div className="mt-4">
                              <div className="text-xs text-gray-500 mb-2 font-medium">📚 Recent Activity:</div>
                              <div className="space-y-1">
                                {course.recentActivity.slice(0, 2).map((activity, index) => (
                                  <div key={index} className="flex items-center justify-between text-xs bg-blue-50 p-2 rounded-lg">
                                    <span className="font-medium text-blue-900">{activity.studentName}</span>
                                    <span className="text-blue-600">
                                      {new Date(activity.activity).toLocaleDateString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Engagement Indicator */}
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Course Engagement</span>
                              <div className="flex items-center space-x-1">
                                {course.completionRate > 70 ? (
                                  <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-green-600 font-medium">High</span>
                                  </>
                                ) : course.completionRate > 40 ? (
                                  <>
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                    <span className="text-yellow-600 font-medium">Medium</span>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-red-600 font-medium">Low</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery || filterStatus !== 'all' 
                        ? 'Try adjusting your search or filters' 
                        : 'Get started by creating your first course'
                      }
                    </p>
                    {!searchQuery && filterStatus === 'all' && (
                      <Link 
                        to="/trainer/create-course"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create Your First Course
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="text-2xl font-bold text-gray-900">${(stats?.totalRevenue || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">This Month</span>
                      <span className="text-lg font-semibold text-green-600">+$12,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Growth Rate</span>
                      <span className="text-lg font-semibold text-blue-600">+18.5%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="text-2xl font-bold text-gray-900">{stats?.averageRating || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Reviews</span>
                      <span className="text-lg font-semibold text-gray-900">{stats?.totalReviews || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="text-lg font-semibold text-green-600">78.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserGroupIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Management</h3>
                  <p className="text-gray-600 mb-6">Advanced student analytics and management features coming soon</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stats?.totalStudents || 0}</div>
                      <div className="text-sm text-gray-600">Total Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">89%</div>
                      <div className="text-sm text-gray-600">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">4.8</div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'certificates' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CertificateApprovals />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
