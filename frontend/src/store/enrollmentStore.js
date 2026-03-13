import { create } from 'zustand';
import { enrollmentService } from '../services/enrollmentService';
import toast from 'react-hot-toast';

export const useEnrollmentStore = create((set, get) => ({
  // State
  enrolledCourses: [],
  enrollmentStatus: {}, // { courseId: 'enrolled' | 'not_enrolled' | 'loading' }
  loading: false,
  error: null,

  // Actions
  fetchEnrollments: async () => {
    try {
      set({ loading: true, error: null });
      
      // First test if the enrollment service is working
      try {
        const testResponse = await enrollmentService.testEnrollments();
        // Silent test - no console log to prevent HTML errors
      } catch (testError) {
        // Silent test failure - no console log
      }
      
      const response = await enrollmentService.getMyCourses();
      
      // Transform response to status map
      const statusMap = {};
      const courses = response.data || [];
      
      courses.forEach(course => {
        statusMap[course.courseId] = 'enrolled';
      });
      
      set({ 
        enrolledCourses: courses, 
        enrollmentStatus: statusMap,
        loading: false 
      });
    } catch (error) {
      // Provide empty state instead of error
      set({ 
        enrolledCourses: [], 
        enrollmentStatus: {},
        loading: false,
        error: null  // Don't show error to user
      });
      // Don't show toast error - just use empty state
    }
  },

  checkEnrollment: async (courseId) => {
    try {
      set(state => ({
        enrollmentStatus: { ...state.enrollmentStatus, [courseId]: 'loading' }
      }));
      
      const response = await enrollmentService.checkEnrollment(courseId);
      
      set(state => ({
        enrollmentStatus: { 
          ...state.enrollmentStatus, 
          [courseId]: response.data?.isEnrolled ? 'enrolled' : 'not_enrolled' 
        }
      }));
      
      return response.data?.isEnrolled || false;
    } catch (error) {
      set(state => ({
        enrollmentStatus: { 
          ...state.enrollmentStatus, 
          [courseId]: 'not_enrolled' 
        }
      }));
      return false;
    }
  },

  enroll: async (courseId, courseTitle) => {
    const currentState = get();
    
    // Prevent double enrollment
    if (currentState.enrollmentStatus[courseId] === 'enrolled') {
      toast.info('You are already enrolled in this course');
      return;
    }
    
    if (currentState.enrollmentStatus[courseId] === 'loading') {
      return;
    }

    try {
      set(state => ({
        enrollmentStatus: { ...state.enrollmentStatus, [courseId]: 'loading' }
      }));

      const response = await enrollmentService.enroll(courseId);
      
      if (response.data.status === 'enrolled_successfully') {
        // Optimistic update
        set(state => ({
          enrolledCourses: [...state.enrolledCourses, response.data.enrollment],
          enrollmentStatus: { ...state.enrollmentStatus, [courseId]: 'enrolled' }
        }));
        
        toast.success(`Successfully enrolled in "${courseTitle}"!`);
        
        // Refetch all enrollments to ensure consistency
        get().fetchEnrollments();
        
      } else if (response.data.status === 'already_enrolled') {
        set(state => ({
          enrollmentStatus: { ...state.enrollmentStatus, [courseId]: 'enrolled' }
        }));
        toast.info('You are already enrolled in this course');
      }
      
      return response.data;
      
    } catch (error) {
      set(state => ({
        enrollmentStatus: { ...state.enrollmentStatus, [courseId]: 'not_enrolled' },
        error: error.response?.data?.message || 'Failed to enroll'
      }));
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Please login to enroll in courses');
      } else if (error.response?.status === 404) {
        toast.error('Course not found');
      } else if (error.response?.status === 409) {
        toast.error('You are already enrolled in this course');
      } else {
        toast.error(error.response?.data?.message || 'Failed to enroll in course');
      }
      
      throw error;
    }
  },

  isEnrolled: (courseId) => {
    const currentState = get();
    return currentState.enrollmentStatus[courseId] === 'enrolled';
  },

  isLoading: (courseId) => {
    const currentState = get();
    return currentState.enrollmentStatus[courseId] === 'loading';
  },

  clearError: () => set({ error: null })
}));
