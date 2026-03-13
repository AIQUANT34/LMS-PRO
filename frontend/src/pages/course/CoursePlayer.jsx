import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/apiService';
import { enrollmentService } from '../../services/enrollmentService';
import toast from 'react-hot-toast';

const CoursePlayer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const videoRef = useRef(null);
  
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Fetch course and lesson data
  useEffect(() => {
    const fetchContent = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Fetch enrollment details
        const enrollmentsResponse = await apiService.get('/api/enrollments/my-courses');
        const userEnrollment = enrollmentsResponse.enrollments?.find(
          e => e.courseId._id === courseId
        );
        
        if (!userEnrollment) {
          setError('You are not enrolled in this course');
          return;
        }
        
        setEnrollment(userEnrollment);

        // Fetch course details
        const courseResponse = await apiService.get(`/api/courses/${courseId}`);
        setCourse(courseResponse);

        // Fetch lesson details if lessonId is provided
        if (lessonId) {
          const lessonResponse = await apiService.get(`/api/learning/lessons/${lessonId}`);
          setLesson(lessonResponse);
          
          // Check if lesson is already completed
          const progress = await apiService.get(`/api/learning/progress/course/${courseId}`);
          const lessonProgress = progress.lessons?.find(l => l.lessonId === lessonId);
          setIsCompleted(lessonProgress?.completed || false);
        }

      } catch (err) {
        setError(err.message);
        console.error('Error fetching course content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [courseId, lessonId, isAuthenticated, navigate]);

  // Video controls
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Save progress every 10 seconds
      if (Math.floor(videoRef.current.currentTime) % 10 === 0) {
        saveVideoProgress();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const saveVideoProgress = async () => {
    if (!enrollment || !lessonId) return;
    
    try {
      await apiService.put(`/api/learning/video/${lessonId}/playback`, {
        enrollmentId: enrollment._id,
        currentTime: videoRef.current?.currentTime || 0,
        duration: videoRef.current?.duration || 0,
        completed: false
      });
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  const markLessonComplete = async () => {
    if (!enrollment || !lessonId) return;
    
    try {
      await enrollmentService.markLessonComplete(lessonId);
      setIsCompleted(true);
      toast.success('Lesson marked as complete!');
      
      // Navigate to next lesson or back to course
      const courseLessons = course?.curriculum || [];
      const currentIndex = courseLessons.findIndex(l => l._id === lessonId);
      
      if (currentIndex < courseLessons.length - 1) {
        const nextLesson = courseLessons[currentIndex + 1];
        navigate(`/courses/${courseId}/lesson/${nextLesson._id}`);
      } else {
        navigate(`/courses/${courseId}`);
      }
      
    } catch (err) {
      console.error('Error marking lesson complete:', err);
      toast.error('Failed to mark lesson as complete');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-md">
          <strong>Error:</strong> {error}
          <div className="mt-4">
            <Link to="/employee/dashboard" className="btn-premium-outline">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-semibold text-gray-900">{lesson?.title || 'Course Player'}</h1>
                <p className="text-sm text-gray-600">{course?.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <DocumentTextIcon className="h-5 w-5 text-gray-600" />
              </button>
              <Link
                to={`/courses/${courseId}/progress`}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChartBarIcon className="h-5 w-5 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black rounded-lg overflow-hidden aspect-video"
            >
              <video
                ref={videoRef}
                className="w-full h-full"
                src={lesson?.videoUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                controls={false}
              />
              
              {/* Custom Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <div 
                  className="mb-4 h-1 bg-gray-600 rounded-full cursor-pointer"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handlePlayPause}
                      className="p-2 hover:bg-white/20 rounded-full"
                    >
                      {isPlaying ? (
                        <PauseIcon className="h-6 w-6 text-white" />
                      ) : (
                        <PlayIcon className="h-6 w-6 text-white" />
                      )}
                    </button>
                    
                    <button
                      onClick={handleMuteToggle}
                      className="p-2 hover:bg-white/20 rounded-full"
                    >
                      {isMuted ? (
                        <SpeakerXMarkIcon className="h-6 w-6 text-white" />
                      ) : (
                        <SpeakerWaveIcon className="h-6 w-6 text-white" />
                      )}
                    </button>
                    
                    <div className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={playbackSpeed}
                      onChange={(e) => {
                        setPlaybackSpeed(parseFloat(e.target.value));
                        if (videoRef.current) {
                          videoRef.current.playbackRate = parseFloat(e.target.value);
                        }
                      }}
                      className="bg-white/20 text-white text-sm px-2 py-1 rounded"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                    </select>
                    
                    {!isCompleted && (
                      <button
                        onClick={markLessonComplete}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                        <span>Mark Complete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Lesson Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-white rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Lesson Details</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <BookOpenIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Duration: {lesson?.duration || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    Progress: {Math.round((currentTime / duration) * 100) || 0}%
                  </span>
                </div>
                {isCompleted && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Completed</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{lesson?.description || 'No description available.'}</p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h3>
              <div className="space-y-3">
                {course?.curriculum?.map((item, index) => (
                  <Link
                    key={item._id}
                    to={`/courses/${courseId}/lesson/${item._id}`}
                    className={`block p-3 rounded-lg border ${
                      item._id === lessonId 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">
                          {index + 1}. {item.title}
                        </span>
                        {item.completed && (
                          <CheckCircleIcon className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{item.duration}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Resources */}
            {lesson?.resources?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
                <div className="space-y-3">
                  {lesson.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {resource.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {resource.type}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Transcript Modal */}
      {showTranscript && lesson?.transcript && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTranscript(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Transcript</h3>
                <button
                  onClick={() => setShowTranscript(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose max-w-none">
                {lesson.transcript}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CoursePlayer;
