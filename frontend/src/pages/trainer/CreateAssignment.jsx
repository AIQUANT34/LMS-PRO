import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  XMarkIcon,
  FolderIcon,
  StarIcon,
  ChartBarIcon,
  VideoCameraIcon,
  DocumentIcon,
  LinkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';

const BasicInfoStep = ({ formData, handleInputChange, errors, courses, handleSelectChange, handleKeyDown }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assignment Title <span className="text-red-500">*</span>
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
          Course <span className="text-red-500">*</span>
        </label>
        <select
          name="courseId"
          value={formData.courseId}
          onChange={handleSelectChange}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.courseId ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
        {errors.courseId && (
          <p className="mt-1 text-sm text-red-500">{errors.courseId}</p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assignment Type <span className="text-red-500">*</span>
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleSelectChange}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="coding">Coding Exercise</option>
          <option value="quiz">Quiz</option>
          <option value="project">Project</option>
          <option value="essay">Essay</option>
          <option value="presentation">Presentation</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-500">{errors.type}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Difficulty Level <span className="text-red-500">*</span>
        </label>
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleSelectChange}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.difficulty ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        {errors.difficulty && (
          <p className="mt-1 text-sm text-red-500">{errors.difficulty}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Points
        </label>
        <input
          type="number"
          name="points"
          value={formData.points}
          onChange={handleInputChange}
          min="0"
          max="1000"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Due Date <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.dueDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estimated Time
        </label>
        <input
          type="text"
          name="estimatedTime"
          value={formData.estimatedTime}
          onChange={handleInputChange}
          placeholder="e.g., 2 hours, 30 minutes"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
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
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.description ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="Describe assignment requirements and objectives..."
      />
      {errors.description && (
        <p className="mt-1 text-sm text-red-500">{errors.description}</p>
      )}
    </div>
  </div>
);

const ContentStep = ({ formData, handleInputChange, errors }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Instructions <span className="text-red-500">*</span>
      </label>
      <textarea
        name="instructions"
        value={formData.instructions}
        onChange={handleInputChange}
        rows={8}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.instructions ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="Provide detailed instructions for completing this assignment..."
      />
      {errors.instructions && (
        <p className="mt-1 text-sm text-red-500">{errors.instructions}</p>
      )}
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-medium text-blue-900 mb-2">Rich Text Editor Tips:</h4>
      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
        <li>Bold, italic, and underline formatting</li>
        <li>Bullet points and numbered lists</li>
        <li>Code blocks and syntax highlighting</li>
        <li>Links and embedded media</li>
        <li>Mathematical equations and formulas</li>
      </ul>
    </div>
  </div>
);

const MaterialsStep = ({ 
  formData, 
  setFormData, 
  newMaterial, 
  setNewMaterial, 
  addMaterial, 
  removeMaterial, 
  handleMaterialChange, 
  handleKeyDown,
  errors 
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Assignment Materials</h3>
      <button
        type='button'
        onClick={() => setNewMaterial({ title: '', type: 'file', url: '' })}
        className="btn-premium"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Material
      </button>
    </div>

    <div className="space-y-4">
      {formData.materials.map((material) => (
        <div key={material.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              {material.type === 'file' && <DocumentIcon className="h-5 w-5 text-blue-600" />}
              {material.type === 'video' && <VideoCameraIcon className="h-5 w-5 text-red-600" />}
              {material.type === 'link' && <LinkIcon className="h-5 w-5 text-green-600" />}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{material.title}</h4>
                {material.url && (
                  <a 
                    href={material.url} 
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 text-sm truncate block max-w-xs"
                  >
                    {material.url}
                  </a>
                )}
              </div>
            </div>
            <button
              type='button'
              onClick={() => removeMaterial(material.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>

    {formData.materials.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        <DocumentIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
        <p>No materials added yet. Click "Add Material" to get started.</p>
      </div>
    )}

    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-3">Add New Material</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material Title
          </label>
          <input
            type="text"
            value={newMaterial.title}
            onChange={(e) => handleMaterialChange('title', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter material title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={newMaterial.type}
            onChange={(e) => handleMaterialChange('type', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="file">Document/File</option>
            <option value="video">Video</option>
            <option value="link">External Link</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL (optional)
          </label>
          <input
            type="url"
            value={newMaterial.url}
            onChange={(e) => handleMaterialChange('url', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>
      </div>
      <button
        type='button'
        onClick={addMaterial}
        className="w-full mt-4 btn-premium"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Material
      </button>
    </div>
  </div>
);

const GradingStep = ({ 
  formData, 
  setFormData, 
  newRubricCriterion, 
  setNewRubricCriterion, 
  addRubricCriterion, 
  removeRubricCriterion, 
  updateRubricTotalPoints, 
  handleRubricChange,
  handleKeyDown,
  errors 
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Grading Rubric</h3>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Total Points:</label>
          <input
            type="number"
            value={formData.rubric.totalPoints}
            onChange={(e) => updateRubricTotalPoints(parseInt(e.target.value) || 0)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type='button'
          onClick={() => setNewRubricCriterion({ description: '', points: 0 })}
          className="btn-premium"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Criterion
        </button>
      </div>
    </div>

    {errors.rubric && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-red-800">{errors.rubric}</p>
      </div>
    )}

    {errors.rubricPoints && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-red-800">{errors.rubricPoints}</p>
      </div>
    )}

    <div className="space-y-4">
      {formData.rubric.criteria.map((criterion, index) => (
        <div key={criterion.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Criterion Description
                  </label>
                  <textarea
                    value={criterion.description}
                    onChange={(e) => handleRubricChange(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Code clarity and efficiency"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    value={criterion.points}
                    onChange={(e) => handleRubricChange(index, 'points', parseInt(e.target.value) || 0)}
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <button
              type='button'
              onClick={() => removeRubricCriterion(criterion.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>

    {formData.rubric.criteria.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
        <p>No grading criteria added yet. Click "Add Criterion" to get started.</p>
      </div>
    )}
  </div>
);

const SettingsStep = ({ 
  formData, 
  handleInputChange, 
  handleKeyDown,
  errors 
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Submission Settings</h4>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="settings.allowLateSubmission"
              checked={formData.settings.allowLateSubmission}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Allow late submissions</span>
          </label>

          <label className="flex items-center">
            <input
              type="number"
              name="settings.maxAttempts"
              value={formData.settings.maxAttempts}
              onChange={handleInputChange}
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="settings.showSolutions"
              checked={formData.settings.showSolutions}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Show solutions after due date</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

const ReviewStep = ({ formData, courses }) => (
  <div className="space-y-6">
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Review</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Title:</span> {formData.title || 'Not set'}</div>
            <div><span className="font-medium">Course:</span> {courses.find(c => c.id === parseInt(formData.courseId))?.title || 'Not selected'}</div>
            <div><span className="font-medium">Type:</span> {formData.type || 'Not set'}</div>
            <div><span className="font-medium">Difficulty:</span> {formData.difficulty || 'Not set'}</div>
            <div><span className="font-medium">Points:</span> {formData.points || 'Not set'}</div>
            <div><span className="font-medium">Due Date:</span> {formData.dueDate ? new Date(formData.dueDate).toLocaleString() : 'Not set'}</div>
            <div><span className="font-medium">Estimated Time:</span> {formData.estimatedTime || 'Not set'}</div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Description</h4>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            {formData.description || 'No description provided'}
          </div>
        </div>
      </div>

      {/* Materials */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Materials ({formData.materials.length})</h4>
        <div className="space-y-2">
          {formData.materials.length > 0 ? (
            formData.materials.map((material, index) => (
              <div key={material.id} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                {material.type === 'file' && <DocumentIcon className="h-4 w-4 text-blue-600" />}
                {material.type === 'video' && <VideoCameraIcon className="h-4 w-4 text-red-600" />}
                {material.type === 'link' && <LinkIcon className="h-4 w-4 text-green-600" />}
                <span className="flex-1">{material.title}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm">No materials added</div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Late Submissions:</span> {formData.settings.allowLateSubmission ? 'Allowed' : 'Not allowed'}</div>
          <div><span className="font-medium">Max Attempts:</span> {formData.settings.maxAttempts}</div>
          <div><span className="font-medium">Time Limit:</span> {formData.settings.timeLimit ? `${formData.settings.timeLimit} minutes` : 'No limit'}</div>
          <div><span className="font-medium">Show Solutions:</span> {formData.settings.showSolutions ? 'After due date' : 'Never'}</div>
        </div>
      </div>
    </div>
  </div>
);

// Step Indicator Component
const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-8">
    {[1, 2, 3, 4, 5, 6].map((step) => (
      <div
        key={step}
        className={`flex items-center ${currentStep > step ? 'text-green-600' : 'text-gray-400'}`}
      >
        <div className={`flex-1 h-1 mx-4 ${
          currentStep > step ? 'bg-green-600' : 'bg-gray-300'
        }`} />
        {currentStep > step && (
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
        )}
      </div>
    ))}
  </div>
);

const CreateAssignment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    type: 'coding',
    difficulty: 'intermediate',
    points: 100,
    estimatedTime: '2 hours',
    dueDate: '',
    instructions: '',
    materials: [],
    rubric: {
      criteria: [],
      totalPoints: 100
    },
    settings: {
      allowLateSubmission: true,
      maxAttempts: 3,
      showSolutions: false,
      timeLimit: null
    }
  });

  const [errors, setErrors] = useState({});
  const [newMaterial, setNewMaterial] = useState({ title: '', type: 'file', url: '' });
  const [newRubricCriterion, setNewRubricCriterion] = useState({ description: '', points: 0 });

  const steps = [
    { id: 1, name: 'Basic Info', icon: DocumentTextIcon },
    { id: 2, name: 'Content', icon: ClipboardDocumentListIcon },
    { id: 3, name: 'Materials', icon: FolderIcon },
    { id: 4, name: 'Grading', icon: StarIcon },
    { id: 5, name: 'Settings', icon: Cog6ToothIcon },
    { id: 6, name: 'Review', icon: EyeIcon }
  ];

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.TRAINER.GET_COURSES);
      setCourses(response.data?.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      // Fallback mock courses
      setCourses([
        { id: 1, title: 'Complete React Development Course' },
        { id: 2, title: 'Advanced React Development' },
        { id: 3, title: 'Node.js Backend Development' },
        { id: 4, title: 'Python Programming' },
        { id: 5, title: 'Data Science Fundamentals' }
      ]);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title || formData.description) {
        saveDraft();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [formData.title, formData.description]); // Only watch title and description

  const saveDraft = useCallback(async () => {
    try {
      setAutoSaveStatus('saving');
      localStorage.setItem('assignmentDraft', JSON.stringify({
        ...formData,
        lastSaved: new Date().toISOString()
      }));
      setAutoSaveStatus('saved');
    } catch (error) {
      setAutoSaveStatus('error');
      console.error('Auto-save failed:', error);
    }
  }, []); // Remove formData dependency to prevent re-renders

  const validateStep = useCallback((step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Assignment title is required';
      } else if (formData.title.trim().length < 3) {
        newErrors.title = 'Title must be at least 3 characters';
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.trim().length < 10) {
        newErrors.description = 'Description must be at least 10 characters';
      }
      
      if (!formData.courseId) {
        newErrors.courseId = 'Course selection is required';
      }
      
      if (!formData.type) {
        newErrors.type = 'Assignment type is required';
      }
      
      if (!formData.difficulty) {
        newErrors.difficulty = 'Difficulty level is required';
      }
      
      if (!formData.dueDate) {
        newErrors.dueDate = 'Due date is required';
      } else {
        const dueDate = new Date(formData.dueDate);
        const now = new Date();
        if (dueDate <= now) {
          newErrors.dueDate = 'Due date must be in the future';
        }
      }
    }
    
    if (step === 2) {
      if (!formData.instructions.trim()) {
        newErrors.instructions = 'Instructions are required';
      }
    }
    
    if (step === 3) {
      if (formData.materials.length === 0) {
        newErrors.materials = 'At least one material is required';
      }
    }
    
    if (step === 4) {
      if (formData.rubric.criteria.length === 0) {
        newErrors.rubric = 'At least one grading criterion is required';
      }
      
      const totalRubricPoints = formData.rubric.criteria.reduce((sum, criterion) => sum + criterion.points, 0);
      if (totalRubricPoints !== formData.rubric.totalPoints) {
        newErrors.rubricPoints = 'Total points must match sum of criteria points';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  }, [currentStep, validateStep]);

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested settings fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle material input changes separately to avoid form submission
  const handleMaterialChange = useCallback((field, value) => {
    setNewMaterial(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle rubric criterion changes separately to avoid form submission
  const handleRubricChange = useCallback((index, field, value) => {
    const updatedCriteria = formData.rubric.criteria.map((criterion, i) => 
      i === index ? { ...criterion, [field]: value } : criterion
    );
    setFormData(prev => ({
      ...prev,
      rubric: {
        ...prev.rubric,
        criteria: updatedCriteria
      }
    }));
  }, [formData]);

  // Prevent Enter key from submitting form
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  // Handle select changes without form submission
  const handleSelectChange = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    handleInputChange(e);
  }, [handleInputChange]);

  const handleSubmit = useCallback(async (e) => {
    console.log("Form submitted")
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    if (!validateStep(steps.length)) {
      return;
    }
    
    setSaving(true);
    
    try {
      const assignmentData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await apiService.post(API_ENDPOINTS.TRAINER.ASSIGNMENTS.CREATE, assignmentData);
      
      // Clear draft after successful submission
      localStorage.removeItem('assignmentDraft');
      
      toast.success('Assignment created successfully!');
      navigate('/trainer/assignments');
    } catch (error) {
      console.error('Failed to create assignment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create assignment';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  }, [formData, validateStep]);

  // Prevent any form submission except from submit button
  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const addMaterial = useCallback(() => {
    if (newMaterial.title.trim() && newMaterial.url.trim()) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, { ...newMaterial, id: Date.now() }]
      }));
      setNewMaterial({ title: '', type: 'file', url: '' });
    }
  }, [newMaterial]);

  const removeMaterial = useCallback((materialId) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(material => material.id !== materialId)
    }));
  }, []);

  const addRubricCriterion = useCallback(() => {
    if (newRubricCriterion.description.trim() && newRubricCriterion.points > 0) {
      setFormData(prev => ({
        ...prev,
        rubric: {
          ...prev.rubric,
          criteria: [...prev.rubric.criteria, { 
            ...newRubricCriterion, 
            id: Date.now() 
          }]
        }
      }));
      setNewRubricCriterion({ description: '', points: 0 });
    }
  }, [newRubricCriterion]);

  const removeRubricCriterion = useCallback((criterionId) => {
    setFormData(prev => ({
      ...prev,
      rubric: {
        ...prev.rubric,
        criteria: prev.rubric.criteria.filter(criterion => criterion.id !== criterionId)
      }
    }));
  }, []);

  const updateRubricTotalPoints = useCallback((points) => {
    setFormData(prev => ({
      ...prev,
      rubric: {
        ...prev.rubric,
        totalPoints: points
      }
    }));
  }, []);

  const loadDraft = useCallback(() => {
    try {
      const draft = localStorage.getItem('assignmentDraft');
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        setFormData(parsedDraft);
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <BasicInfoStep formData={formData} handleInputChange={handleInputChange} errors={errors} courses={courses} handleSelectChange={handleSelectChange} handleKeyDown={handleKeyDown} />;
      case 2: return <ContentStep formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      case 3: return <MaterialsStep formData={formData} setFormData={setFormData} newMaterial={newMaterial} setNewMaterial={setNewMaterial} addMaterial={addMaterial} removeMaterial={removeMaterial} handleMaterialChange={handleMaterialChange} handleKeyDown={handleKeyDown} errors={errors} />;
      case 4: return <GradingStep formData={formData} setFormData={setFormData} newRubricCriterion={newRubricCriterion} setNewRubricCriterion={setNewRubricCriterion} addRubricCriterion={addRubricCriterion} removeRubricCriterion={removeRubricCriterion} updateRubricTotalPoints={updateRubricTotalPoints} handleRubricChange={handleRubricChange} handleKeyDown={handleKeyDown} errors={errors} />;
      case 5: return <SettingsStep formData={formData} handleInputChange={handleInputChange} handleKeyDown={handleKeyDown} errors={errors} />;
      case 6: return <ReviewStep formData={formData} courses={courses} />;
      case 4: return <GradingStep formData={formData} setFormData={setFormData} newRubricCriterion={newRubricCriterion} setNewRubricCriterion={setNewRubricCriterion} addRubricCriterion={addRubricCriterion} removeRubricCriterion={removeRubricCriterion} updateRubricTotalPoints={updateRubricTotalPoints} handleRubricChange={handleRubricChange} handleKeyDown={handleKeyDown} errors={errors} />;
      case 5: return <SettingsStep formData={formData} handleInputChange={handleInputChange} handleKeyDown={handleKeyDown} errors={errors} />;
      case 6: return <ReviewStep formData={formData} courses={courses} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/trainer/assignments')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Assignment</h1>
                <p className="text-sm text-gray-600">Create a new assignment for your students</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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
                    <span className="text-sm text-gray-600">Draft saved</span>
                  </>
                )}
                {autoSaveStatus === 'error' && (
                  <>
                    <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-gray-600">Save failed</span>
                  </>
                )}
              </div>
              
              <button
                type='button'
                onClick={loadDraft}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Load Draft
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div>
            {renderStepContent()}
          </div>

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
              {currentStep < steps.length && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-premium"
                >
                  Next Step
                  <ArrowLeftIcon className="h-4 w-4 ml-2 rotate-180" />
                </button>
              )}
              
              {currentStep === steps.length && (
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-premium"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Create Assignment
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;
