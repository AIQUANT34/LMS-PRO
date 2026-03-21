# LMS Frontend API Documentation

## Overview
This document outlines all API integrations between the frontend and backend systems for the Corporate Learning Management System (LMS).

## Base Configuration
- **Base URL**: `/api` (proxied to `http://localhost:3000`)
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`

## API Services Structure

### 1. Authentication Service (`/services/apiService.js`)
**Endpoints:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/create-admin` - Create admin user

**Usage:**
```javascript
import { apiService } from '../services/apiService';
const result = await apiService.post('/auth/login', { email, password });
```

### 2. Course Service (`/services/apiService.js`)
**Endpoints:**
- `GET /api/courses/public` - Get all published courses
- `GET /api/courses/instructor` - Get instructor's courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

**Usage:**
```javascript
const courses = await apiService.get('/courses/public');
```

### 3. Enrollment Service (`/services/enrollmentService.js`)
**Endpoints:**
- `POST /api/enrollments/:courseId` - Enroll in course
- `GET /api/enrollments/my-courses` - Get user's enrolled courses
- `POST /api/enrollments/complete` - Mark enrollment as complete
- `GET /api/learning/progress/course/:courseId` - Get course progress

**Usage:**
```javascript
import { enrollmentService } from '../services/enrollmentService';
await enrollmentService.enroll(courseId);
```

### 4. AI Service (`/services/aiService.js`)
**Endpoints:**
- `POST /api/ai/ask` - Ask AI assistant a question
- `POST /api/ai/generate-quiz` - Generate quiz for lesson
- `POST /api/ai/progress-summary/:employeeId/:courseId` - Get progress summary
- `GET /api/ai/recommendations/:employeeId/:courseId` - Get recommendations

**Usage:**
```javascript
import { aiService } from '../services/aiService';
const response = await aiService.askQuestion(question, courseId, lessonId);
```

### 5. Certificate Service (`/services/certificateService.js`)
**Endpoints:**
- `GET /api/certificates/my` - Get user's certificates
- `GET /api/certificates/:id` - Get specific certificate
- `POST /api/learning/certificate/:courseId` - Generate certificate
- `GET /api/certificates/verify/:reference` - Verify certificate
- `GET /api/certificates/:id/download` - Download certificate PDF

**Usage:**
```javascript
import { certificateService } from '../services/certificateService';
const certificate = await certificateService.getCertificate(id);
```

## Component Integration Map

### Employee Dashboard
- **API Calls:**
  - `GET /api/learning/dashboard` - Dashboard statistics
  - `GET /api/enrollments/my-courses` - Enrolled programs

### Trainer Dashboard
- **API Calls:**
  - `GET /api/courses/instructor` - Instructor's courses
  - `POST /api/courses/:id/publish` - Publish course
  - `DELETE /api/courses/:id` - Delete course

### Course Marketplace
- **API Calls:**
  - `GET /api/courses/public` - All available courses
  - `POST /api/enrollments/:courseId` - Enroll in course

### AI Assistant
- **API Calls:**
  - `POST /api/ai/ask` - Send question to AI
  - Fallback to mock responses if service unavailable

### Certificate Page
- **API Calls:**
  - `GET /api/certificates/:id` - Certificate details
  - `GET /api/certificates/:id/download` - Download PDF
  - `POST /api/certificates/:id/share` - Share certificate

## Error Handling

### Global Error Handling
All API calls are wrapped in try-catch blocks with:
- Console error logging
- User-friendly toast notifications
- Fallback to mock data when appropriate

### Authentication Errors
- 401 responses automatically redirect to login
- Tokens are cleared from localStorage
- User is logged out from the store

### Network Errors
- Loading states are shown during API calls
- Error messages are displayed to users
- Retry mechanisms for critical operations

## Data Transformation

### Backend to Frontend Mapping
```javascript
// Course data transformation
{
  _id: course._id,
  title: course.title,
  trainer: course.trainerId?.name,
  rating: course.ratings.average,
  employees: course.enrollmentCount,
  // ... other mappings
}
```

### Corporate LMS Terminology
- `student` → `employee`
- `instructor` → `trainer`
- `course` → `training program`
- `lesson` → `training module`

## Development Notes

### Vite Proxy Configuration
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

### Environment Variables
- `VITE_API_BASE_URL` - API base URL (default: `/api`)
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## Testing API Connections

### Test Component
Use the `TestAPI` component to verify API connections:
```javascript
import TestAPI from '../components/TestAPI';
```

### Manual Testing
1. Ensure backend is running on port 3000
2. Frontend should be running on port 5173
3. Check browser console for API errors
4. Verify network requests in DevTools

## Production Considerations

### Security
- All API calls use HTTPS in production
- JWT tokens have expiration handling
- Sensitive data is not stored in localStorage

### Performance
- API calls are debounced where appropriate
- Large datasets are paginated
- Images are optimized and cached

### Scalability
- API service layer allows for easy endpoint updates
- Component-level error handling prevents cascade failures
- Mock data fallbacks ensure graceful degradation
