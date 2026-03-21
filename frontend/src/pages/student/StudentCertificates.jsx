import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import { 
  AcademicCapIcon,
  DocumentIcon,
  CheckCircleIcon,
  ClockIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  QrCodeIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  UserIcon,
  ShieldCheckIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(API_ENDPOINTS.CERTIFICATES.MY);
      setCertificates(response.data || []);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (certificateId, certificateReference) => {
    try {
      setDownloading(certificateId);
      
      console.log('🎓 Starting certificate download:', { certificateId, certificateReference });
      
      // Get the download URL
      const downloadUrl = API_ENDPOINTS.CERTIFICATES.DOWNLOAD(certificateId);
      console.log('🎓 Download URL:', downloadUrl);
      
      // Get auth token for authenticated download
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // Fetch the PDF file
      const response = await fetch(downloadUrl, { headers });
      
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
      link.download = `${certificateReference || 'certificate'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      toast.success('🎉 Certificate downloaded successfully!');
    } catch (error) {
      console.error('🎓 Download failed:', error);
      toast.error(`Download failed: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const shareCertificate = async (certificateId) => {
    try {
      const shareData = {
        platform: 'linkedin',
        message: 'I completed this course!'
      };
      
      const response = await apiService.post(API_ENDPOINTS.CERTIFICATES.SHARE(certificateId), shareData);
      
      if (response.data.shareUrls?.linkedin) {
        window.open(response.data.shareUrls.linkedin, '_blank');
      }
      
      toast.success('Certificate shared!');
    } catch (error) {
      toast.error('Failed to share certificate');
    }
  };

  const verifyCertificate = (certificateReference) => {
    const verifyUrl = API_ENDPOINTS.CERTIFICATES.VERIFY(certificateReference);
    window.open(verifyUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
              <p className="mt-1 text-gray-600">Download and share your course completion certificates</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <AcademicCapIcon className="h-5 w-5" />
              <span>{certificates.length} Certificates Earned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : certificates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <AcademicCapIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Certificates Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Complete courses to earn professional certificates that you can download and share with employers.
            </p>
            <button
              onClick={() => window.location.href = '/student/courses'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Certificate Preview */}
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-6 h-48">
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="text-white">
                        <div className="flex items-center mb-2">
                          <AcademicCapIcon className="h-6 w-6 mr-2 text-yellow-300" />
                          <span className="text-xs font-medium text-yellow-300 uppercase tracking-wide">Certificate</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{cert.courseName || cert.programName}</h3>
                        <p className="text-blue-100 text-sm">Certificate of Completion</p>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-full p-3">
                        <DocumentIcon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <p className="text-sm font-medium">{cert.studentName || 'Student'}</p>
                        <p className="text-xs text-blue-100">Issued {new Date(cert.completionDate).toLocaleDateString()}</p>
                      </div>
                      {cert.isApproved && (
                        <div className="bg-green-500 bg-opacity-20 rounded-full p-2">
                          <ShieldCheckIcon className="h-5 w-5 text-green-300" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {cert.isApproved ? (
                          <div className="flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Verified
                          </div>
                        ) : (
                          <div className="flex items-center text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full text-sm font-medium">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            Pending Approval
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">ID: {cert.certificateId}</span>
                    </div>

                    {/* Course Info */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm">Instructor: {cert.trainerName || 'Instructor'}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm">Completed: {new Date(cert.completionDate).toLocaleDateString()}</span>
                      </div>

                      {cert.isApproved && cert.blockchainTxId && (
                        <div className="flex items-center text-gray-600">
                          <ShieldCheckIcon className="h-4 w-4 mr-2 text-green-500" />
                          <span className="text-sm">Blockchain Verified</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-gray-100">
                      {cert.isApproved ? (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => downloadCertificate(cert._id, cert.certificateReference || cert.certificateId)}
                            disabled={downloading === cert._id}
                            className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                          >
                            {downloading === cert._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Downloading...
                              </>
                            ) : (
                              <>
                                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                Download PDF
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => verifyCertificate(cert.certificateReference || cert.certificateId)}
                            className="flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
                          >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Verify
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center">
                              <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-yellow-800">Pending Instructor Approval</p>
                                <p className="text-xs text-yellow-600 mt-1">
                                  Your certificate is waiting for instructor review
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => verifyCertificate(cert.certificateReference || cert.certificateId)}
                            className="w-full flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
                          >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Check Status
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCertificates;
