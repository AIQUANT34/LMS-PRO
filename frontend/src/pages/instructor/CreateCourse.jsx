import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  ArrowDownTrayIcon,
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
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: '',
    originalPrice: '',
    language: 'English',
    duration: '',
    lessons: '',
    thumbnail: '',
    previewVideo: '',
    tags: [],
    requirements: [],
    objectives: [],
    status: 'draft'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'photography', label: 'Photography' },
    { value: 'business', label: 'Business' }
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const steps = [
    { id: 1, title: 'Basic Information', description: 'Course title, description, and basic details' },
    { id: 2, title: 'Course Content', description: 'Curriculum, lessons, and learning objectives' },
    { id: 3, title: 'Media & Resources', description: 'Upload thumbnail and preview videos' },
    { id: 4, title: 'Pricing & Settings', description: 'Set pricing and course configuration' },
    { id: 5, title: 'Review & Publish', description: 'Review and publish your course' }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = 'Course title is required';
        }
        if (!formData.description.trim()) {
          newErrors.description = 'Course description is required';
        }
        if (!formData.category) {
          newErrors.category = 'Category is required';
        }
        if (!formData.level) {
          newErrors.level = 'Level is required';
        }
        break;
      case 2:
        if (!formData.duration) {
          newErrors.duration = 'Duration is required';
        }
        if (!formData.lessons) {
          newErrors.lessons = 'Number of lessons is required';
        }
        if (formData.requirements.length === 0) {
          newErrors.requirements = 'At least one requirement is required';
        }
        if (formData.objectives.length === 0) {
          newErrors.objectives = 'At least one learning objective is required';
        }
        break;
      case 3:
        if (!formData.thumbnail) {
          newErrors.thumbnail = 'Course thumbnail is required';
        }
        break;
      case 4:
        if (!formData.price) {
          newErrors.price = 'Price is required';
        }
        if (parseFloat(formData.price) < 0) {
          newErrors.price = 'Price must be a positive number';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep(5)) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Creating course:', formData);
        setIsSubmitting(false);
        navigate('/instructor/courses');
      }, 2000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`flex items-center ${
            index < steps.length - 1 ? 'flex-1' : ''
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep > step.id
                ? 'bg-green-600'
                : currentStep === step.id
                ? 'bg-blue-600'
                : 'bg-gray-300'
            }`}
          >
            {currentStep > step.id ? (
              <CheckCircleIcon className="h-5 w-5 text-white" />
            ) : (
              <span className="text-sm font-medium text-white">{step.id}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 ${
              currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const BasicInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter course title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter course description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level <span className="text-red-500">*</span>
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.level ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {levels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          {errors.level && (
            <p className="text-red-500 text-sm mt-1">{errors.level}</p>
          )}
        </div>
      </div>
    </div>
  );

  const ContentStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (hours) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.duration ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter course duration in hours"
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Lessons <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="lessons"
            value={formData.lessons}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.lessons ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter number of lessons"
          />
          {errors.lessons && (
            <p className="text-red-500 text-sm mt-1">{errors.lessons}</p>
          )}
        </div>
      </div>
    </div>
  );

  const MediaStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Thumbnail <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="space-y-4">
            <CameraIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="text-gray-600">Click to upload course thumbnail</p>
            <button className="btn-premium">
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              Upload Thumbnail
            </button>
          </div>
        </div>
        {errors.thumbnail && (
          <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>
        )}
      </div>
    </div>
  );

  const PricingStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (USD) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter course price"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
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
            placeholder="Enter original price"
          />
        </div>
      </div>
    </div>
  );

  const ReviewStep = () => (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Course</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">Course Information</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Title:</strong> {formData.title}</p>
              <p><strong>Description:</strong> {formData.description}</p>
              <p><strong>Category:</strong> {formData.category}</p>
              <p><strong>Level:</strong> {formData.level}</p>
              <p><strong>Duration:</strong> {formData.duration} hours</p>
              <p><strong>Lessons:</strong> {formData.lessons}</p>
              <p><strong>Price:</strong> ${formData.price}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handlePrevious}
              className="btn-premium-outline"
            >
              Previous
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-premium"
            >
              {isSubmitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Course</h1>
              <p className="text-gray-600">Create and publish your new course</p>
            </div>
            
            <button
              onClick={() => navigate('/instructor/courses')}
              className="btn-premium-outline"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Courses
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <StepIndicator />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="card-premium p-6">
            {currentStep === 1 && <BasicInfoStep />}
            {currentStep === 2 && <ContentStep />}
            {currentStep === 3 && <MediaStep />}
            {currentStep === 4 && <PricingStep />}
            {currentStep === 5 && <ReviewStep />}
          </div>
        </form>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="btn-premium-outline"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === 5}
            className="btn-premium"
          >
            {currentStep === 5 ? 'Create Course' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
