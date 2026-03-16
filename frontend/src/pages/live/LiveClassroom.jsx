import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
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
  VideoCameraIcon,
  ShareIcon,
  HandRaisedIcon,
  EllipsisHorizontalIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  StarIcon,
  FireIcon,
  SparklesIcon,
  BeakerIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PrinterIcon,
  LinkIcon,
  CameraIcon,
  PhotoIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  DocumentIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  ListBulletIcon,
  TableCellsIcon,
  ChartPieIcon,
  ChartBarIcon,
  CircleStackIcon,
  ArchiveBoxIcon,
  InboxIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  CogIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
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
  TrophyIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const LiveClassroom = () => {
  const [session, setSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [raisedHands, setRaisedHands] = useState(new Set());
  const [polls, setPolls] = useState([]);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [whiteboardData, setWhiteboardData] = useState([]);
  const [recordingStatus, setRecordingStatus] = useState('stopped'); // stopped, recording, paused
  const [breakoutRooms, setBreakoutRooms] = useState([]);
  const [showBreakoutModal, setShowBreakoutModal] = useState(false);

  // Mock session data
  const mockSession = {
    id: 1,
    title: 'Advanced React Patterns - Live Session',
    courseId: 1,
    trainerId: 1,
    trainer: {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14" font-family="Arial"%3EInstructor%3C/text%3E%3C/svg%3E'
    },
    scheduledTime: '2024-03-07T18:00:00Z',
    duration: 90, // minutes
    maxParticipants: 50,
    currentParticipants: 23,
    status: 'live', // scheduled, live, ended
    description: 'Live coding session on advanced React patterns including hooks, context, and performance optimization',
    recordingEnabled: true,
    chatEnabled: true,
    screenShareEnabled: true,
    whiteboardEnabled: true,
    breakoutRoomsEnabled: true,
    pollingEnabled: true,
    handRaiseEnabled: true,
    waitingRoomEnabled: false,
    password: null,
    joinUrl: 'https://lms-pro.live/session/123456',
    settings: {
      allowRecording: true,
      allowChat: true,
      allowScreenShare: true,
      allowWhiteboard: true,
      allowBreakoutRooms: true,
      allowPolling: true,
      allowHandRaise: true,
      muteOnEntry: false,
      videoOnEntry: true,
      waitingRoom: false,
      requirePassword: false
    }
  };

  // Mock participants data
  const mockParticipants = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'trainer',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14" font-family="Arial"%3EInstructor%3C/text%3E%3C/svg%3E',
      joinedAt: '2024-03-07T18:00:00Z',
      isMuted: false,
      isVideoOn: true,
      isScreenSharing: false,
      hasHandRaised: false,
      connectionQuality: 'excellent',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      role: 'student',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14" font-family="Arial"%3EInstructor%3C/text%3E%3C/svg%3E',
      joinedAt: '2024-03-07T18:02:00Z',
      isMuted: true,
      isVideoOn: false,
      isScreenSharing: false,
      hasHandRaised: false,
      connectionQuality: 'good',
      ipAddress: '192.168.1.101',
      device: 'Safari on Mac'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@example.com',
      role: 'student',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14" font-family="Arial"%3EInstructor%3C/text%3E%3C/svg%3E',
      joinedAt: '2024-03-07T18:05:00Z',
      isMuted: true,
      isVideoOn: true,
      isScreenSharing: false,
      hasHandRaised: true,
      connectionQuality: 'fair',
      ipAddress: '192.168.1.102',
      device: 'Chrome on Linux'
    }
  ];

  // Mock messages data
  const mockMessages = [
    {
      id: 1,
      senderId: 1,
      senderName: 'John Smith',
      senderRole: 'trainer',
      message: 'Welcome everyone! Today we\'ll be covering advanced React patterns.',
      timestamp: '2024-03-07T18:00:30Z',
      type: 'text',
      attachments: []
    },
    {
      id: 2,
      senderId: 2,
      senderName: 'Sarah Johnson',
      senderRole: 'student',
      message: 'Great! Looking forward to learning about hooks optimization.',
      timestamp: '2024-03-07T18:01:15Z',
      type: 'text',
      attachments: []
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'John Smith',
      senderRole: 'trainer',
      message: 'Let\'s start with a quick poll to gauge everyone\'s experience level.',
      timestamp: '2024-03-07T18:02:00Z',
      type: 'poll',
      pollData: {
        question: 'How comfortable are you with React hooks?',
        options: ['Very comfortable', 'Somewhat comfortable', 'Just starting', 'Never used'],
        votes: [5, 12, 4, 2],
        totalVotes: 23,
        isActive: false
      }
    }
  ];

  // Mock polls data
  const mockPolls = [
    {
      id: 1,
      question: 'How comfortable are you with React hooks?',
      options: ['Very comfortable', 'Somewhat comfortable', 'Just starting', 'Never used'],
      votes: [5, 12, 4, 2],
      totalVotes: 23,
      isActive: false,
      createdAt: '2024-03-07T18:02:00Z',
      createdBy: 1
    },
    {
      id: 2,
      question: 'Which topic would you like to cover next?',
      options: ['Context API', 'Performance Optimization', 'Custom Hooks', 'Error Boundaries'],
      votes: [8, 7, 5, 3],
      totalVotes: 23,
      isActive: true,
      createdAt: '2024-03-07T18:15:00Z',
      createdBy: 1
    }
  ];

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setSession(mockSession);
      setParticipants(mockParticipants);
      setMessages(mockMessages);
      setPolls(mockPolls);
      setIsLive(true);
    }, 500);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        senderId: 2, // Current user
        senderName: 'Current User',
        senderRole: 'student',
        message: newMessage,
        timestamp: new Date().toISOString(),
        type: 'text',
        attachments: []
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const handleRaiseHand = () => {
    const newRaisedHands = new Set(raisedHands);
    if (newRaisedHands.has(2)) { // Current user ID
      newRaisedHands.delete(2);
    } else {
      newRaisedHands.add(2);
    }
    setRaisedHands(newRaisedHands);
  };

  const handleStartRecording = () => {
    setRecordingStatus('recording');
  };

  const handlePauseRecording = () => {
    setRecordingStatus('paused');
  };

  const handleStopRecording = () => {
    setRecordingStatus('stopped');
  };

  const handleCreatePoll = (pollData) => {
    const newPoll = {
      id: polls.length + 1,
      ...pollData,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: 1
    };
    setPolls([...polls, newPoll]);
    setShowPollModal(false);
  };

  const handleVotePoll = (pollId, optionIndex) => {
    const updatedPolls = polls.map(poll => {
      if (poll.id === pollId) {
        const newVotes = [...poll.votes];
        newVotes[optionIndex] += 1;
        return { ...poll, votes: newVotes, totalVotes: poll.totalVotes + 1 };
      }
      return poll;
    });
    setPolls(updatedPolls);
  };

  const handleCreateBreakoutRoom = (roomData) => {
    const newRoom = {
      id: breakoutRooms.length + 1,
      ...roomData,
      participants: [],
      createdAt: new Date().toISOString()
    };
    setBreakoutRooms([...breakoutRooms, newRoom]);
    setShowBreakoutModal(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'trainer': return 'text-purple-600';
      case 'teaching_assistant': return 'text-blue-600';
      case 'student': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRoleBg = (role) => {
    switch (role) {
      case 'trainer': return 'bg-purple-100';
      case 'teaching_assistant': return 'bg-blue-100';
      case 'student': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'fair': return 'text-orange-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const VideoControls = () => (
    <div className="flex items-center justify-center gap-3 p-4 bg-gray-900 rounded-lg">
      <button
        onClick={handleToggleMute}
        className={`p-3 rounded-lg transition-colors ${
          isMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        <MicrophoneIcon className="h-5 w-5" />
      </button>
      
      <button
        onClick={handleToggleVideo}
        className={`p-3 rounded-lg transition-colors ${
          !isVideoOn ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        <VideoCameraIcon className="h-5 w-5" />
      </button>
      
      <button
        onClick={handleToggleScreenShare}
        className={`p-3 rounded-lg transition-colors ${
          isScreenSharing ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        <ShareIcon className="h-5 w-5" />
      </button>
      
      <button
        onClick={handleRaiseHand}
        className={`p-3 rounded-lg transition-colors ${
          raisedHands.has(2) ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        <HandRaisedIcon className="h-5 w-5" />
      </button>
      
      <div className="h-8 w-px bg-gray-600" />
      
      <button
        onClick={recordingStatus === 'stopped' ? handleStartRecording : 
                 recordingStatus === 'recording' ? handlePauseRecording : handleStartRecording}
        className={`p-3 rounded-lg transition-colors ${
          recordingStatus === 'recording' ? 'bg-red-600 text-white' : 
          recordingStatus === 'paused' ? 'bg-yellow-600 text-white' : 
          'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        {recordingStatus === 'stopped' ? (
          <PlayIcon className="h-5 w-5" />
        ) : recordingStatus === 'recording' ? (
          <PauseIcon className="h-5 w-5" />
        ) : (
          <PlayIcon className="h-5 w-5" />
        )}
      </button>
      
      {recordingStatus !== 'stopped' && (
        <button
          onClick={handleStopRecording}
          className="p-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
        >
          <StopIcon className="h-5 w-5" />
        </button>
      )}
      
      <div className="h-8 w-px bg-gray-600" />
      
      <button
        onClick={() => setShowSettingsModal(true)}
        className="p-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
      >
        <CogIcon className="h-5 w-5" />
      </button>
      
      <button
        onClick={() => window.close()}
        className="p-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
      >
        <PhoneIcon className="h-5 w-5 transform rotate-135" />
      </button>
    </div>
  );

  const ChatPanel = () => (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <img 
              src={`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Crect fill="%23e5e7eb" width="40" height="40"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="10" font-family="Arial"%3EUser%3C/text%3E%3C/svg%3E`}
              alt={message.senderName}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 text-sm">{message.senderName}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${getRoleBg(message.senderRole)}`}>
                  <span className={getRoleColor(message.senderRole)}>
                    {message.senderRole.charAt(0).toUpperCase() + message.senderRole.slice(1)}
                  </span>
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              {message.type === 'text' && (
                <p className="text-sm text-gray-700">{message.message}</p>
              )}
              
              {message.type === 'poll' && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">{message.pollData.question}</p>
                  <div className="space-y-2">
                    {message.pollData.options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{option}</span>
                        <span className="text-sm text-gray-500">
                          {message.pollData.votes[index]} votes
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {message.pollData.totalVotes} total votes
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ParticipantsPanel = () => (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Participants ({participants.length})</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {participants.map((participant) => (
          <div key={participant.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img 
              src={participant.avatar}
              alt={participant.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{participant.name}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${getRoleBg(participant.role)}`}>
                  <span className={getRoleColor(participant.role)}>
                    {participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>Joined: {new Date(participant.joinedAt).toLocaleTimeString()}</span>
                <span>•</span>
                <span className={getQualityColor(participant.connectionQuality)}>
                  {participant.connectionQuality}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {participant.isMuted && (
                <MicrophoneIcon className="h-4 w-4 text-red-600" />
              )}
              {!participant.isVideoOn && (
                <VideoCameraIcon className="h-4 w-4 text-red-600" />
              )}
              {participant.isScreenSharing && (
                <ShareIcon className="h-4 w-4 text-blue-600" />
              )}
              {participant.hasHandRaised && (
                <HandRaisedIcon className="h-4 w-4 text-yellow-600" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PollsPanel = () => (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Polls</h3>
        <button
          onClick={() => setShowPollModal(true)}
          className="btn-premium text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Create Poll
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {polls.map((poll) => (
          <div key={poll.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{poll.question}</h4>
              {poll.isActive && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Active
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              {poll.options.map((option, index) => (
                <div key={index} className="flex items-center justify-between">
                  <button
                    onClick={() => !poll.isActive && handleVotePoll(poll.id, index)}
                    disabled={poll.isActive}
                    className="flex-1 text-left p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{option}</span>
                      <span className="text-sm text-gray-500">
                        {poll.votes[index]} votes ({poll.totalVotes > 0 ? Math.round((poll.votes[index] / poll.totalVotes) * 100) : 0}%)
                      </span>
                    </div>
                    {poll.totalVotes > 0 && (
                      <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(poll.votes[index] / poll.totalVotes) * 100}%` }}
                        />
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-3 text-xs text-gray-500">
              {poll.totalVotes} total votes • Created {new Date(poll.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PollModal = () => (
    <AnimatePresence>
      {showPollModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create Poll</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleCreatePoll({
                question: formData.get('question'),
                options: [
                  formData.get('option1'),
                  formData.get('option2'),
                  formData.get('option3'),
                  formData.get('option4')
                ].filter(option => option.trim())
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    name="question"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your question..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Options
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="option1"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Option 1"
                    />
                    <input
                      type="text"
                      name="option2"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Option 2"
                    />
                    <input
                      type="text"
                      name="option3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Option 3 (optional)"
                    />
                    <input
                      type="text"
                      name="option4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Option 4 (optional)"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPollModal(false)}
                  className="btn-premium-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-premium"
                >
                  Create Poll
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">
              {session?.title || 'Live Classroom'}
            </h1>
            {isLive && (
              <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                LIVE
              </span>
            )}
            {recordingStatus === 'recording' && (
              <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                RECORDING
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UsersIcon className="h-4 w-4" />
              <span>{participants.length}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ClockIcon className="h-4 w-4" />
              <span>45:23</span>
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black relative">
            {/* Main Video */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <UserIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-white text-lg">John Smith</p>
                <p className="text-gray-400 text-sm">Trainer</p>
              </div>
            </div>
            
            {/* Participant Videos Grid */}
            <div className="absolute top-4 right-4 grid grid-cols-2 gap-2">
              {participants.slice(1, 5).map((participant) => (
                <div key={participant.id} className="w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-gray-600" />
                </div>
              ))}
            </div>
            
            {/* Recording Indicator */}
            {recordingStatus === 'recording' && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-full">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span className="text-sm">Recording</span>
              </div>
            )}
            
            {/* Hand Raise Indicator */}
            {raisedHands.size > 0 && (
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-yellow-600 text-white rounded-full">
                <span className="text-sm">{raisedHands.size} hands raised</span>
              </div>
            )}
          </div>
          
          {/* Video Controls */}
          <VideoControls />
        </div>

        {/* Side Panel */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'chat'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'participants'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Participants
            </button>
            <button
              onClick={() => setActiveTab('polls')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'polls'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Polls
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'chat' && <ChatPanel />}
            {activeTab === 'participants' && <ParticipantsPanel />}
            {activeTab === 'polls' && <PollsPanel />}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PollModal />
    </div>
  );
};

export default LiveClassroom;
