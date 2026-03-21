import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../../services/aiService';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import 'react-toastify/dist/ReactToastify.css';
import { Fragment } from 'react';
import { 
  SparklesIcon,
  UserIcon,
  BriefcaseIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  StarIcon,
  FireIcon,
  BeakerIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PrinterIcon,
  ShareIcon,
  LinkIcon,
  CameraIcon,
  PhotoIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  DocumentIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  TruckIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  XMarkIcon,
  ListBulletIcon,
  TableCellsIcon,
  ChartPieIcon,
  ChartBarIcon,
  CircleStackIcon,
  ArchiveBoxIcon,
  InboxIcon,
  PhoneIcon,
  MapPinIcon,
  CogIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  FlagIcon,
  LockClosedIcon,
  KeyIcon,
  GlobeAltIcon,
  ServerIcon,
  FolderIcon,
  FunnelIcon,
  ArrowRightIcon,
  XCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  SpeakerWaveIcon,
  MicrophoneIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const AIAssistant = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-pro');
  const [conversationMode, setConversationMode] = useState('chat');
  const [suggestions, setSuggestions] = useState([]);
  const [learningPath, setLearningPath] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [courseContext, setCourseContext] = useState(null);
  const [recentTopics, setRecentTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load real user profile
  useEffect(() => {
    if (user) {
      setUserProfile({
        id: user.id,
        name: user.name || 'User',
        email: user.email,
        role: user.role,
        level: 'intermediate',
        interests: ['React', 'JavaScript', 'Node.js'],
        learningStyle: 'visual',
        goals: ['Become a full-stack developer', 'Build production-ready applications'],
        preferredPace: 'medium',
        strengths: ['Problem-solving', 'Debugging'],
        weaknesses: ['CSS styling', 'Database design'],
        completedPrograms: [],
        currentProgram: null,
        progress: {
          totalLessons: 0,
          completedLessons: 0,
          averageScore: 0,
          timeSpent: 0,
          streak: 0
        }
      });
    }
  }, [user]);

  // Load real course context
  useEffect(() => {
    const loadCourseContext = async () => {
      try {
        const response = await apiService.get(API_ENDPOINTS.ENROLLMENTS.MY_COURSES);
        const courses = response.data || [];
        
        if (courses.length > 0) {
          const currentCourse = courses[0];
          setCourseContext({
            id: currentCourse.courseId,
            title: currentCourse.title,
            currentLesson: 1,
            lessonTitle: 'Current Lesson',
            topics: ['React', 'JavaScript', 'Node.js'],
            difficulty: 'intermediate',
            estimatedTime: 30,
            prerequisites: ['Basic JavaScript'],
            learningObjectives: [
              'Master React concepts',
              'Build interactive components',
              'Understand state management'
            ]
          });
        }
      } catch (error) {
        console.error('Failed to load course context:', error);
      }
    };

    loadCourseContext();
  }, [user]);

  // Generate dynamic suggestions based on course context
  useEffect(() => {
    if (courseContext) {
      const baseSuggestions = [
        `Explain ${courseContext.topics?.[0] || 'React concepts'}`,
        `Help me debug ${courseContext.topics?.[1] || 'React code'}`,
        `Quiz me on ${courseContext.title || 'course topics'}`,
        'Show me examples',
        'Create practice exercises'
      ];

      setSuggestions(baseSuggestions.map((text, index) => ({
        id: index + 1,
        type: 'action',
        title: text,
        description: `Get help with ${text}`,
        priority: index === 0 ? 'high' : 'medium',
        estimatedTime: '5-10 min'
      })));
    }
  }, [courseContext]);

  // Generate dynamic learning path
  const generateLearningPath = () => {
    if (!courseContext) return;
    
    setLearningPath({
      id: courseContext.id,
      title: `${courseContext.title} - Learning Path`,
      description: `Personalized learning path for ${courseContext.title}`,
      progress: 0,
      estimatedDuration: '4 weeks',
      modules: courseContext.topics?.map((topic, index) => ({
        id: index + 1,
        title: topic,
        description: `Master ${topic} concepts`,
        duration: '1 week',
        completed: false,
        lessons: [
          { id: 1, title: `Introduction to ${topic}`, completed: false },
          { id: 2, title: `${topic} Fundamentals`, completed: false },
          { id: 3, title: `Advanced ${topic}`, completed: false }
        ]
      })) || []
    });
  };

  // Initialize with empty messages
  useEffect(() => {
    setMessages([]);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setNewMessage(suggestion);
    handleSendMessage(suggestion);
  };

  const handleSendMessage = async (messageText = newMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      // Call real AI service with proper context
      const response = await aiService.askQuestion(
        messageText, 
        courseContext?.id, 
        null // lessonId - can be added later
      );

      console.log('🔍 AI Response:', response);
      console.log('🔍 Response type:', typeof response);
      console.log('🔍 Response data:', response?.data);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response?.data?.response || response?.data?.content || response?.response || response?.content || response || 'I apologize, but I couldn\'t process your request. Please try again.',
        timestamp: new Date().toISOString(),
        suggestions: response?.data?.suggestions || response?.suggestions || []
      };

      console.log('🔍 AI Message created:', aiMessage);

      // Check if this is a raw AI response (not wrapped)
      if (typeof response === 'string' && response.length > 0) {
        console.log('🔍 Raw AI response detected');
      }

      setMessages(prev => [...prev, aiMessage]);

      // Add to recent topics
      if (!recentTopics.includes(messageText)) {
        setRecentTopics(prev => [messageText, ...prev.slice(0, 4)]);
      }

    } catch (error) {
      console.error('AI Service Error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
        timestamp: new Date().toISOString(),
        error: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionRef.current.onend = () => {
        setIsSpeaking(false);
      };
    }
  }, []);

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) return;

    if (voiceEnabled) {
      recognitionRef.current.stop();
      setVoiceEnabled(false);
    } else {
      recognitionRef.current.start();
      setIsSpeaking(true);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">AI Training Assistant</h1>
              <p className="text-sm text-gray-600">Your professional development companion</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="claude-3">Claude 3</option>
              <option value="gemini-pro">Gemini Pro</option>
            </select>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <CogIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Interface */}
        <div className="flex-1 bg-white">
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg px-4 py-2`}>
                      {message.type === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <SparklesIcon className="h-4 w-4 text-blue-600" />
                          <span className="text-xs text-blue-600 font-medium">AI Assistant</span>
                        </div>
                      )}
                      
                      <p className="text-sm">{message.content}</p>
                      
                      {message.codeExample && (
                        <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 font-medium">{message.codeExample.language}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(message.codeExample.code)}
                              className="p-1 text-blue-600 hover:text-blue-800 text-xs"
                            >
                              <DocumentDuplicateIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <pre className="text-xs bg-gray-900 text-white p-2 rounded overflow-x-auto">
                            <code>{message.codeExample.code}</code>
                          </pre>
                        </div>
                      )}
                      
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => handleSendMessage('Explain ' + (courseContext?.topics?.[0] || 'React hooks'))}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                  >
                    Explain Concept
                  </button>
                  <button
                    onClick={() => handleSendMessage('Help me debug my code')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200"
                  >
                    Debug Code
                  </button>
                  <button
                    onClick={() => handleSendMessage('Quiz me on ' + (courseContext?.title || 'React'))}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200"
                  >
                    Take Quiz
                  </button>
                  <button
                    onClick={() => handleSendMessage('Training Path')}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200"
                  >
                    Training Path
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <SparklesIcon className="h-4 w-4" />
                  <span>AI powered by {selectedModel}</span>
                </div>

                {/* Message Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about your professional development..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isTyping}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                  
                  {voiceEnabled && (
                    <button
                      onClick={toggleVoiceRecognition}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <MicrophoneIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          {/* User Profile */}
          {userProfile && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <UserIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{userProfile.name}</h3>
                  <p className="text-sm text-gray-600">{userProfile.email}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{userProfile.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Learning Style:</span>
                  <span className="font-medium">{userProfile.learningStyle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">{userProfile.progress.completedLessons}/{userProfile.progress.totalLessons}</span>
                </div>
              </div>
            </div>
          )}

          {/* Course Context */}
          {courseContext && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Current Course</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{courseContext.title}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lesson:</span>
                    <span className="font-medium">{courseContext.currentLesson}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-medium">{courseContext.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Time:</span>
                    <span className="font-medium">{courseContext.estimatedTime} min</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Learning Objectives</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {courseContext.learningObjectives?.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                        <p className="text-sm text-gray-600">{suggestion.description}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        <span>{suggestion.estimatedTime}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Learning Path */}
          {learningPath && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Learning Path</h3>
                <button
                  onClick={() => setShowLearningPath(!showLearningPath)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {showLearningPath ? 'Hide' : 'Show'} Path
                </button>
              </div>
              
              {showLearningPath && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">{learningPath.title}</h4>
                    <span className="text-sm text-gray-600">{learningPath.estimatedDuration}</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Progress</span>
                      <span className="text-sm text-gray-600">{learningPath.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 text-white text-xs font-semibold py-1 rounded-full"
                        style={{ width: `${learningPath.progress}%` }}
                      >
                        {learningPath.progress}% Complete
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {learningPath.modules?.map((module, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{module.title}</h5>
                          <span className="text-sm text-gray-600">{module.duration}</span>
                        </div>
                        
                        <div className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircleIcon className={`h-4 w-4 ${module.completed ? 'text-green-600' : 'text-gray-400'}`} />
                            <span className="text-sm">{module.completed ? 'Completed' : 'Not Started'}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          {module.lessons?.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-center gap-2 text-sm">
                              <div className={`w-2 h-2 rounded-full ${lesson.completed ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                              <span className="text-xs">{lesson.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Conversation Mode</span>
                <select
                  value={conversationMode}
                  onChange={(e) => setConversationMode(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="chat">Chat</option>
                  <option value="voice">Voice</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">AI Model</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude-3">Claude 3</option>
                  <option value="gemini-pro">Gemini Pro</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
