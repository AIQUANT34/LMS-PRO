import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  DocumentTextIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  StarIcon,
  PaperClipIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const AssignmentSystem = () => {
  const { courseId, assignmentId } = useParams();
  const fileInputRef = useRef(null);
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Mock assignment data
  const mockAssignment = {
    id: assignmentId,
    title: 'React Component Library Project',
    description: 'Create a comprehensive React component library with at least 10 reusable components. Your library should include proper documentation, TypeScript support, and comprehensive testing.',
    courseName: 'Complete React Development Course - 2024',
    instructor: 'John Smith',
    dueDate: '2024-03-15',
    maxFileSize: 10, // MB
    allowedFileTypes: ['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.zip'],
    totalPoints: 100,
    instructions: [
      'Create at least 10 reusable React components',
      'Use TypeScript for type safety',
      'Include comprehensive documentation',
      'Write unit tests for each component',
      'Create a storybook for component showcase',
      'Follow React best practices and patterns',
      'Include proper prop validation and default values'
    ],
    rubric: [
      { category: 'Component Quality', points: 30, description: 'Components are well-structured, reusable, and follow best practices' },
      { category: 'TypeScript Implementation', points: 20, description: 'Proper TypeScript types and interfaces' },
      { category: 'Documentation', points: 15, description: 'Comprehensive documentation and examples' },
      { category: 'Testing', points: 20, description: 'Unit tests with good coverage' },
      { category: 'Code Organization', points: 15, description: 'Clean, maintainable code structure' }
    ],
    resources: [
      { name: 'Component Library Guide.pdf', type: 'pdf', url: '#' },
      { name: 'React TypeScript Cheatsheet.pdf', type: 'pdf', url: '#' },
      { name: 'Example Repository', type: 'link', url: 'https://github.com/example' }
    ]
  };

  // Mock submission data
  const mockSubmission = {
    id: 'sub-001',
    studentName: 'John Doe',
    submittedAt: '2024-03-10T14:30:00Z',
    text: 'I have created a comprehensive React component library with 12 components. Each component is fully typed with TypeScript and includes comprehensive documentation. I\'ve also created unit tests using Jest and React Testing Library, and set up Storybook for component visualization.',
    files: [
      {
        id: 1,
        name: 'react-components.zip',
        size: '8.5 MB',
        type: 'zip',
        url: '#'
      },
      {
        id: 2,
        name: 'documentation.md',
        size: '245 KB',
        type: 'md',
        url: '#'
      }
    ],
    grade: 92,
    status: 'graded',
    feedback: {
      overall: 'Excellent work! Your component library demonstrates strong understanding of React patterns and TypeScript.',
      strengths: [
        'Great TypeScript implementation',
        'Comprehensive documentation',
        'Well-structured components',
        'Good test coverage'
      ],
      improvements: [
        'Consider adding more advanced hooks examples',
        'Add accessibility testing',
        'Include performance optimization examples'
      ],
      rubricScores: [
        { category: 'Component Quality', score: 28, maxScore: 30 },
        { category: 'TypeScript Implementation', score: 18, maxScore: 20 },
        { category: 'Documentation', score: 14, maxScore: 15 },
        { category: 'Testing', score: 18, maxScore: 20 },
        { category: 'Code Organization', score: 14, maxScore: 15 }
      ]
    }
  };

  React.useEffect(() => {
    // Simulate API call to get assignment data
    setTimeout(() => {
      setAssignment(mockAssignment);
      setSubmission(mockSubmission);
    }, 500);
  }, []);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      const isValidType = assignment.allowedFileTypes.includes(extension);
      const isValidSize = file.size <= assignment.maxFileSize * 1024 * 1024;
      return isValidType && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to confirmation or show success message
    }, 2000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSubmissionStatus = () => {
    if (!submission) return 'not-submitted';
    if (submission.status === 'pending') return 'pending';
    if (submission.status === 'graded') return 'graded';
    return 'submitted';
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
              <Link to={`/student/courses/${courseId}`} className="text-gray-600 hover:text-gray-900">
                <ArrowRightIcon className="h-5 w-5 rotate-180" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
                <p className="text-gray-600">{assignment.courseName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {submission && (
                <div className="flex items-center gap-2 text-sm">
                  {getStatusIcon(getSubmissionStatus())}
                  <span className={`font-medium ${getStatusColor(getSubmissionStatus())}`}>
                    {getSubmissionStatus().replace('-', ' ').toUpperCase()}
                  </span>
                  {submission.grade && (
                    <span className="font-bold text-green-600">Grade: {submission.grade}%</span>
                  )}
                </div>
              )}
              <button
                onClick={() => setShowFeedback(!showFeedback)}
                className="btn-premium-outline"
              >
                <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                {showFeedback ? 'Hide Feedback' : 'View Feedback'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Details */}
            <div className="card-premium p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Assignment Overview</h2>
                  <p className="text-gray-600">{assignment.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserIcon className="h-4 w-4" />
                  <span>{assignment.instructor}</span>
                </div>
              </div>

              {/* Assignment Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Due Date</div>
                    <div className="text-sm text-gray-600">{assignment.dueDate}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <StarIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Total Points</div>
                    <div className="text-sm text-gray-600">{assignment.totalPoints} points</div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
                <ul className="space-y-2">
                  {assignment.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rubric */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Grading Rubric</h3>
                <div className="space-y-3">
                  {assignment.rubric.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{item.category}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{item.points} pts</div>
                        <div className="text-sm text-gray-600">{Math.round((item.points / assignment.totalPoints) * 100)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resources</h3>
                <div className="space-y-2">
                  {assignment.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{resource.name}</div>
                        <div className="text-sm text-gray-600">{resource.type}</div>
                      </div>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Submission Form */}
            {!submission && (
              <div className="card-premium p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Assignment</h3>
                
                {/* Text Submission */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Describe your work, challenges faced, and what you learned..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                  />
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Files
                  </label>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    accept={assignment.allowedFileTypes.join(',')}
                    className="hidden"
                  />
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-premium-outline"
                    >
                      Choose Files
                    </button>
                    <p className="text-sm text-gray-600 mt-2">
                      Max file size: {assignment.maxFileSize}MB
                    </p>
                    <p className="text-xs text-gray-500">
                      Allowed types: {assignment.allowedFileTypes.join(', ')}
                    </p>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <PaperClipIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{file.name}</div>
                              <div className="text-sm text-gray-600">{formatFileSize(file.size)}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || files.length === 0}
                    className="btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        Submit Assignment
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowPreview(true)}
                    className="btn-premium-outline"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Preview
                  </button>
                </div>
              </div>
            )}

            {/* Existing Submission */}
            {submission && (
              <div className="card-premium p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Submission</h3>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{submission.studentName}</div>
                        <div className="text-sm text-gray-600">Submitted {new Date(submission.submittedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge-success">Graded</span>
                      <span className="font-bold text-green-600">{submission.grade}%</span>
                    </div>
                  </div>
                  
                  {submission.text && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{submission.text}</p>
                    </div>
                  )}
                </div>

                {/* Files */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Submitted Files</h4>
                  <div className="space-y-2">
                    {submission.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <PaperClipIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{file.name}</div>
                            <div className="text-sm text-gray-600">{file.size}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFeedback(!showFeedback)}
                    className="btn-premium"
                  >
                    <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                    View Feedback
                  </button>
                  <button className="btn-premium-outline">
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Submission
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Feedback Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {showFeedback && submission && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="card-premium p-6 sticky top-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Instructor Feedback</h3>
                  
                  {/* Overall Grade */}
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">{submission.grade}%</div>
                    <div className="text-gray-600">Overall Grade</div>
                  </div>

                  {/* Feedback Text */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Overall Comments</h4>
                    <p className="text-gray-700">{submission.feedback.overall}</p>
                  </div>

                  {/* Strengths */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {submission.feedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {submission.feedback.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rubric Scores */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Detailed Scores</h4>
                    <div className="space-y-3">
                      {submission.feedback.rubricScores.map((score, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-900">{score.category}</span>
                            <span className="text-gray-600">{score.score}/{score.maxScore}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
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
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Submission Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{text || 'No description provided'}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Files</h4>
                  <div className="space-y-2">
                    {files.length > 0 ? (
                      files.map((file) => (
                        <div key={file.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                          <PaperClipIcon className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{file.name}</div>
                            <div className="text-xs text-gray-600">{formatFileSize(file.size)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No files attached</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 btn-premium-outline"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    handleSubmit();
                  }}
                  className="flex-1 btn-premium"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssignmentSystem;
