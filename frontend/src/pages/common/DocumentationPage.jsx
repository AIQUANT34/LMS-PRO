import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  CogIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ServerIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DocumentationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('overview');

  const sections = [
    { id: 'overview', name: 'Overview', icon: GlobeAltIcon },
    { id: 'getting-started', name: 'Getting Started', icon: AcademicCapIcon },
    { id: 'student-guide', name: 'Student Guide', icon: BookOpenIcon },
    { id: 'instructor-guide', name: 'Instructor Guide', icon: CodeBracketIcon },
    { id: 'api', name: 'API Documentation', icon: CodeBracketIcon },
    { id: 'integration', name: 'Integration', icon: ShieldCheckIcon },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: ExclamationTriangleIcon }
  ];

  const documentationContent = {
    overview: {
      title: 'ProTrain Platform Overview',
      content: `
        ProTrain is a comprehensive Learning Management System designed to provide
        exceptional educational experiences for students and instructors worldwide.
        
        ## Key Features
        
        - **AI-Powered Learning**: Personalized recommendations and intelligent tutoring
        - **Progress Tracking**: Comprehensive monitoring of learning achievements
        - **Interactive Content**: Video lessons, quizzes, and assignments
        - **Certification**: Blockchain-verified completion certificates
        - **Mobile Responsive**: Learn anywhere, anytime on any device
        
        ## Platform Architecture
        
        ProTrain uses modern web technologies to deliver a seamless learning experience:
        - Frontend: React.js with Tailwind CSS
        - Backend: NestJS with MongoDB
        - AI Integration: Google Gemini and Hugging Face APIs
        - Authentication: JWT-based secure login system
      `
    },
    'getting-started': {
      title: 'Getting Started with ProTrain',
      content: `
        ## Quick Start Guide
        
        ### 1. Create Your Account
        
        Visit the registration page and create your free student account. You'll need:
        - Valid email address
        - Secure password
        - Basic profile information
        
        ### 2. Explore Courses
        
        Browse our comprehensive course catalog featuring:
        - Expert-led video content
        - Interactive quizzes and assignments
        - Real-time progress tracking
        - AI-powered learning assistance
        
        ### 3. Start Learning
        
        Enroll in courses that match your learning goals and begin your educational journey with ProTrain's advanced features.
      `
    },
    'student-guide': {
      title: 'Student User Guide',
      content: `
        ## Navigating Your Dashboard
        
        Your personalized dashboard provides:
        - **Learning Progress**: Track course completion and achievements
        - **AI Assistant**: Get help with course content and questions
        - **Course Library**: Access all enrolled materials
        - **Certificates**: View and download completion certificates
        
        ## Course Features
        
        - **Video Player**: Interactive lessons with bookmarks and notes
        - **Quiz System**: Test your knowledge with instant feedback
        - **Assignment Portal**: Submit and track assignment progress
        - **Progress Analytics**: Visual charts of your learning journey
        
        ## AI Integration
        
        ProTrain's AI assistant provides:
        - 24/7 homework help
        - Personalized learning recommendations
        - Progress summaries and insights
        - Intelligent tutoring support
      `
    },
    api: {
      title: 'API Documentation',
      content: `
        ## RESTful API Endpoints
        
        ### Authentication
        \`\`\`javascript
        POST /api/auth/login
        POST /api/auth/register
        POST /api/auth/refresh
        \`\`\`
        
        ### Courses
        \`\`\`javascript
        GET /api/courses/public
        GET /api/courses/:id
        POST /api/courses
        PUT /api/courses/:id
        DELETE /api/courses/:id
        \`\`\`
        
        ### Learning
        \`\`\`javascript
        GET /api/learning/progress/course/:id
        POST /api/learning/progress/complete/:lessonId
        GET /api/learning/lessons/:courseId
        \`\`\`
        
        ### AI Services
        \`\`\`javascript
        POST /api/ai/ask
        POST /api/ai/generate-quiz
        GET /api/ai/progress-summary/:studentId/:courseId
        \`\`\`
        
        ## Authentication
        
        All API requests require JWT authentication:
        \`\`\`javascript
        Authorization: Bearer <your-jwt-token>
        Content-Type: application/json
        \`\`\`
      `
    },
    integration: {
      title: 'Integration Guide',
      content: `
        ## Third-Party Integrations
        
        ### Learning Management Systems (LMS)
        
        ProTrain supports integration with:
        - **Moodle**: Course import and user synchronization
        - **Canvas**: Assignment and grade book syncing
        - **Blackboard**: Content migration tools
        - **Google Classroom**: Single Sign-On (SSO) integration
        
        ### Analytics Platforms
        
        Connect with:
        - **Google Analytics**: Track student engagement
        - **Mixpanel**: User behavior analysis
        - **Segment**: Learning journey analytics
        - **Hotjar**: User experience insights
        
        ### Communication Tools
        
        Integrate with:
        - **Slack**: Real-time notifications
        - **Microsoft Teams**: Collaborative learning spaces
        - **Zoom**: Live classroom integration
        - **Discord**: Student community channels
      `
    },
    troubleshooting: {
      title: 'Troubleshooting Guide',
      content: `
        ## Common Issues and Solutions
        
        ### Video Playback Issues
        
        **Problem**: Videos won't play or buffer continuously
        **Solution**: 
        - Check internet connection speed
        - Clear browser cache and cookies
        - Try different browser (Chrome, Firefox, Safari)
        - Disable browser extensions that might block content
        
        ### Login Problems
        
        **Problem**: Can't log in or password not working
        **Solution**:
        - Ensure correct email and password
        - Clear browser cache
        - Reset password using "Forgot Password" link
        - Check if Caps Lock is on
        
        ### Certificate Access
        
        **Problem**: Can't view or download certificates
        **Solution**:
        - Verify course completion (100% progress required)
        - Check browser pop-up blockers
        - Wait 24 hours for certificate generation
        - Contact support if issue persists
        
        ### Mobile App Issues
        
        **Problem**: ProTrain not working on mobile device
        **Solution**:
        - Use updated browser version
        - Check device compatibility
        - Try desktop site for full functionality
        - Report specific device and browser issues
      `
    }
  };

  const currentContent = documentationContent[selectedSection];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowRightIcon className="h-5 w-5 rotate-180 mr-2" />
                <span className="text-lg font-semibold">Back to Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search documentation..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sections.map(section => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h3>
              <div className="space-y-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <section.icon className="h-5 w-5 mr-2" />
                    {section.name}
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => toast.success('API key copied to clipboard!')}
                    className="flex items-center p-3 text-blue-600 hover:bg-blue-50 rounded-lg w-full"
                  >
                    <LinkIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">Get API Key</span>
                  </button>
                  <button
                    onClick={() => window.open('/api/docs', '_blank')}
                    className="flex items-center p-3 text-blue-600 hover:bg-blue-50 rounded-lg w-full"
                  >
                    <CodeBracketIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">Interactive API Docs</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">Download PDF</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Content Display */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentContent.title}</h2>
              </div>
              
              <div className="prose max-w-none">
                {currentContent.content.split('\n').map((line, index) => (
                  <p key={index} className="mb-4">
                    {line.startsWith('##') ? (
                      <strong className="text-lg text-gray-900">{line}</strong>
                    ) : line.startsWith('###') ? (
                      <strong className="text-md text-gray-800">{line}</strong>
                    ) : line.startsWith('**') ? (
                      <strong className="text-gray-700">{line}</strong>
                    ) : line.startsWith('-') ? (
                      <span className="text-gray-600 ml-4">{line}</span>
                    ) : line.startsWith('```') ? (
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{line.replace(/```/g, '')}</code>
                      </pre>
                    ) : (
                      <span>{line}</span>
                    )}
                  </p>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share Documentation
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Print
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
