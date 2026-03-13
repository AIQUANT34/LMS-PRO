import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  AcademicCapIcon,
  BookOpenIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PlayIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Bars3Icon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowUpTrayIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  FireIcon,
  BeakerIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  FolderIcon,
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  LockClosedIcon,
  LockOpenIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const CourseBuilder = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Mock course data
  const mockCourse = {
    id: courseId || 'new',
    title: 'Complete React Development Course - 2024',
    description: 'Master React from scratch to advanced concepts including Redux, Next.js, and deployment',
    category: 'Development',
    level: 'Intermediate',
    price: 89.99,
    originalPrice: 199.99,
    thumbnail: 'https://via.placeholder.com/800x400',
    status: 'draft',
    publishedAt: null,
    students: 0,
    rating: 0,
    reviews: 0,
    revenue: 0,
    tags: ['React', 'JavaScript', 'TypeScript', 'Next.js', 'Redux'],
    bestseller: false,
    hot: false,
    featured: false
  };

  // Mock modules data
  const mockModules = [
    {
      id: 1,
      title: 'Introduction to React',
      description: 'Get started with React fundamentals and core concepts',
      order: 1,
      duration: '2 hours 30 minutes',
      lessons: [
        {
          id: 1,
          title: 'What is React?',
          type: 'video',
          duration: '15:30',
          order: 1,
          preview: true,
          content: {
            videoUrl: 'https://example.com/video1.mp4',
            transcript: 'React is a JavaScript library for building user interfaces...',
            resources: [
              { name: 'React Documentation.pdf', type: 'pdf', url: '#' },
              { name: 'Setup Guide.md', type: 'md', url: '#' }
            ]
          }
        },
        {
          id: 2,
          title: 'Setting Up Development Environment',
          type: 'video',
          duration: '22:15',
          order: 2,
          preview: true,
          content: {
            videoUrl: 'https://example.com/video2.mp4',
            transcript: 'Setting up your React development environment...',
            resources: []
          }
        },
        {
          id: 3,
          title: 'Your First React Component',
          type: 'video',
          duration: '18:45',
          order: 3,
          preview: false,
          content: {
            videoUrl: 'https://example.com/video3.mp4',
            transcript: 'Creating your first React component...',
            resources: []
          }
        }
      ],
      quiz: {
        id: 1,
        title: 'React Basics Quiz',
        questions: 5,
        duration: '10 minutes',
        passingScore: 70
      }
    },
    {
      id: 2,
      title: 'Components and Props',
      description: 'Deep dive into React components and how to pass data between them',
      order: 2,
      duration: '3 hours 15 minutes',
      lessons: [
        {
          id: 4,
          title: 'Understanding Components',
          type: 'video',
          duration: '25:30',
          order: 1,
          preview: false,
          content: {
            videoUrl: 'https://example.com/video4.mp4',
            transcript: 'Understanding React components...',
            resources: []
          }
        },
        {
          id: 5,
          title: 'Props and PropTypes',
          type: 'video',
          duration: '20:15',
          order: 2,
          preview: false,
          content: {
            videoUrl: 'https://example.com/video5.mp4',
            transcript: 'Working with props and PropTypes...',
            resources: []
          }
        },
        {
          id: 6,
          title: 'Component Exercise',
          type: 'assignment',
          duration: '45 minutes',
          order: 3,
          preview: false,
          content: {
            description: 'Build a simple component library...',
            resources: [
              { name: 'Exercise Files.zip', type: 'zip', url: '#' }
            ]
          }
        }
      ],
      quiz: {
        id: 2,
        title: 'Components and Props Quiz',
        questions: 8,
        duration: '15 minutes',
        passingScore: 75
      }
    },
    {
      id: 3,
      title: 'State and Lifecycle',
      description: 'Learn about React state management and component lifecycle methods',
      order: 3,
      duration: '2 hours 45 minutes',
      lessons: [
        {
          id: 7,
          title: 'Introduction to State',
          type: 'video',
          duration: '18:20',
          order: 1,
          preview: false,
          content: {
            videoUrl: 'https://example.com/video7.mp4',
            transcript: 'Introduction to React state...',
            resources: []
          }
        },
        {
          id: 8,
          title: 'Component Lifecycle',
          type: 'video',
          duration: '22:10',
          order: 2,
          preview: false,
          content: {
            videoUrl: 'https://example.com/video8.mp4',
            transcript: 'React component lifecycle methods...',
            resources: []
          }
        }
      ],
      quiz: {
        id: 3,
        title: 'State and Lifecycle Quiz',
        questions: 6,
        duration: '12 minutes',
        passingScore: 70
      }
    }
  ];

  useEffect(() => {
    // Simulate API call to get course data
    setTimeout(() => {
      setCourse(mockCourse);
      setModules(mockModules);
    }, 500);
  }, [courseId]);

  const handleDragStart = (e, item, type, moduleId) => {
    setDraggedItem({ ...item, type, moduleId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetModuleId) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.type === 'lesson') {
      // Move lesson between modules
      const updatedModules = modules.map(module => {
        if (module.id === draggedItem.moduleId) {
          return {
            ...module,
            lessons: module.lessons.filter(lesson => lesson.id !== draggedItem.id)
          };
        }
        if (module.id === targetModuleId) {
          return {
            ...module,
            lessons: [...module.lessons, { ...draggedItem, order: module.lessons.length + 1 }]
          };
        }
        return module;
      });
      setModules(updatedModules);
    } else if (draggedItem.type === 'module') {
      // Reorder modules
      const draggedIndex = modules.findIndex(m => m.id === draggedItem.id);
      const targetIndex = modules.findIndex(m => m.id === targetModuleId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newModules = [...modules];
        const [draggedModule] = newModules.splice(draggedIndex, 1);
        newModules.splice(targetIndex, 0, draggedModule);
        setModules(newModules.map((module, index) => ({ ...module, order: index + 1 })));
      }
    }
    
    setDraggedItem(null);
  };

  const toggleModuleExpansion = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleAddModule = () => {
    const newModule = {
      id: Date.now(),
      title: `Module ${modules.length + 1}`,
      description: 'New module description',
      order: modules.length + 1,
      duration: '0 minutes',
      lessons: [],
      quiz: null
    };
    setModules([...modules, newModule]);
  };

  const handleAddLesson = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      const newLesson = {
        id: Date.now(),
        title: `Lesson ${module.lessons.length + 1}`,
        type: 'video',
        duration: '0:00',
        order: module.lessons.length + 1,
        preview: false,
        content: {
          videoUrl: '',
          transcript: '',
          resources: []
        }
      };
      
      const updatedModules = modules.map(m => 
        m.id === moduleId 
          ? { ...m, lessons: [...m.lessons, newLesson] }
          : m
      );
      setModules(updatedModules);
    }
  };

  const handleAddQuiz = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      const newQuiz = {
        id: Date.now(),
        title: `Module ${module.order} Quiz`,
        questions: 0,
        duration: '0 minutes',
        passingScore: 70
      };
      
      const updatedModules = modules.map(m => 
        m.id === moduleId 
          ? { ...m, quiz: newQuiz }
          : m
      );
      setModules(updatedModules);
    }
  };

  const handleDeleteModule = (moduleId) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const handleDeleteLesson = (moduleId, lessonId) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
        };
      }
      return module;
    });
    setModules(updatedModules);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizModal(true);
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return <VideoCameraIcon className="h-4 w-4" />;
      case 'assignment': return <DocumentTextIcon className="h-4 w-4" />;
      case 'quiz': return <QuestionMarkCircleIcon className="h-4 w-4" />;
      default: return <DocumentIcon className="h-4 w-4" />;
    }
  };

  const getLessonTypeColor = (type) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-600';
      case 'assignment': return 'bg-green-100 text-green-600';
      case 'quiz': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const ModuleCard = ({ module, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-premium mb-4"
      draggable
      onDragStart={(e) => handleDragStart(e, module, 'module', module.id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, module.id)}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpenIcon className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{module.title}</h3>
            <p className="text-sm text-gray-600">{module.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{module.duration}</span>
          <button
            onClick={() => toggleModuleExpansion(module.id)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {expandedModules.has(module.id) ? (
              <ArrowUpIcon className="h-4 w-4 text-gray-600" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-gray-600" />
            )}
          </button>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <EllipsisVerticalIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expandedModules.has(module.id) && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Lessons */}
              <div className="space-y-2">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    draggable
                    onDragStart={(e) => handleDragStart(e, lesson, 'lesson', module.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, module.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getLessonTypeColor(lesson.type)}`}>
                        {getLessonIcon(lesson.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{lesson.title}</span>
                          {lesson.preview && (
                            <span className="badge-info">Preview</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ClockIcon className="h-3 w-3" />
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditLesson(lesson)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <PencilIcon className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(module.id, lesson.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                      >
                        <TrashIcon className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quiz */}
              {module.quiz && (
                <div
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
                  onClick={() => handleEditQuiz(module.quiz)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <QuestionMarkCircleIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{module.quiz.title}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{module.quiz.questions} questions</span>
                        <span>•</span>
                        <span>{module.quiz.duration}</span>
                        <span>•</span>
                        <span>{module.quiz.passingScore}% to pass</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-purple-200 rounded transition-colors">
                      <PencilIcon className="h-4 w-4 text-purple-600" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add Content Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleAddLesson(module.id)}
                  className="btn-premium-outline text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Lesson
                </button>
                <button
                  onClick={() => handleAddQuiz(module.id)}
                  className="btn-premium-outline text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Quiz
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course builder...</p>
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
            <div className="flex items-center gap-4">
              <Link to="/trainer/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowRightIcon className="h-5 w-5 rotate-180" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Course Builder</h1>
                <p className="text-gray-600">{course.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="btn-premium-outline">
                <EyeIcon className="h-4 w-4 mr-2" />
                Preview
              </button>
              <button className="btn-premium">
                <UploadIcon className="h-4 w-4 mr-2" />
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                <button
                  onClick={handleAddModule}
                  className="btn-premium"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Module
                </button>
              </div>
              
              {/* Modules */}
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <ModuleCard key={module.id} module={module} index={index} />
                ))}
              </div>

              {modules.length === 0 && (
                <div className="text-center py-12">
                  <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Modules Yet</h3>
                  <p className="text-gray-600 mb-4">Start building your course by adding your first module.</p>
                  <button
                    onClick={handleAddModule}
                    className="btn-premium"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add First Module
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={course.description}
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={course.category}
                      onChange={(e) => setCourse({ ...course, category: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="development">Development</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="data-science">Data Science</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select
                      value={course.level}
                      onChange={(e) => setCourse({ ...course, level: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    value={course.price}
                    onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) })}
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Statistics</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Modules</span>
                  <span className="font-semibold text-gray-900">{modules.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Lessons</span>
                  <span className="font-semibold text-gray-900">
                    {modules.reduce((total, module) => total + module.lessons.length, 0)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Quizzes</span>
                  <span className="font-semibold text-gray-900">
                    {modules.filter(module => module.quiz).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estimated Duration</span>
                  <span className="font-semibold text-gray-900">
                    {modules.reduce((total, module) => {
                      const [hours, minutes] = module.duration.split(' ');
                      return total + parseInt(hours) + parseInt(minutes) / 60;
                    }, 0).toFixed(1)} hours
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Builder Tips</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <InformationCircleIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Drag and drop lessons to reorder them within modules
                  </p>
                </div>
                
                <div className="flex items-start gap-2">
                  <InformationCircleIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Mark lessons as preview to give students a sneak peek
                  </p>
                </div>
                
                <div className="flex items-start gap-2">
                  <InformationCircleIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Add quizzes to test student understanding
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Modal */}
      <AnimatePresence>
        {showLessonModal && selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Lesson</h2>
                <button
                  onClick={() => setShowLessonModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                  <input
                    type="text"
                    value={selectedLesson.title}
                    onChange={(e) => setSelectedLesson({ ...selectedLesson, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Type</label>
                  <select
                    value={selectedLesson.type}
                    onChange={(e) => setSelectedLesson({ ...selectedLesson, type: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="video">Video</option>
                    <option value="assignment">Assignment</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
                
                {selectedLesson.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                    <input
                      type="url"
                      value={selectedLesson.content?.videoUrl || ''}
                      onChange={(e) => setSelectedLesson({
                        ...selectedLesson,
                        content: { ...selectedLesson.content, videoUrl: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={selectedLesson.duration}
                    onChange={(e) => setSelectedLesson({ ...selectedLesson, duration: e.target.value })}
                    placeholder="0:00"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="preview"
                    checked={selectedLesson.preview}
                    onChange={(e) => setSelectedLesson({ ...selectedLesson, preview: e.target.checked })}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="preview" className="text-sm text-gray-700">
                    Mark as preview lesson
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowLessonModal(false)}
                  className="btn-premium-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save lesson logic here
                    setShowLessonModal(false);
                  }}
                  className="btn-premium"
                >
                  Save Lesson
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseBuilder;
