import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowLeftIcon,
  ArrowRightIcon,
  VideoCameraIcon,
  PlayIcon,
  PauseIcon,
  StarIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  LanguageIcon,
  TagIcon,
  FolderIcon,
  ClipboardDocumentCheckIcon,
  CodeBracketIcon,
  MusicalNoteIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

// Course Categories
const COURSE_CATEGORIES = [
  { id: 'programming', name: 'Programming', icon: CodeBracketIcon },
  { id: 'design', name: 'Design', icon: SparklesIcon },
  { id: 'business', name: 'Business', icon: BriefcaseIcon },
  { id: 'marketing', name: 'Marketing', icon: ChartBarIcon },
  { id: 'data-science', name: 'Data Science', icon: ChartPieIcon },
  { id: 'photography', name: 'Photography', icon: CameraIcon },
  { id: 'music', name: 'Music', icon: MusicalNoteIcon },
  { id: 'health', name: 'Health & Fitness', icon: HeartIcon },
  { id: 'language', name: 'Language Learning', icon: GlobeAltIcon },
  { id: 'academic', name: 'Academic', icon: AcademicCapIcon }
];

// Course Levels
const COURSE_LEVELS = [
  { id: 'beginner', name: 'Beginner', description: 'No prior experience needed' },
  { id: 'intermediate', name: 'Intermediate', description: 'Some experience recommended' },
  { id: 'advanced', name: 'Advanced', description: 'Extensive experience required' },
  { id: 'all', name: 'All Levels', description: 'Suitable for everyone' }
];

// Languages
const LANGUAGES = [
  { id: 'english', name: 'English' },
  { id: 'spanish', name: 'Spanish' },
  { id: 'french', name: 'French' },
  { id: 'german', name: 'German' },
  { id: 'chinese', name: 'Chinese' },
  { id: 'japanese', name: 'Japanese' },
  { id: 'korean', name: 'Korean' },
  { id: 'portuguese', name: 'Portuguese' },
  { id: 'russian', name: 'Russian' },
  { id: 'arabic', name: 'Arabic' }
];

// Basic Information Step
const BasicInfoStep = ({ formData, handleInputChange, errors, setFormData }) => {
  const [tagInput, setTagInput] = useState('');

  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center mb-4">
          <LightBulbIcon className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-900">Course Basics</h3>
        </div>
        <p className="text-blue-800">
          Start with the essential information that will help students understand what your course is about.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a compelling course title..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            60+ characters recommended. Make it catchy and descriptive.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            placeholder="Describe your course in detail. What will students learn? What makes your course unique?"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            150+ characters recommended. Focus on student benefits and outcomes.
          </p>
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {COURSE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
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
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.level ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a level</option>
              {COURSE_LEVELS.map(level => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
            {errors.level && (
              <p className="mt-1 text-sm text-red-500">{errors.level}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language <span className="text-red-500">*</span>
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.language ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select language</option>
              {LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
            {errors.language && (
              <p className="mt-1 text-sm text-red-500">{errors.language}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle Language
            </label>
            <select
              name="subtitleLanguage"
              value={formData.subtitleLanguage}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">No subtitles</option>
              {LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Tags
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
                placeholder="Add tags (e.g., JavaScript, React, Web Development)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Add relevant tags to help students discover your course.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Course Content Step
const ContentStep = ({ formData, handleInputChange, errors, setFormData }) => {
  const [objectiveInput, setObjectiveInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');

  const addObjective = (e) => {
    e.preventDefault();
    if (objectiveInput.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, objectiveInput.trim()]
      }));
      setObjectiveInput('');
    }
  };

  const removeObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = (e) => {
    e.preventDefault();
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Duration (hours) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="0.5"
              max="1000"
              step="0.5"
              placeholder="e.g., 8.5"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.duration ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Lectures <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="lectures"
              value={formData.lectures}
              onChange={handleInputChange}
              min="1"
              max="1000"
              placeholder="e.g., 45"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.lectures ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lectures && (
              <p className="mt-1 text-sm text-red-500">{errors.lectures}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What Students Will Learn <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="flex-1 text-gray-700">{objective}</span>
                <button
                  type="button"
                  onClick={() => removeObjective(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={objectiveInput}
                onChange={(e) => setObjectiveInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addObjective(e)}
                placeholder="Add a learning outcome (e.g., Build responsive websites)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addObjective}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          {errors.objectives && (
            <p className="mt-1 text-sm text-red-500">{errors.objectives}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Add 4-6 clear learning outcomes. Start each with an action verb.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prerequisites
          </label>
          <div className="space-y-3">
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="flex-1 text-gray-700">{requirement}</span>
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRequirement(e)}
                placeholder="Add a prerequisite (e.g., Basic HTML knowledge)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Add requirements if students need prior knowledge or experience.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Audience
          </label>
          <textarea
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe your ideal student (e.g., Beginners who want to learn web development, Professionals looking to upskill...)"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.targetAudience ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.targetAudience && (
            <p className="mt-1 text-sm text-red-500">{errors.targetAudience}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Help students understand if this course is right for them.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Media Step
const MediaStep = ({ formData, setFormData, errors }) => {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Thumbnail must be smaller than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
        setFormData(prev => ({ ...prev, thumbnail: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Video must be smaller than 100MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoPreview(e.target.result);
        setFormData(prev => ({ ...prev, previewVideo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailPreview(null);
    setFormData(prev => ({ ...prev, thumbnail: null }));
  };

  const removeVideo = () => {
    setVideoPreview(null);
    setFormData(prev => ({ ...prev, previewVideo: null }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <div className="flex items-center mb-4">
          <CameraIcon className="h-6 w-6 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-purple-900">Course Media</h3>
        </div>
        <p className="text-purple-800">
          Add visual elements to make your course more engaging and professional.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Thumbnail <span className="text-red-500">*</span>
          </label>
          <div className="space-y-4">
            {thumbnailPreview ? (
              <div className="relative inline-block">
                <img
                  src={thumbnailPreview}
                  alt="Course thumbnail"
                  className="w-64 h-36 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  id="thumbnail-upload"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
                <label htmlFor="thumbnail-upload" className="cursor-pointer">
                  <CameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload course thumbnail</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  <p className="text-xs text-gray-400 mt-2">Recommended: 1280x720 pixels</p>
                </label>
              </div>
            )}
          </div>
          {errors.thumbnail && (
            <p className="mt-1 text-sm text-red-500">{errors.thumbnail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Promotional Video (Optional)
          </label>
          <div className="space-y-4">
            {videoPreview ? (
              <div className="relative">
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-w-2xl rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload promotional video</p>
                  <p className="text-sm text-gray-500">MP4, WebM up to 100MB</p>
                  <p className="text-xs text-gray-400 mt-2">Recommended: 2-3 minutes</p>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Pricing Step
const PricingStep = ({ formData, handleInputChange, errors }) => {
  const calculateDiscountedPrice = () => {
    if (!formData.price || !formData.discount) return 0;
    const price = parseFloat(formData.price);
    const discount = parseFloat(formData.discount);
    return price * (1 - discount / 100);
  };

  const calculateRevenue = () => {
    if (!formData.price) return 0;
    return parseFloat(formData.price) * 0.7; // Assuming 70% revenue share
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
        <div className="flex items-center mb-4">
          <CurrencyDollarIcon className="h-6 w-6 text-yellow-600 mr-2" />
          <h3 className="text-lg font-semibold text-yellow-900">Pricing Strategy</h3>
        </div>
        <p className="text-yellow-800">
          Set a competitive price that reflects the value of your course.
        </p>
      </div>

      <div className="space-y-6">
        {/* Free vs Paid Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Course Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleInputChange({ target: { name: 'isFree', value: true } })}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.isFree
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <HeartIcon className="h-8 w-8" />
              </div>
              <h4 className="font-semibold text-lg mb-1">Free Course</h4>
              <p className="text-sm opacity-75">Perfect for building your audience and sharing knowledge</p>
            </button>
            
            <button
              type="button"
              onClick={() => handleInputChange({ target: { name: 'isFree', value: false } })}
              className={`p-4 rounded-lg border-2 transition-all ${
                !formData.isFree
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <CurrencyDollarIcon className="h-8 w-8" />
              </div>
              <h4 className="font-semibold text-lg mb-1">Paid Course</h4>
              <p className="text-sm opacity-75">Monetize your expertise and earn revenue</p>
            </button>
          </div>
        </div>

        {/* Pricing Options - Only show if not free */}
        {!formData.isFree && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Price (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g., 29.99"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </label>
                <select
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="0">No discount</option>
                  <option value="10">10% off</option>
                  <option value="20">20% off</option>
                  <option value="30">30% off</option>
                  <option value="40">40% off</option>
                  <option value="50">50% off</option>
                </select>
              </div>
            </div>

            {formData.price && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 mb-4">Revenue Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">List Price</p>
                    <p className="text-2xl font-bold text-blue-900">${formData.price}</p>
                  </div>
                  {formData.discount > 0 && (
                    <div>
                      <p className="text-sm text-blue-700">After Discount</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${calculateDiscountedPrice().toFixed(2)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-blue-700">Your Revenue (70%)</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${calculateRevenue().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Free Course Benefits - Only show if free */}
        {formData.isFree && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-medium text-green-900 mb-4">Benefits of Free Courses</h4>
            <ul className="text-sm text-green-800 space-y-2">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Build your student base and reputation quickly</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>No payment integration required</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Perfect for testing course content and getting feedback</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Can be monetized later when you're ready</span>
              </li>
            </ul>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">Pricing Tips</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Research similar courses to set a competitive price</li>
            <li>• Consider your experience and course quality</li>
            <li>• Higher prices often signal higher value to students</li>
            <li>• Use limited-time discounts to boost enrollment</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

// Review Step
const ReviewStep = ({ formData, errors, isSubmitting }) => {
  const calculateDiscountedPrice = () => {
    if (!formData.price || !formData.discount) return formData.price;
    const price = parseFloat(formData.price);
    const discount = parseFloat(formData.discount);
    return price * (1 - discount / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center mb-4">
          <ClipboardDocumentCheckIcon className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-green-900">Review & Publish</h3>
        </div>
        <p className="text-green-800">
          Review your course details before publishing. You can always edit later.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Course Overview</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Basic Information</h5>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Title:</span> {formData.title || 'Not set'}</div>
                <div><span className="font-medium">Category:</span> {formData.category ? COURSE_CATEGORIES.find(c => c.id === formData.category)?.name : 'Not set'}</div>
                <div><span className="font-medium">Level:</span> {formData.level ? COURSE_LEVELS.find(l => l.id === formData.level)?.name : 'Not set'}</div>
                <div><span className="font-medium">Language:</span> {formData.language ? LANGUAGES.find(l => l.id === formData.language)?.name : 'Not set'}</div>
                <div><span className="font-medium">Duration:</span> {formData.duration ? `${formData.duration} hours` : 'Not set'}</div>
                <div><span className="font-medium">Lectures:</span> {formData.lectures || 'Not set'}</div>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Pricing</h5>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Price:</span> ${formData.price || 'Not set'}</div>
                {formData.discount > 0 && (
                  <div><span className="font-medium">Discount:</span> {formData.discount}% off</div>
                )}
                {formData.discount > 0 && formData.price && (
                  <div><span className="font-medium">Final Price:</span> ${calculateDiscountedPrice().toFixed(2)}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {formData.description && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h5 className="font-medium text-gray-700 mb-2">Description</h5>
            <p className="text-sm text-gray-600">{formData.description}</p>
          </div>
        )}

        {formData.objectives.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h5 className="font-medium text-gray-700 mb-2">Learning Outcomes</h5>
            <ul className="space-y-1">
              {formData.objectives.map((objective, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        )}

        {formData.requirements.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h5 className="font-medium text-gray-700 mb-2">Prerequisites</h5>
            <ul className="space-y-1">
              {formData.requirements.map((requirement, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <ShieldCheckIcon className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {formData.tags.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h5 className="font-medium text-gray-700 mb-2">Tags</h5>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{errors.submit}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Main Component
const CreateCourse = () => {
  const navigate = useNavigate();
  const { user, setUser, refreshUserData, isVerifiedTrainer, getTrainerRequestStatus } = useAuthStore(); // Get all auth store functions
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(null);
  
  // Fetch fresh user data on component mount
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);
  
  // Manual refresh function for debugging
  const handleRefreshUserData = async () => {
    await refreshUserData();
  };
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    language: '',
    subtitleLanguage: '',
    duration: '',
    lectures: '',
    objectives: [],
    requirements: [],
    targetAudience: '',
    tags: [],
    thumbnail: null,
    previewVideo: null,
    isFree: true, // Default to free course
    price: undefined, // Don't send price for free courses
    discount: '0',
    status: 'draft'
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, name: 'Basic Info', icon: BookOpenIcon },
    { id: 2, name: 'Content', icon: DocumentIcon },
    { id: 3, name: 'Media', icon: CameraIcon },
    { id: 4, name: 'Pricing', icon: CurrencyDollarIcon },
    { id: 5, name: 'Review', icon: CheckCircleIcon }
  ];

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title || formData.description) {
        localStorage.setItem('courseDraft', JSON.stringify(formData));
        setLastSaved(new Date());
        setAutoSaveStatus('saved');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('courseDraft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        // Clean the draft data to remove any unwanted fields
        const cleanedDraft = {
          ...parsedDraft,
          status: 'draft' // Ensure status is always draft
        };
        delete cleanedDraft.isPublished;
        delete cleanedDraft.previewVideo;
        delete cleanedDraft.discount;
        setFormData(cleanedDraft);
        setLastSaved(new Date(parsedDraft.lastSaved));
      } catch (error) {
      }
    }
  }, []);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Course title is required';
      } else if (formData.title.trim().length < 3) {
        newErrors.title = 'Course title must be at least 3 characters';
      }

      if (!formData.description.trim()) {
        newErrors.description = 'Course description is required';
      } else if (formData.description.trim().length < 10) {
        newErrors.description = 'Description must be at least 10 characters';
      }

      if (!formData.category) {
        newErrors.category = 'Category is required';
      }

      if (!formData.level) {
        newErrors.level = 'Level is required';
      }

      if (!formData.language) {
        newErrors.language = 'Language is required';
      }
    }

    if (step === 2) {
      if (!formData.duration || parseFloat(formData.duration) <= 0) {
        newErrors.duration = 'Duration must be greater than 0';
      }

      if (!formData.lectures || parseInt(formData.lectures) <= 0) {
        newErrors.lectures = 'Number of lectures must be greater than 0';
      }

      if (formData.objectives.length === 0) {
        newErrors.objectives = 'At least one learning outcome is required';
      }
    }

    if (step === 4) {
      // Only validate price if it's a paid course
      if (!formData.isFree) {
        if (!formData.price || parseFloat(formData.price) < 0) {
          newErrors.price = 'Price must be a valid positive number';
        }
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

  const handleStepClick = (stepId) => {
    // Allow navigation to previous steps and current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue = value;
    
    // Handle different input types
    if (type === 'number') {
      processedValue = value === '' ? '' : parseFloat(value);
    } else if (type === 'checkbox') {
      processedValue = e.target.checked;
    } else if (typeof value === 'boolean') {
      processedValue = value;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(5)) {
      return;
    }
    
    if (user?.role === 'trainer' && !user?.isVerifiedTrainer) {
      toast.error('Your trainer account must be approved by admin before creating courses. Please wait for admin approval.');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Ensure minimum required fields have values
      const submissionData = {
        ...formData,
        objectives: formData.objectives.length > 0 ? formData.objectives : ['Learn the fundamentals'],
        requirements: formData.requirements.length > 0 ? formData.requirements : ['Basic computer skills'],
        tags: formData.tags.length > 0 ? formData.tags : ['beginner-friendly'],
        duration: formData.duration || 10, // Send as number
        lectures: formData.lectures || 20 // Send as number
      };

      // Only include fields that the backend accepts based on schema
      const finalData = {
        title: submissionData.title,
        description: submissionData.description,
        category: submissionData.category,
        level: submissionData.level,
        language: submissionData.language,
        duration: submissionData.duration, // in minutes as per schema
        originalPrice: submissionData.price || 0, // mapped to originalPrice
        // Don't send status - backend will set default 'draft'
        // Don't send tags - not in backend schema
        // Don't send lectures - not in backend schema
      };

      // Remove any unwanted properties that might cause backend errors
      delete finalData.isPublished;
      delete finalData.previewVideo;
      delete finalData.discount;
      delete finalData.lessons;
      
      // Recursively clean any nested objects that might contain isPublished
      const cleanNestedObjects = (obj) => {
        if (typeof obj !== 'object' || obj === null) {
          return obj;
        }
        const cleaned = {};
        for (const key in obj) {
          if (key === 'isPublished') continue;
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            cleaned[key] = cleanNestedObjects(obj[key]);
          } else {
            cleaned[key] = obj[key];
          }
        }
        return cleaned;
      };
      
      const cleanFinalData = cleanNestedObjects(finalData);
      
      // Debug: Log the final data being sent
      console.log('🔍 CreateCourse Debug - Final data being sent:', cleanFinalData);
      console.log('🔍 CreateCourse Debug - Data types:', Object.keys(cleanFinalData).map(key => ({
        field: key,
        type: typeof cleanFinalData[key],
        value: cleanFinalData[key],
        isArray: Array.isArray(cleanFinalData[key])
      })));

      // Determine the correct endpoint based on user role
      const endpoint = user?.role === 'trainer' 
        ? API_ENDPOINTS.TRAINER.CREATE_COURSE
        : API_ENDPOINTS.COURSES.CREATE;
      
      console.log('🔍 CreateCourse Debug - Using endpoint:', endpoint);
      
      
      const response = await apiService.post(endpoint, cleanFinalData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });


      // Clear draft after successful submission
      localStorage.removeItem('courseDraft');
      
      toast.success('Course created successfully!');
      navigate('/trainer/courses');
    } catch (error) {
      
      toast.error(error.response?.data?.message || 'Failed to create course');
      setErrors({ submit: error.response?.data?.message || 'Failed to create course' });
      
      // Handle specific 403 error
      if (error.response?.status === 403) {
        let errorMessage = `Access denied. Current role: ${user?.role}.`;
        
        if (error.response?.data?.message?.includes('verified')) {
          errorMessage += ' Trainer account must be approved by admin before creating courses. Please wait for admin approval of your trainer application.';
        } else if (!user?.isVerifiedTrainer) {
          errorMessage += ' Your trainer account is not verified. Please submit a trainer application and wait for admin approval.';
        } else {
          errorMessage += ' Required roles: trainer. Please contact admin to update your role.';
        }
        
        setErrors({ submit: errorMessage });
        toast.error(errorMessage);
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to create course. Please try again.';
        setErrors({ submit: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/trainer/courses')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Create New Course</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {autoSaveStatus === 'saved' && lastSaved && (
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                )}
                {autoSaveStatus === 'saving' && (
                  <span className="text-blue-600">Saving...</span>
                )}
              </div>
              
              {/* Debug refresh button */}
              <button
                onClick={handleRefreshUserData}
                className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                title="Refresh user data"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => {
                  localStorage.removeItem('courseDraft');
                  navigate('/trainer/courses');
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <BasicInfoStep
                  key="step1"
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  setFormData={setFormData}
                />
              )}
              {currentStep === 2 && (
                <ContentStep
                  key="step2"
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  setFormData={setFormData}
                />
              )}
              {currentStep === 3 && (
                <MediaStep
                  key="step3"
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {currentStep === 4 && (
                <PricingStep
                  key="step4"
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                />
              )}
              {currentStep === 5 && (
                <ReviewStep
                  key="step5"
                  formData={formData}
                  errors={errors}
                  isSubmitting={isSubmitting}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>

            <div className="flex items-center space-x-4">
              {currentStep === 5 ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const courseData = { ...formData, status: 'draft' };
                      localStorage.setItem('courseDraft', JSON.stringify(courseData));
                      toast.success('Course saved as draft!');
                      navigate('/trainer/courses');
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <RocketLaunchIcon className="h-4 w-4 mr-2" />
                        Publish Course
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center"
                >
                  Next
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
