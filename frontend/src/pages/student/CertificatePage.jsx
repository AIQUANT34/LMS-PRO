import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  DocumentIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  DownloadIcon,
  ShareIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/apiService';

const StudentCertificatePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const [certificate, setCertificate] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCertificateData();
  }, [courseId, isAuthenticated, navigate]);

  const fetchCertificateData = async () => {
    try {
      const [certificateRes, courseRes] = await Promise.all([
        apiService.get(`/api/certificates/course/${courseId}`),
        apiService.get(`/api/courses/${courseId}`)
      ]);
      
      setCertificate(certificateRes.data);
      setCourse(courseRes.data);
    } catch (error) {
      console.error('Error fetching certificate:', error);
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await apiService.get(`/api/certificates/${certificate.id}/download`);
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.reference}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate');
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
      const response = await apiService.get(`/api/certificates/verify/${certificate.reference}`);
      if (response.data.valid) {
        alert('Certificate is valid and authentic!');
      } else {
        alert('Certificate verification failed!');
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
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

  const completionDate = certificate?.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : 'Unknown';
  const expiryDate = certificate?.expiresAt ? new Date(certificate.expiresAt).toLocaleDateString() : 'Never';

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
                    <p className="font-semibold text-gray-900">{course?.instructorId?.name || 'Not specified'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Certificate ID</p>
                    <p className="font-mono font-semibold text-gray-900">{certificate?.reference}</p>
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
                <DownloadIcon className="h-4 w-4 mr-2" />
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
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
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
            </div>
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
