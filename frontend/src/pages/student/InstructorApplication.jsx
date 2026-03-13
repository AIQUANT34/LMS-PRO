import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon,
  UserCircleIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  StarIcon,
  ClockIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpTrayIcon ,
  XMarkIcon,
  CheckIcon,
  SparklesIcon,
  TrophyIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/apiService';
import uploadService from '../../services/uploadService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';

const WelcomeStep = ({ handleNext }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center max-w-3xl mx-auto"
  >
    <div className="mb-8">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <AcademicCapIcon className="h-12 w-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Become an Instructor
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Share your knowledge, inspire learners, and earn while doing what you love
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn Money</h3>
        <p className="text-gray-600 text-sm">Get paid for every student enrollment and build a sustainable income stream</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
          <UsersIcon className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Impact</h3>
        <p className="text-gray-600 text-sm">Reach thousands of students worldwide and make a real difference in their lives</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
          <ChartBarIcon className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Grow Your Brand</h3>
        <p className="text-gray-600 text-sm">Build your personal brand and establish yourself as an expert in your field</p>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Our Platform?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div className="flex items-start space-x-3">
          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Industry-leading revenue share</p>
            <p className="text-sm text-gray-600">Keep up to 70% of your course revenue</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Marketing support</p>
            <p className="text-sm text-gray-600">We help promote your courses to millions of learners</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Teaching tools</p>
            <p className="text-sm text-gray-600">Access to advanced course creation and analytics tools</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Community support</p>
            <p className="text-sm text-gray-600">Connect with other instructors and share best practices</p>
          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-center">
      <button
        onClick={handleNext}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
      >
        Start Application
        <ArrowRightIcon className="h-5 w-5 ml-2 inline" />
      </button>
    </div>
  </motion.div>
);

const PersonalInfoStep = ({ formData, handleInputChange, errors }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl mx-auto"
  >
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.firstName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.lastName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          disabled
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
        />
        <p className="mt-1 text-sm text-gray-500">This is your registered email</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+1 (555) 123-4567"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country <span className="text-red-500">*</span>
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.country ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a country</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
          <option value="IN">India</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
          <option value="JP">Japan</option>
          <option value="BR">Brazil</option>
          <option value="OTHER">Other</option>
        </select>
        {errors.country && (
          <p className="mt-1 text-sm text-red-500">{errors.country}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone <span className="text-red-500">*</span>
        </label>
        <select
          name="timezone"
          value={formData.timezone}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.timezone ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select timezone</option>
          <option value="EST">Eastern Time (EST)</option>
          <option value="CST">Central Time (CST)</option>
          <option value="MST">Mountain Time (MST)</option>
          <option value="PST">Pacific Time (PST)</option>
          <option value="GMT">Greenwich Mean Time (GMT)</option>
          <option value="CET">Central European Time (CET)</option>
          <option value="IST">India Standard Time (IST)</option>
          <option value="JST">Japan Standard Time (JST)</option>
          <option value="AEST">Australian Eastern Time (AEST)</option>
        </select>
        {errors.timezone && (
          <p className="mt-1 text-sm text-red-500">{errors.timezone}</p>
        )}
      </div>
    </div>
  </motion.div>
);

const ProfessionalStep = ({ formData, setFormData, handleInputChange, errors, handleArrayInput, removeArrayItem, expertiseAreas }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl mx-auto"
  >
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Information</h2>
    
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Areas of Expertise <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {expertiseAreas.map(area => (
            <button
              key={area}
              type="button"
              onClick={() => handleArrayInput('expertise', area)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                formData.expertise.includes(area)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
        {formData.expertise.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.expertise.map(item => (
              <span
                key={item}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeArrayItem('expertise', item)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.expertise && (
          <p className="mt-1 text-sm text-red-500">{errors.expertise}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Experience <span className="text-red-500">*</span>
        </label>
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          rows={4}
          placeholder="Describe your professional experience, achievements, and career highlights..."
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.experience ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.experience && (
          <p className="mt-1 text-sm text-red-500">{errors.experience}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Education <span className="text-red-500">*</span>
        </label>
        <div className="space-y-4">
          {formData.education.map((edu, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index] = { ...newEducation[index], degree: e.target.value };
                      setFormData(prev => ({ ...prev, education: newEducation }));
                    }}
                    placeholder="Degree (e.g., Bachelor's, Master's, PhD)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index] = { ...newEducation[index], institution: e.target.value };
                      setFormData(prev => ({ ...prev, education: newEducation }));
                    }}
                    placeholder="Institution (e.g., Harvard University)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    autoComplete="off"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={edu.year || ''}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index] = { ...newEducation[index], year: e.target.value };
                      setFormData(prev => ({ ...prev, education: newEducation }));
                    }}
                    placeholder="Year (e.g., 2020)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('education', index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Degree</span>
                <span>•</span>
                <span>Institution</span>
                <span>•</span>
                <span>Year</span>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleArrayInput('education', { degree: '', institution: '', year: '' })}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Education</span>
          </button>
        </div>
        {errors.education && (
          <p className="mt-1 text-sm text-red-500">{errors.education}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Add your educational background. Include your highest degree first.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Occupation <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="currentOccupation"
          value={formData.currentOccupation}
          onChange={handleInputChange}
          placeholder="e.g., Senior Software Engineer at Tech Company"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.currentOccupation ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.currentOccupation && (
          <p className="mt-1 text-sm text-red-500">{errors.currentOccupation}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            name="linkedinProfile"
            value={formData.linkedinProfile}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/yourprofile"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personal Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://yourwebsite.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  </motion.div>
);

const TeachingStep = ({ formData, setFormData, handleInputChange, errors, handleArrayInput, removeArrayItem, teachingStyles }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl mx-auto"
  >
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Teaching Information</h2>
    
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Teaching Experience <span className="text-red-500">*</span>
        </label>
        <textarea
          name="teachingExperience"
          value={formData.teachingExperience}
          onChange={handleInputChange}
          rows={4}
          placeholder="Describe your teaching experience, including any mentoring, training, or educational roles..."
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.teachingExperience ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.teachingExperience && (
          <p className="mt-1 text-sm text-red-500">{errors.teachingExperience}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Teaching Style <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {teachingStyles.map(style => (
            <label key={style.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="teachingStyle"
                value={style.value}
                checked={formData.teachingStyle === style.value}
                onChange={handleInputChange}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-gray-900">{style.label}</p>
                <p className="text-sm text-gray-600">{style.description}</p>
              </div>
            </label>
          ))}
        </div>
        {errors.teachingStyle && (
          <p className="mt-1 text-sm text-red-500">{errors.teachingStyle}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Audience <span className="text-red-500">*</span>
        </label>
        <textarea
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleInputChange}
          rows={3}
          placeholder="Who do you want to teach? (e.g., beginners, professionals, students, etc.)"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.targetAudience ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.targetAudience && (
          <p className="mt-1 text-sm text-red-500">{errors.targetAudience}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Ideas <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {formData.courseIdeas.map((idea, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={idea.title || ''}
                  onChange={(e) => {
                    const newIdeas = [...formData.courseIdeas];
                    newIdeas[index] = { ...newIdeas[index], title: e.target.value };
                    setFormData(prev => ({ ...prev, courseIdeas: newIdeas }));
                  }}
                  placeholder="Course title (e.g., Complete Web Development Bootcamp)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('courseIdeas', index)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={idea.description || ''}
                onChange={(e) => {
                  const newIdeas = [...formData.courseIdeas];
                  newIdeas[index] = { ...newIdeas[index], description: e.target.value };
                  setFormData(prev => ({ ...prev, courseIdeas: newIdeas }));
                }}
                placeholder="Brief description of what students will learn..."
                rows={2}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                autoComplete="off"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleArrayInput('courseIdeas', { title: '', description: '' })}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Course Idea</span>
          </button>
        </div>
        {errors.courseIdeas && (
          <p className="mt-1 text-sm text-red-500">{errors.courseIdeas}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Share your potential course ideas. Include a compelling title and description.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Motivation <span className="text-red-500">*</span>
        </label>
        <textarea
          name="motivation"
          value={formData.motivation}
          onChange={handleInputChange}
          rows={4}
          placeholder="Why do you want to become an instructor? What motivates you to teach?"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.motivation ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.motivation && (
          <p className="mt-1 text-sm text-red-500">{errors.motivation}</p>
        )}
      </div>
    </div>
  </motion.div>
);

const DocumentsStep = ({ formData, handleInputChange, errors, handleFileUpload, previewUrl }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl mx-auto"
  >
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Teaching Demo</h2>
    
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Teaching Demo Video <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            id="teachingDemo"
            accept="video/*"
            onChange={(e) => handleFileUpload(e, 'teachingDemo')}
            className="hidden"
          />
          <label htmlFor="teachingDemo" className="cursor-pointer">
            <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">
              {formData.teachingDemo ? formData.teachingDemo.name : 'Click to upload teaching demo'}
            </p>
            <p className="text-sm text-gray-500">MP4, MOV, or AVI (max 10MB, 2-5 minutes)</p>
          </label>
        </div>
        {previewUrl && (
          <div className="mt-4">
            <video
              src={previewUrl}
              controls
              className="w-full max-w-md rounded-lg"
            />
          </div>
        )}
        {errors.teachingDemo && (
          <p className="mt-1 text-sm text-red-500">{errors.teachingDemo}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Tips for Your Teaching Demo</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keep it between 2-5 minutes</li>
          <li>• Choose a topic you're passionate about</li>
          <li>• Show your personality and teaching style</li>
          <li>• Include practical examples or demonstrations</li>
          <li>• Ensure good lighting and clear audio</li>
        </ul>
      </div>
    </div>
  </motion.div>
);

const ReviewStep = ({ formData, handleInputChange, errors, teachingStyles }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl mx-auto"
  >
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Application</h2>
    
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</div>
          <div><span className="font-medium">Email:</span> {formData.email}</div>
          <div><span className="font-medium">Phone:</span> {formData.phone}</div>
          <div><span className="font-medium">Country:</span> {formData.country}</div>
          <div><span className="font-medium">Timezone:</span> {formData.timezone}</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
        <div className="space-y-3 text-sm">
          <div><span className="font-medium">Expertise:</span> {formData.expertise.join(', ')}</div>
          <div><span className="font-medium">Current Occupation:</span> {formData.currentOccupation}</div>
          <div><span className="font-medium">Experience:</span> {formData.experience}</div>
          <div>
            <span className="font-medium">Education:</span>
            <div className="mt-2 space-y-1">
              {formData.education.map((edu, index) => (
                <div key={index} className="text-gray-600">
                  {edu.degree && edu.institution && edu.year 
                    ? `${edu.degree} from ${edu.institution} (${edu.year})`
                    : edu.degree || edu.institution || edu.year
                    ? `${edu.degree || ''} ${edu.institution || ''} ${edu.year || ''}`.trim()
                    : 'Not specified'
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Information</h3>
        <div className="space-y-3 text-sm">
          <div><span className="font-medium">Teaching Style:</span> {teachingStyles.find(s => s.value === formData.teachingStyle)?.label}</div>
          <div><span className="font-medium">Target Audience:</span> {formData.targetAudience}</div>
          <div>
            <span className="font-medium">Course Ideas:</span>
            <div className="mt-2 space-y-2">
              {formData.courseIdeas.map((idea, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded border border-gray-200">
                  <div className="font-medium text-gray-800">{idea.title || 'Untitled Course'}</div>
                  {idea.description && (
                    <div className="text-gray-600 text-xs mt-1">{idea.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div><span className="font-medium">Motivation:</span> {formData.motivation}</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Teaching Demo:</span> {formData.teachingDemo ? formData.teachingDemo.name : 'Not uploaded'}</div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
        <div className="space-y-3">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              I accept the instructor terms and conditions and understand the platform policies
            </span>
          </label>
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="dataConsent"
              checked={formData.dataConsent}
              onChange={handleInputChange}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              I consent to the processing of my personal data for instructor application purposes
            </span>
          </label>
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleInputChange}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              I would like to receive marketing communications about instructor opportunities
            </span>
          </label>
        </div>
        {Object.keys(errors).filter(key => key.includes('Consent') || key === 'termsAccepted').map(key => (
          <p key={key} className="mt-1 text-sm text-red-500">{errors[key]}</p>
        ))}
      </div>
    </div>
  </motion.div>
);

const StatusStep = ({ navigate, applicationStatus, existingApplication }) => {
  const getStatusIcon = () => {
    switch (applicationStatus) {
      case 'approved':
        return <CheckCircleIcon className="h-12 w-12 text-green-600" />;
      case 'rejected':
        return <XMarkIcon className="h-12 w-12 text-red-600" />;
      default:
        return <ClockIcon className="h-12 w-12 text-yellow-600" />;
    }
  };

  const getStatusTitle = () => {
    switch (applicationStatus) {
      case 'approved':
        return 'Application Approved!';
      case 'rejected':
        return 'Application Not Approved';
      default:
        return 'Application Under Review';
    }
  };

  const getStatusMessage = () => {
    switch (applicationStatus) {
      case 'approved':
        return 'Congratulations! Your instructor application has been approved. You can now start creating courses.';
      case 'rejected':
        return 'We appreciate your interest. Unfortunately, your application was not approved at this time.';
      default:
        return 'Your instructor application is being reviewed by our team';
    }
  };

  const getStatusColor = () => {
    switch (applicationStatus) {
      case 'approved':
        return 'bg-green-100';
      case 'rejected':
        return 'bg-red-100';
      default:
        return 'bg-yellow-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <div className={`w-24 h-24 ${getStatusColor()} rounded-full flex items-center justify-center mx-auto mb-6`}>
          {getStatusIcon()}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {getStatusTitle()}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {getStatusMessage()}
        </p>
      </div>

      {applicationStatus === 'pending' && (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">Application submitted</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-yellow-600 rounded-full animate-pulse" />
                <span className="text-sm text-gray-700">Initial review (1-2 business days)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                <span className="text-sm text-gray-700">Detailed evaluation (3-5 business days)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                <span className="text-sm text-gray-700">Final decision (5-7 business days)</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
            <div className="text-left space-y-3 text-sm text-gray-700">
              <p>• Our team will carefully review your application and qualifications</p>
              <p>• We may contact you for additional information or a video interview</p>
              <p>• You'll receive an email with our decision within 5-7 business days</p>
              <p>• If approved, you'll get access to instructor tools and resources</p>
            </div>
          </div>
        </>
      )}

      {applicationStatus === 'approved' && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Welcome Aboard!</h3>
            <div className="text-left space-y-3 text-sm text-gray-700">
              <p>• You now have access to instructor dashboard and course creation tools</p>
              <p>• Start creating your first course and share your expertise with learners</p>
              <p>• Join our instructor community and get support from fellow educators</p>
              <p>• Access comprehensive resources to help you succeed as an instructor</p>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/instructor/dashboard')}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              Go to Instructor Dashboard
              <ArrowRightIcon className="h-5 w-5 ml-2 inline" />
            </button>
            <button
              onClick={() => navigate('/trainer/create-course')}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              Create Your First Course
            </button>
          </div>
        </>
      )}

      {applicationStatus === 'rejected' && (
        <>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Feedback</h3>
            {existingApplication?.rejectionReason && (
              <div className="mb-4 p-4 bg-white rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Reason:</p>
                <p className="text-sm text-gray-700">{existingApplication.rejectionReason}</p>
              </div>
            )}
            <div className="text-left space-y-3 text-sm text-gray-700">
              <p>• We encourage you to review our instructor requirements</p>
              <p>• Consider gaining more experience in your area of expertise</p>
              <p>• You may reapply after 6 months with updated qualifications</p>
              <p>• Feel free to contact our support team for more guidance</p>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/courses')}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all"
            >
              Browse Courses
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              Check Status Later
            </button>
          </div>
        </>
      )}

      <div className="flex justify-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
};

const StepIndicator = ({ currentStep, steps }) => (
  <div className="flex items-center justify-center mb-8">
    {steps.map((step, index) => (
      <div key={step.id} className="flex items-center">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
          ${currentStep > step.id ? 'bg-green-600 text-white' : 
            currentStep === step.id ? 'bg-blue-600 text-white' : 
            'bg-gray-200 text-gray-500'}
        `}>
          {currentStep > step.id ? (
            <CheckIcon className="h-5 w-5" />
          ) : (
            step.id
          )}
        </div>
        {index < steps.length - 1 && (
          <div className={`
            w-16 h-1 mx-2
            ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'}
          `} />
        )}
      </div>
    ))}
  </div>
);

const InstructorApplication = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    country: '',
    timezone: '',
    
    // Professional Information
    expertise: [],
    experience: '',
    education: [],
    currentOccupation: '',
    linkedinProfile: '',
    website: '',
    
    // Teaching Information
    teachingExperience: '',
    teachingStyle: '',
    targetAudience: '',
    courseIdeas: [],
    
    // Documents
    teachingDemo: null,
    
    // Preferences
    availability: '',
    preferredSchedule: '',
    motivation: '',
    
    // Agreement
    termsAccepted: false,
    dataConsent: false,
    marketingConsent: false
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [existingApplication, setExistingApplication] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewUrl, setPreviewUrl] = useState('');

  // Steps configuration
  const steps = [
    { id: 1, name: 'Welcome', icon: SparklesIcon, description: 'Start your journey' },
    { id: 2, name: 'Personal Info', icon: UserCircleIcon, description: 'Tell us about yourself' },
    { id: 3, name: 'Professional', icon: BriefcaseIcon, description: 'Your expertise' },
    { id: 4, name: 'Teaching', icon: AcademicCapIcon, description: 'Teaching approach' },
    { id: 5, name: 'Teaching Demo', icon: VideoCameraIcon, description: 'Upload demo video' },
    { id: 6, name: 'Review', icon: CheckCircleIcon, description: 'Review & submit' }
  ];

  // Expertise areas
  const expertiseAreas = [
    'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
    'Artificial Intelligence', 'Cloud Computing', 'DevOps', 'Cybersecurity',
    'UI/UX Design', 'Graphic Design', 'Digital Marketing', 'Business',
    'Finance', 'Photography', 'Video Production', 'Music Production',
    'Languages', 'Health & Fitness', 'Personal Development', 'Other'
  ];

  // Experience levels
  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-2 years)', description: 'Just starting in your field' },
    { value: 'intermediate', label: 'Intermediate (2-5 years)', description: 'Solid foundation and growing expertise' },
    { value: 'advanced', label: 'Advanced (5-10 years)', description: 'Deep expertise and experience' },
    { value: 'expert', label: 'Expert (10+ years)', description: 'Recognized authority in your field' }
  ];

  // Teaching styles
  const teachingStyles = [
    { value: 'interactive', label: 'Interactive & Hands-on', description: 'Lots of practical exercises and engagement' },
    { value: 'theoretical', label: 'Theoretical & Conceptual', description: 'Focus on principles and concepts' },
    { value: 'project-based', label: 'Project-Based', description: 'Learn through real projects' },
    { value: 'discussion', label: 'Discussion & Debate', description: 'Collaborative learning environment' },
    { value: 'demonstration', label: 'Demonstration & Walkthrough', description: 'Show and tell approach' }
  ];

  useEffect(() => {
    checkExistingApplication();
  }, []);

  const checkExistingApplication = async () => {
    try {
      const response = await apiService.get(`/users/instructor-application/${user.id}`);
      if (response && response._id) {
        setExistingApplication(response);
        setApplicationStatus(response.status);
        setCurrentStep(7); // Show status page regardless of status
      }
    } catch (error) {
      // No existing application found - user can apply
      console.log('No existing application found, user can apply');
      setApplicationStatus(null);
      setExistingApplication(null);
    }
  };

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

  const handleArrayInput = (field, value) => {
    if (field === 'education') {
      // Handle education as objects
      if (value && (typeof value === 'object')) {
        setFormData(prev => ({
          ...prev,
          [field]: [...prev[field], value]
        }));
      }
    } else if (field === 'courseIdeas') {
      // Handle course ideas as objects
      if (value && (typeof value === 'object')) {
        setFormData(prev => ({
          ...prev,
          [field]: [...prev[field], value]
        }));
      }
    } else {
      // Handle other arrays as strings
      if (value && !formData[field].includes(value)) {
        setFormData(prev => ({
          ...prev,
          [field]: [...prev[field], value]
        }));
      }
    }
  };

  const removeArrayItem = (field, itemOrIndex) => {
    if (field === 'education' || field === 'courseIdeas') {
      // Handle education and course ideas by index
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== itemOrIndex)
      }));
    } else {
      // Handle other arrays by value
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter(i => i !== itemOrIndex)
      }));
    }
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = fieldName === 'teachingDemo' 
        ? ['video/mp4', 'video/quicktime', 'video/x-msvideo']
        : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type. ${fieldName === 'teachingDemo' ? 'Please upload a video file.' : 'Please upload a PDF or Word document.'}`);
        return;
      }
      
      setFormData(prev => ({ ...prev, [fieldName]: file }));
      
      // Create preview for video
      if (fieldName === 'teachingDemo') {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.country) newErrors.country = 'Country is required';
      if (!formData.timezone) newErrors.timezone = 'Timezone is required';
    }
    
    if (step === 3) {
      if (formData.expertise.length === 0) newErrors.expertise = 'Please select at least one area of expertise';
      if (!formData.experience.trim()) newErrors.experience = 'Professional experience is required';
      if (formData.education.length === 0) newErrors.education = 'Please add at least one education entry';
      if (!formData.currentOccupation.trim()) newErrors.currentOccupation = 'Current occupation is required';
    }
    
    if (step === 4) {
      if (!formData.teachingExperience.trim()) newErrors.teachingExperience = 'Teaching experience is required';
      if (!formData.teachingStyle) newErrors.teachingStyle = 'Please select a teaching style';
      if (!formData.targetAudience.trim()) newErrors.targetAudience = 'Target audience is required';
      if (formData.courseIdeas.length === 0) newErrors.courseIdeas = 'Please add at least one course idea';
      if (!formData.motivation.trim()) newErrors.motivation = 'Motivation is required';
    }
    
    if (step === 5) {
      if (!formData.teachingDemo) newErrors.teachingDemo = 'Teaching demo is required';
    }
    
    if (step === 6) {
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
      if (!formData.dataConsent) newErrors.dataConsent = 'You must consent to data processing';
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

  const handleSubmit = async () => {
    if (!validateStep(6)) return;
    
    setLoading(true);
    
    // Check authentication status
    const token = localStorage.getItem('token');
    console.log('Current token:', token);
    console.log('User ID:', user?.id);
    
    try {
      // For now, use existing upload system as fallback
      let teachingDemoUrl = '';
      if (formData.teachingDemo) {
        try {
          // Use existing upload service
          const uploadFormData = new FormData();
          uploadFormData.append('file', formData.teachingDemo);
          
          console.log('File being uploaded:', formData.teachingDemo);
          console.log('File size:', formData.teachingDemo.size);
          console.log('File type:', formData.teachingDemo.type);
          console.log('FormData entries:', Array.from(uploadFormData.entries()));
          
          const uploadResponse = await apiService.post(API_ENDPOINTS.UPLOAD.FILE, uploadFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          console.log('Upload response:', uploadResponse);
          console.log('Upload response status:', uploadResponse.status);
          console.log('Upload response headers:', uploadResponse.headers);
          console.log('Upload response full object:', JSON.stringify(uploadResponse, null, 2));
          
          if (uploadResponse && uploadResponse.url) {
            teachingDemoUrl = uploadResponse.url;
          } else {
            console.error('Response structure:', {
              data: uploadResponse,
              status: uploadResponse.status,
              headers: uploadResponse.headers
            });
            throw new Error('Invalid upload response structure');
          }
        } catch (error) {
          console.error('Video upload error:', error);
          console.error('Full error response:', error.response);
          console.error('Error status:', error.response?.status);
          console.error('Error data:', error.response?.data);
          
          if (error.response?.status === 401) {
            toast.error('Please login to upload files');
          } else if (error.response?.status === 500) {
            toast.error('Server error during upload. Please try again.');
          } else {
            toast.error('Failed to upload teaching demo video');
          }
          setLoading(false);
          return;
        }
      }
      
      // Prepare application data
      const applicationData = {
        ...formData,
        teachingDemoUrl,
      };
      
      // Remove file objects from data
      delete applicationData.teachingDemo;
      
      const response = await apiService.post(API_ENDPOINTS.USERS.APPLY_INSTRUCTOR, applicationData);
      
      toast.success('Application submitted successfully! We\'ll review it within 5-7 business days.');
      setApplicationStatus('pending');
      setCurrentStep(7); // Show status page
      
    } catch (error) {
      console.error('Application submission error:', error);
      
      // Handle specific error cases
      if (error.response?.data?.message?.includes('already have a pending or approved application')) {
        toast.error('You already have an application under review. Please check your application status.');
        // Refresh to show existing application status
        await checkExistingApplication();
        setCurrentStep(7);
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit application');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <WelcomeStep handleNext={handleNext} />;
      case 2: return <PersonalInfoStep formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      case 3: return <ProfessionalStep formData={formData} setFormData={setFormData} handleInputChange={handleInputChange} errors={errors} handleArrayInput={handleArrayInput} removeArrayItem={removeArrayItem} expertiseAreas={expertiseAreas} />;
      case 4: return <TeachingStep formData={formData} setFormData={setFormData} handleInputChange={handleInputChange} errors={errors} handleArrayInput={handleArrayInput} removeArrayItem={removeArrayItem} teachingStyles={teachingStyles} />;
      case 5: return <DocumentsStep formData={formData} handleInputChange={handleInputChange} errors={errors} handleFileUpload={handleFileUpload} previewUrl={previewUrl} />;
      case 6: return <ReviewStep formData={formData} handleInputChange={handleInputChange} errors={errors} teachingStyles={teachingStyles} />;
      case 7: return <StatusStep navigate={navigate} applicationStatus={applicationStatus} existingApplication={existingApplication} />;
      default: return null;
    }
  };

  if (applicationStatus && currentStep !== 7) {
    return <StatusStep navigate={navigate} applicationStatus={applicationStatus} existingApplication={existingApplication} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/student/dashboard')}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Instructor Application</h1>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Secure Application</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep <= 6 && <StepIndicator currentStep={currentStep} steps={steps} />}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {currentStep <= 6 && (
          <div className="flex justify-between mt-8">
            <button
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

            <div className="flex space-x-4">
              {currentStep < 6 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Next
                  <ArrowRightIcon className="h-4 w-4 ml-2 inline" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                  <CheckCircleIcon className="h-4 w-4 ml-2 inline" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorApplication;
