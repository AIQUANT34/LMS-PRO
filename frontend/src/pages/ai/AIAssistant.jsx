import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  BellIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
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
  Cog6TootIcon,
  ArrowLeftIcon,
  ArrowRightIcon as ArrowRightIconOutline,
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
  TrendingUpIcon,
  TrendingDownIcon,
  XCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  BrainIcon,
  CpuChipIcon,
  ChartBarIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  SpeakerXMarkIcon,
  VolumeOffIcon,
  VolumeUpIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [conversationMode, setConversationMode] = useState('chat');
  const [suggestions, setSuggestions] = useState([]);
  const [learningPath, setLearningPath] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [courseContext, setCourseContext] = useState(null);
  const [recentTopics, setRecentTopics] = useState([]);
  const [knowledgeGraph, setKnowledgeGraph] = useState([]);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Mock user profile
  const mockUserProfile = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'student',
    level: 'intermediate',
    interests: ['React', 'JavaScript', 'Node.js'],
    learningStyle: 'visual',
    goals: ['Become a full-stack developer', 'Build production-ready applications'],
    preferredPace: 'medium',
    strengths: ['Problem-solving', 'Debugging'],
    weaknesses: ['CSS styling', 'Database design'],
    completedCourses: [1, 2, 3],
    currentCourse: 4,
    progress: {
      totalLessons: 45,
      completedLessons: 23,
      averageScore: 85,
      timeSpent: 120, // hours
      streak: 7 // days
    }
  };

  // Mock course context
  const mockCourseContext = {
    id: 4,
    title: 'Advanced React Patterns',
    currentLesson: 15,
    lessonTitle: 'Performance Optimization',
    topics: ['Memoization', 'useMemo', 'useCallback', 'React.memo'],
    difficulty: 'advanced',
    estimatedTime: 45,
    prerequisites: ['React hooks', 'Component lifecycle'],
    learningObjectives: [
      'Understand React performance optimization techniques',
      'Implement memoization strategies',
      'Use React DevTools for performance profiling'
    ]
  };

  // Mock AI suggestions
  const mockSuggestions = [
    {
      id: 1,
      type: 'concept',
      title: 'Understanding useMemo',
      description: 'Learn how to optimize expensive calculations with useMemo',
      priority: 'high',
      estimatedTime: '15 min'
    },
    {
      id: 2,
      type: 'practice',
      title: 'Practice: Optimize Component',
      description: 'Apply performance optimization to a real component',
      priority: 'medium',
      estimatedTime: '20 min'
    },
    {
      id: 3,
      type: 'resource',
      title: 'React Performance Guide',
      description: 'Comprehensive guide to React performance optimization',
      priority: 'low',
      estimatedTime: '30 min'
    }
  ];

  // Mock learning path
  const mockLearningPath = {
    id: 1,
    title: 'React Performance Mastery',
    description: 'Complete learning path for React performance optimization',
    progress: 35,
    estimatedDuration: '8 hours',
    modules: [
      {
        id: 1,
        title: 'Understanding React Rendering',
        description: 'Learn how React renders components',
        duration: '1 hour',
        completed: true,
        lessons: [
          { id: 1, title: 'Virtual DOM', completed: true },
          { id: 2, title: 'Reconciliation', completed: true },
          { id: 3, title: 'Component Lifecycle', completed: false }
        ]
      },
      {
        id: 2,
        title: 'Memoization Techniques',
        description: 'Master memoization in React',
        duration: '2 hours',
        completed: false,
        lessons: [
          { id: 4, title: 'useMemo Hook', completed: false },
          { id: 5, title: 'useCallback Hook', completed: false },
          { id: 6, title: 'React.memo', completed: false }
        ]
      },
      {
        id: 3,
        title: 'Performance Profiling',
        description: 'Learn to profile and optimize React applications',
        duration: '1.5 hours',
        completed: false,
        lessons: [
          { id: 7, title: 'React DevTools', completed: false },
          { id: 8, title: 'Performance Metrics', completed: false },
          { id: 9, title: 'Optimization Strategies', completed: false }
        ]
      }
    ]
  };

  // Mock messages
  const mockMessages = [
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI learning assistant. I can help you with React concepts, code problems, study strategies, and much more. What would you like to learn today?',
      timestamp: '2024-03-07T10:00:00Z',
      suggestions: [
        'Explain React hooks',
        'Help me debug my code',
        'Create a study plan',
        'Quiz me on React concepts'
      ]
    },
    {
      id: 2,
      type: 'user',
      content: 'Can you explain useMemo and when I should use it?',
      timestamp: '2024-03-07T10:01:00Z'
    },
    {
      id: 3,
      type: 'ai',
      content: 'Great question! `useMemo` is a React hook that memoizes expensive calculations. Here\'s when to use it:\n\n**When to use useMemo:**\n1. Expensive calculations that don\'t need to re-run on every render\n2. Referential equality checks (preventing unnecessary re-renders)\n3. Deriving data from props/state\n\n**Example:**\n```javascript\nconst expensiveValue = useMemo(() => {\n  return computeExpensiveValue(data);\n}, [data]);\n```\n\nThe calculation only re-runs when `data` changes. Would you like to see a practical example or try a coding exercise?',
      timestamp: '2024-03-07T10:01:30Z',
      codeExample: {
        language: 'javascript',
        code: `const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);`
      },
      suggestions: [
        'Show me a practical example',
        'Try a coding exercise',
        'Explain useCallback too',
        'What about React.memo?'
      ]
    }
  ];

  useEffect(() => {
    // Initialize data
    setTimeout(() => {
      setMessages(mockMessages);
      setUserProfile(mockUserProfile);
      setCourseContext(mockCourseContext);
      setSuggestions(mockSuggestions);
      setLearningPath(mockLearningPath);
      setRecentTopics(['React hooks', 'Performance optimization', 'State management']);
      setKnowledgeGraph([
        { node: 'React', connections: ['Hooks', 'Components', 'Performance'] },
        { node: 'Hooks', connections: ['useState', 'useEffect', 'useMemo'] },
        { node: 'Performance', connections: ['Memoization', 'Optimization'] }
      ]);
    }, 500);

    // Initialize speech recognition if available
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
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText = newMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      if (voiceEnabled) {
        speakText(aiResponse.content);
      }
    }, 1500);
  };

  const generateAIResponse = (userMessage) => {
    const responses = {
      'default': {
        content: 'I understand you\'re asking about ' + userMessage + '. Let me help you with that. Based on your current progress in React, I\'d recommend focusing on the fundamentals first.',
        suggestions: ['Tell me more', 'Show me examples', 'Create practice exercises', 'Explain differently']
      },
      'help': {
        content: 'I can help you with:\n\n📚 **Learning Concepts** - Explain any programming concept\n🐛 **Debugging** - Help you find and fix errors\n📝 **Code Review** - Review your code and suggest improvements\n📊 **Study Planning** - Create personalized learning paths\n🎯 **Practice** - Generate coding exercises and quizzes\n\nWhat would you like help with?',
        suggestions: ['Explain a concept', 'Debug my code', 'Review my code', 'Create study plan']
      },
      'quiz': {
        content: 'Great! Let\'s test your knowledge with a quick quiz:\n\n**Question:** What is the primary purpose of the useMemo hook?\n\nA) To memoize expensive calculations\nB) To manage state\nC) To handle side effects\nD) To create refs\n\nTake your time to think about it!',
        suggestions: ['Answer A', 'Answer B', 'Answer C', 'Answer D', 'Give me a hint']
      }
    };

    const lowerMessage = userMessage.toLowerCase();
    let response = responses.default;

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      response = responses.help;
    } else if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
      response = responses.quiz;
    }

    return {
      id: messages.length + 2,
      type: 'ai',
      ...response,
      timestamp: new Date().toISOString()
    };
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceRecognition = () => {
    if (recognitionRef.current) {
      if (voiceEnabled) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
      setVoiceEnabled(!voiceEnabled);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setNewMessage(suggestion);
    handleSendMessage(suggestion);
  };

  const generateLearningPath = () => {
    const path = {
      title: 'Personalized React Learning Path',
      description: 'Based on your current progress and goals',
      modules: [
        {
          title: 'React Fundamentals',
          duration: '2 hours',
          lessons: ['Components', 'Props', 'State'],
          completed: false
        },
        {
          title: 'Advanced Patterns',
          duration: '3 hours',
          lessons: ['Hooks', 'Context', 'Performance'],
          completed: false
        }
      ]
    };
    setLearningPath(path);
    setShowLearningPath(true);
  };

  const MessageBubble = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-2xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
        <div className={`px-4 py-3 rounded-lg ${
          message.type === 'user' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {message.codeExample && (
            <div className="mt-3 p-3 bg-gray-900 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">{message.codeExample.language}</span>
                <button className="text-xs text-gray-400 hover:text-white">
                  <DocumentDuplicateIcon className="h-3 w-3" />
                </button>
              </div>
              <pre className="text-sm text-gray-300">
                <code>{message.codeExample.code}</code>
              </pre>
            </div>
          )}
          
          {message.suggestions && (
            <div className="mt-3 space-y-2">
              {message.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`block w-full text-left px-3 py-2 rounded text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-700 hover:bg-blue-800 text-white'
                      : 'bg-white hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${
          message.type === 'user' ? 'text-right' : 'text-left'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );

  const QuickActions = () => (
    <div className="p-4 border-t border-gray-200">
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleSendMessage('Explain ' + (courseContext?.topics[0] || 'React hooks'))}
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
          onClick={generateLearningPath}
          className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200"
        >
          Learning Path
        </button>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <SparklesIcon className="h-4 w-4" />
        <span>AI powered by {selectedModel}</span>
      </div>
    </div>
  );

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
              <h1 className="text-lg font-semibold text-gray-900">AI Learning Assistant</h1>
              <p className="text-sm text-gray-600">Your personalized learning companion</p>
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
              <Cog6TootIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Course Context Bar */}
      {courseContext && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AcademicCapIcon className="h-5 w-5 text-blue-600" />
              <div>
                <span className="text-sm font-medium text-blue-900">{courseContext.title}</span>
                <span className="text-sm text-blue-700 ml-2">• {courseContext.lessonTitle}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <ClockIcon className="h-4 w-4" />
              <span>{courseContext.estimatedTime} min</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white">
            <div className="p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about your learning..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button
                  onClick={toggleVoiceRecognition}
                  className={`p-2 rounded-lg transition-colors ${
                    voiceEnabled 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <MicrophoneIcon className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => voiceEnabled ? stopSpeaking() : speakText(messages[messages.length - 1]?.content)}
                  className={`p-2 rounded-lg transition-colors ${
                    isSpeaking 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {isSpeaking ? (
                    <SpeakerXMarkIcon className="h-5 w-5" />
                  ) : (
                    <SpeakerWaveIcon className="h-5 w-5" />
                  )}
                </button>
                
                <button
                  onClick={() => handleSendMessage()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <QuickActions />
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* User Profile */}
          {userProfile && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={`https://via.placeholder.com/50x50`}
                  alt={userProfile.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{userProfile.name}</h3>
                  <p className="text-sm text-gray-600">{userProfile.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-gray-900">{userProfile.progress.completedLessons}</div>
                  <div className="text-gray-600">Lessons</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-gray-900">{userProfile.progress.averageScore}%</div>
                  <div className="text-gray-600">Score</div>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Recommended for You</h3>
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{suggestion.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                        suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {suggestion.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{suggestion.estimatedTime}</span>
                      <button className="text-xs text-blue-600 hover:text-blue-700">
                        Start →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Topics */}
          {recentTopics.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Topics</h3>
              <div className="flex flex-wrap gap-2">
                {recentTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(`Tell me about ${topic}`)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
