import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import { 
  PlayIcon,
  PauseIcon,
  BookOpenIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  ClockIcon,
  UsersIcon,
  ChartBarIcon,
  VideoCameraIcon,
  DocumentIcon,
  ArrowLeftIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  LockClosedIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';

// Reusable Components
const EnhancedVideoPlayer = ({ lesson, onProgressUpdate, allLessons, courseId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(lesson?.isCompleted || false);

  const videoRef = useRef(null);

  // Parse content to get video URL
  const parsedContent = lesson?.content ? JSON.parse(lesson.content) : {};
  const videoUrl = parsedContent.videoUrl || lesson?.videoUrl;
  
  console.log('🎯 Lesson data debug:', {
    lessonId: lesson?._id,
    lessonTitle: lesson?.title,
    lessonContent: lesson?.content,
    parsedContent,
    videoUrlFromContent: parsedContent.videoUrl,
    videoUrlFromLesson: lesson?.videoUrl,
    finalVideoUrl: videoUrl
  });

  // Check if it's a YouTube URL
  const isYouTube = videoUrl && (
    videoUrl.includes('youtube.com') || 
    videoUrl.includes('youtu.be') ||
    videoUrl.includes('youtube')
  );

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    console.log('🎯 Extracting video ID from URL:', url);
    
    if (!url) {
      console.log('🎯 No URL provided');
      return null;
    }
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      console.log('🎯 Youtu.be video ID:', videoId);
      return videoId;
    } else if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      console.log('🎯 YouTube.com video ID:', videoId);
      return videoId;
    } else if (url.includes('youtube.com/embed/')) {
      const videoId = url.split('embed/')[1].split('?')[0];
      console.log('🎯 YouTube embed video ID:', videoId);
      return videoId;
    } else if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('shorts/')[1].split('?')[0];
      console.log('🎯 YouTube Shorts video ID:', videoId);
      return videoId;
    }
    
    console.log('🎯 No valid YouTube URL format found');
    return null;
  };

  // YouTube player options
  const youtubeOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      modestbranding: 1,
      autohide: 1,
      showinfo: 0,
    },
  };

  // Get current lesson index
  const currentLessonIndex = allLessons.findIndex(l => l._id === lesson._id);
  const nextLesson = allLessons[currentLessonIndex + 1];
  const isLastLesson = currentLessonIndex === allLessons.length - 1;

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video && !isYouTube) {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      
      // Calculate watched percentage
      const percentage = (video.currentTime / video.duration) * 100;
      setWatchedPercentage(percentage);
      
      // Update progress
      onProgressUpdate && onProgressUpdate(percentage, video.currentTime);
      
      // Auto-complete at 90% watched
      if (percentage >= 90 && !isCompleted) {
        handleMarkComplete();
      }
    }
  }, [onProgressUpdate, isYouTube, isCompleted]);

  const handleMarkComplete = useCallback(() => {
    if (!isCompleted) {
      setIsCompleted(true);
      
      // Auto-navigate to next lesson after 2 seconds
      if (!isLastLesson && nextLesson) {
        setTimeout(() => {
          // Navigate to next lesson
          window.location.href = `/trainer/courses/${courseId}/view#lesson-${nextLesson._id}`;
        }, 2000);
      }
    }
  }, [isCompleted, isLastLesson, nextLesson, courseId]);

  const handleVideoEnd = useCallback(() => {
    // Mark as complete when video ends
    if (!isCompleted) {
      handleMarkComplete();
    }
  }, [isCompleted, handleMarkComplete]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video && !isYouTube) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const formatPercentage = (percentage) => {
    return Math.min(100, Math.max(0, Math.round(percentage)));
  };

  // Resume from saved progress
  useEffect(() => {
    const video = videoRef.current;
    if (video && !isYouTube && lesson?.videoProgress) {
      const savedTime = lesson.videoProgress.currentTime || 0;
      if (savedTime > 0 && savedTime < video.duration) {
        video.currentTime = savedTime;
        setCurrentTime(savedTime);
      }
    }
  }, [lesson?.videoProgress, isYouTube]);

  return (
    <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
      {/* YouTube Embed */}
      {isYouTube && videoUrl ? (
        <div className="relative w-full aspect-video">
          {(() => {
            const videoId = getYouTubeVideoId(videoUrl);
            console.log('🎯 Final video ID for YouTube component:', videoId);
            
            if (!videoId) {
              return (
                <div className="flex items-center justify-center h-full bg-gray-900 rounded-xl">
                  <div className="text-center text-white">
                    <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Invalid YouTube URL</h3>
                    <p className="text-gray-400">The YouTube URL could not be processed.</p>
                    <p className="text-sm text-gray-500 mt-2">URL: {videoUrl}</p>
                  </div>
                </div>
              );
            }
            
            return (
              <YouTube
                videoId={videoId}
                opts={youtubeOpts}
                className="w-full h-full rounded-xl"
                onReady={(event) => {
                  console.log('🎯 YouTube player ready for video:', videoId);
                }}
                onPlay={(event) => {
                  setIsPlaying(true);
                }}
                onPause={(event) => {
                  setIsPlaying(false);
                }}
                onEnd={(event) => {
                  handleVideoEnd();
                }}
                onError={(event) => {
                  console.error('🎯 YouTube player error:', event);
                }}
              />
            );
          })()}
          
          {/* Custom overlay for YouTube */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  YouTube Video
                </div>
              </div>
              <div className="text-sm text-white/80">
                Lesson {lesson?.sequence || 1}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Check for PDF content */
        parsedContent.textContent && parsedContent.textContent.includes('.pdf') ? (
          <div className="relative w-full aspect-video bg-white rounded-xl">
            <iframe
              src={parsedContent.textContent}
              className="w-full h-full rounded-xl"
              title="PDF Document"
              frameBorder="0"
            />
            {/* Custom overlay for PDF */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <DocumentTextIcon className="h-5 w-5 text-white" />
                  <div className="text-sm">
                    PDF Document
                  </div>
                </div>
                <div className="text-sm text-white/80">
                  Lesson {lesson?.sequence || 1}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Direct Video File */
          videoUrl ? (
            <>
              <video
                ref={videoRef}
                className="w-full aspect-video"
                controls={false}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
                onEnded={handleVideoEnd}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Custom Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlayPause}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? (
                        <PauseIcon className="h-5 w-5" />
                      ) : (
                        <PlayIcon className="h-5 w-5" />
                      )}
                    </button>
                    <div className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-white/80">
                      Lesson {lesson?.sequence || 1}
                    </div>
                    {/* Completion Status */}
                    <div className="flex items-center space-x-2">
                      {isCompleted ? (
                        <div className="flex items-center text-green-400">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs">Completed</span>
                        </div>
                      ) : (
                        <div className="text-xs text-white/60">
                          {formatPercentage(watchedPercentage)}% Complete
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="absolute bottom-16 left-4 right-4">
                  <div className="bg-white/20 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${formatPercentage(watchedPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>
              </>
          ) : (
            /* No Video Available */
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
              <div className="text-center">
                <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Not Available</h3>
                <p className="text-gray-600 mb-4">This lesson doesn't have video or PDF content uploaded yet.</p>
                <p className="text-sm text-gray-500">Please upload a video file or add a YouTube URL.</p>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};

const ModuleAccordion = ({ module, lessons, selectedLessonId, onLessonSelect, isTrainer }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const moduleLessons = lessons.filter(lesson => lesson.moduleId === module.id);
  const completedLessons = moduleLessons.filter(lesson => lesson.isCompleted).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Module Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">{module.title}</h3>
              <p className="text-sm text-gray-500">
                {moduleLessons.length} lessons • {completedLessons} completed
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500">
              {Math.round((completedLessons / moduleLessons.length) * 100)}%
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </div>
        </button>

        {/* Module Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-200">
                {moduleLessons.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    onClick={() => onLessonSelect(lesson)}
                    className={`px-6 py-3 flex items-center justify-between hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedLessonId === lesson._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        {lesson.isCompleted ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : lesson.type === 'video' ? (
                          <VideoCameraIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {lesson.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4" />
                            {lesson.duration || 0}min
                          </span>
                          {lesson.isFree && (
                            <span className="flex items-center space-x-1 text-green-600">
                              <EyeIcon className="h-4 w-4" />
                              Free
                            </span>
                          )}
                          {!lesson.isFree && (
                            <span className="flex items-center space-x-1 text-orange-600">
                              <LockClosedIcon className="h-4 w-4" />
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">
                        {index + 1}
                      </span>
                      {isTrainer && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit lesson
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete lesson
                            }}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('trainer'); // 'trainer' or 'student'

  console.log("Course ID:", courseId);
  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        console.log("Fetching course")

        setLoading(true);
        
        // Fetch course details (api is calling here)
        const courseResponse = await apiService.get(API_ENDPOINTS.COURSES.GET_BY_ID(courseId));
        console.log("full course response", courseResponse)

        const courseData = courseResponse.data || courseResponse;
        setCourse(courseData);

        // Fetch lessons with progress (optimized API call)
        const lessonsResponse = await apiService.get(API_ENDPOINTS.LEARNING.LESSONS.GET_BY_COURSE(courseId));
        console.log("lesson api done")

        const lessonsData = lessonsResponse?.data?.lessons || lessonsResponse?.lessons || [];
        setLessons(lessonsData);

        // Group lessons into modules
        const modulesMap = {};
        lessonsData.forEach(lesson => {
          const moduleId = lesson.moduleId || 'default';
          if (!modulesMap[moduleId]) {
            modulesMap[moduleId] = {
              id: moduleId,
              title: lesson.moduleTitle || `Module ${Object.keys(modulesMap).length + 1}`,
              description: ''
            };
          }
        });
        
        const modulesArray = Object.values(modulesMap);
        setModules(modulesArray);

        // Select first lesson by default
        if (lessonsData.length > 0) {
          setSelectedLesson(lessonsData[0]);
        }
        
      } catch (error) {
        console.error("error", error)
        toast.error('Failed to load course data');
        // console.error('Course loading error:', error);
      } finally {
        console.log("Loading finished")
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const handleLessonSelect = useCallback((lesson) => {
    console.log("selected lesson full data", lesson)
    setSelectedLesson(lesson);
  }, []);

  const handleProgressUpdate = useCallback((progress, currentTime) => {
    // Update video progress to backend
    if (selectedLesson) {
      console.log('🔍 CourseView Debug - API_ENDPOINTS.LEARNING:', API_ENDPOINTS.LEARNING);
      console.log('🔍 CourseView Debug - UPDATE_VIDEO_PROGRESS:', API_ENDPOINTS.LEARNING.UPDATE_VIDEO_PROGRESS);
      console.log('🔍 CourseView Debug - UPDATE_VIDEO_PROGRESS type:', typeof API_ENDPOINTS.LEARNING.UPDATE_VIDEO_PROGRESS);
      
      // Use direct endpoint string instead of function call
      const endpoint = `/learning/video/${selectedLesson._id}/progress`;
      console.log('🔍 CourseView Debug - Direct endpoint:', endpoint);
      
      apiService.post(endpoint, {
        currentTime,
        watchedPercentage: progress,
        duration: selectedLesson.duration || 0
      }).catch(error => {
        console.error('Progress update failed:', error);
      });
    }
  }, [selectedLesson]);

  const handleAddLesson = () => {
    navigate(`/trainer/courses/${courseId}/lessons/create`);
  };

  const handleEditCourse = () => {
    navigate(`/trainer/courses/${courseId}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-700">Loading Course...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600 mt-1">{course.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Course Stats */}
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  {course.duration || 0}h
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpenIcon className="h-4 w-4" />
                  {lessons.length} lessons
                </div>
                <div className="flex items-center space-x-1">
                  <UsersIcon className="h-4 w-4" />
                  {course.enrollmentCount || 0} students
                </div>
                <div className="flex items-center space-x-1">
                  <ChartBarIcon className="h-4 w-4" />
                  {course.level || 'Beginner'}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('student')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'student'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Student
                  </button>
                  <button
                    onClick={() => setViewMode('trainer')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'trainer'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-1" />
                    Trainer
                  </button>
                </div>
                
                {/* Edit Course Button (Trainer View Only) */}
                {viewMode === 'trainer' && (
                  <>
                    <button
                      onClick={handleEditCourse}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit Course
                    </button>
                    <button
                      onClick={handleAddLesson}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm font-medium"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Lesson
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Course Content */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Course Content Header */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpenIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Course Content
                </h2>
                
                {/* Modules and Lessons */}
                <div className="space-y-3">
                  {modules.length > 0 ? (
                    modules.map((module) => (
                      <ModuleAccordion
                        key={module.id}
                        module={module}
                        lessons={lessons}
                        selectedLessonId={selectedLesson?._id}
                        onLessonSelect={handleLessonSelect}
                        isTrainer={viewMode === 'trainer'}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No lessons available yet</p>
                      {viewMode === 'trainer' && (
                        <button
                          onClick={handleAddLesson}
                          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Create your first lesson
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Content - Video Player & Lesson Details */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Video Player */}
                <EnhancedVideoPlayer
                  lesson={selectedLesson}
                  onProgressUpdate={handleProgressUpdate}
                  allLessons={lessons}
                  courseId={courseId}
                />

                {/* Lesson Details */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedLesson.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          {selectedLesson.duration || 0} minutes
                        </span>
                        <span className="flex items-center space-x-1">
                          <BookOpenIcon className="h-4 w-4" />
                          Lesson {selectedLesson.sequence || 1}
                        </span>
                        {selectedLesson.isCompleted && (
                          <span className="flex items-center space-x-1 text-green-600">
                            <CheckCircleIcon className="h-4 w-4" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Trainer Actions */}
                    {viewMode === 'trainer' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/trainer/lessons/${selectedLesson._id}/edit`)}
                          className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1 text-sm font-medium"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            // Handle delete lesson
                            if (window.confirm('Are you sure you want to delete this lesson?')) {
                              // Delete API call
                            }
                          }}
                          className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-1 text-sm font-medium"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Lesson Description */}
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedLesson.description || 'No description available for this lesson.'}
                    </p>
                  </div>

                  {/* Resources */}
                  {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <DocumentIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Resources
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedLesson.resources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                          >
                            <div className="flex-shrink-0">
                              <DocumentTextIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {resource.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                View resource
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              /* No Lesson Selected */
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Lesson
                </h3>
                <p className="text-gray-600">
                  Choose a lesson from the course content panel to start viewing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
