import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpenIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  FireIcon,
  SparklesIcon,
  BeakerIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  LinkIcon,
  CameraIcon,
  VideoCameraIcon,
  PhotoIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  DocumentIcon,
  UsersIcon,
  BuildingOfficeIcon,
  TruckIcon,
  PackageIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  ChartPieIcon,
  ChartLineIcon,
  CubeIcon,
  CircleStackIcon,
  ArchiveBoxIcon,
  InboxIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  BellIcon,
  CogIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ArrowRightIcon as ArrowRightIconOutline,
  PlayIcon,
  PauseIcon,
  StopIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Mock course data
  const mockCourseData = {
    id: courseId,
    title: 'Advanced React Patterns',
    description: 'Master advanced React patterns and techniques for building scalable applications',
    instructor: {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      avatar: 'https://via.placeholder.com/100x100'
    },
    category: 'Development',
    level: 'Advanced',
    price: 89.99,
    originalPrice: 129.99,
    currency: 'USD',
    language: 'English',
    duration: 24, // hours
    lessons: 45,
    enrolledStudents: 1234,
    completedStudents: 567,
    rating: 4.8,
    reviews: 234,
    thumbnail: 'https://via.placeholder.com/400x225',
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-01',
    publishedAt: '2024-01-20',
    revenue: 45678.90,
    isPublished: true,
    isFeatured: true,
    tags: ['React', 'JavaScript', 'Frontend', 'Advanced'],
    requirements: ['Basic React knowledge', 'JavaScript ES6+', 'HTML/CSS'],
    objectives: ['Master advanced patterns', 'Build scalable apps', 'Performance optimization'],
    modules: [
      {
        id: 1,
        title: 'Introduction to Advanced Patterns',
        lessons: [
          {
            id: 1,
            title: 'Course Overview',
            duration: '15 min',
            type: 'video',
            content: 'Introduction to the course and what you will learn',
            videoUrl: 'https://example.com/video1.mp4',
            isPublished: true,
            order: 1
          },
          {
            id: 2,
            title: 'Prerequisites Review',
            duration: '20 min',
            type: 'video',
            content: 'Review of React basics and prerequisites',
            videoUrl: 'https://example.com/video2.mp4',
            isPublished: true,
            order: 2
          }
        ],
        isPublished: true,
        order: 1
      },
      {
        id: 2,
        title: 'Performance Optimization',
        lessons: [
          {
            id: 3,
            title: 'Understanding Re-renders',
            duration: '25 min',
            type: 'video',
            content: 'Deep dive into React re-rendering',
            videoUrl: 'https://example.com/video3.mp4',
            isPublished: true,
            order: 3
          }
        ],
        isPublished: true,
        order: 2
      }
    ],
    resources: [
      {
        id: 1,
        name: 'Course Slides',
        type: 'pdf',
        url: 'https://example.com/slides.pdf',
        isRequired: true
      },
      {
        id: 2,
        name: 'Code Examples',
        type: 'zip',
        url: 'https://example.com/code.zip',
        isRequired: false
      }
    ],
    faqs: [
      {
        id: 1,
        question: 'What are the prerequisites for this course?',
        answer: 'Basic React knowledge, JavaScript ES6+, and HTML/CSS experience.'
      },
      {
        id: 2,
        question: 'How long do I have access to the course?',
        answer: 'Lifetime access once you enroll.'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourseData(mockCourseData);
      setFormData({
        title: mockCourseData.title,
        description: mockCourseData.description,
        category: mockCourseData.category,
        level: mockCourseData.level,
        price: mockCourseData.price,
        originalPrice: mockCourseData.originalPrice,
        language: mockCourseData.language,
        duration: mockCourseData.duration,
        lessons: mockCourseData.lessons,
        tags: mockCourseData.tags.join(', '),
        requirements: mockCourseData.requirements.join('\n'),
        objectives: mockCourseData.objectives.join('\n')
      });
      setIsLoading(false);
    }, 1000);
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setCourseData({
        ...courseData,
        ...formData
      });
      setIsSaving(false);
      navigate(`/instructor/courses/${courseId}`);
    }, 2000);
  };

  const handlePublish = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setCourseData({
        ...courseData,
        status: 'published'
      });
      setIsSaving(false);
    }, 2000);
  };

  const handleUnpublish = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setCourseData({
        ...courseData,
        status: 'draft'
      });
      setIsSaving(false);
    }, 2000);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: BookOpenIcon },
    { id: 'content', label: 'Course Content', icon: DocumentIcon },
    { id: 'media', label: 'Media', icon: VideoCameraIcon },
    { id: 'pricing', label: 'Pricing', icon: CurrencyDollarIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon }
  ];

  const BasicInfoTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="data-science">Data Science</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (hours)
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Lessons
          </label>
          <input
            type="number"
            name="lessons"
            value={formData.lessons}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="React, JavaScript, Frontend"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requirements (one per line)
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Objectives (one per line)
          </label>
          <textarea
            name="objectives"
            value={formData.objectives}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const ContentTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Course Modules</h3>
        <button className="btn-premium">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Module
        </button>
      </div>

      <div className="space-y-4">
        {courseData?.modules?.map((module, index) => (
          <div key={module.id} className="card-premium p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{module.title}</h4>
                  <p className="text-sm text-gray-600">{module.lessons.length} lessons</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-premium-outline text-sm">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button className="btn-premium-outline text-sm text-red-600 hover:bg-red-50">
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-xs">{lesson.order}</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                      <p className="text-sm text-gray-600">{lesson.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      lesson.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {lesson.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <button className="btn-premium-outline text-sm">
                      <PencilIcon className="h-3 w-3 mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MediaTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Thumbnail
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <img
              src={courseData?.thumbnail}
              alt="Course thumbnail"
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <button className="btn-premium-outline">
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              Change Thumbnail
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview Video
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <button className="btn-premium-outline">
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              Upload Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const PricingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (USD)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original Price (USD)
          </label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          id="isFeatured"
          checked={courseData?.isFeatured}
          onChange={(e) => setCourseData({...courseData, isFeatured: e.target.checked})}
          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
          Feature this course
        </label>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Course Status</h3>
          <p className="text-sm text-gray-600">Control the visibility and availability of your course</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            courseData?.status === 'published' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {courseData?.status?.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        {courseData?.status === 'published' ? (
          <button
            onClick={handleUnpublish}
            disabled={isSaving}
            className="btn-premium-outline text-yellow-600 hover:bg-yellow-50"
          >
            <XCircleIcon className="h-4 w-4 mr-2" />
            Unpublish Course
          </button>
        ) : (
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="btn-premium text-green-600 hover:bg-green-50"
          >
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Publish Course
          </button>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              <button
                onClick={() => navigate(`/instructor/courses`)}
                className="btn-premium-outline"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Courses
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
                <p className="text-gray-600">{courseData?.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-premium"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="card-premium p-6">
          {activeTab === 'basic' && <BasicInfoTab />}
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'media' && <MediaTab />}
          {activeTab === 'pricing' && <PricingTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
