import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Layouts
const StudentLayout = lazy(() => import('../components/layout/StudentLayout'));
const EmployeeLayout = lazy(() => import('../components/layout/EmployeeLayout'));
const TrainerLayout = lazy(() => import('../components/layout/TrainerLayout'));
const AdminLayout = lazy(() => import('../components/layout/AdminLayout'));
const AuthLayout = lazy(() => import('../components/layout/AuthLayout'));

// Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));

// Student Pages
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));
const StudentCourses = lazy(() => import('../pages/student/StudentCourses'));
const StudentProfile = lazy(() => import('../pages/student/StudentProfile'));
const StudentAchievements = lazy(() => import('../pages/student/StudentAchievements'));
const CoursePlayer = lazy(() => import('../pages/student/CoursePlayer'));
const QuizSystem = lazy(() => import('../pages/student/QuizSystem'));
const CertificatePage = lazy(() => import('../pages/student/CertificatePage'));
const AssignmentSystem = lazy(() => import('../pages/student/AssignmentSystem'));
const LiveClassroom = lazy(() => import('../pages/live/LiveClassroom'));
const AIAssistant = lazy(() => import('../pages/ai/AIAssistant'));
const GamificationSystem = lazy(() => import('../pages/gamification/GamificationSystem'));
const InstructorApplication = lazy(() => import('../pages/student/InstructorApplication'));

// Trainer Pages
const TrainerDashboard = lazy(() => import('../pages/trainer/TrainerDashboard'));
const MyCoursesTrainer = lazy(() => import('../pages/trainer/MyCourses'));
const CreateCourse = lazy(() => import('../pages/trainer/CreateCourse'));
const CourseBuilder = lazy(() => import('../pages/trainer/CourseBuilder'));
const EditCourse = lazy(() => import('../pages/trainer/EditCourse'));
const CourseAnalytics = lazy(() => import('../pages/trainer/CourseAnalytics'));
const TrainerProfile = lazy(() => import('../pages/trainer/TrainerProfile'));
const GradingSystem = lazy(() => import('../pages/trainer/GradingSystem'));
const TrainerAssignments = lazy(() => import('../pages/trainer/TrainerAssignments'));
const CreateAssignment = lazy(() => import('../pages/trainer/CreateAssignment'));
const TrainerAnalytics = lazy(() => import('../pages/trainer/TrainerAnalytics'));
const TrainerEarnings = lazy(() => import('../pages/trainer/TrainerEarnings'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const CourseManagement = lazy(() => import('../pages/admin/CourseManagement'));
const TrainerApproval = lazy(() => import('../pages/admin/TrainerApproval'));
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile'));

// Common Pages
const HomePage = lazy(() => import('../pages/common/HomePage'));
const AboutPage = lazy(() => import('../pages/common/AboutPage'));
const ContactPage = lazy(() => import('../pages/common/ContactPage'));
const CourseDetail = lazy(() => import('../pages/course/CourseDetail'));
const CourseSearch = lazy(() => import('../pages/course/CourseSearch'));
const CourseProgress = lazy(() => import('../pages/course/CourseProgress'));
const UnauthorizedPage = lazy(() => import('../pages/common/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('../pages/common/NotFoundPage'));
const HelpCenter = lazy(() => import('../pages/common/HelpCenter'));
const DocumentationPage = lazy(() => import('../pages/common/DocumentationPage'));
const CommunityPage = lazy(() => import('../pages/common/CommunityPage'));
const SystemStatusPage = lazy(() => import('../pages/common/SystemStatusPage'));
const InstructorsPage = lazy(() => import('../pages/common/InstructorsPage'));

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
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/docs" element={<DocumentationPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/status" element={<SystemStatusPage />} />
        <Route path="/courses" element={<CourseMarketplace />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/search" element={<CourseSearch />} />
        <Route path="/instructors" element={<InstructorsPage />} />

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
        <Route path="/student" element={<StudentLayout/>}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="achievements" element={<StudentAchievements />} />
          <Route path="instructor-application" element={<InstructorApplication />} />
          <Route path="courses/:courseId/lesson/:lessonId" element={<CoursePlayer />} />
          <Route path="courses/:courseId/progress" element={<CourseProgress />} />
          <Route path="courses/:id/quiz/:quizId" element={<QuizSystem />} />
          <Route path="courses/:id/assignment/:assignmentId" element={<AssignmentSystem />} />
          <Route path="courses/:id/certificate" element={<CertificatePage />} />
          <Route path="live/:sessionId" element={<LiveClassroom />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="gamification" element={<GamificationSystem />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Trainer Routes */}
        <Route path="/trainer" element={<TrainerLayout/>}>
          <Route index element={<TrainerDashboard />} />
          <Route path="dashboard" element={<TrainerDashboard />} />
          <Route path="courses" element={<MyCoursesTrainer />} />
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="courses/:id/builder" element={<CourseBuilder />} />
          <Route path="courses/:id/edit" element={<EditCourse />} />
          <Route path="courses/:id/analytics" element={<CourseAnalytics />} />
          <Route path="courses/:id/grading/:assignmentId" element={<GradingSystem />} />
          <Route path="assignments" element={<TrainerAssignments />} />
          <Route path="assignments/create" element={<CreateAssignment />} />
          <Route path="analytics" element={<TrainerAnalytics />} />
          <Route path="earnings" element={<TrainerEarnings />} />
          <Route path="profile" element={<TrainerProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="trainers" element={<TrainerApproval />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Error Pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
