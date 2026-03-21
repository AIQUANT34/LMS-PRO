import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  BookOpenIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ChartBarIcon,
  VideoCameraIcon,
  DocumentIcon,
  QuestionMarkCircleIcon,
  ArrowUpTrayIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = id;

  // Utility function to validate MongoDB ObjectId
  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academic',
    level: 'beginner',
    language: 'english',
    duration: 1,
    price: 0,
    tags: [],
    status: 'draft',
    thumbnail: '',
    isPublic: true
  });
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [modules, setModules] = useState([]);

  // Utility function to get valid lesson type for backend
  const getValidLessonType = (type) => {
    // Backend supported types (based on error message, 'pdf' is not supported)
    const supportedTypes = ['video', 'text', 'quiz', 'assignment'];
    
    // Map unsupported types to supported ones
    const typeMapping = {
      'pdf': 'text',        // PDF lessons treated as text lessons
      'document': 'text',   // Document lessons treated as text lessons
      'presentation': 'text', // Presentation lessons treated as text lessons
      'audio': 'text',      // Audio lessons treated as text lessons
      'scorm': 'text',      // SCORM lessons treated as text lessons
    };
    
    // Return mapped type or original if already supported
    const mappedType = typeMapping[type] || type;
    
    // Final fallback to 'video' if still not supported
    return supportedTypes.includes(mappedType) ? mappedType : 'video';
  };

  // Utility function to clean lesson data for backend
  const cleanLessonData = (lesson, courseStatus = null) => {
    // Clean the content object based on lesson type
    let cleanContent = {};
    if (lesson.content) {
      if (typeof lesson.content === 'string') {
        try {
          const parsed = JSON.parse(lesson.content);
          
          // Build content based on lesson type
          if (lesson.type === 'video') {
            cleanContent = {
              videoUrl: parsed.videoUrl || '',
              textContent: parsed.textContent || '',
              resources: parsed.resources || []
            };
          } else if (lesson.type === 'pdf') {
            cleanContent = {
              pdfUrl: parsed.pdfUrl || '',
              textContent: parsed.textContent || '',
              resources: parsed.resources || []
            };
          } else if (lesson.type === 'text') {
            cleanContent = {
              textContent: parsed.textContent || '',
              resources: parsed.resources || []
            };
          } else {
            // Default for quiz, assignment, etc.
            cleanContent = {
              textContent: parsed.textContent || '',
              resources: parsed.resources || []
            };
          }
        } catch {
          // Fallback based on type
          if (lesson.type === 'video') {
            cleanContent = { videoUrl: '', textContent: lesson.content || '', resources: [] };
          } else if (lesson.type === 'pdf') {
            cleanContent = { pdfUrl: '', textContent: lesson.content || '', resources: [] };
          } else {
            cleanContent = { textContent: lesson.content || '', resources: [] };
          }
        }
      } else {
        // Handle object content
        if (lesson.type === 'video') {
          cleanContent = {
            videoUrl: lesson.content.videoUrl || '',
            textContent: lesson.content.textContent || '',
            resources: lesson.content.resources || []
          };
        } else if (lesson.type === 'pdf') {
          cleanContent = {
            pdfUrl: lesson.content.pdfUrl || '',
            textContent: lesson.content.textContent || '',
            resources: lesson.content.resources || []
          };
        } else {
          cleanContent = {
            textContent: lesson.content.textContent || '',
            resources: lesson.content.resources || []
          };
        }
      }
    }

    return {
      title: lesson.title || 'Untitled Lesson',
      description: lesson.description || 'Lesson description', // Required non-empty string
      content: JSON.stringify(cleanContent), // Must be string
      type: getValidLessonType(lesson.type), // Map to supported types
      moduleId: lesson.moduleId || 'default_module', // Required string
      isPublished: courseStatus === 'published', // Set published status based on course status
      // Only include fields that backend expects
    };
  };

  // Module and lesson management
  const addModule = () => {
    const newModule = {
      id: `module_${Date.now()}`, // Simplified ID format
      title: `Module ${modules.length + 1}`,
      description: '',
      lessons: [],
      isExpanded: true
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (moduleId, field, value) => {
    setModules(modules.map(module => 
      module.id === moduleId ? { ...module, [field]: value } : module
    ));
  };

  const deleteModule = (moduleId) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const toggleModuleExpansion = (moduleId) => {
    setModules(modules.map(module => 
      module.id === moduleId ? { ...module, isExpanded: !module.isExpanded } : module
    ));
  };

  const addLesson = (moduleId) => {
    const newLesson = {
      id: `lesson_${Date.now()}`, // Simplified ID format
      title: '',
      description: 'Lesson description', // Required non-empty field for backend
      type: 'video', // video, text, quiz, assignment
      content: {
        videoUrl: '',
        textContent: '',
        resources: []
      }
      // Remove fields that backend doesn't expect: duration, isPublished, isFree, order
    };
    
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: [...module.lessons, newLesson] }
        : module
    ));
  };

  const updateLesson = (moduleId, lessonId, field, value) => {
    setModules(modules.map(module => {
      if (module.id === moduleId) {
        const updatedLessons = module.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
        );
        return { ...module, lessons: updatedLessons };
      }
      return module;
    }));
  };

  const updateLessonContent = (moduleId, lessonId, contentField, value) => {
    setModules(modules.map(module => {
      if (module.id === moduleId) {
        const updatedLessons = module.lessons.map(lesson => {
          if (lesson.id === lessonId) {
            return {
              ...lesson,
              content: { ...lesson.content, [contentField]: value }
            };
          }
          return lesson;
        });
        return { ...module, lessons: updatedLessons };
      }
      return module;
    }));
  };

  const deleteLesson = (moduleId, lessonId) => {
    setModules(modules.map(module => {
      if (module.id === moduleId) {
        const updatedLessons = module.lessons.filter(lesson => lesson.id !== lessonId);
        return { ...module, lessons: updatedLessons };
      }
      return module;
    }));
  };

  const moveLesson = (moduleId, lessonId, direction) => {
    setModules(modules.map(module => {
      if (module.id === moduleId) {
        const lessons = [...module.lessons];
        const lessonIndex = lessons.findIndex(l => l.id === lessonId);
        
        if (direction === 'up' && lessonIndex > 0) {
          [lessons[lessonIndex], lessons[lessonIndex - 1]] = [lessons[lessonIndex - 1], lessons[lessonIndex]];
        } else if (direction === 'down' && lessonIndex < lessons.length - 1) {
          [lessons[lessonIndex], lessons[lessonIndex + 1]] = [lessons[lessonIndex + 1], lessons[lessonIndex]];
        }
        
        return { ...module, lessons };
      }
      return module;
    }));
  };

  const handleFileUpload = (moduleId, lessonId, fileType, file) => {
    // In a real app, this would upload to a server
    // For now, we'll simulate with a URL
    const mockUrl = URL.createObjectURL(file);
    
    if (fileType === 'video') {
      updateLessonContent(moduleId, lessonId, 'videoUrl', mockUrl);
      updateLessonContent(moduleId, lessonId, 'duration', 0); // Would be calculated from video
    } else if (fileType === 'pdf') {
      updateLessonContent(moduleId, lessonId, 'pdfUrl', mockUrl);
    } else if (fileType === 'image') {
      updateLessonContent(moduleId, lessonId, 'imageUrl', mockUrl);
    }
    
    toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded successfully`);
  };

  // Fetch course data on component mount
  useEffect(() => {

    const fetchCourseData = async () => {
      
      if (!courseId) {
        toast.error('No course ID provided');
        navigate('/trainer/courses', { state: { refresh: true } });
        return;
      }

      try {
        setIsLoading(true);
        
        // Method 1: Try trainer courses list first (most reliable)
        let course = null;
        
        try {
          const trainerResponse = await apiService.get(API_ENDPOINTS.COURSES.GET_TRAINER_COURSES);
          
          // Handle different response structures (same as MyCourses)
          let coursesData = [];
          if (trainerResponse && trainerResponse.data && trainerResponse.data.courses) {
            coursesData = trainerResponse.data.courses;
          } else if (trainerResponse && trainerResponse.courses) {
            coursesData = trainerResponse.courses;
          } else if (trainerResponse && Array.isArray(trainerResponse.data)) {
            coursesData = trainerResponse.data;
          } else if (Array.isArray(trainerResponse)) {
            coursesData = trainerResponse;
          } else {
            coursesData = [];
          }
          
          
          if (coursesData.length > 0) {
            
            course = coursesData.find(c => 
              c._id === courseId || c.id === courseId
            );
          } else {
          }
        } catch (trainerError) {
        }

        // Method 2: Fallback to direct course endpoint
        if (!course) {
          
          try {
            const directResponse = await apiService.get(API_ENDPOINTS.COURSES.GET_BY_ID(courseId));
            course = directResponse?.data?.course || directResponse?.data;
          } catch (directError) {
          }
        }


        if (!course) {
          toast.error('Course not found or access denied');
          navigate('/trainer/courses', { state: { refresh: true } });
          return;
        }

        setCourseData(course);
        
        // Set form data with course values
        const formDataToSet = {
          title: course.title || '',
          description: course.description || '',
          category: course.category || 'academic',
          level: course.level || 'beginner',
          language: course.language || 'english',
          duration: course.duration || 1,
          price: course.price || 0,
          tags: course.tags || [],
          status: course.status || 'draft',
          thumbnail: course.thumbnail || '',
          isPublic: course.isPublic !== false
        };
        
        setFormData(formDataToSet);

        // Set modules if available
        if (course.modules && Array.isArray(course.modules)) {
          setModules(course.modules);
        } else {
          // Try to fetch curriculum data separately
          try {
            const curriculumResponse = await apiService.get(API_ENDPOINTS.LEARNING.LESSONS.GET_BY_COURSE(courseId));
            
            if (curriculumResponse.data && curriculumResponse.data.lessons) {
              // Group lessons by modules and clean them
              const lessonsByModule = {};
              curriculumResponse.data.lessons.forEach(lesson => {
                const moduleId = lesson.moduleId || 'default';
                if (!lessonsByModule[moduleId]) {
                  lessonsByModule[moduleId] = {
                    id: moduleId,
                    title: lesson.moduleTitle || `Module ${Object.keys(lessonsByModule).length + 1}`,
                    description: '',
                    lessons: [],
                    isExpanded: true
                  };
                }
                // Clean the lesson data to only include expected fields
                const cleanedLesson = {
                  id: lesson._id,
                  title: lesson.title || '',
                  description: lesson.description || '',
                  type: lesson.type || 'video',
                  content: lesson.content || {},
                  moduleId: lesson.moduleId || 'default'
                };
                lessonsByModule[moduleId].lessons.push(cleanedLesson);
              });
              
              const fetchedModules = Object.values(lessonsByModule);
              setModules(fetchedModules);
            }
          } catch (curriculumError) {
            setModules([]);
          }
        }

      } catch (error) {
        toast.error('Failed to load course data');
        navigate('/trainer/courses', { state: { refresh: true } });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, navigate]);

  // Track unsaved changes
  useEffect(() => {
    if (JSON.stringify(formData) !== JSON.stringify(courseData)) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [formData, courseData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const handleSave = async (status = null) => {
    try {
      setIsSaving(true);
      
      if (!courseId) {
        toast.error('Course ID is missing');
        return;
      }

      // Clean course data for backend - only include expected fields
      const courseDataToSave = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        language: formData.language,
        duration: formData.duration,
        price: formData.price,
        tags: formData.tags,
        status: formData.status,
        thumbnail: formData.thumbnail
        // Remove isPublic and modules as backend doesn't expect them
      };


      const response = await apiService.put(API_ENDPOINTS.COURSES.UPDATE(courseId), courseDataToSave);
      
      
      // Step 2: Save curriculum data (modules and lessons)
      if (modules && modules.length > 0) {
        try {
          
          // Check if there are any lessons with actual content
          const lessonsWithContent = modules.flatMap(module => 
            module.lessons.filter(lesson => lesson.title && lesson.title.trim() !== '')
          );
          
          if (lessonsWithContent.length === 0) {
            toast.warning('Course saved, but no lessons to save. Please add lesson content before publishing.');
            return;
          }
          
          // Skip course update with lessons (backend rejects modules field)
          // Go directly to individual lesson creation
          
          // Try individual lesson endpoints
          let lessonSaveSuccess = true;
          let savedLessons = 0;
          let failedLessons = 0;
          
          for (const module of modules) {
            for (const lesson of module.lessons) {
              // Clean lesson data according to backend expectations
              const lessonData = cleanLessonData({
                ...lesson,
                moduleId: module.id || 'default_module'
              }, status);
              
              
              try {
                if (lesson.id.startsWith('lesson_')) {
                  // This is a new lesson created in frontend - create new lesson
                  const response = await apiService.post(API_ENDPOINTS.LEARNING.LESSONS.CREATE(courseId), lessonData);
                  
                  // Update the lesson ID with the backend-generated ID
                  let newLessonId = null;
                  
                  // Handle different response structures - response IS the data, not response.data
                  if (response && response.lesson) {
                    // Standard structure: {message: 'Lesson created successfully', lesson: {...}}
                    const lessonObj = response.lesson;
                    newLessonId = lessonObj._id;
                  } else if (response && response._id) {
                    // Direct structure: {_id: '...', ...}
                    newLessonId = response._id;
                  } else if (response && response.id) {
                    // Alternative structure: {id: '...', ...}
                    newLessonId = response.id;
                  }
                  
                  if (newLessonId && isValidObjectId(newLessonId)) {
                    lesson.id = newLessonId;
                    savedLessons++;
                    
                    // Update the lesson in the local state to reflect the backend changes
                    setModules(prevModules => 
                      prevModules.map(mod => 
                        mod.id === module.id 
                          ? {
                              ...mod,
                              lessons: mod.lessons.map(l => 
                                l.id === lesson.id 
                                  ? { ...l, id: newLessonId }
                                  : l
                              )
                            }
                          : mod
                      )
                    );
                  } else {
                    savedLessons++;
                  }
                } else if (isValidObjectId(lesson.id)) {
                  // This is an existing lesson with valid MongoDB ObjectId - update it
                  await apiService.put(API_ENDPOINTS.LEARNING.LESSONS.UPDATE(lesson.id), lessonData);
                  savedLessons++;
                } else {
                  // Invalid ID format, skip this lesson
                  failedLessons++;
                }
              } catch (lessonError) {
                toast.error(`Failed to save lesson: ${lesson.title || 'Untitled'}`);
                lessonSaveSuccess = false;
                failedLessons++;
                // Continue with other lessons even if one fails
              }
            }
          }
          
          if (lessonSaveSuccess && savedLessons > 0) {
            toast.success(`Successfully saved ${savedLessons} lesson${savedLessons > 1 ? 's' : ''}`);
          } else if (savedLessons > 0 && failedLessons > 0) {
            toast.warning(`Saved ${savedLessons} lesson${savedLessons > 1 ? 's' : ''}, ${failedLessons} failed`);
          } else {
            toast.error('Failed to save any lessons');
          }
        } catch (curriculumError) {
          
          // Check if it's a 500 error (server issue) or 404 (endpoint not found)
          if (curriculumError.response?.status >= 500 || curriculumError.response?.status === 404) {
            toast.warning('Course saved successfully! However, lesson saving failed due to server issues. You can add lessons later when the backend is available.', {
              duration: 5000
            });
          } else {
            toast.error('Failed to save curriculum data');
          }
        }
      } else {
        toast.success('Course saved successfully!');
      }
      
      setHasUnsavedChanges(false);
      
      // Navigate back to courses with refresh flag
      setTimeout(() => {
        navigate('/trainer/courses', { state: { refresh: true } });
      }, 1500); // Give user time to see the success message
      
      // Update course data with response
      if (response.data) {
        const updatedCourse = response.data.course || response.data;
        setCourseData(updatedCourse);
        setFormData(prev => ({
          ...prev,
          ...updatedCourse
        }));
      }
      
    } catch (error) {
      toast.error('Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  const validateCourseForPublish = () => {
    const issues = [];
    
    if (!formData.title?.trim()) {
      issues.push('Course title is required');
    }
    if (!formData.description?.trim()) {
      issues.push('Course description is required');
    }
    if (!modules || modules.length === 0) {
      issues.push('At least one module is required');
    } else {
      let hasAnyLesson = false;
      modules.forEach((module, moduleIndex) => {
        if (module.lessons && module.lessons.length > 0) {
          hasAnyLesson = true;
          module.lessons.forEach((lesson, lessonIndex) => {
            if (!lesson.title?.trim()) {
              issues.push(`Lesson ${lessonIndex + 1} in Module ${moduleIndex + 1} needs a title`);
            }
          });
        }
      });
      
      if (!hasAnyLesson) {
        issues.push('At least one lesson is required');
      }
    }
    
    return issues;
  };

  const getPublishValidationStatus = () => {
    const issues = validateCourseForPublish();
    const isReady = issues.length === 0;
    
    return {
      isReady,
      issues,
      message: isReady 
        ? '✅ Course is ready to publish!' 
        : `⚠️ ${issues.length} issue${issues.length === 1 ? '' : 's'} need${issues.length === 1 ? 's' : ''} to be resolved`
    };
  };

 const handlePublish = async () => {
  const validation = getPublishValidationStatus();

  if (!validation.isReady) {
    toast.error('Please fix all issues before publishing');
    return;
  }

  try {
    setIsSaving(true);

    // Step 1: Save everything first
    await handleSave();

    // Step 2: Call publish API
    await apiService.patch(
      `/courses/${courseId}/publish`
    );

    toast.success('Course published successfully 🚀');

  } catch (error) {
    toast.error('Failed to publish course');
  } finally {
    setIsSaving(false);
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: BookOpenIcon },
    { id: 'curriculum', label: 'Curriculum', icon: AcademicCapIcon },
    { id: 'pricing', label: 'Pricing', icon: CurrencyDollarIcon },
    { id: 'publish', label: 'Publish', icon: CheckCircleIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/trainer/courses', { state: { refresh: true } })}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Courses
              </button>
              
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  {formData.title || 'Untitled Course'}
                </h1>
                {formData.status === 'published' && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Published
                  </span>
                )}
                {formData.status === 'draft' && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                    Draft
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={() => handleSave()}
                disabled={isSaving || !hasUnsavedChanges}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {previewMode ? (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{formData.title}</h2>
            <p className="text-gray-600 mb-6">{formData.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-sm text-gray-500">Category</span>
                <p className="font-medium">{formData.category}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Level</span>
                <p className="font-medium">{formData.level}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Duration</span>
                <p className="font-medium">{formData.duration} hours</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Price</span>
                <p className="font-medium">${formData.price}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'basic' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your course title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe what students will learn in your course"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="academic">Academic</option>
                        <option value="professional">Professional</option>
                        <option value="technical">Technical</option>
                        <option value="creative">Creative</option>
                        <option value="business">Business</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => handleInputChange('level', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (hours)
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={formData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'curriculum' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Course Curriculum</h2>
                  <button
                    onClick={addModule}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Module
                  </button>
                </div>

                {modules.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Building Your Curriculum</h3>
                    <p className="text-gray-600 mb-4">Add modules and lessons to structure your course content</p>
                    <button
                      onClick={addModule}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4 mr-2 inline" />
                      Add Your First Module
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {modules.map((module, moduleIndex) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Module Header */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => toggleModuleExpansion(module.id)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                              >
                                {module.isExpanded ? (
                                  <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                                ) : (
                                  <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                                )}
                              </button>
                              <input
                                type="text"
                                value={module.title}
                                onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                                className="font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                                placeholder="Module title"
                              />
                              <span className="text-sm text-gray-500">
                                {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => deleteModule(module.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <textarea
                            value={module.description}
                            onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                            className="w-full mt-2 px-2 py-1 text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded resize-none"
                            placeholder="Module description (optional)"
                            rows={2}
                          />
                        </div>

                        {/* Module Content */}
                        {module.isExpanded && (
                          <div className="p-4">
                            {/* Add Lesson Button */}
                            <div className="mb-4">
                              <button
                                onClick={() => addLesson(module.id)}
                                className="flex items-center px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add Lesson
                              </button>
                            </div>

                            {/* Lessons */}
                            <div className="space-y-3">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-sm font-medium text-gray-500">
                                          {lessonIndex + 1}.
                                        </span>
                                        <input
                                          type="text"
                                          value={lesson.title}
                                          onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                          className="flex-1 font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                                          placeholder="Lesson title"
                                        />
                                      </div>
                                      
                                      {/* Lesson Type Selector */}
                                      <select
                                        value={lesson.type}
                                        onChange={(e) => updateLesson(module.id, lesson.id, 'type', e.target.value)}
                                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      >
                                        <option value="video">Video</option>
                                        <option value="text">Text</option>
                                        <option value="pdf">PDF</option>
                                        <option value="image">Image</option>
                                        <option value="quiz">Quiz</option>
                                        <option value="assignment">Assignment</option>
                                      </select>
                                    </div>

                                    {/* Lesson Actions */}
                                    <div className="flex items-center space-x-1">
                                      <button
                                        onClick={() => moveLesson(module.id, lesson.id, 'up')}
                                        disabled={lessonIndex === 0}
                                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      >
                                        <ChevronUpIcon className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => moveLesson(module.id, lesson.id, 'down')}
                                        disabled={lessonIndex === module.lessons.length - 1}
                                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      >
                                        <ChevronDownIcon className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => deleteLesson(module.id, lesson.id)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Lesson Content Based on Type */}
                                  <div className="mt-3 space-y-3">
                                    {lesson.type === 'video' && (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                                        <input
                                          type="text"
                                          value={lesson.content.videoUrl}
                                          onChange={(e) => updateLessonContent(module.id, lesson.id, 'videoUrl', e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="https://example.com/video.mp4"
                                        />
                                        <div className="mt-2">
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Or upload video file</label>
                                          <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => e.target.files[0] && handleFileUpload(module.id, lesson.id, 'video', e.target.files[0])}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {lesson.type === 'text' && (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
                                        <textarea
                                          value={lesson.content.textContent}
                                          onChange={(e) => updateLessonContent(module.id, lesson.id, 'textContent', e.target.value)}
                                          rows={4}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="Enter your lesson content here..."
                                        />
                                      </div>
                                    )}

                                    {lesson.type === 'pdf' && (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">PDF URL</label>
                                        <input
                                          type="text"
                                          value={lesson.content.pdfUrl}
                                          onChange={(e) => updateLessonContent(module.id, lesson.id, 'pdfUrl', e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="https://example.com/document.pdf"
                                        />
                                        <div className="mt-2">
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Or upload PDF file</label>
                                          <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => e.target.files[0] && handleFileUpload(module.id, lesson.id, 'pdf', e.target.files[0])}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {lesson.type === 'image' && (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                        <input
                                          type="text"
                                          value={lesson.content.imageUrl}
                                          onChange={(e) => updateLessonContent(module.id, lesson.id, 'imageUrl', e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="https://example.com/image.jpg"
                                        />
                                        <div className="mt-2">
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Or upload image file</label>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => e.target.files[0] && handleFileUpload(module.id, lesson.id, 'image', e.target.files[0])}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {lesson.type === 'quiz' && (
                                      <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                                        <QuestionMarkCircleIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Quiz builder coming soon</p>
                                      </div>
                                    )}

                                    {lesson.type === 'assignment' && (
                                      <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                                        <ClipboardDocumentListIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Assignment builder coming soon</p>
                                      </div>
                                    )}

                                    {/* Preview Toggle */}
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        id={`preview-${lesson.id}`}
                                        checked={lesson.isPreview}
                                        onChange={(e) => updateLesson(module.id, lesson.id, 'isPreview', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                      />
                                      <label htmlFor={`preview-${lesson.id}`} className="ml-2 text-sm text-gray-700">
                                        This lesson is a free preview
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'pricing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Price ($)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                      Make this course publicly available
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'publish' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Publish Course</h2>
                
                {(() => {
                  const validation = getPublishValidationStatus();
                  return (
                    <div className="space-y-6">
                      <div className={`p-4 rounded-lg ${validation.isReady ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                        <div className="flex items-start">
                          {validation.isReady ? (
                            <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1 mr-3" />
                          ) : (
                            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-1 mr-3" />
                          )}
                          <div>
                            <h3 className={`font-medium ${validation.isReady ? 'text-green-800' : 'text-yellow-800'}`}>
                              {validation.message}
                            </h3>
                            {!validation.isReady && validation.issues.length > 0 && (
                              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                                {validation.issues.map((issue, index) => (
                                  <li key={index}>{issue}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleSave('draft')}
                          disabled={isSaving}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Save as Draft
                        </button>
                        
                        <button
                          onClick={handlePublish}
                          disabled={isSaving || !validation.isReady}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isSaving ? 'Publishing...' : 'Publish Course'}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EditCourse;
