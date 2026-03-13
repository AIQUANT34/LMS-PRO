import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChartBarIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  FireIcon,
  TrophyIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/apiService';
import { aiService } from '../../services/aiService';
import toast from 'react-hot-toast';

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Fetch course and progress data
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Fetch course details
        const courseResponse = await apiService.get(`/api/courses/${courseId}`);
        setCourse(courseResponse);
        
        // Fetch progress data
        const progressResponse = await apiService.get(`/api/learning/progress/course/${courseId}`);
        setProgress(progressResponse);
        
      } catch (err) {
        console.error('Error fetching course progress:', err);
        toast.error('Failed to load course progress');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, isAuthenticated, navigate]);

  // Generate AI summary
  const generateAISummary = async () => {
    if (!course || !progress) return;
    
    try {
      setLoadingSummary(true);
      
      const summary = await aiService.getProgressSummary(user.userId, courseId, {
        context: 'corporate_training'
      });
      
      setAiSummary(summary);
      toast.success('AI summary generated!');
      
    } catch (err) {
      console.error('Error generating AI summary:', err);
      toast.error('Failed to generate AI summary');
    } finally {
      setLoadingSummary(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateOverallProgress = () => {
    if (!progress?.lessons) return 0;
    
    const totalLessons = progress.lessons.length;
    const completedLessons = progress.lessons.filter(lesson => lesson.completed).length;
    
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course || !progress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-md">
          <strong>Error:</strong> Course progress not found
          <div className="mt-4">
            <Link to="/student/dashboard" className="btn-premium-outline">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to={`/courses/${courseId}`}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Course Progress</h1>
                <p className="text-sm text-gray-600">{course.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={generateAISummary}
                disabled={loadingSummary}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <AcademicCapIcon className="h-5 w-5" />
                <span>{loadingSummary ? 'Generating...' : 'AI Summary'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Overall Progress</h2>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Completion</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProgressColor(overallProgress)}`}>
                    {overallProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{progress.lessons?.length || 0}</div>
                  <div className="text-sm text-gray-600">Total Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {progress.lessons?.filter(l => l.completed).length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {progress.lessons?.filter(l => !l.completed).length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(progress.totalTimeSpent / 60) || 0}h
                  </div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                </div>
              </div>
            </motion.div>

            {/* Lesson Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Progress</h3>
              
              <div className="space-y-3">
                {progress.lessons?.map((lesson, index) => (
                  <div
                    key={lesson.lessonId}
                    className={`p-4 border rounded-lg ${
                      lesson.completed 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {lesson.completed ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                        )}
                        
                        <div className="flex-1">
                          <Link
                            to={`/courses/${courseId}/lesson/${lesson.lessonId}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
                            {index + 1}. {lesson.title}
                          </Link>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>{lesson.duration || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FireIcon className="h-3 w-3" />
                              <span>{Math.round(lesson.timeSpent / 60)}m</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {Math.round(lesson.progress)}%
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-full"
                            style={{ width: `${lesson.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Summary */}
            {aiSummary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Learning Analysis</h3>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <div className="whitespace-pre-wrap">{aiSummary}</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <TrophyIcon className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {progress.averageScore || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {progress.enrollmentDate ? formatDate(progress.enrollmentDate) : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Enrollment Date</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {progress.streak || 0} days
                    </div>
                    <div className="text-sm text-gray-600">Learning Streak</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  to={`/courses/${courseId}`}
                  className="block w-full p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <BookOpenIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Continue Learning</span>
                  </div>
                </Link>
                
                <Link
                  to={`/student/ai-assistant`}
                  className="block w-full p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Get AI Help</span>
                  </div>
                </Link>
                
                {overallProgress >= 100 && (
                  <Link
                    to={`/courses/${courseId}/certificate`}
                    className="block w-full p-3 border border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50"
                  >
                    <div className="flex items-center space-x-2">
                      <TrophyIcon className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-700">View Certificate</span>
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <FireIcon className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Keep the momentum!</div>
                    <div className="text-xs text-gray-600">You're on a {progress.streak || 0}-day learning streak.</div>
                  </div>
                </div>
                
                {overallProgress < 100 && (
                  <div className="flex items-start space-x-2">
                    <ChartBarIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Focus on incomplete lessons</div>
                      <div className="text-xs text-gray-600">
                        {progress.lessons?.filter(l => !l.completed).length || 0} lessons remaining
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
