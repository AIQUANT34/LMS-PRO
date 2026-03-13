import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  PrinterIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  CameraIcon,
  XMarkIcon,
  ListBulletIcon,
  TableCellsIcon,
  ChartPieIcon,
  InboxIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  BellIcon,
  CogIcon,
  ArrowPathIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';

const BasicInfoStep = ({ formData, handleInputChange, errors, categories, levels, handleSelectChange, handleKeyDown }) => (
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
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe your course content and learning objectives..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
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
          onChange={handleSelectChange}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a category</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
          <option value="marketing">Marketing</option>
          <option value="data-science">Data Science</option>
          <option value="photography">Photography</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Level <span className="text-red-500">*</span>
        </label>
        <select
          name="level"
          value={formData.level}
          onChange={handleSelectChange}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.level ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        {errors.level && (
          <p className="mt-1 text-sm text-red-500">{errors.level}</p>
        )}
      </div>
    </div>
  </div>
);

const ContentStep = ({ formData, handleInputChange, errors, handleKeyDown }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Duration (hours) <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        name="duration"
        value={formData.duration}
        onChange={handleInputChange}
        min="1"
        max="100"
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.duration ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors.duration && (
        <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        What You'll Learn
      </label>
      <textarea
        name="whatYoullLearn"
        value={formData.whatYoullLearn}
        onChange={handleInputChange}
        rows={4}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.whatYoullLearn ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="List the key skills and topics students will master..."
      />
      {errors.whatYoullLearn && (
        <p className="mt-1 text-sm text-red-500">{errors.whatYoullLearn}</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Target Audience
      </label>
      <select
        name="targetAudience"
        value={formData.targetAudience}
        onChange={handleSelectChange}
        onKeyDown={handleKeyDown}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.targetAudience ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Select audience</option>
        <option value="beginners">Beginners</option>
        <option value="intermediate">Intermediate Learners</option>
        <option value="advanced">Advanced Learners</option>
        <option value="all">All Levels</option>
      </select>
      {errors.targetAudience && (
        <p className="mt-1 text-sm text-red-500">{errors.targetAudience}</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Prerequisites
      </label>
      <textarea
        name="prerequisites"
        value={formData.prerequisites}
        onChange={handleInputChange}
        rows={3}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.prerequisites ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="List any required knowledge or skills..."
      />
      {errors.prerequisites && (
        <p className="mt-1 text-sm text-red-500">{errors.prerequisites}</p>
      )}
    </div>
  </div>
);

const MediaStep = ({ formData, setFormData, thumbnail, setThumbnail, handleKeyDown }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Course Thumbnail <span className="text-red-500">*</span>
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
        <div className="space-y-4">
          <CameraIcon className="h-16 w-16 mx-auto mb-2 text-gray-400" />
          <div>
            <p className="text-gray-600">Click to upload course thumbnail</p>
            <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
          </div>
        </div>
      </div>
      {thumbnail && (
        <div className="mt-4">
          <img
            src={thumbnail}
            alt="Course thumbnail"
            className="w-32 h-32 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => setThumbnail(null)}
            className="ml-4 text-red-600 hover:text-red-800"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  </div>
);

const PricingStep = ({ formData, handleInputChange, errors, handleKeyDown }) => (
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
          min="0"
          step="0.01"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.price ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-500">{errors.price}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Discount
        </label>
        <select
          name="discount"
          value={formData.discount}
          onChange={handleSelectChange}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.discount ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="0">No discount</option>
          <option value="10">10% off</option>
          <option value="20">20% off</option>
          <option value="30">30% off</option>
          <option value="50">50% off</option>
        </select>
        {errors.discount && (
          <p className="mt-1 text-sm text-red-500">{errors.discount}</p>
        )}
      </div>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-medium text-blue-900 mb-2">Pricing Tips</h4>
      <ul className="text-sm text-blue-800 mt-2 space-y-1">
        <li>• Set a competitive price based on course value</li>
        <li>• Consider offering discounts for promotions</li>
        <li>• Original price shows discount value to students</li>
      </ul>
    </div>
  </div>
);

const ReviewStep = ({ formData }) => (
  <div className="space-y-6">
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Course</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Course Information</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Title:</span> {formData.title || 'Not set'}</div>
            <div><span className="font-medium">Description:</span> {formData.description || 'Not set'}</div>
            <div><span className="font-medium">Category:</span> {formData.category || 'Not set'}</div>
            <div><span className="font-medium">Level:</span> {formData.level || 'Not set'}</div>
            <div><span className="font-medium">Duration:</span> {formData.duration ? `${formData.duration} hours` : 'Not set'}</div>
            <div><span className="font-medium">Price:</span> ${formData.price ? formData.price.toFixed(2) : 'Not set'}</div>
            <div><span className="font-medium">Discount:</span> {formData.discount ? `${formData.discount}%` : 'No discount'}</div>
          </div>
        </div>

        {/* Media */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Course Media</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Thumbnail:</span> {thumbnail ? 'Uploaded' : 'Not uploaded'}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Step Indicator Component
const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-8">
    {steps.map((step, index) => (
      <div
        key={step.id}
        className={`flex items-center ${currentStep > step.id ? 'text-green-600' : 'text-gray-400'}`}
      >
        <div className={`flex-1 h-1 mx-4 ${
          currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
        }`} />
        {currentStep > step.id && (
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
        )}
      </div>
    ))}
  </div>
);

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
  const [newTag, setNewTag] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(null);

  // Auto-save functionality with debouncing
  const autoSaveTimeoutRef = useRef(null);
  
  const debouncedSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      if ((formData.title && formData.title.trim()) || (formData.description && formData.description.trim())) {
        saveDraft();
      }
    }, 2000); // 2 second debounce
  }, [formData.title, formData.description, formData.category, formData.level]);

  useEffect(() => {
    debouncedSave();
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [debouncedSave]);

  const saveDraft = useCallback(async () => {
    try {
      setAutoSaveStatus('saving');
      const draftData = {
        ...formData,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem('courseDraft', JSON.stringify(draftData));
      setLastSaved(new Date());
      setAutoSaveStatus('saved');
    } catch (error) {
      setAutoSaveStatus('error');
      console.error('Auto-save failed:', error);
    }
  }, []); // Remove formData dependency to prevent re-renders

  const loadDraft = () => {
    try {
      const draft = localStorage.getItem('courseDraft');
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        setFormData(parsedDraft);
        setLastSaved(new Date(parsedDraft.lastSaved));
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };

  const steps = [
    { id: 1, name: 'Basic Info', icon: BookOpenIcon },
    { id: 2, name: 'Content', icon: DocumentIcon },
    { id: 3, name: 'Media', icon: CameraIcon },
    { id: 4, name: 'Pricing', icon: CurrencyDollarIcon },
    { id: 5, name: 'Review', icon: CheckCircleIcon }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Course title is required';
      } else if (formData.title.trim().length < 3) {
        newErrors.title = 'Course title must be at least 3 characters';
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.trim().length < 10) {
        newErrors.description = 'Description must be at least 10 characters';
      }
      
      if (!formData.category) {
        newErrors.category = 'Category is required';
      }
      
      if (!formData.level) {
        newErrors.level = 'Level is required';
      }
    }
    
    if (step === 2) {
      if (!formData.duration || parseInt(formData.duration) <= 0) {
        newErrors.duration = 'Duration must be greater than 0';
      }
      
      if (!formData.lessons || parseInt(formData.lessons) <= 0) {
        newErrors.lessons = 'Number of lessons must be greater than 0';
      }
      
      if (formData.requirements.length === 0) {
        newErrors.requirements = 'At least one requirement is recommended';
      }
      
      if (formData.objectives.length === 0) {
        newErrors.objectives = 'At least one learning objective is required';
      }
    }
    
    if (step === 4) {
      if (!formData.price || parseFloat(formData.price) < 0) {
        newErrors.price = 'Price must be a valid positive number';
      }
      
      if (formData.originalPrice && parseFloat(formData.originalPrice) < parseFloat(formData.price)) {
        newErrors.originalPrice = 'Original price must be greater than or equal to the current price';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(5)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Enhanced form data preparation
      const courseData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        originalPrice: parseFloat(formData.originalPrice) || 0,
        duration: parseInt(formData.duration) || 0,
        lessons: parseInt(formData.lessons) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await apiService.post(API_ENDPOINTS.TRAINER.CREATE_COURSE, courseData);
      console.log('Course created successfully:', response.data);
      
      // Clear draft after successful submission
      localStorage.removeItem('courseDraft');
      
      // Show success message and navigate
      toast.success('Course created successfully!');
      navigate('/trainer/courses');
    } catch (error) {
      console.error('Error creating course:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create course. Please try again.';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = useCallback((e) => {
    const { name, value, type } = e.target;
    
    // Handle different input types properly
    let processedValue = value;
    if (type === 'number') {
      processedValue = value === '' ? '' : parseFloat(value);
    }
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: processedValue
      };
      return newData;
    });
  }, []);
  
  // Separate error clearing to avoid re-renders
  const clearFieldError = useCallback((fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [errors]);
  
  // Combined input change handler with error clearing
  const handleInputChangeWithValidation = useCallback((e) => {
    handleInputChange(e);
    clearFieldError(e.target.name);
  }, [handleInputChange, clearFieldError]);

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent form submission that causes page reload
    // Only call handleSubmit if we're on the review step
    if (currentStep === 5) {
      handleSubmit(e);
    }
  };

  const handleKeyDown = (e) => {
    // Prevent form submission on Enter key for all inputs except when on review step
    if (e.key === 'Enter' && currentStep !== 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const addTag = (e) => {
    if (e) e.preventDefault();
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (e, tagToRemove) => {
    if (e) e.preventDefault();
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addRequirement = (e) => {
    if (e) e.preventDefault();
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (e, reqToRemove) => {
    if (e) e.preventDefault();
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== reqToRemove)
    }));
  };

  const addObjective = (e) => {
    if (e) e.preventDefault();
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (e, objToRemove) => {
    if (e) e.preventDefault();
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj !== objToRemove)
    }));
  };

  return (
    <div>
      <StepIndicator currentStep={currentStep} />
      {currentStep === 1 && (
        <BasicInfoStep 
          formData={formData} 
          handleInputChange={handleInputChangeWithValidation} 
          errors={errors} 
          categories={[]} 
          levels={[]} 
          handleSelectChange={handleInputChangeWithValidation} 
          handleKeyDown={handleKeyDown} 
        />
      )}
      {currentStep === 2 && (
        <ContentStep 
          formData={formData} 
          handleInputChange={handleInputChangeWithValidation} 
          errors={errors} 
          handleKeyDown={handleKeyDown} 
        />
      )}
      {currentStep === 3 && (
        <MediaStep 
          formData={formData} 
          setFormData={setFormData} 
          thumbnail={''} 
          setThumbnail={() => {}} 
          handleKeyDown={handleKeyDown} 
        />
      )}
      {currentStep === 4 && (
        <PricingStep 
          formData={formData} 
          handleInputChange={handleInputChangeWithValidation} 
          errors={errors} 
          handleKeyDown={handleKeyDown} 
        />
      )}
      {currentStep === 5 && (
        <ReviewStep formData={formData} />
      )}
        <div className="space-y-2">
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{req}</span>
              <button
                type="button"
                onClick={() => removeRequirement(req)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Objectives */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Objectives
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                addObjective();
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a learning objective and press Enter"
          />
          <button
            type="button"
            onClick={addObjective}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.objectives.map((obj, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{obj}</span>
              <button
                type="button"
                onClick={() => removeObjective(obj)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
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
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.duration ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Course duration in hours"
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
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
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.lessons ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Total number of lessons"
          />
          {errors.lessons && (
            <p className="mt-1 text-sm text-red-500">{errors.lessons}</p>
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
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <div className="space-y-4">
            <CameraIcon className="h-16 w-16 text-gray-400 mx-auto" />
            <div>
              <p className="text-gray-600">Click to upload course thumbnail</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
            </div>
            <button
              type="button"
              className="btn-premium"
            >
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              Choose File
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preview Video (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <div className="space-y-4">
            <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto" />
            <div>
              <p className="text-gray-600">Upload a preview video</p>
              <p className="text-sm text-gray-500">MP4, WebM up to 100MB</p>
            </div>
            <button
              type="button"
              className="btn-premium-outline"
            >
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              Choose File
            </button>
          </div>
        </div>
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
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter course price"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter original price (optional)"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Pricing Tips</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Set a competitive price based on course value</li>
              <li>• Consider offering discounts for promotions</li>
              <li>• Original price shows discount value to students</li>
            </ul>
          </div>
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
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
              <p><strong>Title:</strong> {formData.title || 'Not set'}</p>
              <p><strong>Description:</strong> {formData.description || 'Not set'}</p>
              <p><strong>Category:</strong> {formData.category || 'Not set'}</p>
              <p><strong>Level:</strong> {formData.level || 'Not set'}</p>
              <p><strong>Language:</strong> {formData.language || 'Not set'}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">Course Details</h4>
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
              <p><strong>Duration:</strong> {formData.duration || 'Not set'} hours</p>
              <p><strong>Lessons:</strong> {formData.lessons || 'Not set'}</p>
              <p><strong>Price:</strong> ${formData.price || 'Not set'}</p>
              {formData.originalPrice && (
                <p><strong>Original Price:</strong> ${formData.originalPrice}</p>
              )}
            </div>
          </div>

          {formData.tags.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900">Tags</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {formData.requirements.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900">Requirements</h4>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {formData.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">{req}</li>
                ))}
              </ul>
            </div>
          )}

          {formData.objectives.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900">Learning Objectives</h4>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {formData.objectives.map((obj, index) => (
                  <li key={index} className="text-gray-700">{obj}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/courses')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Course</h1>
                <p className="text-gray-600">Create and publish your new course</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Auto-save indicator */}
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                {autoSaveStatus === 'saving' && (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent"></div>
                    <span className="text-sm text-gray-600">Saving...</span>
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Saved</span>
                  </>
                )}
                {autoSaveStatus === 'error' && (
                  <>
                    <XCircleIcon className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-gray-600">Save failed</span>
                  </>
                )}
              </div>
              
              <button
                onClick={() => navigate('/trainer/courses')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate('/trainer/courses')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <StepIndicator />

        {/* Form */}
        <form
          id="createCourseForm"
          onSubmit={handleFormSubmit}
          onKeyDown={handleKeyDown}
        >
          <div className="card-premium p-8">
            {currentStep === 1 && <BasicInfoStep />}
            {currentStep === 2 && <ContentStep />}
            {currentStep === 3 && <MediaStep />}
            {currentStep === 4 && <PricingStep />}
            {currentStep === 5 && <ReviewStep />}
          </div>
        </form>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
            Previous
          </button>

          <div className="flex gap-3">
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-premium"
              >
                Next Step
                <ArrowLeftIcon className="h-4 w-4 ml-2 rotate-180" />
              </button>
            ) : (
              <button
                type="submit"
                form="createCourseForm"
                disabled={isSubmitting}
                className="btn-premium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Create Course
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {errors.submit && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{errors.submit}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;
