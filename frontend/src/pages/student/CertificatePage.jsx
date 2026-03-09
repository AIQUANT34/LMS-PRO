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
  StarIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  PrinterIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const CertificatePage = () => {
  const { courseId } = useParams();
  const certificateRef = useRef(null);
  const [certificate, setCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Mock certificate data
  const mockCertificate = {
    id: 'CERT-2024-REACT-001',
    studentName: 'John Doe',
    courseName: 'Complete React Development Course - 2024',
    instructorName: 'John Smith',
    completionDate: 'March 7, 2024',
    issueDate: 'March 7, 2024',
    courseId: 'REACT-2024-001',
    duration: '42 hours',
    grade: 'A+',
    score: 95,
    totalLessons: 234,
    completedLessons: 234,
    blockchainHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    verificationUrl: 'https://lms-pro.com/verify/CERT-2024-REACT-001',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://lms-pro.com/verify/CERT-2024-REACT-001',
    institutionName: 'LMS Pro Academy',
    institutionLogo: 'https://via.placeholder.com/150x50',
    signature: 'John Smith\nLead React Instructor',
    seal: 'https://via.placeholder.com/100x100',
    achievements: [
      'Completed all course modules',
      'Achieved 95% overall score',
      'Submitted all assignments',
      'Passed final assessment'
    ]
  };

  useEffect(() => {
    // Simulate API call to get certificate data
    setTimeout(() => {
      setCertificate(mockCertificate);
      setIsLoading(false);
    }, 1000);
  }, [courseId]);

  const handleDownload = () => {
    // Generate PDF download
    const element = certificateRef.current;
    if (!element) return;

    // Create a temporary canvas for PDF generation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scale = 2; // Higher resolution
    
    canvas.width = 800 * scale;
    canvas.height = 600 * scale;
    ctx.scale(scale, scale);
    
    // Draw certificate content
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 600);
    
    // Add border
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 760, 560);
    
    // Add title
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', 400, 80);
    
    // Add student name
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('This is to certify that', 400, 140);
    
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#2563eb';
    ctx.fillText(certificate.studentName, 400, 190);
    
    // Add course info
    ctx.font = '18px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText('has successfully completed the course', 400, 240);
    
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#2563eb';
    ctx.fillText(certificate.courseName, 400, 280);
    
    // Add completion details
    ctx.font = '16px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText(`Duration: ${certificate.duration}`, 400, 320);
    ctx.fillText(`Grade: ${certificate.grade} (${certificate.score}%)`, 400, 350);
    ctx.fillText(`Completed: ${certificate.completionDate}`, 400, 380);
    
    // Add verification code
    ctx.font = '12px Arial';
    ctx.fillStyle = '#999999';
    ctx.fillText(`Verification Code: ${certificate.id}`, 400, 540);
    
    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificate.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certificate.verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const CertificateTemplate = () => (
    <div className="bg-white p-8" style={{ minHeight: '600px' }}>
      {/* Certificate Border */}
      <div className="border-8 border-double border-blue-600 rounded-lg p-8 relative">
        {/* Decorative Corner Elements */}
        <div className="absolute top-4 left-4 w-16 h-16 border-4 border-blue-600 rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 w-16 h-16 border-4 border-blue-600 rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-blue-600 rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 border-4 border-blue-600 rounded-br-lg"></div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TrophyIcon className="h-12 w-12 text-yellow-500" />
          </div>
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
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 pt-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600 mb-1">Issued on {certificate.issueDate}</div>
              <div className="text-xs text-gray-500">Certificate ID: {certificate.id}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-800">{certificate.instructorName}</div>
              <div className="text-xs text-gray-600">Lead Instructor</div>
            </div>
          </div>
          
          {/* Verification Section */}
          <div className="mt-6 pt-6 border-t border-gray-300 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <ShieldCheckIcon className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-semibold text-gray-800">Blockchain Verified</div>
                <div className="text-xs text-gray-600">Hash: {certificate.blockchainHash.slice(0, 10)}...</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600">Verify at:</div>
              <div className="text-xs text-blue-600">{certificate.verificationUrl}</div>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="text-6xl font-bold text-blue-600 transform rotate-45">
            {certificate.institutionName}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your certificate...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Course Certificate</h1>
                <p className="text-gray-600">Congratulations on completing your course!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="btn-premium-outline"
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={handleShare}
                className="btn-premium-outline"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Share
              </button>
              <button
                onClick={handleDownload}
                className="btn-premium"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Display */}
      <div className="max-w-6xl mx-auto p-8">
        <div ref={certificateRef} className="bg-white shadow-xl rounded-lg overflow-hidden">
          <CertificateTemplate />
        </div>

        {/* Certificate Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-premium p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrophyIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{certificate.grade}</div>
            <div className="text-sm text-gray-600">Final Grade</div>
          </div>
          
          <div className="card-premium p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{certificate.completedLessons}</div>
            <div className="text-sm text-gray-600">Lessons Completed</div>
          </div>
          
          <div className="card-premium p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{certificate.duration}</div>
            <div className="text-sm text-gray-600">Total Duration</div>
          </div>
          
          <div className="card-premium p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AwardIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{certificate.achievements.length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
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
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {copiedLink ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {copiedLink && (
                <p className="text-sm text-green-600">Link copied to clipboard!</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="flex-1 btn-premium-outline">
              <BuildingOfficeIcon className="h-4 w-4 mr-2" />
              LinkedIn
            </button>
            <button className="flex-1 btn-premium-outline">
              <GlobeAltIcon className="h-4 w-4 mr-2" />
              Facebook
            </button>
            <button className="flex-1 btn-premium-outline">
              <GlobeAltIcon className="h-4 w-4 mr-2" />
              Twitter
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Your Learning Journey</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Advanced React Patterns</div>
                  <div className="text-sm text-gray-600">Take your React skills to the next level</div>
                </div>
              </div>
              <Link to="/courses" className="btn-premium-outline">
                Explore
              </Link>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <StarIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Rate This Course</div>
                  <div className="text-sm text-gray-600">Help others by sharing your experience</div>
                </div>
              </div>
              <Link to={`/courses/${courseId}`} className="btn-premium-outline">
                Rate Course
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
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
                <ShareIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Share Your Certificate</h3>
                <p className="text-gray-600">Celebrate your achievement with friends and colleagues!</p>
              </div>
              
              <div className="space-y-3">
                <button className="w-full btn-premium">
                  <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                  Share on LinkedIn
                </button>
                <button className="w-full btn-premium-outline">
                  <GlobeAltIcon className="h-4 w-4 mr-2" />
                  Share on Facebook
                </button>
                <button className="w-full btn-premium-outline">
                  <GlobeAltIcon className="h-4 w-4 mr-2" />
                  Share on Twitter
                </button>
                <button className="w-full btn-premium-outline">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Copy Link
                </button>
              </div>
              
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full btn-premium-outline"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificatePage;
