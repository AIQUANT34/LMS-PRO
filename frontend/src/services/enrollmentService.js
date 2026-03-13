import { apiService } from './apiService';

export const enrollmentService = {
  // Test enrollment service
  testEnrollments: async () => {
    return await apiService.get('/api/enrollments/test');
  },

  // Enroll in a course
  enroll: async (courseId) => {
    return await apiService.post('/api/enrollments/enroll', { courseId });
  },

  // Get user's enrolled courses
  getMyCourses: async () => {
    return await apiService.get('/api/enrollments/my-courses');
  },

  // Check if user is enrolled in specific course
  checkEnrollment: async (courseId) => {
    return await apiService.get(`/api/enrollments/check/${courseId}`);
  },

  // Complete enrollment
  completeEnrollment: async (enrollmentId) => {
    return await apiService.post('/api/enrollments/complete', { enrollmentId });
  },

  // Get enrollment progress
  getProgress: async (courseId) => {
    return await apiService.get(`/api/learning/progress/course/${courseId}`);
  },

  // Mark lesson complete
  markLessonComplete: async (lessonId) => {
    return await apiService.post(`/api/learning/progress/complete/${lessonId}`);
  },

  // Mark lesson incomplete
  markLessonIncomplete: async (lessonId) => {
    return await apiService.put(`/api/learning/progress/incomplete/${lessonId}`);
  },

  // Update video progress
  updateVideoProgress: async (lessonId, progressData) => {
    return await apiService.put(`/api/learning/video/${lessonId}/progress`, progressData);
  },

  // Get course certificate
  getCertificate: async (courseId) => {
    return await apiService.get(`/api/learning/certificate/${courseId}`);
  },

  // Resume course
  resumeCourse: async (courseId) => {
    return await apiService.get(`/api/learning/resume/${courseId}`);
  }
};
