import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  Cog6ToothIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  BookOpenIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  BookmarkIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/apiService';
import { aiService } from '../../services/aiService';

const StudentCoursePlayer = () => {
  const { courseId, lessonId } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchLessonData();
  }, [courseId, lessonId, isAuthenticated]);

  const fetchLessonData = async () => {
    try {
      const [lessonRes, courseRes, progressRes] = await Promise.all([
        apiService.get(`/api/learning/lessons/${lessonId}`),
        apiService.get(`/api/courses/${courseId}`),
        apiService.get(`/api/learning/progress/course/${courseId}`)
      ]);
      
      setLesson(lessonRes.data);
      setCourse(courseRes.data);
      setCompleted(progressRes.data?.lessonsCompleted?.includes(lessonId) || false);
      setBookmarked(progressRes.data?.bookmarked?.includes(lessonId) || false);
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const handleBookmark = async () => {
    try {
      await apiService.post(`/api/learning/bookmark/${lessonId}`);
      setBookmarked(!bookmarked);
    } catch (error) {
      console.error('Error bookmarking lesson:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await apiService.post(`/api/learning/progress/complete/${lessonId}`);
      setCompleted(true);
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const handleSaveNotes = async () => {
    try {
      await apiService.post(`/api/learning/notes/${lessonId}`, { content: notes });
      alert('Notes saved successfully!');
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes');
    }
  };

  const handleAIQuestion = async () => {
    if (!aiQuestion.trim()) return;
    
    try {
      setAiResponse('Thinking...');
      const response = await aiService.askQuestion(aiQuestion, courseId, lessonId, user?.id);
      setAiResponse(response.answer || 'I apologize, but I cannot answer that question right now.');
    } catch (error) {
      setAiResponse('Sorry, I encountered an error. Please try again.');
      console.error('AI Question Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
        {/* Video Player */}
        <div className="lg:col-span-3 relative bg-black">
          {lesson?.videoUrl && (
            <video
              ref={videoRef}
              className="w-full h-full"
              controls={false}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={(e) => {
                if (progressRef.current) {
                  const progress = (e.target.currentTime / e.target.duration) * 100;
                  progressRef.current.style.width = `${progress}%`;
                }
              }}
            >
              <source src={lesson.videoUrl} type="video/mp4" />
            </video>
          )}
          
          {/* Custom Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleSeek(Math.max(0, (videoRef.current?.currentTime || 0) - 10))}
                  className="text-white hover:text-primary-400"
                >
                  <BackwardIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-primary-400"
                >
                  {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
                </button>
                <button
                  onClick={() => handleSeek(Math.min(videoRef.current?.duration || 0, (videoRef.current?.currentTime || 0) + 10))}
                  className="text-white hover:text-primary-400"
                >
                  <ForwardIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="text-white hover:text-primary-400"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:text-primary-400"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleBookmark}
                  className={`text-white hover:text-primary-400 ${bookmarked ? 'text-primary-400' : ''}`}
                >
                  <BookmarkIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowAIChat(!showAIChat)}
                  className="text-white hover:text-primary-400"
                >
                  <QuestionMarkCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div 
              ref={progressRef}
              className="absolute bottom-0 left-0 h-1 bg-primary-600 transition-all duration-300"
              style={{ width: '0%' }}
            />
          </div>
        </div>

        {/* Course Content Sidebar */}
        <div className="lg:col-span-1 bg-white border-l border-gray-200">
          <div className="h-full overflow-y-auto">
            {/* Lesson Info */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{lesson?.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{lesson?.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{lesson?.duration || 'Not specified'}</span>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  <span>{lesson?.viewCount || 0} views</span>
                </div>
              </div>
            </div>

            {/* Course Navigation */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Course Content</h4>
              <div className="space-y-2">
                <Link
                  to={`/student/courses/${courseId}`}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg"
                >
                  <BookOpenIcon className="h-5 w-5 mr-3 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Back to Course</p>
                    <p className="text-sm text-gray-600">{course?.title}</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Lesson Actions */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Actions</h4>
              <div className="space-y-3">
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-3 text-gray-600" />
                  <span className="font-medium text-gray-900">Take Notes</span>
                </button>
                <button
                  onClick={handleComplete}
                  disabled={completed}
                  className="w-full flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-3 text-green-600" />
                  <span className="font-medium text-green-900">Mark as Complete</span>
                </button>
                <button className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                  <ShareIcon className="h-5 w-5 mr-3 text-gray-600" />
                  <span className="font-medium text-gray-900">Share Lesson</span>
                </button>
              </div>
            </div>

            {/* AI Assistant */}
            <AnimatePresence>
              {showAIChat && (
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                  onClick={() => setShowAIChat(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900">AI Learning Assistant</h4>
                      <button
                        onClick={() => setShowAIChat(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <textarea
                          value={aiQuestion}
                          onChange={(e) => setAiQuestion(e.target.value)}
                          placeholder="Ask anything about this lesson..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          rows={3}
                        />
                        <button
                          onClick={handleAIQuestion}
                          className="w-full btn-premium"
                        >
                          Ask AI
                        </button>
                      </div>
                      {aiResponse && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{aiResponse}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notes Section */}
            <AnimatePresence>
              {showNotes && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="p-6 border-b border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">Your Notes</h4>
                    <button
                      onClick={() => setShowNotes(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Take notes here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={8}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleSaveNotes}
                      className="btn-premium"
                    >
                      Save Notes
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursePlayer;
