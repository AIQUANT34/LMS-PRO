import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  DocumentTextIcon,
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  EyeIcon,
  DownloadIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/apiService';
import toast from 'react-hot-toast';

const StudentAssignmentSystem = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const [assignment, setAssignment] = useState(null);
  const [course, setCourse] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAssignmentData();
  }, [courseId, assignmentId, isAuthenticated, navigate]);

  const fetchAssignmentData = async () => {
    try {
      const [assignmentRes, courseRes] = await Promise.all([
        apiService.get(`/api/assignments/${assignmentId}`),
        apiService.get(`/api/courses/${courseId}`)
      ]);
      
      setAssignment(assignmentRes.data);
      setCourse(courseRes.data);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      toast.error('Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submission?.content?.trim()) {
      toast.error('Please provide assignment content');
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiService.post(`/api/assignments/${assignmentId}/submit`, {
        content: submission.content,
        attachments: submission.attachments || []
      });
      
      toast.success('Assignment submitted successfully!');
      setSubmission({ ...submission, submittedAt: new Date(), status: 'submitted' });
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isOverdue = assignment?.dueDate && new Date(assignment.dueDate) < new Date();
  const isSubmitted = submission?.status === 'submitted';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to={`/student/courses/${courseId}`}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Course
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{assignment?.title}</h1>
        </div>
        {isSubmitted && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Submitted
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 card-premium p-6"
        >
          <div className="space-y-6">
            {/* Assignment Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>Due: {assignment?.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</span>
                  {isOverdue && (
                    <span className="ml-2 text-red-600 font-medium">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      Overdue
                    </span>
                  )}
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>Duration: {assignment?.estimatedTime || 'Not specified'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <UserIcon className="h-5 w-5 mr-2" />
                  <span>Instructor: {assignment?.instructorName || course?.instructorId?.name || 'Not specified'}</span>
                </div>
              </div>
            </div>

            {/* Assignment Description */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-3">Description</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{assignment?.description || 'No description provided'}</p>
              </div>
            </div>

            {/* Attachments */}
            {assignment?.attachments && assignment.attachments.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3">Attachments</h3>
                <div className="space-y-2">
                  {assignment.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-700">{attachment.name}</span>
                      </div>
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Submission Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-premium p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Submission</h2>
          
          {isSubmitted ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center text-green-800 mb-2">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  <span className="font-medium">Assignment Submitted</span>
                </div>
                <p className="text-sm text-green-700">
                  Submitted on: {submission?.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Unknown'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Your Work</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{submission?.content || 'No content submitted'}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Content</label>
                <textarea
                  rows={8}
                  value={submission?.content || ''}
                  onChange={(e) => setSubmission({ ...submission, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Write your assignment here..."
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setSubmission({ ...submission, attachments: Array.from(e.target.files) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={submitting}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentAssignmentSystem;
