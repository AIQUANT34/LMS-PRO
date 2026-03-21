import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';

const CreateLesson = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: {
      videoUrl: '',
      textContent: '',
      resources: []
    },
    duration: 0,
    sequence: 1,
    moduleId: 'default',
    moduleTitle: 'Module 1',
    isFree: true
  });
  
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
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
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addResource = () => {
    const newResource = {
      id: Date.now().toString(),
      title: '',
      type: 'document',
      url: ''
    };
    
    setResources(prev => [...prev, newResource]);
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        resources: [...prev.content.resources, newResource]
      }
    }));
  };

  const updateResource = (id, field, value) => {
    const updatedResources = resources.map(resource =>
      resource.id === id ? { ...resource, [field]: value } : resource
    );
    
    setResources(updatedResources);
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        resources: updatedResources
      }
    }));
  };

  const removeResource = (id) => {
    const updatedResources = resources.filter(resource => resource.id !== id);
    
    setResources(updatedResources);
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        resources: updatedResources
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Lesson title is required');
      return;
    }
    
    if (!formData.content.videoUrl.trim()) {
      toast.error('Video URL is required');
      return;
    }

    setLoading(true);
    
    try {
      const lessonData = {
        ...formData,
        courseId,
        duration: parseInt(formData.duration) || 0,
        sequence: parseInt(formData.sequence) || 1
      };

      console.log('🎯 Creating lesson:', lessonData);
      
      const response = await apiService.post(API_ENDPOINTS.LEARNING.LESSONS.CREATE(courseId), lessonData);
      
      if (response.success) {
        toast.success('Lesson created successfully!');
        navigate(`/trainer/courses/${courseId}/view`);
      } else {
        toast.error(response.message || 'Failed to create lesson');
      }
    } catch (error) {
      console.error('🎯 Lesson creation error:', error);
      toast.error('Failed to create lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/trainer/courses/${courseId}/view`)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Course</span>
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Lesson</h1>
                <p className="text-gray-600">Add a new lesson to your course</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter lesson title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what students will learn in this lesson"
              />
            </div>

            {/* Video Content */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <VideoCameraIcon className="h-5 w-5 mr-2 text-blue-600" />
                Video Content
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL *
                  </label>
                  <input
                    type="url"
                    name="content.videoUrl"
                    value={formData.content.videoUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    YouTube videos are automatically embedded
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Content
                  </label>
                  <textarea
                    name="content.textContent"
                    value={formData.content.textContent}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional text content, transcripts, or notes for this lesson"
                  />
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Resources
                </h3>
                <button
                  type="button"
                  onClick={addResource}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Resource
                </button>
              </div>

              <div className="space-y-3">
                {resources.map((resource, index) => (
                  <div key={resource.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Resource title"
                      value={resource.title}
                      onChange={(e) => updateResource(resource.id, 'title', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="url"
                      placeholder="Resource URL"
                      value={resource.url}
                      onChange={(e) => updateResource(resource.id, 'url', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeResource(resource.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {resources.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No resources added yet</p>
                    <p className="text-sm">Add PDFs, links, or other materials for your students</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/trainer/courses/${courseId}/view`)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Create Lesson</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateLesson;
