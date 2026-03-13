// API Configuration
export const API_BASE_URL = 'http://localhost:3001/api'; // Direct backend URL to avoid proxy issues

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    CREATE_ADMIN: '/auth/create-admin',
  },
  
  // User endpoints
  USERS: {
    VERIFY_INSTRUCTOR: (id) => `/users/verify-instructor/${id}`,
    APPLY_INSTRUCTOR: '/users/apply-instructor',
    INSTRUCTOR_APPLICATIONS: '/users/instructor-applications',
    INSTRUCTOR_APPLICATION: (userId) => `/users/instructor-application/${userId}`,
    REVIEW_INSTRUCTOR_APPLICATION: (id) => `/users/instructor-application/${id}/review`,
    GET_ALL: '/users', // Admin endpoint to get all users
    GET_PROFILE: (id) => `/users/${id}`, // Get user profile
    UPDATE: (id) => `/users/${id}`, // Admin endpoint to update user
    DELETE: (id) => `/users/${id}`, // Admin endpoint to delete user
    UPLOAD_PROFILE_PICTURE: (id) => `/users/${id}/profile-picture`, // Upload profile picture
    GET_PROFILE_PICTURE: (id) => `/users/${id}/profile-picture`, // Get profile picture
    CHANGE_PASSWORD: '/users/change-password', // Change password
  },
  
  // Course endpoints
  COURSES: {
    GET_ALL: '/courses/public',
    GET_BY_ID: (id) => `/courses/${id}`,
    CREATE: '/courses',
    UPDATE: (id) => `/courses/${id}`,
    DELETE: (id) => `/courses/${id}`,
    GET_INSTRUCTOR_COURSES: '/courses/instructor',
    SUBMIT_REVIEW: (id) => `/courses/${id}/submit-review`,
    REVIEW: (id) => `/courses/${id}/review`,
    ARCHIVE: (id) => `/courses/${id}/archive`,
    MOVE_TO_DRAFT: (id) => `/courses/${id}/move-draft`,
  },
  
  // Trainer endpoints
  TRAINER: {
    CREATE_COURSE: '/trainer/courses/create',
    GET_COURSES: '/trainer/courses',
    UPDATE_COURSE: (id) => `/trainer/courses/${id}`,
    DELETE_COURSE: (id) => `/trainer/courses/${id}`,
    SUBMIT_REVIEW: (id) => `/trainer/courses/${id}/submit-review`,
    ARCHIVE: (id) => `/trainer/courses/${id}/archive`,
    MOVE_TO_DRAFT: (id) => `/trainer/courses/${id}/move-draft`,
    ASSIGNMENTS: {
      GET_ALL: '/trainer/assignments',
      CREATE: '/trainer/assignments',
      GET_BY_ID: (id) => `/trainer/assignments/${id}`,
      UPDATE: (id) => `/trainer/assignments/${id}`,
      DELETE: (id) => `/trainer/assignments/${id}`,
      DUPLICATE: (id) => `/trainer/assignments/${id}/duplicate`,
      BULK_ACTION: '/trainer/assignments/bulk',
    },
  },
  
  // Enrollment endpoints
  ENROLLMENTS: {
    ENROLL: (courseId) => `/enrollments/${courseId}`,
    COMPLETE: '/enrollments/complete',
    MY_COURSES: '/enrollments/my-courses',
  },
  
  // Learning endpoints
  LEARNING: {
    LESSONS: {
      GET_BY_COURSE: (courseId) => `/learning/courses/${courseId}/lessons`,
      CREATE: (courseId) => `/learning/lessons/${courseId}`,
      GET_BY_ID: (lessonId) => `/learning/lessons/${lessonId}`,
      UPDATE: (lessonId) => `/learning/lessons/${lessonId}`,
      DELETE: (lessonId) => `/learning/lessons/${lessonId}`,
    },
    PROGRESS: {
      COMPLETE_LESSON: (lessonId) => `/learning/progress/complete/${lessonId}`,
      INCOMPLETE_LESSON: (lessonId) => `/learning/progress/incomplete/${lessonId}`,
      GET_COURSE_PROGRESS: (courseId) => `/learning/progress/course/${courseId}`,
      VIDEO_PLAYBACK: (lessonId) => `/learning/video/${lessonId}/playback`,
      VIDEO_PROGRESS: (lessonId) => `/learning/video/${lessonId}/progress`,
    },
    QUIZ: {
      SUBMIT: (lessonId) => `/learning/quiz/${lessonId}/submit`,
    },
    CERTIFICATE: (courseId) => `/learning/certificate/${courseId}`,
    DASHBOARD: '/learning/dashboard',
    RESUME: (courseId) => `/learning/resume/${courseId}`,
  },
  
  // Assessment endpoints
  ASSESSMENTS: {
    GET_BY_COURSE: (courseId) => `/assessments/course/${courseId}`,
    SUBMIT: (assessmentId) => `/assessments/${assessmentId}/submit`,
    MY_SUBMISSION: (assessmentId) => `/assessments/${assessmentId}/my-submission`,
    REVIEW_SUBMISSION: (submissionId) => `/assessments/submission/${submissionId}/review`,
    GET_SUBMISSIONS: (assessmentId) => `/assessments/${assessmentId}/submissions`,
  },
  
  // Certificate endpoints
  CERTIFICATES: {
    APPROVE: (id) => `/certificates/approve/${id}`,
    VERIFY: (reference) => `/certificates/verify/${reference}`,
  },
  
  // Analytics endpoints
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    SYSTEM: '/analytics/system',
    REVENUE: '/analytics/revenue',
    COURSE: (courseId) => `/analytics/course/${courseId}`,
    STUDENT: '/analytics/student',
    INSTRUCTOR: '/analytics/instructor',
    LEARNING_PATH: '/analytics/learning-path',
  },
  
  // AI endpoints
  AI: {
    ASK: '/ai/ask',
    GENERATE_QUIZ: '/ai/generate-quiz',
    PROGRESS_SUMMARY: (studentId, courseId) => `/ai/progress-summary/${studentId}/${courseId}`,
    RECOMMENDATIONS: (studentId, courseId) => `/ai/recommendations/${studentId}/${courseId}`,
  },
  
  // Upload endpoints
  UPLOAD: {
    FILE: '/upload/file',
    GENERATE_S3_URL: '/s3-upload/generate-upload-url',
    DELETE_S3_FILE: '/s3-upload/delete-file',
    GET_S3_METADATA: '/s3-upload/get-file-metadata',
  },
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Get auth headers with JWT token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token 
    ? { ...DEFAULT_HEADERS, 'Authorization': `Bearer ${token}` }
    : DEFAULT_HEADERS;
};
