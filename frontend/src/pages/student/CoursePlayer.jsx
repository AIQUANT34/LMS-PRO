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
  StarIcon,
  PencilIcon,
  PaperClipIcon,
  VideoCameraIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const CoursePlayer = () => {
  const { id, courseId } = useParams();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(1);
  const [completedLessons, setCompletedLessons] = useState(new Set([1, 2]));
  const [bookmarkedLessons, setBookmarkedLessons] = useState(new Set([3]));
  const [notes, setNotes] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState(new Set([1, 2]));

  // Mock course data
  const course = {
    id: courseId,
    title: 'Complete React Development Course - 2024',
    instructor: 'John Doe',
    totalLessons: 234,
    completedLessons: 45,
    totalDuration: '42 hours',
    progress: 19,
    curriculum: [
      {
        id: 1,
        title: 'Introduction to React',
        lessons: [
          { id: 1, title: 'Course Introduction', duration: '15:23', type: 'video', completed: true, current: true },
          { id: 2, title: 'Setting Up Development Environment', duration: '12:45', type: 'video', completed: true },
          { id: 3, title: 'React Fundamentals Quiz', duration: '10 questions', type: 'quiz', bookmarked: true },
          { id: 4, title: 'Your First React App', duration: '18:30', type: 'video', completed: false }
        ]
      },
      {
        id: 2,
        title: 'React Components & Props',
        lessons: [
          { id: 5, title: 'Understanding Components', duration: '22:15', type: 'video', completed: false },
          { id: 6, title: 'Working with Props', duration: '19:40', type: 'video', completed: false },
          { id: 7, title: 'Component Best Practices', duration: '16:20', type: 'video', completed: false },
          { id: 8, title: 'Components Exercise', duration: '25:10', type: 'video', completed: false }
        ]
      },
      {
        id: 3,
        title: 'State Management with Hooks',
        lessons: [
          { id: 9, title: 'Introduction to Hooks', duration: '20:30', type: 'video', completed: false },
          { id: 10, title: 'useState Hook Deep Dive', duration: '24:15', type: 'video', completed: false },
          { id: 11, title: 'useEffect and Side Effects', duration: '28:45', type: 'video', completed: false },
          { id: 12, title: 'Custom Hooks', duration: '21:30', type: 'video', completed: false }
        ]
      }
    ],
    resources: [
      { id: 1, name: 'React Documentation.pdf', type: 'pdf', size: '2.4 MB' },
      { id: 2, name: 'Project Starter Code.zip', type: 'zip', size: '15.7 MB' },
      { id: 3, name: 'Cheatsheet.png', type: 'image', size: '1.2 MB' }
    ],
    transcript: [
      { time: '00:00', text: 'Welcome to this comprehensive React development course!' },
      { time: '00:15', text: 'In this first lesson, we\'ll cover the fundamentals of React and why it\'s so popular.' },
      { time: '00:30', text: 'React is a JavaScript library for building user interfaces, particularly web applications.' },
      { time: '00:45', text: 'It was created by Facebook and is now maintained by Meta and the open-source community.' },
      { time: '01:00', text: 'Let\'s start by understanding what makes React different from other frameworks.' }
    ]
  };

  const currentLessonData = course.curriculum
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === currentLesson);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (e.target.value / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = e.target.value / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changePlaybackSpeed = (speed) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('video-container');
    if (!container) return;

    if (!isFullscreen) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const markLessonComplete = (lessonId) => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const toggleBookmark = (lessonId) => {
    setBookmarkedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const VideoControls = () => (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-white mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <PauseIcon className="h-5 w-5 text-white" />
            ) : (
              <PlayIcon className="h-5 w-5 text-white ml-1" />
            )}
          </button>

          {/* Skip Backward */}
          <button className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
            <BackwardIcon className="h-4 w-4 text-white" />
          </button>

          {/* Skip Forward */}
          <button className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
            <ForwardIcon className="h-4 w-4 text-white" />
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-white hover:text-gray-300 transition-colors">
              {isMuted ? (
                <SpeakerXMarkIcon className="h-5 w-5" />
              ) : (
                <SpeakerWaveIcon className="h-5 w-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Cog6TootIcon className="h-5 w-5" />
            </button>
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg p-2 min-w-[120px]"
                >
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => changePlaybackSpeed(speed)}
                      className={`w-full text-left px-3 py-1 text-sm rounded hover:bg-gray-800 ${
                        playbackSpeed === speed ? 'text-blue-400' : 'text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-gray-300 transition-colors"
          >
            {isFullscreen ? (
              <ArrowsPointingInIcon className="h-5 w-5" />
            ) : (
              <ArrowsPointingOutIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
    }`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Course Content</h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {completedLessons.size} of {course.totalLessons} lessons completed
        </div>
      </div>

      {/* Curriculum */}
      <div className="overflow-y-auto h-[calc(100vh-200px)]">
        {course.curriculum.map((module) => (
          <div key={module.id} className="border-b border-gray-100">
            <button
              onClick={() => toggleModuleExpansion(module.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded flex items-center justify-center">
                  {expandedModules.has(module.id) ? (
                    <ChevronDownIcon className="h-3 w-3 text-primary-600" />
                  ) : (
                    <ChevronRightIcon className="h-3 w-3 text-primary-600" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 text-sm">{module.title}</div>
                  <div className="text-xs text-gray-500">
                    {module.lessons.length} lessons
                  </div>
                </div>
              </div>
            </button>

            <AnimatePresence>
              {expandedModules.has(module.id) && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson.id)}
                      className={`w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                        lesson.id === currentLesson ? 'bg-primary-50 border-l-2 border-primary-600' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {/* Lesson Type Icon */}
                        <div className="w-6 h-6 flex items-center justify-center">
                          {lesson.type === 'video' ? (
                            <VideoCameraIcon className="h-3 w-3 text-gray-400" />
                          ) : (
                            <DocumentTextIcon className="h-3 w-3 text-gray-400" />
                          )}
                        </div>

                        {/* Lesson Info */}
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {lesson.title}
                          </div>
                          <div className="text-xs text-gray-500">{lesson.duration}</div>
                        </div>

                        {/* Status Icons */}
                        <div className="flex items-center gap-2">
                          {completedLessons.has(lesson.id) && (
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          )}
                          {bookmarkedLessons.has(lesson.id) && (
                            <BookmarkIcon className="h-4 w-4 text-yellow-500" />
                          )}
                          {lesson.id === currentLesson && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(lesson.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <BookmarkIcon 
                            className={`h-3 w-3 ${
                              bookmarkedLessons.has(lesson.id) ? 'text-yellow-500 fill-current' : 'text-gray-400'
                            }`}
                          />
                        </button>
                        {lesson.type === 'video' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markLessonComplete(lesson.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <CheckCircleIcon 
                              className={`h-3 w-3 ${
                                completedLessons.has(lesson.id) ? 'text-green-500' : 'text-gray-400'
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );

  const NotesPanel = () => (
    <AnimatePresence>
      {showNotes && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-40"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notes</h3>
              <button
                onClick={() => setShowNotes(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes while watching..."
              className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">{notes.length} characters</span>
              <button className="btn-premium text-sm">
                Save Notes
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const TranscriptPanel = () => (
    <AnimatePresence>
      {showTranscript && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-40"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Transcript</h3>
              <button
                onClick={() => setShowTranscript(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
            {course.transcript.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="text-xs text-gray-500 mb-1">{item.time}</div>
                <div className="text-sm text-gray-700">{item.text}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ResourcesPanel = () => (
    <AnimatePresence>
      {showResources && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-40"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Resources</h3>
              <button
                onClick={() => setShowResources(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              {course.resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                      <div className="text-xs text-gray-500">{resource.size}</div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowDownTrayIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/student/courses`} className="text-gray-300 hover:text-white">
              <ArrowRightIcon className="h-5 w-5 rotate-180" />
            </Link>
            <div>
              <h1 className="text-white font-semibold">{course.title}</h1>
              <p className="text-gray-400 text-sm">Lesson {currentLesson}: {currentLessonData?.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded-lg transition-colors ${
                showNotes ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className={`p-2 rounded-lg transition-colors ${
                showTranscript ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <DocumentTextIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowResources(!showResources)}
              className={`p-2 rounded-lg transition-colors ${
                showResources ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <PaperClipIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:bg-gray-700"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div id="video-container" className="relative bg-black flex-1">
            <video
              ref={videoRef}
              className="w-full h-full"
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            />
            
            <VideoControls />
            
            {/* Center Play Button */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <PlayIcon className="h-10 w-10 text-white ml-1" />
              </button>
            )}
          </div>

          {/* Lesson Info */}
          <div className="bg-gray-800 p-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold">{currentLessonData?.title}</h2>
                <p className="text-gray-400 text-sm">{currentLessonData?.duration}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => markLessonComplete(currentLesson)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    completedLessons.has(currentLesson)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {completedLessons.has(currentLesson) ? 'Completed' : 'Mark as Complete'}
                </button>
                
                <button
                  onClick={() => toggleBookmark(currentLesson)}
                  className={`p-2 rounded-lg transition-colors ${
                    bookmarkedLessons.has(currentLesson)
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <BookmarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panels */}
      <NotesPanel />
      <TranscriptPanel />
      <ResourcesPanel />
    </div>
  );
};

export default CoursePlayer;
