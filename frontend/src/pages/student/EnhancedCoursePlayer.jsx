import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube'
import { 
  PlayIcon,
  PauseIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  ChartBarIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  EyeIcon,
  LockClosedIcon,
  AcademicCapIcon,
  BookmarkIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

// Enhanced Video Player Component
const EnhancedVideoPlayer = ({ lesson, onProgressUpdate, onLessonComplete, allLessons, courseId }) => {
  const { user } = useAuthStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(lesson?.isCompleted || false);
  const [player, setPlayer] = useState(null);
  const [maxWatched, setMaxWatched] = useState(0);
  const [videoHistory, setVideoHistory] = useState(null);
  const [hasResumed, setHasResumed] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(0); // Track last save time

  const videoRef = useRef(null);

  // Parse content to get video URL
  const parsedContent = lesson?.content ? JSON.parse(lesson.content) : {};
  const videoUrl = parsedContent.videoUrl || lesson?.videoUrl;
  
  // Check if it's a YouTube URL
  const isYouTube = videoUrl && (
    videoUrl.includes('youtube.com') || 
    videoUrl.includes('youtu.be') ||
    videoUrl.includes('youtube')
  );

  // Extract YouTube ID (Professional LMS method)
  const getYouTubeId = (url) => {
    console.log('🎯 EnhancedCoursePlayer - Extracting YouTube ID from URL:', url);
    
    if (!url) {
      console.log('🎯 EnhancedCoursePlayer - No URL provided');
      return null;
    }
    
    // Handle YouTube Shorts URLs
    if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('shorts/')[1].split('?')[0];
      console.log('🎯 EnhancedCoursePlayer - YouTube Shorts video ID:', videoId);
      return videoId;
    }
    
    // Handle regular YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    
    console.log('🎯 EnhancedCoursePlayer - Regular YouTube video ID:', videoId);
    return videoId;
  };

  // Get current lesson index
  const currentLessonIndex = (allLessons || []).findIndex(l => l?._id === lesson?._id);
  const nextLesson = (allLessons || [])[currentLessonIndex + 1];
  const isLastLesson = currentLessonIndex === (allLessons || []).length - 1;

  // Load video history when user or lesson changes
  useEffect(() => {
    const loadVideoHistory = async () => {
      if (lesson?._id && user?._id) {
        try {
          console.log('🎯 Loading video history for lesson:', lesson._id, 'user:', user._id);
          const response = await apiService.get(API_ENDPOINTS.LEARNING.PROGRESS.VIDEO_PROGRESS(lesson._id));
          console.log('🎯 Video history response:', response);
          
          if (response?.data && response.data.currentTime > 0) {
            setVideoHistory(response.data);
            setCurrentTime(response.data.currentTime);
            setMaxWatched(response.data.maxWatched || response.data.currentTime);
            setWatchedPercentage(response.data.watchedPercentage || 0);
            console.log('🎯 Video history loaded and state updated:', response.data);
          } else {
            console.log('🎯 No video history found or currentTime is 0');
            setVideoHistory(null);
          }
        } catch (error) {
          console.log('🎯 No video history found (new lesson):', error.message);
          // Try localStorage as fallback
          const localHistory = localStorage.getItem(`videoHistory_${lesson._id}`);
          if (localHistory) {
            const parsed = JSON.parse(localHistory);
            if (parsed.currentTime > 0) {
              setVideoHistory(parsed);
              setCurrentTime(parsed.currentTime);
              setMaxWatched(parsed.maxWatched || parsed.currentTime);
              setWatchedPercentage(parsed.watchedPercentage || 0);
              console.log('🎯 Video history loaded from localStorage:', parsed);
            } else {
              setVideoHistory(null);
            }
          } else {
            setVideoHistory(null);
          }
        }
      }
    };

    loadVideoHistory();
  }, [lesson?._id, user?._id]);

  // Save video progress with optimization
  const saveVideoProgress = useCallback(async (currentTime, duration, watchedPercentage, maxWatched) => {
    if (lesson?._id && user?._id) {
      try {
        console.log('🎯 Saving video progress:', { lessonId: lesson._id, studentId: user._id, currentTime, duration });
        
        // Don't save invalid progress
        if (duration === 0 || currentTime === 0 || !user._id) {
          console.log('🎯 Skipping invalid progress save:', { duration, currentTime, studentId: user._id });
          return;
        }

        // Only save if significant progress change or time interval passed
        const timeSinceLastSave = currentTime - lastSaveTime;
        const shouldSave = timeSinceLastSave >= 5; // Save every 5 seconds minimum
        
        if (!shouldSave) {
          console.log('🎯 Skipping save - too soon since last save:', { timeSinceLastSave });
          return;
        }

        const progressData = {
          lessonId: lesson._id,
          courseId: courseId,
          studentId: user._id,
          currentTime,
          duration,
          watchedPercentage,
          maxWatched,
          lastWatchedAt: new Date().toISOString(),
          isCompleted: watchedPercentage >= 90
        };

        console.log('🎯 Saving video progress payload:', progressData);
        
        // Save to videohistory database
        try {
          await apiService.post(API_ENDPOINTS.LEARNING.PROGRESS.UPDATE_VIDEO_PROGRESS(lesson._id), progressData);
          console.log('🎯 Video progress saved to videohistory database');
          setLastSaveTime(currentTime); // Update last save time
        } catch (apiError) {
          console.log('🎯 Backend save failed, using localStorage fallback');
          // Save to localStorage as backup
          localStorage.setItem(`videoHistory_${lesson._id}`, JSON.stringify(progressData));
          console.log('🎯 Video progress saved to localStorage');
          setLastSaveTime(currentTime); // Update last save time
        }
      } catch (error) {
        console.error('🎯 Failed to save video progress:', error);
      }
    }
  }, [lesson?._id, courseId, user?._id, lastSaveTime]);

  // Resume video from saved progress
  const resumeVideo = useCallback(() => {
    if (!hasResumed && videoHistory && videoHistory.currentTime > 0) {
      console.log('🎯 Resuming video from:', videoHistory.currentTime);
      
      if (isYouTube && player) {
        player.seekTo(videoHistory.currentTime);
        setCurrentTime(videoHistory.currentTime);
        setMaxWatched(videoHistory.maxWatched || videoHistory.currentTime);
      } else if (!isYouTube && videoRef.current) {
        videoRef.current.currentTime = videoHistory.currentTime;
        setCurrentTime(videoHistory.currentTime);
        setMaxWatched(videoHistory.maxWatched || videoHistory.currentTime);
      }
      
      setHasResumed(true);
      
      // Show resume notification
      const resumeMessage = `Resumed from ${Math.floor(videoHistory.currentTime / 60)}:${String(Math.floor(videoHistory.currentTime % 60)).padStart(2, '0')}`;
      toast.success(resumeMessage, { duration: 3000 });
    }
  }, [hasResumed, videoHistory, isYouTube, player]);

  // YouTube player options
  const youtubeOpts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      start: videoHistory?.currentTime || 0, // Start from saved time
    },
  };

  // YouTube player event handlers
  const handleYouTubeReady = useCallback((e) => {
    setPlayer(e.target);
    console.log("🎯 YouTube player ready");
    
    // Resume video from saved progress when player is ready
    setTimeout(() => {
      resumeVideo();
    }, 1000);
  }, [resumeVideo]);

  const handleYouTubePlay = useCallback(() => {
    setIsPlaying(true);
    console.log("🎯 YouTube video playing");
  }, []);

  const handleYouTubePause = useCallback(() => {
    setIsPlaying(false);
    console.log("🎯 YouTube video paused");
    
    // Save progress when pausing
    saveVideoProgress(currentTime, duration, watchedPercentage, maxWatched);
  }, [currentTime, duration, watchedPercentage, maxWatched, saveVideoProgress]);

  const handleYouTubeEnd = useCallback(() => {
    console.log("🎯 YouTube video ended");
    handleMarkComplete();
  }, []);

  // Progress tracking for YouTube
  useEffect(() => {
    if (!player || !isYouTube) return;

    const interval = setInterval(() => {
      const current = player.getCurrentTime();
      const duration = player.getDuration();

      setCurrentTime(current);
      setDuration(duration);

      // Update max watched time (prevent skipping)
      if (current > maxWatched) {
        setMaxWatched(current);
      }

      const percent = (current / duration) * 100;
      setWatchedPercentage(percent);
      
      // Save progress with optimized logic
      saveVideoProgress(current, duration, percent, maxWatched);
      
      // Auto-complete at 90% watched
      if (percent >= 90 && !isCompleted) {
        handleMarkComplete();
      }
    }, 1000); // Check every second, but save logic will optimize

    return () => clearInterval(interval);
  }, [player, isYouTube, maxWatched, isCompleted, saveVideoProgress]);

  // HTML5 video progress tracking
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video && !isYouTube) {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      
      // Update max watched time
      if (video.currentTime > maxWatched) {
        setMaxWatched(video.currentTime);
      }
      
      // Calculate watched percentage
      const percentage = (video.currentTime / video.duration) * 100;
      setWatchedPercentage(percentage);
      
      // Save progress with optimized logic
      saveVideoProgress(video.currentTime, video.duration, percentage, maxWatched);
      
      // Auto-complete at 90% watched
      if (percentage >= 90 && !isCompleted) {
        handleMarkComplete();
      }
    }
  }, [isYouTube, isCompleted, maxWatched, saveVideoProgress]);

  // Save progress when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentTime > 0) {
        saveVideoProgress(currentTime, duration, watchedPercentage, maxWatched);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save progress when component unmounts
      if (currentTime > 0) {
        saveVideoProgress(currentTime, duration, watchedPercentage, maxWatched);
      }
    };
  }, [currentTime, duration, watchedPercentage, maxWatched, saveVideoProgress]);

  const handleMarkComplete = useCallback(() => {
    if (!isCompleted) {
      console.log('🎯 handleMarkComplete called - marking lesson as complete');
      console.log('🎯 Lesson ID:', lesson._id);
      console.log('🎯 isCompleted before:', isCompleted);
      console.log('🎯 onLessonComplete function:', typeof onLessonComplete);
      
      setIsCompleted(true);
      onLessonComplete && onLessonComplete(lesson._id);
      
      // Auto-navigate to next lesson after 2 seconds
      if (!isLastLesson && nextLesson) {
        console.log('🎯 Will navigate to next lesson in 2 seconds:', nextLesson._id);
        setTimeout(() => {
          window.location.href = `/student/courses/${courseId}/lesson/${nextLesson._id}`;
        }, 2000);
      } else {
        console.log('🎯 This is the last lesson - no navigation');
      }
    } else {
      console.log('🎯 handleMarkComplete called but lesson already completed');
    }
  }, [isCompleted, isLastLesson, nextLesson, courseId, onLessonComplete, lesson._id]);

  const handleVideoEnd = useCallback(() => {
    if (!isCompleted) {
      handleMarkComplete();
    }
  }, [isCompleted, handleMarkComplete]);

  // Unified play/pause for both YouTube and HTML5
  const togglePlayPause = () => {
    if (isYouTube && player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } else {
      const video = videoRef.current;
      if (video) {
        if (video.paused) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      }
    }
  };

  // Resume from saved progress
  useEffect(() => {
    if (isYouTube && player && lesson?.videoProgress) {
      const savedTime = lesson.videoProgress.currentTime || 0;
      if (savedTime > 0) {
        player.seekTo(savedTime);
        setCurrentTime(savedTime);
      }
    } else if (!isYouTube) {
      const video = videoRef.current;
      if (video && lesson?.videoProgress) {
        const savedTime = lesson.videoProgress.currentTime || 0;
        if (savedTime > 0 && savedTime < video.duration) {
          video.currentTime = savedTime;
          setCurrentTime(savedTime);
        }
      }
    }
  }, [player, lesson?.videoProgress, isYouTube]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const formatPercentage = (percentage) => {
    return Math.min(100, Math.max(0, Math.round(percentage)));
  };

  // Debug logging
  console.log('🎯 Video Player Debug - parsedContent:', parsedContent);
  console.log('🎯 Video Player Debug - videoUrl:', videoUrl);
  console.log('🎯 Video Player Debug - isYouTube:', isYouTube);
  console.log('🎯 Video Player Debug - YouTube ID:', getYouTubeId(videoUrl));

  return (
    <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
      {!lesson ? (
        <div className="h-96 flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lesson...</p>
          </div>
        </div>
      ) : (
        <>
          {/* YouTube Embed */}
          {isYouTube && videoUrl ? (
            <div className="relative w-full aspect-video">
              <YouTube
                videoId={getYouTubeId(videoUrl)}
                className="w-full aspect-video"
                opts={youtubeOpts}
                onReady={handleYouTubeReady}
                onPlay={handleYouTubePlay}
                onPause={handleYouTubePause}
                onEnd={handleYouTubeEnd}
              />
              {/* Custom overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlayPause}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                    </button>
                    <div className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</div>
                    
                    {/* Resume indicator */}
                    {videoHistory && videoHistory.currentTime > 0 && !hasResumed && (
                      <div className="flex items-center space-x-2 bg-blue-600 px-2 py-1 rounded-full text-xs">
                        <ArrowPathIcon className="h-3 w-3" />
                        <span>Resume from {Math.floor(videoHistory.currentTime / 60)}:{String(Math.floor(videoHistory.currentTime % 60)).padStart(2, '0')}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-white/80">Lesson {lesson?.sequence || 1}</div>
                    <div className="flex items-center space-x-2">
                      {isCompleted ? (
                        <div className="flex items-center text-green-400">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs">Completed</span>
                        </div>
                      ) : (
                        <div className="text-xs text-white/60">{formatPercentage(watchedPercentage)}% Complete</div>
                      )}
                    </div>
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
          ) : (
            /* PDF Content */
            parsedContent.textContent && parsedContent.textContent.includes('.pdf') ? (
              <div className="relative w-full aspect-video bg-white rounded-xl">
                <iframe src={parsedContent.textContent} className="w-full h-full rounded-xl" title="PDF Document" frameBorder="0" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <DocumentTextIcon className="h-5 w-5 text-white" />
                      <div className="text-sm">PDF Document</div>
                    </div>
                    <div className="text-sm text-white/80">Lesson {lesson?.sequence || 1}</div>
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
                    onPlay={() => {
                      setIsPlaying(true);
                      // Resume video from saved progress if not already resumed
                      if (!hasResumed && videoHistory && videoHistory.currentTime > 0) {
                        resumeVideo();
                      }
                    }}
                    onPause={() => {
                      setIsPlaying(false);
                      // Save progress when pausing
                      saveVideoProgress(currentTime, duration, watchedPercentage, maxWatched);
                    }}
                    onLoadedMetadata={(e) => {
                      setDuration(e.target.duration);
                      // Resume video from saved progress when metadata is loaded
                      if (!hasResumed && videoHistory && videoHistory.currentTime > 0) {
                        resumeVideo();
                      }
                    }}
                    onEnded={handleVideoEnd}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/* Custom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={togglePlayPause}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                        </button>
                        <div className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</div>
                        
                        {/* Resume indicator */}
                        {videoHistory && videoHistory.currentTime > 0 && !hasResumed && (
                          <div className="flex items-center space-x-2 bg-blue-600 px-2 py-1 rounded-full text-xs">
                            <ArrowPathIcon className="h-3 w-3" />
                            <span>Resume from {Math.floor(videoHistory.currentTime / 60)}:{String(Math.floor(videoHistory.currentTime % 60)).padStart(2, '0')}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-white/80">Lesson {lesson?.sequence || 1}</div>
                        <div className="flex items-center space-x-2">
                          {isCompleted ? (
                            <div className="flex items-center text-green-400">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              <span className="text-xs">Completed</span>
                            </div>
                          ) : (
                            <div className="text-xs text-white/60">{formatPercentage(watchedPercentage)}% Complete</div>
                          )}
                        </div>
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
                </>
              ) : (
                /* No Content Available */
                <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
                  <div className="text-center">
                    <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Not Available</h3>
                    <p className="text-gray-600 mb-4">This lesson doesn't have video or PDF content uploaded yet.</p>
                    <p className="text-sm text-gray-500">Please contact your trainer to upload content.</p>
                  </div>
                </div>
              )
            )
          )}
        </>
      )}
    </div>
  );
};

// Module Accordion Component
const ModuleAccordion = ({ module, lessons, selectedLessonId, onLessonSelect, progressData }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const moduleLessons = lessons.filter(lesson => lesson.moduleId === module.id);
  const completedLessons = moduleLessons.filter(lesson => {
    const lessonProgress = progressData?.lessons?.find(l => l.lesson?._id === lesson._id);
    return lessonProgress?.isCompleted || false;
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                {moduleLessons.map((lesson, index) => {
                  const lessonProgress = progressData?.lessons?.find(l => l.lesson?._id === lesson._id);
                  const isCompleted = lessonProgress?.isCompleted || false;
                  const isCurrent = selectedLessonId === lesson._id;
                  
                  return (
                    <Link
                      key={lesson._id}
                      to={`/student/courses/${module.courseId}/lesson/${lesson._id}`}
                      className={`px-6 py-3 flex items-center justify-between hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        isCurrent ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : lesson.type === 'video' ? (
                            <VideoCameraIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{lesson.title}</h4>
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
                        <span className="text-xs text-gray-400">{index + 1}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const EnhancedCoursePlayer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [courseRes, lessonsRes, progressRes] = await Promise.all([
        apiService.get(API_ENDPOINTS.COURSES.GET_BY_ID(courseId)),
        apiService.get(API_ENDPOINTS.LEARNING.LESSONS.GET_BY_COURSE(courseId)),
        apiService.get(API_ENDPOINTS.LEARNING.PROGRESS.GET_COURSE_PROGRESS(courseId))
      ]);
      
      const courseData = courseRes || courseRes.data || courseRes?.course;
      const lessonsData = lessonsRes?.data?.lessons || lessonsRes?.lessons || [];
      const progressData = progressRes?.data || progressRes || {};
      
      console.log('🎯 Course data loaded:', courseData);
      console.log('🎯 Lessons data loaded:', lessonsData.length, 'lessons');
      console.log('🎯 Progress data loaded:', progressData);
      
      setCourse(courseData);
      setLessons(lessonsData);
      setProgressData(progressData); // Set progress data
      
      // Group lessons into modules
      const modulesMap = {};
      lessonsData.forEach(lesson => {
        const moduleId = lesson.moduleId || 'default';
        if (!modulesMap[moduleId]) {
          modulesMap[moduleId] = {
            id: moduleId,
            title: lesson.moduleTitle || `Module ${Object.keys(modulesMap).length + 1}`,
            courseId: courseId,
            description: ''
          };
        }
      });
      
      const modulesArray = Object.values(modulesMap);
      setModules(modulesArray);

      // Set selected lesson
      if (lessonId) {
        const lesson = lessonsData.find(l => l._id === lessonId);
        setSelectedLesson(lesson);
      } else if (lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
      }
      
      if (lessonsRes?.data?.progress) {
        setProgressData(lessonsRes.data.progress);
      }
      
      setLastRefresh(new Date());
      
    } catch (error) {
      console.error('Course loading error:', error);
      toast.error('Failed to load course data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [courseId, lessonId]);

  // Auto-select first lesson when lessons load
  useEffect(() => {
    if (lessons?.length > 0 && !selectedLesson) {
      setSelectedLesson(lessons[0]);
    }
  }, [lessons, selectedLesson]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCourseData();
  }, [courseId, lessonId, isAuthenticated, fetchCourseData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourseData();
  }, [fetchCourseData]);

  const handleProgressUpdate = useCallback(async (progress, currentTime) => {
    // Progress tracking disabled due to missing backend endpoint
    console.log('Progress tracking disabled due to missing backend endpoint');
  }, []);

  const handleLessonComplete = useCallback(async () => {
    if (selectedLesson) {
      try {
        console.log('🎯 Attempting to mark lesson complete:', selectedLesson._id);
        console.log('🎯 API Endpoint:', API_ENDPOINTS.LEARNING.PROGRESS.COMPLETE_LESSON(selectedLesson._id));
        
        // Save final completion data to videohistory database
        const completionData = {
          lessonId: selectedLesson._id,
          courseId: courseId,
          studentId: user?._id,
          currentTime: 0, // Will be updated by the video player state
          duration: 0, // Will be updated by the video player state
          watchedPercentage: 100,
          maxWatched: 0, // Will be updated by the video player state
          lastWatchedAt: new Date().toISOString(),
          isCompleted: true,
          completedAt: new Date().toISOString()
        };

        console.log('🎯 Saving completion data to videohistory:', completionData);
        
        // Try backend API first (in case it's implemented later)
        try {
          const response = await apiService.post(API_ENDPOINTS.LEARNING.PROGRESS.COMPLETE_LESSON(selectedLesson._id));
          console.log('🎯 Lesson completion response:', response);
          toast.success('Lesson completed! 🎉');
        } catch (apiError) {
          // If backend endpoint doesn't exist, handle locally
          if (apiError.response?.status === 404) {
            console.log('🎯 Backend endpoint not found, handling completion locally');
            toast.success('Lesson completed! 🎉 (Local tracking only)');
          } else {
            throw apiError; // Re-throw other errors
          }
        }

        // Always save to videohistory database/localStorage
        try {
          await apiService.post(API_ENDPOINTS.LEARNING.PROGRESS.UPDATE_VIDEO_PROGRESS(selectedLesson._id), completionData);
          console.log('🎯 Completion saved to videohistory database');
        } catch (saveError) {
          console.log('🎯 Videohistory save failed, using localStorage');
          const storageKey = `videoHistory_${selectedLesson._id}`;
          localStorage.setItem(storageKey, JSON.stringify(completionData));
        }
        
        // Update local progress data regardless of backend response
        setProgressData(prev => ({
          ...prev,
          lessons: prev?.lessons?.map(l => 
            l.lesson?._id === selectedLesson._id 
              ? { ...l, isCompleted: true }
              : l
          ) || []
        }));

        console.log('🎯 Updated local progress data with lesson:', selectedLesson._id);

        // Save course completion status
        if (lessons && lessons.length > 0) {
          const updatedLessons = progressData?.lessons?.map(l => 
            l.lesson?._id === selectedLesson._id 
              ? { ...l, isCompleted: true }
              : l
          ) || [];
          const completedCount = updatedLessons.filter(l => l.isCompleted).length;
          const totalLessons = lessons.length;
          const courseProgress = (completedCount / totalLessons) * 100;
          
          const courseCompletionData = {
            courseId: courseId,
            studentId: user?._id,
            completedLessons: updatedLessons.filter(l => l.isCompleted).map(l => l.lesson._id),
            totalLessons: totalLessons,
            courseProgress: courseProgress,
            isCourseCompleted: courseProgress >= 100,
            lastCompletedAt: new Date().toISOString()
          };

          console.log('🎯 Saving course completion data:', courseCompletionData);
          
          // 🎓 AUTO-GENERATE CERTIFICATE IF COURSE COMPLETED
          if (courseProgress >= 100) {
            try {
              console.log('🎓 Course completed! Generating certificate...');
              console.log('🎓 Available course data:', course);
              
              // 🔥 Safety check - ensure course data is available
              if (!course) {
                console.error('🎓 Course data not available for certificate generation');
                toast.error('Course completed! Certificate generation failed - course data not available. Please refresh and try again.');
                return;
              }
              
              // 🔥 Ensure all required fields are sent correctly
              const certificateData = {
                courseId: courseId,
                courseName: course?.title || 'Course',
                studentName: user?.name || 'Student',
                trainerName: course?.trainerId?.name || course?.trainerName || 'Instructor'
              };
              
              console.log('🎓 Certificate data being sent:', certificateData);
              
              // Generate certificate automatically
              const certificateResponse = await apiService.post(API_ENDPOINTS.CERTIFICATES.GENERATE, certificateData);
              console.log('🎓 Certificate generated successfully:', certificateResponse.data);
              
              // Show success message to student
              toast.success('🎉 Congratulations! Course completed! Certificate generated and pending approval.');
              
              // Optionally redirect to certificates page
              setTimeout(() => {
                if (window.confirm('Course completed! Would you like to view your certificates?')) {
                  window.location.href = '/student/certificates';
                }
              }, 2000);
              
            } catch (certificateError) {
              console.error('🎓 Certificate generation failed:', certificateError);
              console.error('🎓 Error details:', certificateError.response?.data || certificateError.message);
              
              // 🔥 Better error handling - show specific error
              const errorMessage = certificateError.response?.data?.message || 
                                 certificateError.message || 
                                 'Certificate generation failed. Please try again.';
              
              toast.error(`Course completed! ${errorMessage}`);
              
              // 🔥 Fallback - Still mark course as completed even if certificate fails
              console.log('🎓 Course marked as completed, certificate will be generated later');
            }
          }
          
          // Save course progress to localStorage for dashboard persistence
          const courseProgressKey = `courseProgress_${courseId}_${user?._id}`;
          localStorage.setItem(courseProgressKey, JSON.stringify(courseCompletionData));
        }

        // Refresh course data to update overall progress
        setTimeout(() => {
          fetchCourseData();
        }, 1000);
        
      } catch (error) {
        console.error('🎯 Lesson completion error:', error);
        console.error('🎯 Error response:', error.response);
        console.error('🎯 Error status:', error.response?.status);
        console.error('🎯 Error data:', error.response?.data);
        
        // Show more specific error message
        if (error.response?.status === 403) {
          toast.error('You do not have permission to mark this lesson complete');
        } else if (error.response?.status === 401) {
          toast.error('Please login to mark lessons complete');
        } else {
          toast.error(`Failed to mark lesson complete: ${error.response?.data?.message || error.message}`);
        }
      }
    }
  }, [selectedLesson, fetchCourseData, courseId, user?._id, lessons, progressData]);

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
              <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600 mt-1">{course.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
                  <ChartBarIcon className="h-4 w-4" />
                  {progressData?.lessons?.filter(l => l.isCompleted).length || 0}/{lessons.length} completed
                </div>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center space-x-2 text-sm font-medium"
              >
                <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BookOpenIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Course Content
                  </h2>
                  <div className="text-xs text-gray-500">
                    {progressData?.lessons?.filter(l => l.isCompleted).length || 0}/{lessons.length} lessons
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Overall Progress</span>
                    <span>{progressData?.progressPercentage || 0}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${progressData?.progressPercentage || 0}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  {modules.length > 0 ? (
                    modules.map((module) => (
                      <ModuleAccordion
                        key={module.id}
                        module={module}
                        lessons={lessons}
                        selectedLessonId={selectedLesson?._id}
                        onLessonSelect={(lesson) => {
                          navigate(`/student/courses/${courseId}/lesson/${lesson._id}`);
                        }}
                        progressData={progressData}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No lessons available yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <EnhancedVideoPlayer
                  lesson={selectedLesson}
                  onProgressUpdate={handleProgressUpdate}
                  onLessonComplete={handleLessonComplete}
                  allLessons={lessons}
                  courseId={courseId}
                />

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedLesson.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          {selectedLesson.duration || 0} minutes
                        </span>
                        <span className="flex items-center space-x-1">
                          <BookOpenIcon className="h-4 w-4" />
                          Lesson {selectedLesson.sequence || 1}
                        </span>
                        {(() => {
            // Check if this lesson is completed from the lessons array
            const lessonProgress = progressData?.lessons?.find(l => l.lesson?._id === selectedLesson._id);
            const isCompleted = lessonProgress?.isCompleted || false;
            
            return isCompleted && (
              <span className="flex items-center space-x-1 text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                Completed
              </span>
            );
          })()}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toast.info('AI Assistant coming soon!')}
                      className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1 text-sm font-medium"
                    >
                      <QuestionMarkCircleIcon className="h-4 w-4" />
                      Help
                    </button>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedLesson.description || 'No description available for this lesson.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Lesson</h3>
                <p className="text-gray-600">Choose a lesson from the course content panel to start learning.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCoursePlayer;
