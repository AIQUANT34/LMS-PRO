import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import { 
  CheckCircleIcon, 
  XMarkIcon, 
  ClockIcon, 
  UserIcon,
  AcademicCapIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const CertificateApprovals = () => {
  const [pendingCertificates, setPendingCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(API_ENDPOINTS.CERTIFICATES.PENDING_APPROVALS);
      
      // 🔥 FIX: Certificates are in response directly, not response.data
      const certificates = Array.isArray(response) ? response : (response.data || []);
      console.log('🎯 Certificate approvals loaded:', certificates.length, 'certificates');
      
      setPendingCertificates(certificates);
    } catch (error) {
      console.error('Failed to fetch pending approvals:', error);
      toast.error('Failed to load pending certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (certificateId) => {
    try {
      setApproving(certificateId);
      
      const response = await apiService.patch(API_ENDPOINTS.CERTIFICATES.APPROVE(certificateId));
      
      toast.success(`✅ Certificate approved and submitted to blockchain!`);
      
      // Remove from pending list
      setPendingCertificates(prev => 
        prev.filter(cert => cert._id !== certificateId)
      );
      
      console.log('Certificate approved successfully:', certificateId);
      console.log('Approval response:', response);
    } catch (error) {
      console.error('Approval failed:', error);
      toast.error(error.response?.data?.message || 'Approval failed');
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (certificateId) => {
    try {
      // TODO: Implement rejection endpoint
      toast.info('Rejection feature coming soon');
    } catch (error) {
      toast.error('Rejection failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Approvals</h1>
        <p className="text-gray-600">Review and approve student certificates for blockchain verification</p>
      </div>

      {pendingCertificates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
          <p className="text-gray-500">All certificates are up to date!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingCertificates.map((certificate) => (
            <div key={certificate._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{certificate.studentName}</h3>
                      <p className="text-sm text-gray-500">{certificate.studentEmail}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <AcademicCapIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm">{certificate.courseTitle || certificate.courseName}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm">
                        Completed: {new Date(certificate.completionDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm">
                        Submitted: {new Date(certificate.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Ready for Approval:</strong> This certificate will be submitted to the Cardano blockchain 
                      for permanent verification upon approval.
                    </p>
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  <button
                    onClick={() => handleApprove(certificate._id)}
                    disabled={approving === certificate._id}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {approving === certificate._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Approve
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleReject(certificate._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificateApprovals;
