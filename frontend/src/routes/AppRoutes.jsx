import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Layouts
const StudentLayout = lazy(() => import('../components/layout/StudentLayout'));
const InstructorLayout = lazy(() => import('../components/layout/InstructorLayout'));
const AdminLayout = lazy(() => import('../components/layout/AdminLayout'));
const AuthLayout = lazy(() => import('../components/layout/AuthLayout'));

// Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));

// Student Pages
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));
const MyCoursesStudent = lazy(() => import('../pages/student/MyCourses'));
const CoursePlayer = lazy(() => import('../pages/student/CoursePlayer'));
const StudentProfile = lazy(() => import('../pages/student/StudentProfile'));
const QuizSystem = lazy(() => import('../pages/student/QuizSystem'));
const CertificatePage = lazy(() => import('../pages/student/CertificatePage'));
const AssignmentSystem = lazy(() => import('../pages/student/AssignmentSystem'));
const LiveClassroom = lazy(() => import('../pages/live/LiveClassroom'));
const AIAssistant = lazy(() => import('../pages/ai/AIAssistant'));
const GamificationSystem = lazy(() => import('../pages/gamification/GamificationSystem'));

// Instructor Pages
const InstructorDashboard = lazy(() => import('../pages/instructor/InstructorDashboard'));
const MyCoursesInstructor = lazy(() => import('../pages/instructor/MyCourses'));
const CreateCourse = lazy(() => import('../pages/instructor/CreateCourse'));
const CourseBuilder = lazy(() => import('../pages/instructor/CourseBuilder'));
const EditCourse = lazy(() => import('../pages/instructor/EditCourse'));
const CourseAnalytics = lazy(() => import('../pages/instructor/CourseAnalytics'));
const InstructorProfile = lazy(() => import('../pages/instructor/InstructorProfile'));
const GradingSystem = lazy(() => import('../pages/instructor/GradingSystem'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const CourseManagement = lazy(() => import('../pages/admin/CourseManagement'));
const InstructorApproval = lazy(() => import('../pages/admin/InstructorApproval'));
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile'));
const CourseDetail = lazy(() => import('../pages/course/CourseDetail'));
const CourseSearch = lazy(() => import('../pages/course/CourseSearch'));

// Common Pages
const HomePage = lazy(() => import('../pages/common/HomePage'));
const AboutPage = lazy(() => import('../pages/common/AboutPage'));
const ContactPage = lazy(() => import('../pages/common/ContactPage'));
const NotFoundPage = lazy(() => import('../pages/common/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('../pages/common/UnauthorizedPage'));

// Course Pages
const CourseMarketplace = lazy(() => import('../pages/course/CourseMarketplace'));

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/courses" element={<CourseMarketplace />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/search" element={<CourseSearch />} />

        {/* Auth Routes */}
        <Route path="/login" element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        } />
        <Route path="/register" element={
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        } />
        <Route path="/forgot-password" element={
          <AuthLayout>
            <ForgotPasswordPage />
          </AuthLayout>
        } />

        {/* Student Routes */}
        <Route path="/student/*" element={
          <StudentLayout>
            <Routes>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<MyCoursesStudent />} />
              <Route path="courses/:id/player" element={<CoursePlayer />} />
              <Route path="courses/:id/quiz/:quizId" element={<QuizSystem />} />
              <Route path="courses/:id/assignment/:assignmentId" element={<AssignmentSystem />} />
              <Route path="courses/:id/certificate" element={<CertificatePage />} />
              <Route path="live/:sessionId" element={<LiveClassroom />} />
              <Route path="ai-assistant" element={<AIAssistant />} />
              <Route path="gamification" element={<GamificationSystem />} />
              <Route path="profile" element={<StudentProfile />} />
            </Routes>
          </StudentLayout>
        } />

        {/* Instructor Routes */}
        <Route path="/instructor/*" element={
          <InstructorLayout>
            <Routes>
              <Route path="dashboard" element={<InstructorDashboard />} />
              <Route path="courses" element={<MyCoursesInstructor />} />
              <Route path="courses/create" element={<CreateCourse />} />
              <Route path="courses/:id/builder" element={<CourseBuilder />} />
              <Route path="courses/:id/edit" element={<EditCourse />} />
              <Route path="courses/:id/analytics" element={<CourseAnalytics />} />
              <Route path="courses/:id/grading/:assignmentId" element={<GradingSystem />} />
              <Route path="profile" element={<InstructorProfile />} />
            </Routes>
          </InstructorLayout>
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="instructors" element={<InstructorApproval />} />
              <Route path="profile" element={<AdminProfile />} />
            </Routes>
          </AdminLayout>
        } />

        {/* Error Pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
