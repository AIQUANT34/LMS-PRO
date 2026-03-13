import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';
import { 
  AcademicCapIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TrophyIcon,
  PlusIcon,
  MinusIcon,
  DocumentTextIcon,
  ServerIcon,
  GlobeAltIcon,
  LockClosedIcon,
  KeyIcon,
  FlagIcon,
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
  ShareIcon,
  LinkIcon,
  CameraIcon,
  VideoCameraIcon,
  PhotoIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  DocumentIcon,
  CurrencyDollarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  XMarkIcon,
  ListBulletIcon,
  TableCellsIcon,
  ChartPieIcon,
  ChartBarIcon,
  CubeIcon,
  CircleStackIcon,
  ArchiveBoxIcon,
  InboxIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  BellIcon,
  CogIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const InstructorApproval = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterExpertise, setFilterExpertise] = useState('all');
  const [selectedApplications, setSelectedApplications] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('appliedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [rejectionReason, setRejectionReason] = useState('');

  const applicationsPerPage = 10;

  useEffect(() => {
    fetchInstructorApplications();
  }, []);

  const fetchInstructorApplications = async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.USERS.INSTRUCTOR_APPLICATIONS);
      // Transform the backend data to match the frontend structure
      const transformedApplications = response.map(app => ({
        id: app._id,
        instructor: {
          id: app.userId?._id || app.userId,
          firstName: app.firstName,
          lastName: app.lastName,
          email: app.email,
          phone: app.phone,
          avatar: 'https://via.placeholder.com/100x100', // Default avatar
          bio: app.experience || 'No bio provided',
          location: `${app.country}, ${app.timezone}`,
          website: app.website || '',
          linkedin: app.linkedinProfile || '',
          twitter: '',
          youtube: '',
          expertise: app.expertise || [],
          experience: [], // Will be populated from backend if available
          education: app.education || [],
          certifications: [],
          languages: ['English'],
          teachingExperience: app.teachingExperience || 'Not specified',
          availability: app.currentOccupation || 'Not specified',
          timezone: app.timezone
        },
        application: {
          status: app.status,
          appliedAt: app.createdAt,
          reviewedAt: app.reviewedAt,
          reviewedBy: app.reviewedBy?.name || null,
          rejectionReason: app.rejectionReason || null,
          notes: app.adminNotes ? JSON.stringify(app.adminNotes) : '',
          courses: app.courseIdeas || [],
          documents: app.teachingDemoUrl ? [{
            name: 'Teaching Demo',
            type: 'video',
            url: app.teachingDemoUrl,
            uploadedAt: app.createdAt
          }] : [],
          references: []
        },
        analytics: {
          views: Math.floor(Math.random() * 100),
          profileViews: Math.floor(Math.random() * 50),
          downloads: Math.floor(Math.random() * 25),
          averageRating: 0,
          reviews: 0
        }
      }));
      
      setApplications(transformedApplications);
      setTotalPages(Math.ceil(transformedApplications.length / applicationsPerPage));
    } catch (error) {
      console.error('Error fetching instructor applications:', error);
      toast.error('Failed to load instructor applications');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.instructor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.instructor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.instructor.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || app.application.status === filterStatus;
    const matchesExpertise = filterExpertise === 'all' || app.instructor.expertise.includes(filterExpertise);
    return matchesSearch && matchesStatus && matchesExpertise;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.instructor.firstName.localeCompare(b.instructor.firstName);
    } else if (sortBy === 'email') {
      comparison = a.instructor.email.localeCompare(b.instructor.email);
    } else if (sortBy === 'status') {
      comparison = a.application.status.localeCompare(b.application.status);
    } else if (sortBy === 'appliedAt') {
      comparison = new Date(a.application.appliedAt) - new Date(b.application.appliedAt);
    } else if (sortBy === 'reviewedAt') {
      comparison = new Date(a.application.reviewedAt || 0) - new Date(b.application.reviewedAt || 0);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const paginatedApplications = sortedApplications.slice(
    (currentPage - 1) * applicationsPerPage,
    currentPage * applicationsPerPage
  );

  const handleSelectApplication = (application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const handleViewVideo = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    setShowVideoModal(true);
  };

  const handleApproveApplication = (application) => {
    setSelectedApplication(application);
    setShowApprovalModal(true);
  };

  const handleRejectApplication = (application) => {
    setSelectedApplication(application);
    setShowRejectionModal(true);
    setRejectionReason('');
  };

  const handleConfirmApproval = async () => {
    if (selectedApplication) {
      try {
        await apiService.patch(API_ENDPOINTS.USERS.REVIEW_INSTRUCTOR_APPLICATION(selectedApplication.id), {
          status: 'approved',
          adminNotes: {
            strengths: ['Good profile', 'Relevant experience'],
            concerns: [],
            recommendations: ['Start with basic courses']
          }
        });
        
        toast.success('Application approved successfully!');
        setShowApprovalModal(false);
        setSelectedApplication(null);
        fetchInstructorApplications(); // Refresh the data
      } catch (error) {
        console.error('Error approving application:', error);
        toast.error('Failed to approve application');
      }
    }
  };

  const handleConfirmRejection = async () => {
    if (selectedApplication && rejectionReason) {
      try {
        await apiService.patch(API_ENDPOINTS.USERS.REVIEW_INSTRUCTOR_APPLICATION(selectedApplication.id), {
          status: 'rejected',
          rejectionReason: rejectionReason,
          adminNotes: {
            strengths: [],
            concerns: [rejectionReason],
            recommendations: ['Improve profile and reapply']
          }
        });
        
        toast.success('Application rejected successfully!');
        setShowRejectionModal(false);
        setSelectedApplication(null);
        setRejectionReason('');
        fetchInstructorApplications(); // Refresh the data
      } catch (error) {
        console.error('Error rejecting application:', error);
        toast.error('Failed to reject application');
      }
    }
  };

  const handleToggleApplicationSelection = (applicationId) => {
    const newSelected = new Set(selectedApplications);
    if (newSelected.has(applicationId)) {
      newSelected.delete(applicationId);
    } else {
      newSelected.add(applicationId);
    }
    setSelectedApplications(newSelected);
  };

  const handleBulkAction = async (action) => {
    const selectedApplicationsList = applications.filter(app => selectedApplications.has(app.id));
    
    try {
      const promises = selectedApplicationsList.map(app => 
        apiService.patch(API_ENDPOINTS.USERS.REVIEW_INSTRUCTOR_APPLICATION(app.id), {
          status: action,
          rejectionReason: action === 'rejected' ? 'Bulk rejection - Please review application guidelines' : undefined,
          adminNotes: {
            strengths: action === 'approved' ? ['Approved in bulk review'] : [],
            concerns: action === 'rejected' ? ['Bulk rejection'] : [],
            recommendations: action === 'approved' ? ['Start with basic courses'] : ['Improve profile and reapply']
          }
        })
      );
      
      await Promise.all(promises);
      
      toast.success(`Applications ${action}d successfully!`);
      setSelectedApplications(new Set());
      fetchInstructorApplications(); // Refresh the data
    } catch (error) {
      console.error(`Error in bulk ${action}:`, error);
      toast.error(`Failed to ${action} applications`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100';
      case 'rejected': return 'bg-red-100';
      case 'pending': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  const ApplicationCard = ({ application, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-premium p-6 hover:shadow-premium-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedApplications.has(application.id)}
            onChange={() => handleToggleApplicationSelection(application.id)}
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <img 
            src={application.instructor.avatar} 
            alt={`${application.instructor.firstName} ${application.instructor.lastName}`}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">
                {application.instructor.firstName} {application.instructor.lastName}
              </h3>
              <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusBg(application.application.status)}`}>
                <span className={getStatusColor(application.application.status)}>
                  {application.application.status.charAt(0).toUpperCase() + application.application.status.slice(1)}
                </span>
              </span>
            </div>
            <p className="text-sm text-gray-600">{application.instructor.email}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">Applied</div>
          <div className="font-medium text-gray-900">{new Date(application.application.appliedAt).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-2">{application.instructor.bio}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Expertise</div>
          <div className="flex flex-wrap gap-1">
            {application.instructor.expertise.slice(0, 2).map((exp, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {exp}
              </span>
            ))}
            {application.instructor.expertise.length > 2 && (
              <span className="text-xs text-gray-500">+{application.instructor.expertise.length - 2} more</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Experience</div>
          <div className="font-medium text-gray-900 text-sm">{application.instructor.experience.length} positions</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Proposed Courses</div>
          <div className="font-medium text-gray-900 text-sm">{application.application.courses.length} courses</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Location</div>
          <div className="font-medium text-gray-900 text-sm">{application.instructor.location}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Availability</div>
          <div className="font-medium text-gray-900 text-sm">{application.instructor.availability}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Teaching Experience</div>
          <div className="font-medium text-gray-900 text-sm">{application.instructor.teachingExperience}</div>
        </div>
      </div>

      {application.application.reviewedAt && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Review Details</span>
            <span className="text-xs text-gray-600">
              Reviewed by {application.application.reviewedBy} on {new Date(application.application.reviewedAt).toLocaleDateString()}
            </span>
          </div>
          {application.application.notes && (
            <p className="text-sm text-gray-700">{application.application.notes}</p>
          )}
          {application.application.rejectionReason && (
            <p className="text-sm text-red-600 mt-2">Reason: {application.application.rejectionReason}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <EyeIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{application.analytics.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <DocumentTextIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{application.application.documents.length}</span>
          </div>
          {application.analytics.averageRating > 0 && (
            <div className="flex items-center gap-1">
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-600">{application.analytics.averageRating}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectApplication(application)}
            className="btn-premium-outline text-sm"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            View
          </button>
          {application.application.status === 'pending' && (
            <>
              <button
                onClick={() => handleApproveApplication(application)}
                className="btn-premium-outline text-sm text-green-600 hover:bg-green-50"
              >
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Approve
              </button>
              <button
                onClick={() => handleRejectApplication(application)}
                className="btn-premium-outline text-sm text-red-600 hover:bg-red-50"
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  const ApplicationModal = () => (
    <AnimatePresence>
      {showApplicationModal && selectedApplication && (
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
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Instructor Application Details</h2>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={selectedApplication.instructor.avatar} 
                      alt={`${selectedApplication.instructor.firstName} ${selectedApplication.instructor.lastName}`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedApplication.instructor.firstName} {selectedApplication.instructor.lastName}
                      </h3>
                      <p className="text-gray-600">{selectedApplication.instructor.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusBg(selectedApplication.application.status)}`}>
                          <span className={getStatusColor(selectedApplication.application.status)}>
                            {selectedApplication.application.status.charAt(0).toUpperCase() + selectedApplication.application.status.slice(1)}
                          </span>
                        </span>
                        <span className="text-sm text-gray-600">
                          Applied: {new Date(selectedApplication.application.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Bio</h4>
                    <p className="text-gray-700">{selectedApplication.instructor.bio}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{selectedApplication.instructor.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{selectedApplication.instructor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{selectedApplication.instructor.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GlobeAltIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{selectedApplication.instructor.website}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Professional Details</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Availability:</span>
                          <span className="text-sm text-gray-900 ml-2">{selectedApplication.instructor.availability}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Timezone:</span>
                          <span className="text-sm text-gray-900 ml-2">{selectedApplication.instructor.timezone}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Teaching Experience:</span>
                          <span className="text-sm text-gray-900 ml-2">{selectedApplication.instructor.teachingExperience}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Languages:</span>
                          <span className="text-sm text-gray-900 ml-2">{selectedApplication.instructor.languages.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Areas of Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.instructor.expertise.map((exp, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Experience</h4>
                    <div className="space-y-4">
                      {selectedApplication.instructor.experience.map((exp, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium text-gray-900">{exp.position}</h5>
                            <span className="text-sm text-gray-600">{exp.duration}</span>
                          </div>
                          <div className="text-sm text-gray-700 mb-1">{exp.company}</div>
                          <p className="text-sm text-gray-600">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Education</h4>
                    <div className="space-y-3">
                      {selectedApplication.instructor.education.map((edu, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-4">
                          <h5 className="font-medium text-gray-900">{edu.degree}</h5>
                          <div className="text-sm text-gray-700">{edu.institution}</div>
                          <div className="text-sm text-gray-600">{edu.duration}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Certifications</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {selectedApplication.instructor.certifications.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Proposed Courses</h4>
                    <div className="space-y-3">
                      {selectedApplication.application.courses.map((course, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-1">{course.title}</h5>
                          <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-700">
                            <span>Duration: {course.duration}</span>
                            <span>Price: ${course.price}</span>
                            <span>Level: {course.level}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedApplication.application.references.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">References</h4>
                      <div className="space-y-3">
                        {selectedApplication.application.references.map((ref, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">{ref.name}</div>
                            <div className="text-sm text-gray-600">{ref.position}</div>
                            <div className="text-sm text-gray-700">{ref.email}</div>
                            <div className="text-sm text-gray-700">{ref.phone}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="card-premium p-6 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Application Documents</h4>
                    <div className="space-y-3">
                      {selectedApplication.application.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {doc.type === 'video' ? (
                              <VideoCameraIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                            )}
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{doc.name}</div>
                              <div className="text-xs text-gray-600">{doc.type}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleViewVideo(doc.url)}
                            className="btn-premium-outline text-sm"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-premium p-6 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Application Analytics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Profile Views</span>
                        <span className="font-medium text-gray-900">{selectedApplication.analytics.profileViews}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Document Downloads</span>
                        <span className="font-medium text-gray-900">{selectedApplication.analytics.downloads}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Views</span>
                        <span className="font-medium text-gray-900">{selectedApplication.analytics.views}</span>
                      </div>
                      {selectedApplication.analytics.averageRating > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Rating</span>
                          <div className="flex items-center gap-1">
                            <StarIconSolid className="h-4 w-4 text-yellow-400" />
                            <span className="font-medium text-gray-900">{selectedApplication.analytics.averageRating}</span>
                            <span className="text-gray-500 text-sm">({selectedApplication.analytics.reviews})</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedApplication.application.reviewedAt && (
                    <div className="card-premium p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Review Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Reviewed By</span>
                          <span className="font-medium text-gray-900">{selectedApplication.application.reviewedBy}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Review Date</span>
                          <span className="font-medium text-gray-900">{new Date(selectedApplication.application.reviewedAt).toLocaleDateString()}</span>
                        </div>
                        {selectedApplication.application.notes && (
                          <div>
                            <span className="text-sm text-gray-600">Notes:</span>
                            <p className="text-sm text-gray-700 mt-1">{selectedApplication.application.notes}</p>
                          </div>
                        )}
                        {selectedApplication.application.rejectionReason && (
                          <div>
                            <span className="text-sm text-gray-600">Rejection Reason:</span>
                            <p className="text-sm text-red-600 mt-1">{selectedApplication.application.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApplicationModal(false)}
                className="btn-premium-outline"
              >
                Close
              </button>
              {selectedApplication.application.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setShowApplicationModal(false);
                      handleApproveApplication(selectedApplication);
                    }}
                    className="btn-premium text-green-600 hover:bg-green-50"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Approve Application
                  </button>
                  <button
                    onClick={() => {
                      setShowApplicationModal(false);
                      handleRejectApplication(selectedApplication);
                    }}
                    className="btn-premium text-red-600 hover:bg-red-50"
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Reject Application
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ApprovalModal = () => (
    <AnimatePresence>
      {showApprovalModal && selectedApplication && (
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
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Approve Application?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to approve <strong>{selectedApplication.instructor.firstName} {selectedApplication.instructor.lastName}</strong>'s application? This will grant them instructor access.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="btn-premium-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                className="btn-premium text-green-600 hover:bg-green-50"
              >
                Approve Application
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const VideoModal = () => (
    <AnimatePresence>
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">Teaching Demo Video</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {selectedVideoUrl ? (
                  <video
                    controls
                    className="w-full h-full"
                    src={selectedVideoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <VideoCameraIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const RejectionModal = () => (
    <AnimatePresence>
      {showRejectionModal && selectedApplication && (
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
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircleIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Application?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to reject <strong>{selectedApplication.instructor.firstName} {selectedApplication.instructor.lastName}</strong>'s application? Please provide a reason.
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="btn-premium-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={!rejectionReason.trim()}
                className="btn-premium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Reject Application
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Instructor Approval</h1>
              <p className="text-gray-600">Review and manage instructor applications</p>
            </div>
            
            <button className="btn-premium">
              <PlusIcon className="h-4 w-4 mr-2" />
              Invite Instructor
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications by name, email, expertise..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={filterExpertise}
              onChange={(e) => setFilterExpertise(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Expertise</option>
              <option value="React">React</option>
              <option value="JavaScript">JavaScript</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Python">Python</option>
              <option value="Data Science">Data Science</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="status">Sort by Status</option>
              <option value="appliedAt">Sort by Applied Date</option>
              <option value="reviewedAt">Sort by Review Date</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedApplications.size > 0 && (
          <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-600">
                {selectedApplications.size} application{selectedApplications.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="btn-premium-outline text-sm"
              >
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="btn-premium-outline text-sm text-red-600 hover:bg-red-50"
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Application Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {paginatedApplications.map((application, index) => (
            <ApplicationCard key={application.id} application={application} index={index} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn-premium-outline"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? 'btn-premium'
                      : 'btn-premium-outline'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="btn-premium-outline"
            >
              Next
            </button>
          </div>
        )}

        {paginatedApplications.length === 0 && (
          <div className="text-center py-12">
            <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find applications.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ApplicationModal />
      <ApprovalModal />
      <VideoModal />
      <RejectionModal />
    </div>
  );
};

export default InstructorApproval;
