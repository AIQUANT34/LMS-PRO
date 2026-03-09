import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  TrophyIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  PrinterIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const CertificatePage = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Mock certificate data
  const mockCertificate = {
    id: id,
    studentName: 'John Doe',
    courseName: 'Advanced React Patterns',
    instructorName: 'John Smith',
    completionDate: '2024-03-15',
    grade: 'A+',
    score: 95,
    duration: '24 hours',
    certificateId: 'CERT-2024-12345',
    verificationUrl: 'https://lms-pro.com/verify/CERT-2024-12345',
    achievements: [
      'Early Adopter',
      'Top Performer',
      'Perfect Score'
    ]
  };

  useEffect(() => {
    setCertificate(mockCertificate);
  }, [id]);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      // In a real app, this would trigger a download
      console.log('Downloading certificate...');
    }, 2000);
  };

  const handleShare = () => {
    setIsSharing(true);
    setTimeout(() => {
      setIsSharing(false);
      // In a real app, this would open share dialog
      console.log('Sharing certificate...');
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Certificate</h1>
              <p className="text-gray-600">View and share your achievement</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                to="/student/dashboard"
                className="btn-premium-outline"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-premium p-8">
          {/* Certificate Preview */}
          <div className="bg-white rounded-lg shadow-premium-lg p-8 mb-8">
            <div className="border-4 border-double border-blue-600 rounded-lg p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrophyIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{certificate.achievements.length}</div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
              
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-blue-900 mb-2">Certificate of Completion</h1>
                <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
              </div>

              {/* Main Content */}
              <div className="text-center mb-8">
                <p className="text-lg text-gray-700 mb-4">This is to certify that</p>
                <h2 className="text-3xl font-bold text-blue-800 mb-6">{certificate.studentName}</h2>
                
                <div className="max-w-2xl mx-auto mb-6">
                  <p className="text-lg text-gray-700 mb-2">has successfully completed the course</p>
                  <h3 className="text-2xl font-semibold text-blue-700">{certificate.courseName}</h3>
                </div>

                {/* Course Details */}
                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{certificate.grade}</div>
                    <div className="text-sm text-gray-600">Grade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{certificate.score}%</div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{certificate.duration}</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Achievements</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {certificate.achievements.map((achievement, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certificate Info */}
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-600 mb-2">Certificate ID: {certificate.certificateId}</div>
                  <div className="text-sm text-gray-600 mb-4">Completion Date: {certificate.completionDate}</div>
                  <div className="text-sm text-gray-600 mb-4">Instructor: {certificate.instructorName}</div>
                </div>
              </div>

              {/* Share Options */}
              <div className="card-premium p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Achievement</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={certificate.verificationUrl}
                        readOnly
                        className="flex-1 bg-transparent border-none outline-none"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="btn-premium"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    {isDownloading ? 'Downloading...' : 'Download'}
                  </button>
                  <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="btn-premium-outline"
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    {isSharing ? 'Sharing...' : 'Share'}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="btn-premium-outline"
                  >
                    <PrinterIcon className="h-4 w-4 mr-2" />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Section */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Verify Certificate</h3>
            <p className="text-blue-700 text-center">
              Scan the QR code or visit: <br />
              <a href={certificate.verificationUrl} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                {certificate.verificationUrl}
              </a>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            to="/student/dashboard"
            className="btn-premium-outline"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
