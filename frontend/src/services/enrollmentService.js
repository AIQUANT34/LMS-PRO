import { apiService } from './apiService';
import { API_ENDPOINTS } from '../config/api';

export const enrollmentService = {
  // Test enrollment service
  testEnrollments: async () => {
    return await apiService.get('/enrollments/test');
  },

  // Enroll in a course
  enroll: async (courseId) => {
    console.log('🔍 Service Debug - courseId being sent to API:', courseId);
    console.log('🔍 Service Debug - typeof courseId:', typeof courseId);
    
    try {
      const response = await apiService.post(API_ENDPOINTS.ENROLLMENTS.ENROLL(courseId));
      console.log('🔍 Service Debug - Full API response:', response);
      console.log('🔍 Service Debug - response.data:', response.data);
      console.log('🔍 Service Debug - response.status:', response.status);
      return response;
    } catch (error) {
      console.log('🔍 Service Debug - API Error:', error);
      console.log('🔍 Service Debug - Error response:', error.response);
      console.log('🔍 Service Debug - Error response data:', error.response?.data);
      console.log('🔍 Service Debug - Error message:', error.response?.data?.message);
      console.log('🔍 Service Debug - Error error:', error.response?.data?.error);
      console.log('🔍 Service Debug - Full error object:', JSON.stringify(error.response?.data, null, 2));
      throw error;
    }
  },

  // Get user's enrolled courses
  getMyCourses: async () => {
    return await apiService.get('/enrollments/my-courses');
  },

  // Check if user is enrolled in specific course
  checkEnrollment: async (courseId) => {
    return await apiService.get(`/enrollments/check/${courseId}`);
  },

  // Complete enrollment
  completeEnrollment: async (enrollmentId) => {
    return await apiService.post('/enrollments/complete', { enrollmentId });
  },

  // Get enrollment progress
  getProgress: async (courseId) => {
    return await apiService.get(`/learning/progress/course/${courseId}`);
  },

  // Mark lesson complete
  markLessonComplete: async (lessonId) => {
    return await apiService.post(`/learning/progress/complete/${lessonId}`);
  },

  // Mark lesson incomplete
  markLessonIncomplete: async (lessonId) => {
    return await apiService.put(`/learning/progress/incomplete/${lessonId}`);
  },

  // Update video progress
  updateVideoProgress: async (lessonId, progressData) => {
    return await apiService.put(`/learning/video/${lessonId}/progress`, progressData);
  },

  // Get course certificate
  getCertificate: async (courseId) => {
    return await apiService.get(`/learning/certificate/${courseId}`);
  },

  // Resume course
  resumeCourse: async (courseId) => {
    return await apiService.get(`/learning/resume/${courseId}`);
  }
};
