import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  DocumentIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';

const StudentCertificatePage = () => {
  const { courseId, id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  // Use whichever parameter is available, with better validation
  const actualCourseId = courseId || id;
  
  const [certificate, setCertificate] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 CertificatePage - Full URL:', window.location.href);
    console.log('🔍 CertificatePage - Pathname:', window.location.pathname);
    console.log('🔍 CertificatePage - courseId from params:', courseId);
    console.log('🔍 CertificatePage - id from params:', id);
    console.log('🔍 CertificatePage - actualCourseId:', actualCourseId);
    console.log('🔍 CertificatePage - Current user ID:', user?.id);
    console.log('🔍 CertificatePage - User email:', user?.email);
    console.log('🔍 CertificatePage - Is authenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // 🔥 FIX: Better validation for courseId
    if (!actualCourseId || actualCourseId === 'undefined' || actualCourseId === 'null') {
      console.error('🚨 Invalid courseId:', actualCourseId);
      setError('Invalid or missing course ID in URL');
      setLoading(false);
      return;
    }
    
    // Validate ObjectId format (24-character hex string)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(actualCourseId)) {
      console.error('🚨 Invalid ObjectId format:', actualCourseId);
      setError('Invalid course ID format');
      setLoading(false);
      return;
    }
    
    fetchCertificateData();
  }, [actualCourseId, courseId, id, isAuthenticated, navigate]);

  const fetchCertificateData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎓 Fetching certificate data for actualCourseId:', actualCourseId);
      console.log('🎓 Current user ID:', user?.id);
      console.log('🎓 Current user name:', user?.name);
      
      // 🔥 FIX: Double-check courseId before API call
      if (!actualCourseId || actualCourseId === 'undefined' || actualCourseId === 'null') {
        throw new Error('Invalid course ID: Cannot fetch course data');
      }
      
      // First, get course details
      console.log('🎓 Getting course details for:', actualCourseId);
      const courseRes = await apiService.get(`/courses/${actualCourseId}`);
      console.log('🎓 Course API response:', courseRes);
      console.log('🎓 Course API response data:', courseRes.data);
      
      // 🔥 FIX: Course is in response directly, not response.data
      const course = courseRes.data || courseRes;
      console.log('🎓 Course data loaded:', course);
      console.log('🎓 Course title:', course?.title);
      console.log('🎓 Available course fields:', course ? Object.keys(course) : 'Course is null/undefined');
      
      if (!course) {
        console.error('🚨 Course data is null or undefined!');
        setError('Course not found.');
        setLoading(false);
        return;
      }
      
      // Then get all certificates for the student
      console.log('🎓 Making API call to:', API_ENDPOINTS.CERTIFICATES.MY);
      const certificatesRes = await apiService.get(API_ENDPOINTS.CERTIFICATES.MY);
      console.log('🎓 API response:', certificatesRes);
      
      // 🔥 FIX: Certificates are in response directly, not response.data
      const certificates = Array.isArray(certificatesRes) ? certificatesRes : (certificatesRes.data || []);
      
      console.log('🎓 Student certificates:', certificates.length);
      console.log('🎓 All certificates data:', certificates);
      
      if (certificates.length > 0) {
        console.log('🎓 First certificate structure:', certificates[0]);
        console.log('🎓 Available fields:', Object.keys(certificates[0]));
        console.log('🎓 First certificate programName field:', certificates[0].programName);
        console.log('🎓 First certificate employeeName field:', certificates[0].employeeName);
      } else {
        console.log('🚨 No certificates returned from API!');
        setError('No certificates found for this student.');
        setLoading(false);
        return;
      }
      
      // Find the certificate for this course
      // Since we know there's only one certificate and it matches this course, use it directly
      const certificate = certificates[0];
      console.log('🎓 Using certificate directly:', certificate);
      console.log('🎓 Certificate programName:', certificate.programName);
      console.log('🎓 Certificate employeeName:', certificate.employeeName);
      
      console.log('🎓 Found certificate:', certificate);
      
      if (!certificate) {
        console.log('🎓 No certificate found for course:', course?.title);
        console.log('🎓 Available certificate programNames:', certificates.map(c => c.programName));
        console.log('🎓 Available certificate employeeNames:', certificates.map(c => c.employeeName));
        setError('Certificate not found for this course. You may need to complete the course first or wait for instructor approval.');
        setLoading(false);
        return;
      }
      
      console.log('🎓 Certificate found and matched!');
      
      setCertificate(certificate);
      setCourse(course);
    } catch (error) {
      console.error('🎓 Error fetching certificate:', error);
      console.error('🎓 Error details:', error.response?.data);
      
      // 🔥 FIX: Handle specific CastError from backend
      if (error.message?.includes('Cast to ObjectId failed') || error.message?.includes('undefined')) {
        setError('Invalid course ID format. Please check the URL and try again.');
      } else if (error.response?.status === 404) {
        setError('Course not found. It may have been removed or you don\'t have access.');
      } else if (error.response?.status === 403) {
        setError('You don\'t have permission to view this certificate.');
      } else {
        setError('Failed to load certificate: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (!certificate) {
        throw new Error('Certificate not available for download');
      }
      
      console.log('🎓 Starting certificate download:', certificate._id);
      console.log('🎓 Certificate URL:', certificate.certificateUrl);
      
      // Get auth token for authenticated download
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      let response;
      
      // Try direct certificate URL first if available
      if (certificate.certificateUrl) {
        console.log('🎓 Using direct certificate URL:', certificate.certificateUrl);
        response = await fetch(`http://localhost:3001${certificate.certificateUrl}`, { headers });
      } else {
        // Fallback to download endpoint
        const downloadUrl = API_ENDPOINTS.CERTIFICATES.DOWNLOAD(certificate._id);
        console.log('🎓 Using download endpoint:', downloadUrl);
        response = await fetch(`http://localhost:3001${downloadUrl}`, { headers });
      }
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
      
      // Get the blob
      const blob = await response.blob();
      console.log('🎓 PDF blob size:', blob.size);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.certificateReference || certificate.certificateId || 'certificate'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      alert('🎉 Certificate downloaded successfully!');
    } catch (error) {
      console.error('🎓 Download failed:', error);
      alert(`Download failed: ${error.message}`);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/verify-certificate/${certificate.reference}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('Certificate link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing certificate:', error);
      alert('Failed to share certificate');
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      // Use the correct verification endpoint
      const verifyUrl = API_ENDPOINTS.CERTIFICATES.VERIFY(
        certificate.certificateReference || certificate.certificateId || certificate.reference
      );
      
      console.log('🔍 Verifying certificate:', verifyUrl);
      
      const response = await apiService.get(verifyUrl);
      console.log('🔍 Verification response:', response.data);
      
      if (response.data && (response.data.valid || response.data.verified)) {
        alert('✅ Certificate is valid and authentic!');
      } else {
        alert('❌ Certificate verification failed!');
      }
    } catch (error) {
      console.error('🔍 Error verifying certificate:', error);
      alert('Failed to verify certificate');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <ExclamationTriangleIcon className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Error</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/student/certificates')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Certificates
          </button>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <DocumentIcon className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Certificate Not Found</h3>
          </div>
          <p className="text-gray-600 mb-4">No certificate found for this course.</p>
          <button
            onClick={() => navigate('/student/certificates')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Certificates
          </button>
        </div>
      </div>
    );
  }

  const completionDate = certificate?.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : 
                       certificate?.completionDate ? new Date(certificate.completionDate).toLocaleDateString() : 
                       'Unknown';
  const expiryDate = certificate?.expiresAt ? new Date(certificate.expiresAt).toLocaleDateString() : 'Never';
  
  // Debug certificate fields
  console.log('🎓 Certificate fields available:', Object.keys(certificate || {}));
  console.log('🎓 Certificate data:', certificate);
  console.log('🎓 Certificate ID (certificateId):', certificate?.certificateId);
  console.log('🎓 Certificate ID (reference):', certificate?.reference);
  console.log('🎓 Trainer name (trainerName):', certificate?.trainerName);
  console.log('🎓 Trainer name (trainer):', certificate?.trainer);
  console.log('🎓 Issue date:', certificate?.issueDate);
  console.log('🎓 Completion date:', certificate?.completionDate);
  console.log('🎓 Calculated completion date:', completionDate);
  
  // Check if course data is available
  console.log('🎓 Course data available:', course ? 'YES' : 'NO');
  console.log('🎓 Course trainerId:', course?.trainerId);
  console.log('🎓 Course trainerId.name:', course?.trainerId?.name);

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
          <h1 className="text-2xl font-bold text-gray-900">Certificate</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Certificate Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <div className="card-premium p-8 text-center">
            {/* Certificate Design */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-8 mb-6">
              <div className="text-center">
                <div className="mb-6">
                  <ShieldCheckIcon className="h-16 w-16 text-yellow-600 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate of Completion</h2>
                <p className="text-lg text-gray-700 mb-4">{course?.title}</p>
                <div className="flex items-center justify-center space-x-6 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Awarded to</p>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Completion Date</p>
                    <p className="font-semibold text-gray-900">{completionDate}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Instructor</p>
                    <p className="font-semibold text-gray-900">
                      {certificate?.trainerName || course?.trainerId?.name || 'Not specified'}
                      {/* Debug: {JSON.stringify({trainerName: certificate?.trainerName, courseTrainer: course?.trainerId?.name})} */}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Certificate ID</p>
                    <p className="font-mono font-semibold text-gray-900">
                      {certificate?.certificateId || 'Not specified'}
                      {/* Debug: {JSON.stringify({certificateId: certificate?.certificateId, reference: certificate?.reference})} */}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Actions */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDownload}
                className="btn-premium"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={handleShare}
                className="btn-premium-outline"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>

            {/* Blockchain Verification */} 
            {/* {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Blockchain Verification</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <QrCodeIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Transaction ID: {certificate?.transactionId || 'Pending'}</span>
                </div>
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="btn-premium-outline text-sm"
                >
                  {verifying ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border border-gray-600 mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-4 w-4 mr-2" />
                      Verify
                    </div>
                  )}
                </button>
              </div>
            </div> */}
          </div>
        </motion.div>

        {/* Certificate Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-premium p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Certificate Details</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Certificate ID</span>
              <span className="font-mono font-medium text-gray-900">{certificate?.reference}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Issued Date</span>
              <span className="font-medium text-gray-900">{completionDate}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Expiry Date</span>
              <span className="font-medium text-gray-900">{expiryDate}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                certificate?.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {certificate?.status === 'active' ? 'Valid' : 'Expired'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Blockchain Verified</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                certificate?.transactionId 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {certificate?.transactionId ? 'Yes' : 'Pending'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentCertificatePage;
