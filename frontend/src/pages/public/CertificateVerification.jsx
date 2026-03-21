import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import { 
  CheckCircleIcon,
  XMarkIcon,
  AcademicCapIcon,
  UserIcon,
  CalendarIcon,
  DocumentIcon,
  ExternalLinkIcon,
  QrCodeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const CertificateVerification = () => {
  const { reference } = useParams();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reference) {
      verifyCertificate();
    }
  }, [reference]);

  const verifyCertificate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.get(API_ENDPOINTS.CERTIFICATES.VERIFY(reference));
      setVerification(response.data);
      
      if (response.data.isValid) {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error('Certificate verification failed!');
      }
    } catch (err) {
      console.error('Verification failed:', err);
      setError('Certificate not found or verification failed');
      toast.error('Certificate not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !verification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
          <XMarkIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The certificate reference is invalid or does not exist.'}</p>
          <p className="text-sm text-gray-500">
            Reference: <code className="bg-gray-100 px-2 py-1 rounded">{reference}</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Verification</h1>
          <p className="text-gray-600">Blockchain-powered certificate authentication</p>
        </div>

        {/* Verification Status */}
        <div className={`rounded-xl shadow-sm p-6 mb-8 ${
          verification.isValid 
            ? 'bg-green-50 border-2 border-green-200' 
            : 'bg-red-50 border-2 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {verification.isValid ? (
                <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
              ) : (
                <XMarkIcon className="h-8 w-8 text-red-600 mr-3" />
              )}
              <div>
                <h2 className={`text-xl font-bold ${
                  verification.isValid ? 'text-green-900' : 'text-red-900'
                }`}>
                  {verification.isValid ? '✅ Certificate Verified' : '❌ Verification Failed'}
                </h2>
                <p className={`text-sm ${
                  verification.isValid ? 'text-green-700' : 'text-red-700'
                }`}>
                  {verification.isValid 
                    ? 'This certificate is authentic and blockchain-verified'
                    : 'This certificate could not be verified'
                  }
                </p>
              </div>
            </div>
            
            {verification.blockchainTxId && (
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Blockchain Network</p>
                <p className="text-sm font-medium text-gray-900">{verification.blockchainNetwork}</p>
              </div>
            )}
          </div>
        </div>

        {/* Certificate Details */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Certificate Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certificate Info */}
            <div className="space-y-4">
              <div className="flex items-center">
                <DocumentIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Certificate Reference</p>
                  <p className="font-mono text-sm font-medium text-gray-900">{verification.certificateReference}</p>
                </div>
              </div>

              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-medium text-gray-900">{verification.studentName}</p>
                </div>
              </div>

              <div className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Course Name</p>
                  <p className="font-medium text-gray-900">{verification.courseName}</p>
                </div>
              </div>

              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Completion Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(verification.completionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Blockchain Info */}
            <div className="space-y-4">
              {verification.blockchainTxId && (
                <>
                  <div className="flex items-center">
                    <QrCodeIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Blockchain Transaction ID</p>
                      <p className="font-mono text-xs font-medium text-gray-900 bg-gray-100 p-2 rounded">
                        {verification.blockchainTxId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Verification Status</p>
                      <p className={`font-medium ${
                        verification.isValid ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {verification.isValid ? 'Valid' : 'Invalid'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Blockchain Explorer</p>
                    <a
                      href={verification.blockchainExplorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLinkIcon className="h-4 w-4 mr-2" />
                      View on Cardano Explorer
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Security Information */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🔒 Security Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• This certificate is cryptographically secured on the Cardano blockchain</li>
              <li>• The completion record hash is permanently stored and immutable</li>
              <li>• No personal data is stored on the blockchain, only the verification hash</li>
              <li>• This verification page can be shared to prove authenticity</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            This certificate was issued and verified using LMS-PRO blockchain technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;
