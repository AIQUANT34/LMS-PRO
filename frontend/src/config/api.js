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
    VERIFY_TRAINER: (id) => `/users/verify-trainer/${id}`,
    APPLY_TRAINER: '/users/apply-trainer',
    TRAINER_APPLICATIONS: '/users/trainer-applications',
    TRAINER_APPLICATION: (userId) => `/users/trainer-application/${userId}`,
    REVIEW_TRAINER_APPLICATION: (id) => `/users/trainer-application/${id}/review`,
    GET_ALL: '/users', // Admin endpoint to get all users
    GET_PROFILE: (id) => `/users/${id}`, // Get user profile
    UPDATE: (id) => `/users/${id}`, // Admin endpoint to update user
    DELETE: (id) => `/users/${id}`, // Admin endpoint to delete user
    UPLOAD_PROFILE_PICTURE: (id) => `/users/${id}/profile-picture`, // Upload profile picture
    GET_PROFILE_PICTURE: (id) => `/users/${id}/profile-picture`, // Get profile picture
    CHANGE_PASSWORD: '/users/change-password', // Change password
  },
  
  // Course endpoints (includes trainer operations)
  COURSES: {
    GET_ALL: '/courses/public',
    GET_BY_ID: (id) => `/courses/${id}`, // Use general courses endpoint
    CREATE: '/trainer/courses/create', // Fixed to match backend TrainerController route
    UPDATE: (id) => `/trainer/courses/${id}`, // Use trainer endpoint for updates
    DELETE: (id) => `/trainer/courses/${id}`, // Use trainer endpoint for deletion
    GET_TRAINER_COURSES: '/trainer/courses', // Fixed route
    SUBMIT_REVIEW: (id) => `/courses/${id}/submit-review`,
    REVIEW: (id) => `/courses/${id}/review`,
    ARCHIVE: (id) => `/courses/${id}/archive`,
    MOVE_TO_DRAFT: (id) => `/courses/${id}/move-draft`,
  },
  
  // Trainer endpoints (removed to avoid conflicts - use COURSES endpoints)
  TRAINER: {
    // These endpoints now handled by CoursesModule to avoid route conflicts
    CREATE_COURSE: '/trainer/courses/create', // Fixed to match backend TrainerController route
    GET_COURSES: '/trainer/courses', // Fixed route
    UPDATE_COURSE: (id) => `/trainer/courses/${id}`, // Use trainer endpoint
    DELETE_COURSE: (id) => `/trainer/courses/${id}`, // Use trainer endpoint
    SUBMIT_REVIEW: (id) => `/courses/${id}/submit-review`, // Use standard
    ARCHIVE: (id) => `/courses/${id}/archive`, // Use standard
    MOVE_TO_DRAFT: (id) => `/courses/${id}/move-draft`, // Use standard
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
    UPDATE_LAST_ACCESSED: (courseId) => `/enrollments/update-last-accessed`,
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
      UPDATE_VIDEO_PROGRESS: (lessonId) => `/learning/video/${lessonId}/progress`,
      STUDENT_COMPLETIONS: '/learning/videohistory/student-completions',
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
    MY: '/certificates/my',
    GET: (id) => `/certificates/${id}`,
    DOWNLOAD: (id) => `/certificates/${id}/download`,
    SHARE: (id) => `/certificates/${id}/share`,
    APPROVE: (id) => `/certificates/approve/${id}`,
    VERIFY: (reference) => `/certificates/verify/${reference}`,
    PENDING_APPROVALS: '/certificates/pending-approvals',
    GENERATE: '/certificates/generate',
  },
  
  // Analytics endpoints
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    SYSTEM: '/analytics/system',
    REVENUE: '/analytics/revenue',
    COURSE: (courseId) => `/analytics/course/${courseId}`,
    STUDENT: '/analytics/student',
    TRAINER: '/analytics/trainer',
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
