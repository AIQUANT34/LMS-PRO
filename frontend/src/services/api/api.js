import axiosInstance from './axiosInstance';

// Auth API
export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: () => axiosInstance.post('/auth/logout'),
  refreshToken: () => axiosInstance.post('/auth/refresh'),
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => axiosInstance.post('/auth/reset-password', { token, newPassword }),
};

// User API
export const userAPI = {
  getProfile: () => axiosInstance.get('/users/profile'),
  updateProfile: (data) => axiosInstance.put('/users/profile', data),
  changePassword: (data) => axiosInstance.put('/users/change-password', data),
  getUsers: (params) => axiosInstance.get('/users', { params }),
  updateUser: (id, data) => axiosInstance.put(`/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
};

// Course API
export const courseAPI = {
  getCourses: (params) => axiosInstance.get('/courses', { params }),
  getCourse: (id) => axiosInstance.get(`/courses/${id}`),
  createCourse: (data) => axiosInstance.post('/courses', data),
  updateCourse: (id, data) => axiosInstance.put(`/courses/${id}`, data),
  deleteCourse: (id) => axiosInstance.delete(`/courses/${id}`),
  publishCourse: (id) => axiosInstance.post(`/courses/${id}/publish`),
  getMyCourses: () => axiosInstance.get('/courses/my'),
  getPublishedCourses: (params) => axiosInstance.get('/courses/published', { params }),
  searchCourses: (query) => axiosInstance.get('/courses/search', { params: { q: query } }),
};

// Enrollment API
export const enrollmentAPI = {
  enroll: (courseId) => axiosInstance.post(`/enrollments/${courseId}`),
  getMyEnrollments: () => axiosInstance.get('/enrollments/my'),
  getEnrollment: (id) => axiosInstance.get(`/enrollments/${id}`),
  updateProgress: (enrollmentId, data) => axiosInstance.put(`/enrollments/${enrollmentId}/progress`, data),
  getCourseEnrollments: (courseId) => axiosInstance.get(`/enrollments/course/${courseId}`),
};

// Assessment API
export const assessmentAPI = {
  getAssessments: (courseId) => axiosInstance.get(`/assessments/course/${courseId}`),
  getAssessment: (id) => axiosInstance.get(`/assessments/${id}`),
  createAssessment: (data) => axiosInstance.post('/assessments', data),
  updateAssessment: (id, data) => axiosInstance.put(`/assessments/${id}`, data),
  deleteAssessment: (id) => axiosInstance.delete(`/assessments/${id}`),
  submitAssignment: (data) => axiosInstance.post('/assessments/submit', data),
  getSubmissions: (assessmentId) => axiosInstance.get(`/assessments/${assessmentId}/submissions`),
  gradeSubmission: (submissionId, data) => axiosInstance.put(`/assessments/submissions/${submissionId}/grade`, data),
};

// Certificate API
export const certificateAPI = {
  getCertificates: () => axiosInstance.get('/certificates/my'),
  getCertificate: (id) => axiosInstance.get(`/certificates/${id}`),
  generateCertificate: (enrollmentId) => axiosInstance.post(`/certificates/generate/${enrollmentId}`),
  verifyCertificate: (id) => axiosInstance.get(`/certificates/verify/${id}`),
  downloadCertificate: (id) => axiosInstance.get(`/certificates/${id}/download`, { responseType: 'blob' }),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axiosInstance.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('video', file);
    return axiosInstance.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post('/upload/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Learning API
export const learningAPI = {
  getCourseProgress: (courseId) => axiosInstance.get(`/learning/progress/${courseId}`),
  markLessonComplete: (courseId, lessonId) => axiosInstance.post(`/learning/complete/${courseId}/${lessonId}`),
  getNotes: (courseId) => axiosInstance.get(`/learning/notes/${courseId}`),
  saveNotes: (courseId, notes) => axiosInstance.post(`/learning/notes/${courseId}`, { notes }),
  getBookmarks: (courseId) => axiosInstance.get(`/learning/bookmarks/${courseId}`),
  addBookmark: (courseId, lessonId) => axiosInstance.post(`/learning/bookmark/${courseId}/${lessonId}`),
  removeBookmark: (courseId, lessonId) => axiosInstance.delete(`/learning/bookmark/${courseId}/${lessonId}`),
};

// AI Assistant API
export const aiAPI = {
  askQuestion: (data) => axiosInstance.post('/ai/ask', data),
  generateQuiz: (courseData) => axiosInstance.post('/ai/generate-quiz', courseData),
  getProgressSummary: (courseId) => axiosInstance.get(`/ai/progress-summary/${courseId}`),
  getRecommendations: (userId) => axiosInstance.get(`/ai/recommendations/${userId}`),
};

export default {
  auth: authAPI,
  user: userAPI,
  course: courseAPI,
  enrollment: enrollmentAPI,
  assessment: assessmentAPI,
  certificate: certificateAPI,
  upload: uploadAPI,
  learning: learningAPI,
  ai: aiAPI,
};
