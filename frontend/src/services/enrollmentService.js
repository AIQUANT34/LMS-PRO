import { apiService } from './apiService';

export const enrollmentService = {
  // Test enrollment service
  testEnrollments: async () => {
    return await apiService.get('/enrollments/test');
  },

  // Enroll in a course
  enroll: async (courseId) => {
    return await apiService.post('/enrollments/enroll', { courseId });
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
