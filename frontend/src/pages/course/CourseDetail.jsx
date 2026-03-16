import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { PLACEHOLDERS } from '../../utils/placeholders';
import { 
  PlayIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon,
  ShareIcon,
  CheckCircleIcon,
  BookOpenIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  DownloadIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  FireIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CertificateIcon,
  UsersIcon,
  CalendarIcon,
  LanguageIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState('not-enrolled'); // 'not-enrolled', 'enrolled', 'completed'
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user and check enrollment status
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    console.log('Current user:', currentUser);
    console.log('Token exists:', !!token);
    console.log('Course ID:', id);
    
    setUser(currentUser);
    
    // Check if user is enrolled in this course
    if (token && currentUser.id) {
      checkEnrollmentStatus();
    }
  }, [id]);

  const checkEnrollmentStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      console.log('Checking enrollment status...');
      const enrollments = await apiService.get('/api/enrollments/my-courses');
      console.log('User enrollments:', enrollments);
      
      const isEnrolled = enrollments.some(enrollment => {
        console.log('Comparing:', enrollment.course._id?.toString(), 'with:', id);
        return enrollment.course._id?.toString() === id;
      });
      
      console.log('Is enrolled in this course:', isEnrolled);
      
      if (isEnrolled) {
        setEnrollmentStatus('enrolled');
        console.log('Setting enrollment status to enrolled');
      } else {
        setEnrollmentStatus('not-enrolled');
        console.log('Setting enrollment status to not-enrolled');
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
      setEnrollmentStatus('not-enrolled');
    }
  };

  const handleEnrollCourse = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await apiService.post(`/api/enrollments/${id}`);
      setEnrollmentStatus('enrolled');
      alert('Enrolled successfully!');
    } catch (error) {
      console.error('Enrollment error:', error);
      if (error.response?.data?.message === 'Already enrolled in this course') {
        setEnrollmentStatus('enrolled');
        alert('You are already enrolled in this course!');
      } else {
        alert(error.response?.data?.message || 'Enrollment failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Mock course data - in real app, fetch from API using id
  const course = {
    id: 1,
    title: 'Complete React Development Course - 2024',
    description: 'Master React from scratch to advanced concepts including Redux, Next.js, and deployment. This comprehensive course covers everything you need to become a professional React developer.',
    trainer: {
      name: 'John Doe',
      title: 'Senior React Developer & Trainer',
      avatar: PLACEHOLDERS.AVATAR('john-doe'),
      bio: 'With over 10 years of experience in web development, John has worked with Fortune 500 companies and startups alike. He specializes in React, Node.js, and modern web technologies.',
      rating: 4.8,
      students: 45678,
      courses: 12,
      expertise: ['React', 'JavaScript', 'Node.js', 'TypeScript', 'Next.js']
    },
    rating: 4.8,
    reviews: 2341,
    students: 15234,
    price: 89.99,
    originalPrice: 199.99,
    image: PLACEHOLDERS.LARGE(),
    previewVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Development',
    level: 'Intermediate',
    duration: '42 hours',
    lessons: 234,
    language: 'English',
    subtitles: ['English', 'Spanish', 'French', 'German'],
    lastUpdated: '2024-01-15',
    certificate: true,
    access: 'Lifetime',
    requirements: [
      'Basic HTML, CSS, and JavaScript knowledge',
      'Understanding of programming concepts',
      'Computer with internet access'
    ],
    whatYouWillLearn: [
      'Build modern, responsive web applications with React',
      'Master React Hooks and advanced patterns',
      'Understand Redux for state management',
      'Learn Next.js for server-side rendering',
      'Deploy applications to production',
      'Work with APIs and databases'
    ],
    targetAudience: [
      'Aspiring web developers',
      'JavaScript developers wanting to learn React',
      'Frontend developers looking to upgrade skills',
      'Students preparing for web development careers'
    ],
    curriculum: [
      {
        id: 1,
        title: 'Introduction to React',
        lessons: [
          { id: 1, title: 'Course Introduction', duration: '15:23', type: 'video', free: true },
          { id: 2, title: 'Setting Up Development Environment', duration: '12:45', type: 'video', free: true },
          { id: 3, title: 'React Fundamentals Quiz', duration: '10 questions', type: 'quiz' },
          { id: 4, title: 'Your First React App', duration: '18:30', type: 'video' }
        ]
      },
      {
        id: 2,
        title: 'React Components & Props',
        lessons: [
          { id: 5, title: 'Understanding Components', duration: '22:15', type: 'video' },
          { id: 6, title: 'Working with Props', duration: '19:40', type: 'video' },
          { id: 7, title: 'Component Best Practices', duration: '16:20', type: 'video' },
          { id: 8, title: 'Components Exercise', duration: '25:10', type: 'video' }
        ]
      },
      {
        id: 3,
        title: 'State Management with Hooks',
        lessons: [
          { id: 9, title: 'Introduction to Hooks', duration: '20:30', type: 'video' },
          { id: 10, title: 'useState Hook Deep Dive', duration: '24:15', type: 'video' },
          { id: 11, title: 'useEffect and Side Effects', duration: '28:45', type: 'video' },
          { id: 12, title: 'Custom Hooks', duration: '21:30', type: 'video' }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        user: 'Sarah Johnson',
        avatar: PLACEHOLDERS.SMALL_AVATAR('sarah-johnson'),
        rating: 5,
        date: '2024-01-10',
        comment: 'Absolutely amazing course! John explains everything clearly and the projects are really practical. Highly recommend!'
      },
      {
        id: 2,
        user: 'Mike Chen',
        avatar: PLACEHOLDERS.SMALL_AVATAR('mike-chen'),
        rating: 4,
        date: '2024-01-05',
        comment: 'Great content and well-structured. Would love more advanced topics in future updates.'
      },
      {
        id: 3,
        user: 'Emily Davis',
        avatar: PLACEHOLDERS.SMALL_AVATAR('emily-davis'),
        rating: 5,
        date: '2023-12-28',
        comment: 'This course helped me land my first React developer job. Thank you John!'
      }
    ],
    relatedCourses: [
      {
        id: 2,
        title: 'Advanced JavaScript Concepts & ES6+',
        trainer: 'Jane Smith',
        rating: 4.9,
        students: 12456,
        price: 79.99,
        image: 'https://via.placeholder.com/300x200'
      },
      {
        id: 3,
        title: 'Node.js Backend Development',
        trainer: 'Sarah Wilson',
        rating: 4.6,
        students: 9876,
        price: 94.99,
        image: 'https://via.placeholder.com/300x200'
      }
    ]
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const toggleLessonExpansion = (moduleId) => {
    setExpandedLesson(expandedLesson === moduleId ? null : moduleId);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIconSolid
            key={i}
            className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-gray-600">{rating}</span>
      </div>
    );
  };

  const CourseStats = () => (
    <div className="flex flex-wrap gap-6 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <StarIcon className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <div className="font-semibold text-gray-900">{course.rating}</div>
          <div className="text-sm text-gray-600">Rating</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <UserGroupIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <div className="font-semibold text-primary-dark">{course.students.toLocaleString()}</div>
          <div className="text-sm text-muted-dark">Students</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <ClockIcon className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <div className="font-semibold text-primary-dark">{course.duration}</div>
          <div className="text-sm text-muted-dark">Duration</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <DocumentTextIcon className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <div className="font-semibold text-primary-dark">{course.lessons}</div>
          <div className="text-sm text-muted-dark">Lessons</div>
        </div>
      </div>
    </div>
  );

  const CourseSidebar = () => (
    <div className="lg:col-span-4">
      <div className="card-premium sticky top-6">
        {/* Course Preview */}
        <div className="relative">
          <img 
            src={course.image} 
            alt={course.title}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-t-xl flex items-center justify-center">
            <button
              onClick={() => setShowVideoModal(true)}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <PlayIcon className="h-8 w-8 text-gray-900 ml-1" />
            </button>
          </div>
        </div>

        {/* Course Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              {course.originalPrice > course.price && (
                <span className="text-sm text-muted-dark line-through">
                  ${course.originalPrice}
                </span>
              )}
              <div className="text-3xl font-bold text-primary-dark">
                ${course.price}
              </div>
            </div>
            <button
              onClick={toggleWishlist}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <HeartIcon 
                className={`h-5 w-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              />
            </button>
          </div>

          {/* Enrollment Status */}
          {enrollmentStatus === 'enrolled' && (
            <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded-lg mb-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="font-semibold">✓ You are enrolled in this course</span>
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg mb-4 text-center">
            <div className="text-sm">
              <strong>Debug Info:</strong><br/>
              Status: {enrollmentStatus}<br/>
              Course ID: {id}<br/>
              User: {user?.name || 'Not logged in'}
            </div>
          </div>

          {/* Enrollment Button */}
          {enrollmentStatus === 'enrolled' ? (
            <button className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg mb-4" disabled>
              ✓ Already Enrolled
            </button>
          ) : (
            <button 
              onClick={handleEnrollCourse}
              disabled={loading}
              className="w-full btn-premium mb-4"
            >
              {loading ? 'Enrolling...' : 'Enroll Now'}
            </button>
          )}

          <div className="text-center text-sm text-muted-dark mb-6">
            30-Day Money-Back Guarantee
          </div>

          {/* Course Features */}
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-medium-contrast">{course.lessons} lessons</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-medium-contrast">{course.duration} of video content</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-medium-contrast">{course.access} access</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-medium-contrast">Certificate of completion</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-medium-contrast">Access on mobile and TV</span>
            </div>
          </div>

          {/* Share */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
            <ShareIcon className="h-5 w-5 text-muted-dark" />
            <span className="text-sm text-muted-dark">Share this course</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={course.previewVideo}
                  className="w-full h-96 rounded-lg"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/courses" className="text-gray-500 hover:text-gray-700">Courses</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{course.title}</span>
          </nav>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Course Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="badge-info">{course.category}</span>
                <span className="badge-warning">{course.level}</span>
                {course.originalPrice > course.price && (
                  <span className="badge-success">Bestseller</span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                {course.description}
              </p>

              <CourseStats />

              {/* Trainer Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <img 
                  src={course.trainer.avatar} 
                  alt={course.trainer.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{course.trainer.name}</div>
                  <div className="text-sm text-gray-600">{course.trainer.title}</div>
                  {renderStars(course.trainer.rating)}
                </div>
                <button className="btn-premium-outline">
                  View Profile
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {['overview', 'curriculum', 'trainer', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* What You'll Learn */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Who this course is for</h2>
                    <ul className="space-y-2">
                      {course.targetAudience.map((audience, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                          <span className="text-gray-700">{audience}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'curriculum' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
                    <div className="text-sm text-gray-600">
                      {course.lessons} lessons • {course.duration} total length
                    </div>
                  </div>

                  {course.curriculum.map((module) => (
                    <div key={module.id} className="card-premium overflow-hidden">
                      <button
                        onClick={() => toggleLessonExpansion(module.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <BookOpenIcon className="h-4 w-4 text-primary-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">{module.title}</div>
                            <div className="text-sm text-gray-600">
                              {module.lessons.length} lessons
                            </div>
                          </div>
                        </div>
                        <svg
                          className={`h-5 w-5 text-gray-400 transform transition-transform ${
                            expandedLesson === module.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {expandedLesson === module.id && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="border-t border-gray-200"
                          >
                            {module.lessons.map((lesson) => (
                              <div key={lesson.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                  {lesson.type === 'video' ? (
                                    <VideoCameraIcon className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                                  )}
                                  <span className="text-sm text-gray-700">{lesson.title}</span>
                                  {lesson.free && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                      Free
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm text-gray-500">{lesson.duration}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'trainer' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-start gap-6">
                    <img 
                      src={course.trainer.avatar} 
                      alt={course.trainer.name}
                      className="w-24 h-24 rounded-full"
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.trainer.name}</h2>
                      <p className="text-gray-600 mb-4">{course.trainer.title}</p>
                      {renderStars(course.trainer.rating)}
                      <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <UsersIcon className="h-4 w-4" />
                          <span>{course.trainer.students.toLocaleString()} students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpenIcon className="h-4 w-4" />
                          <span>{course.trainer.courses} courses</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                    <p className="text-gray-700">{course.trainer.bio}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.trainer.expertise.map((skill, index) => (
                        <span key={index} className="badge-info">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Review Summary */}
                  <div className="card-premium p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">{course.rating}</div>
                        {renderStars(course.rating)}
                        <div className="text-sm text-gray-600 mt-1">
                          {course.reviews.toLocaleString()} ratings
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{course.students.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Students</div>
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {course.reviews.map((review) => (
                      <div key={review.id} className="card-premium p-6">
                        <div className="flex items-start gap-4">
                          <img 
                            src={review.avatar} 
                            alt={review.user}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold text-gray-900">{review.user}</div>
                              <div className="text-sm text-gray-500">{review.date}</div>
                            </div>
                            {renderStars(review.rating)}
                            <p className="text-gray-700 mt-3">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Related Courses */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {course.relatedCourses.map((relatedCourse) => (
                  <div key={relatedCourse.id} className="card-premium overflow-hidden group">
                    <img 
                      src={relatedCourse.image} 
                      alt={relatedCourse.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedCourse.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{relatedCourse.trainer}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <StarIconSolid className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-600 ml-1">
                            {relatedCourse.rating}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          ${relatedCourse.price}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <CourseSidebar />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
