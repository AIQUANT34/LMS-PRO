import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  StarIcon,
  PaperClipIcon,
  DownloadIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChartBarIcon,
  AcademicCapIcon,
  TrophyIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const GradingSystem = () => {
  const { courseId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradingData, setGradingData] = useState({});
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [stats, setStats] = useState(null);

  // Mock assignment data
  const mockAssignment = {
    id: assignmentId,
    title: 'React Component Library Project',
    courseName: 'Complete React Development Course - 2024',
    dueDate: '2024-03-15',
    totalPoints: 100,
    rubric: [
      { category: 'Component Quality', points: 30, description: 'Components are well-structured, reusable, and follow best practices' },
      { category: 'TypeScript Implementation', points: 20, description: 'Proper TypeScript types and interfaces' },
      { category: 'Documentation', points: 15, description: 'Comprehensive documentation and examples' },
      { category: 'Testing', points: 20, description: 'Unit tests with good coverage' },
      { category: 'Code Organization', points: 15, description: 'Clean, maintainable code structure' }
    ]
  };

  // Mock submissions data
  const mockSubmissions = [
    {
      id: 'sub-001',
      studentName: 'John Doe',
      studentEmail: 'john@example.com',
      studentAvatar: 'https://via.placeholder.com/40x40',
      submittedAt: '2024-03-10T14:30:00Z',
      status: 'graded',
      grade: 92,
      text: 'I have created a comprehensive React component library with 12 components. Each component is fully typed with TypeScript and includes comprehensive documentation. I\'ve also created unit tests using Jest and React Testing Library, and set up Storybook for component visualization.',
      files: [
        { id: 1, name: 'react-components.zip', size: '8.5 MB', type: 'zip', url: '#' },
        { id: 2, name: 'documentation.md', size: '245 KB', type: 'md', url: '#' }
      ],
      feedback: {
        overall: 'Excellent work! Your component library demonstrates strong understanding of React patterns and TypeScript.',
        strengths: ['Great TypeScript implementation', 'Comprehensive documentation', 'Well-structured components', 'Good test coverage'],
        improvements: ['Consider adding more advanced hooks examples', 'Add accessibility testing', 'Include performance optimization examples'],
        rubricScores: [
          { category: 'Component Quality', score: 28, maxScore: 30 },
          { category: 'TypeScript Implementation', score: 18, maxScore: 20 },
          { category: 'Documentation', score: 14, maxScore: 15 },
          { category: 'Testing', score: 18, maxScore: 20 },
          { category: 'Code Organization', score: 14, maxScore: 15 }
        ]
      }
    },
    {
      id: 'sub-002',
      studentName: 'Jane Smith',
      studentEmail: 'jane@example.com',
      studentAvatar: 'https://via.placeholder.com/40x40',
      submittedAt: '2024-03-11T16:45:00Z',
      status: 'pending',
      grade: null,
      text: 'Here is my React component library submission. I focused on creating reusable UI components with proper TypeScript types and comprehensive documentation.',
      files: [
        { id: 3, name: 'ui-components.zip', size: '6.2 MB', type: 'zip', url: '#' },
        { id: 4, name: 'README.md', size: '189 KB', type: 'md', url: '#' }
      ],
      feedback: null
    },
    {
      id: 'sub-003',
      studentName: 'Mike Johnson',
      studentEmail: 'mike@example.com',
      studentAvatar: 'https://via.placeholder.com/40x40',
      submittedAt: '2024-03-12T09:20:00Z',
      status: 'submitted',
      grade: null,
      text: 'I created a React component library with focus on accessibility and performance. All components are properly typed and tested.',
      files: [
        { id: 5, name: 'accessible-components.zip', size: '7.8 MB', type: 'zip', url: '#' }
      ],
      feedback: null
    }
  ];

  // Mock stats data
  const mockStats = {
    totalSubmissions: mockSubmissions.length,
    gradedSubmissions: mockSubmissions.filter(s => s.status === 'graded').length,
    pendingSubmissions: mockSubmissions.filter(s => s.status === 'pending').length,
    averageGrade: 88.5,
    onTimeSubmissions: mockSubmissions.filter(s => new Date(s.submittedAt) <= new Date(mockAssignment.dueDate)).length,
    lateSubmissions: mockSubmissions.filter(s => new Date(s.submittedAt) > new Date(mockAssignment.dueDate)).length
  };

  useEffect(() => {
    // Simulate API call to get assignment data
    setTimeout(() => {
      setAssignment(mockAssignment);
      setSubmissions(mockSubmissions);
      setStats(mockStats);
    }, 500);
  }, []);

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradingData({
      overall: '',
      strengths: [],
      improvements: [],
      rubricScores: assignment.rubric.map(rubric => ({
        category: rubric.category,
        score: 0,
        maxScore: rubric.points
      }))
    });
    setShowGradingModal(true);
  };

  const handleSaveGrade = () => {
    // Simulate API call to save grade
    const updatedSubmissions = submissions.map(sub => 
      sub.id === selectedSubmission.id 
        ? { ...sub, status: 'graded', grade: calculateTotalGrade(), feedback: gradingData }
        : sub
    );
    
    setSubmissions(updatedSubmissions);
    setSelectedSubmission(null);
    setShowGradingModal(false);
    
    // Update stats
    const newStats = {
      ...stats,
      gradedSubmissions: stats.gradedSubmissions + 1,
      pendingSubmissions: stats.pendingSubmissions - 1,
      averageGrade: calculateNewAverage(updatedSubmissions)
    };
    setStats(newStats);
  };

  const calculateTotalGrade = () => {
    const totalScore = gradingData.rubricScores.reduce((sum, score) => sum + score.score, 0);
    const maxScore = assignment.rubric.reduce((sum, rubric) => sum + rubric.points, 0);
    return Math.round((totalScore / maxScore) * 100);
  };

  const calculateNewAverage = (updatedSubmissions) => {
    const gradedSubs = updatedSubmissions.filter(s => s.status === 'graded' && s.grade !== null);
    if (gradedSubs.length === 0) return 0;
    const totalGrade = gradedSubs.reduce((sum, sub) => sum + sub.grade, 0);
    return Math.round(totalGrade / gradedSubs.length);
  };

  const handleRubricScoreChange = (category, score) => {
    setGradingData(prev => ({
      ...prev,
      rubricScores: prev.rubricScores.map(rubric => 
        rubric.category === category ? { ...rubric, score } : rubric
      )
    }));
  };

  const handleAddStrength = (strength) => {
    if (strength.trim()) {
      setGradingData(prev => ({
        ...prev,
        strengths: [...prev.strengths, strength.trim()]
      }));
    }
  };

  const handleRemoveStrength = (index) => {
    setGradingData(prev => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index)
    }));
  };

  const handleAddImprovement = (improvement) => {
    if (improvement.trim()) {
      setGradingData(prev => ({
        ...prev,
        improvements: [...prev.improvements, improvement.trim()]
      }));
    }
  };

  const handleRemoveImprovement = (index) => {
    setGradingData(prev => ({
      ...prev,
      improvements: prev.improvements.filter((_, i) => i !== index)
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'graded': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'submitted': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'graded': return <CheckCircleIcon className="h-5 w-5" />;
      case 'pending': return <ClockIcon className="h-5 w-5" />;
      case 'submitted': return <DocumentTextIcon className="h-5 w-5" />;
      default: return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const SubmissionCard = ({ submission, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-premium p-6 hover:shadow-premium-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={submission.studentAvatar} 
            alt={submission.studentName}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{submission.studentName}</h3>
            <p className="text-sm text-gray-600">{submission.studentEmail}</p>
            <div className="flex items-center gap-2 mt-1">
              {getStatusIcon(submission.status)}
              <span className={`text-sm font-medium ${getStatusColor(submission.status)}`}>
                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </span>
              {submission.grade && (
                <span className="text-sm font-bold text-green-600">Grade: {submission.grade}%</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {submission.status === 'pending' ? (
            <button
              onClick={() => handleGradeSubmission(submission)}
              className="btn-premium text-sm"
            >
              Grade Now
            </button>
          ) : submission.status === 'graded' ? (
            <button
              onClick={() => handleGradeSubmission(submission)}
              className="btn-premium-outline text-sm"
            >
              Edit Grade
            </button>
          ) : (
            <button
              onClick={() => handleGradeSubmission(submission)}
              className="btn-premium-outline text-sm"
            >
              Review
            </button>
          )}
        </div>
      </div>

      {/* Submission Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4" />
          <span>Submitted: {formatDate(submission.submittedAt)}</span>
        </div>
        
        {submission.text && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 line-clamp-3">{submission.text}</p>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <PaperClipIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {submission.files.length} file{submission.files.length !== 1 ? 's' : ''} attached
          </span>
        </div>
      </div>

      {/* Feedback Preview */}
      {submission.feedback && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <ChatBubbleLeftIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-blue-900 mb-1">Instructor Feedback</div>
              <p className="text-sm text-blue-700 line-clamp-2">{submission.feedback.overall}</p>
              <div className="flex gap-2 mt-2">
                <span className="badge-success">{submission.feedback.strengths.length} strengths</span>
                <span className="badge-warning">{submission.feedback.improvements.length} improvements</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  const GradingModal = () => (
    <AnimatePresence>
      {showGradingModal && selectedSubmission && (
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
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedSubmission.studentAvatar} 
                    alt={selectedSubmission.studentName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Grade Submission</h2>
                    <p className="text-gray-600">{selectedSubmission.studentName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGradingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Grading Form */}
            <div className="p-6 space-y-6">
              {/* Overall Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Feedback
                </label>
                <textarea
                  value={gradingData.overall}
                  onChange={(e) => setGradingData(prev => ({ ...prev, overall: e.target.value }))}
                  placeholder="Provide overall feedback for this submission..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>

              {/* Rubric Scoring */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rubric Scoring</h3>
                <div className="space-y-4">
                  {assignment.rubric.map((rubric, index) => {
                    const score = gradingData.rubricScores.find(r => r.category === rubric.category);
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium text-gray-900">{rubric.category}</div>
                            <div className="text-sm text-gray-600">{rubric.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Max: {rubric.points} pts</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="0"
                            max={rubric.points}
                            value={score?.score || 0}
                            onChange={(e) => handleRubricScoreChange(rubric.category, parseInt(e.target.value))}
                            className="flex-1"
                          />
                          <div className="w-16 text-center">
                            <div className="font-bold text-gray-900">{score?.score || 0}</div>
                            <div className="text-xs text-gray-600">/ {rubric.points}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Strengths</h3>
                <div className="space-y-2 mb-3">
                  {gradingData.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-800">{strength}</span>
                      <button
                        onClick={() => handleRemoveStrength(index)}
                        className="ml-auto p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a strength..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleAddStrength(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a strength..."]');
                      if (input && input.value.trim()) {
                        handleAddStrength(input.value);
                        input.value = '';
                      }
                    }}
                    className="btn-premium-outline text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Improvements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas for Improvement</h3>
                <div className="space-y-2 mb-3">
                  {gradingData.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                      <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                      <span className="text-sm text-yellow-800">{improvement}</span>
                      <button
                        onClick={() => handleRemoveImprovement(index)}
                        className="ml-auto p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add an improvement..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleAddImprovement(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add an improvement..."]');
                      if (input && input.value.trim()) {
                        handleAddImprovement(input.value);
                        input.value = '';
                      }
                    }}
                    className="btn-premium-outline text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Grade Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Total Score</div>
                    <div className="text-2xl font-bold text-gray-900">{calculateTotalGrade()}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Grade</div>
                    <div className="text-2xl font-bold">
                      {calculateTotalGrade() >= 90 ? 'A+' : 
                       calculateTotalGrade() >= 80 ? 'A' :
                       calculateTotalGrade() >= 70 ? 'B' :
                       calculateTotalGrade() >= 60 ? 'C' : 'D'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowGradingModal(false)}
                className="btn-premium-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGrade}
                className="btn-premium"
              >
                Save Grade
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={`/trainer/courses/${courseId}`} className="text-gray-600 hover:text-gray-900">
                <ArrowRightIcon className="h-5 w-5 rotate-180" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
                <p className="text-gray-600">{assignment.courseName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-600">Due Date</div>
                <div className="font-medium text-gray-900">{assignment.dueDate}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Points</div>
                <div className="font-medium text-gray-900">{assignment.totalPoints} pts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="card-premium p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</div>
            <div className="text-sm text-gray-600">Total Submissions</div>
          </div>
          
          <div className="card-premium p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.gradedSubmissions}</div>
            <div className="text-sm text-gray-600">Graded</div>
          </div>
          
          <div className="card-premium p-4 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingSubmissions}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          
          <div className="card-premium p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.averageGrade}%</div>
            <div className="text-sm text-gray-600">Average Grade</div>
          </div>
          
          <div className="card-premium p-4 text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUpIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.onTimeSubmissions}</div>
            <div className="text-sm text-gray-600">On Time</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {['pending', 'submitted', 'graded'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab} ({submissions.filter(s => s.status === tab).length})
              </button>
            ))}
          </nav>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissions
            .filter(submission => activeTab === 'all' || submission.status === activeTab)
            .map((submission, index) => (
              <SubmissionCard key={submission.id} submission={submission} index={index} />
            ))}
        </div>

        {submissions.filter(s => s.status === activeTab).length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No {activeTab} submissions</h3>
            <p className="text-gray-600">
              {activeTab === 'pending' && 'No submissions are pending grading.'}
              {activeTab === 'submitted' && 'No submissions are currently submitted.'}
              {activeTab === 'graded' && 'No graded submissions yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Grading Modal */}
      <GradingModal />
    </div>
  );
};

export default GradingSystem;
