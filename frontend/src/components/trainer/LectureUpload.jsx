import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VideoCameraIcon,
  DocumentIcon,
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import uploadService from '../../services/uploadService';
import toast from 'react-hot-toast';

const LectureUpload = ({ courseId, onLectureCreated, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPreview: false,
    isPublished: false,
  });
  const [files, setFiles] = useState({
    video: null,
    thumbnail: null,
    resources: [],
  });
  const [uploadProgress, setUploadProgress] = useState({});
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle file selection
  const handleFileSelect = useCallback(async (fileType, selectedFile) => {
    try {
      // Validate file
      if (fileType === 'video') {
        uploadService.validateFile(selectedFile, ['video/'], 500 * 1024 * 1024); // 500MB
      } else if (fileType === 'thumbnail') {
        uploadService.validateFile(selectedFile, ['image/'], 10 * 1024 * 1024); // 10MB
      } else if (fileType === 'resources') {
        uploadService.validateFile(selectedFile, ['image/', 'application/pdf', 'application/msword'], 50 * 1024 * 1024); // 50MB
      }

      // Create preview
      if (fileType === 'thumbnail' || fileType === 'video') {
        const preview = fileType === 'thumbnail' 
          ? await uploadService.createImagePreview(selectedFile)
          : await uploadService.createVideoPreview(selectedFile);
        
        setPreviews(prev => ({
          ...prev,
          [fileType]: preview
        }));
      }

      setFiles(prev => ({
        ...prev,
        [fileType]: fileType === 'resources' 
          ? [...prev.resources, selectedFile]
          : selectedFile
      }));

      // Clear errors
      setErrors(prev => ({ ...prev, [fileType]: '' }));
      
    } catch (error) {
      setErrors(prev => ({ ...prev, [fileType]: error.message }));
      toast.error(error.message);
    }
  }, []);

  // Remove file
  const removeFile = (fileType, index = null) => {
    if (fileType === 'resources' && index !== null) {
      const newResources = [...files.resources];
      newResources.splice(index, 1);
      setFiles(prev => ({ ...prev, resources: newResources }));
    } else {
      setFiles(prev => ({ ...prev, [fileType]: null }));
      setPreviews(prev => ({ ...prev, [fileType]: null }));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!files.video) newErrors.video = 'Video file is required';
    }
    
    if (step === 2) {
      if (!files.thumbnail) newErrors.thumbnail = 'Thumbnail is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Upload files to S3
  const uploadFiles = async () => {
    setLoading(true);
    const uploadedUrls = {};
    
    try {
      // Upload video
      if (files.video) {
        setUploadProgress({ video: 0 });
        const videoResult = await uploadService.uploadFile(
          files.video, 
          'lecture-videos',
          (progress) => setUploadProgress({ video: progress })
        );
        uploadedUrls.videoUrl = videoResult.fileUrl;
        uploadedUrls.videoMetadata = {
          duration: 0, // Will be updated by video processing
          format: files.video.type,
          size: files.video.size,
        };
      }

      // Upload thumbnail
      if (files.thumbnail) {
        setUploadProgress({ thumbnail: 0 });
        const thumbnailResult = await uploadService.uploadFile(
          files.thumbnail,
          'lecture-thumbnails',
          (progress) => setUploadProgress({ thumbnail: progress })
        );
        uploadedUrls.thumbnailUrl = thumbnailResult.fileUrl;
      }

      // Upload resource files
      if (files.resources.length > 0) {
        uploadedUrls.resourceFiles = [];
        setUploadProgress({ resources: 0 });
        
        for (let i = 0; i < files.resources.length; i++) {
          const resource = files.resources[i];
          const result = await uploadService.uploadFile(
            resource,
            'lecture-resources',
            (progress) => {
              const overallProgress = ((i * 100) + progress) / files.resources.length;
              setUploadProgress({ resources: Math.round(overallProgress) });
            }
          );
          
          uploadedUrls.resourceFiles.push({
            name: resource.name,
            url: result.fileUrl,
            type: uploadService.isPdfFile(resource) ? 'pdf' : 
                  uploadService.isImageFile(resource) ? 'image' : 'document',
            size: resource.size,
          });
        }
      }

      return uploadedUrls;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
      setUploadProgress({});
    }
  };

  // Submit lecture
  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    try {
      setLoading(true);
      
      // Upload all files
      const uploadedUrls = await uploadFiles();
      
      // Create lecture data
      const lectureData = {
        ...formData,
        courseId,
        ...uploadedUrls,
      };
      
      // Send to backend
      const response = await fetch('/api/lectures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(lectureData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create lecture');
      }
      
      const newLecture = await response.json();
      toast.success('Lecture created successfully!');
      onLectureCreated(newLecture);
      
    } catch (error) {
      console.error('Error creating lecture:', error);
      toast.error(error.message || 'Failed to create lecture');
    } finally {
      setLoading(false);
    }
  };

  // Render file upload area
  const renderFileUpload = (fileType, title, description, acceptedTypes, icon) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
      <input
        type="file"
        id={`${fileType}-upload`}
        accept={acceptedTypes}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) handleFileSelect(fileType, file);
        }}
        className="hidden"
      />
      <label htmlFor={`${fileType}-upload`} className="cursor-pointer">
        {icon}
        <p className="text-gray-600 mb-2">
          {files[fileType] ? files[fileType].name : `Click to upload ${title.toLowerCase()}`}
        </p>
        <p className="text-sm text-gray-500">{description}</p>
        {files[fileType] && (
          <div className="mt-2 text-sm text-blue-600">
            Size: {uploadService.formatFileSize(files[fileType].size)}
          </div>
        )}
      </label>
      
      {errors[fileType] && (
        <p className="mt-2 text-sm text-red-500">{errors[fileType]}</p>
      )}
      
      {files[fileType] && (
        <button
          type="button"
          onClick={() => removeFile(fileType)}
          className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Remove
        </button>
      )}
      
      {previews[fileType] && (
        <div className="mt-4">
          {fileType === 'video' ? (
            <video
              src={previews[fileType]}
              className="w-full max-w-md mx-auto rounded-lg"
              controls
            />
          ) : (
            <img
              src={previews[fileType]}
              alt="Preview"
              className="w-full max-w-md mx-auto rounded-lg"
            />
          )}
        </div>
      )}
      
      {uploadProgress[fileType] !== undefined && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress[fileType]}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {uploadProgress[fileType]}% uploaded
          </p>
        </div>
      )}
    </div>
  );

  // Render resource files
  const renderResourceFiles = () => (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          id="resources-upload"
          accept="image/*,.pdf,.doc,.docx"
          multiple
          onChange={(e) => {
            const newFiles = Array.from(e.target.files);
            newFiles.forEach(file => handleFileSelect('resources', file));
          }}
          className="hidden"
        />
        <label htmlFor="resources-upload" className="cursor-pointer">
          <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Click to upload resource files</p>
          <p className="text-sm text-gray-500">Images, PDFs, or documents (max 50MB each)</p>
        </label>
      </div>
      
      {files.resources.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Resource Files ({files.resources.length})</h4>
          {files.resources.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                {uploadService.isImageFile(file) && <PhotoIcon className="h-5 w-5 text-blue-600" />}
                {uploadService.isPdfFile(file) && <DocumentIcon className="h-5 w-5 text-red-600" />}
                {!uploadService.isImageFile(file) && !uploadService.isPdfFile(file) && <DocumentIcon className="h-5 w-5 text-gray-600" />}
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{uploadService.formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile('resources', index)}
                className="text-red-600 hover:text-red-800"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {uploadProgress.resources !== undefined && (
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress.resources}%` }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Lecture</h2>
          <p className="text-gray-600 mt-1">Add video content to your course</p>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep > step ? 'bg-green-600 text-white' : 
                    currentStep === step ? 'bg-blue-600 text-white' : 
                    'bg-gray-200 text-gray-500'}
                `}>
                  {currentStep > step ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div className={`
                    w-16 h-1 mx-2
                    ${currentStep > step ? 'bg-green-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-xs text-gray-500">
            <span className="w-20 text-center">Basic Info</span>
            <span className="w-16 text-center">Thumbnail</span>
            <span className="w-16 text-center">Resources</span>
            <span className="w-16 text-center">Review</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lecture Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter lecture title"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title}</p>
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
                      placeholder="Describe what students will learn in this lecture"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    {renderFileUpload(
                      'video',
                      'Video',
                      'MP4, MOV, or AVI (max 500MB)',
                      'video/*',
                      <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    )}
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isPreview"
                        checked={formData.isPreview}
                        onChange={handleInputChange}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Free preview lecture</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleInputChange}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Publish immediately</span>
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lecture Thumbnail</h3>
                  <p className="text-gray-600 mb-6">
                    Upload an attractive thumbnail to help students understand what this lecture is about.
                  </p>
                  
                  {renderFileUpload(
                    'thumbnail',
                    'Thumbnail',
                    'JPG, PNG, or GIF (max 10MB, recommended 1280x720)',
                    'image/*',
                    <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Files</h3>
                  <p className="text-gray-600 mb-6">
                    Add supplementary materials like PDFs, images, or documents to help students learn better.
                  </p>
                  
                  {renderResourceFiles()}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Create</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Lecture Details</h4>
                    <div className="space-y-3 text-sm">
                      <div><span className="font-medium">Title:</span> {formData.title}</div>
                      <div><span className="font-medium">Description:</span> {formData.description}</div>
                      <div><span className="font-medium">Video:</span> {files.video ? files.video.name : 'Not uploaded'}</div>
                      <div><span className="font-medium">Thumbnail:</span> {files.thumbnail ? files.thumbnail.name : 'Not uploaded'}</div>
                      <div><span className="font-medium">Resources:</span> {files.resources.length} files</div>
                      <div><span className="font-medium">Free Preview:</span> {formData.isPreview ? 'Yes' : 'No'}</div>
                      <div><span className="font-medium">Published:</span> {formData.isPublished ? 'Yes' : 'No'}</div>
                    </div>
                  </div>

                  {previews.video && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Video Preview</h4>
                      <video
                        src={previews.video}
                        className="w-full max-w-md mx-auto rounded-lg"
                        controls
                      />
                    </div>
                  )}

                  {previews.thumbnail && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Thumbnail Preview</h4>
                      <img
                        src={previews.thumbnail}
                        alt="Thumbnail preview"
                        className="w-full max-w-md mx-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <div>
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
          
          <div className="flex space-x-4">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <ClockIcon className="h-5 w-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Create Lecture</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureUpload;
