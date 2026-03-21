import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';
import {
  BookOpenIcon,
  PlayIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  FireIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  TrophyIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon,
  HeartIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  VideoCameraIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { useEnrollmentStore } from '../../store/enrollmentStore';
import {
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const CourseMarketplace = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { 
    fetchEnrollments, 
    enroll, 
    isEnrolled, 
    isLoading,
    enrolledCourses 
  } = useEnrollmentStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [enrollingPrograms, setEnrollingPrograms] = useState(new Set());
  const [programs, setPrograms] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Fetch training programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        
        // Fetch real courses data from backend
        const response = await apiService.get(API_ENDPOINTS.COURSES.GET_ALL);
        
        if (!response || !response.courses) {
          throw new Error('Invalid response from courses API');
        }
        
        // Transform backend data to frontend format with lesson fetching
        const transformedPrograms = await Promise.all(
          (response.courses || []).map(async (course) => {
            console.log('🔍 CourseMarketplace Debug - Processing course:', {
              _id: course._id,
              title: course.title,
              typeof_id: typeof course._id
            });
            
            try {
              // Fetch actual lessons data for accurate lesson count
              const lessonsResponse = await apiService.get(API_ENDPOINTS.LEARNING.LESSONS.GET_BY_COURSE(course._id));
              const lessons = lessonsResponse?.data?.lessons || lessonsResponse?.lessons || [];
              
              // Calculate actual lesson count
              const lessonCount = lessons.length;
              
              const transformedCourse = {
                id: course._id,
                title: course.title,
                description: course.description,
                category: course.category,
                level: course.level,
                trainer: course.trainerId?.name || 'Expert Instructor',
                trainerAvatar: course.trainerId?.avatar || 'https://via.placeholder.com/40x40',
                rating: course.ratings?.average || 0,
                reviews: course.ratings?.count || 0,
                employees: course.enrollmentCount || 0,
                price: course.originalPrice || 0,
                originalPrice: course.originalPrice || 0,
                image: course.thumbnail || 'https://via.placeholder.com/400x250',
                duration: course.duration || '10 hours',
                lessons: lessonCount, // Use actual lesson count
                language: 'English',
                lastUpdated: course.updatedAt,
                bestseller: course.enrollmentCount > 100,
                hot: course.enrollmentCount > 50,
                featured: course.enrollmentCount > 200
              };
              
              console.log('🔍 CourseMarketplace Debug - Transformed course:', {
                id: transformedCourse.id,
                typeof_id: typeof transformedCourse.id,
                title: transformedCourse.title
              });
              
              return transformedCourse;
            } catch (lessonError) {
              console.log('🔍 CourseMarketplace Debug - Lesson fetch failed for course:', course._id);
              
              // Fallback to course.totalLessons if lesson fetching fails
              const fallbackCourse = {
                id: course._id,
                title: course.title,
                description: course.description,
                category: course.category,
                level: course.level,
                trainer: course.  trainerId?.name || 'Expert Instructor',
                trainerAvatar: course.trainerId?.avatar || 'https://via.placeholder.com/40x40',
                rating: course.ratings?.average || 0,
                reviews: course.ratings?.count || 0,
                employees: course.enrollmentCount || 0,
                price: course.originalPrice || 0,
                originalPrice: course.originalPrice || 0,
                image: course.thumbnail || 'https://via.placeholder.com/400x250',
                duration: course.duration || '10 hours',
                lessons: course.totalLessons || 0, // Fallback to totalLessons
                language: 'English',
                lastUpdated: course.updatedAt,
                bestseller: course.enrollmentCount > 100,
                hot: course.enrollmentCount > 50,
                featured: course.enrollmentCount > 200
              };
              
              console.log('🔍 CourseMarketplace Debug - Fallback course:', {
                id: fallbackCourse.id,
                typeof_id: typeof fallbackCourse.id,
                title: fallbackCourse.title
              });
              
              return fallbackCourse;
            }
          })
        );
        console.log('🔍 CourseMarketplace Debug - Final programs array:', transformedPrograms.map(p => ({
          id: p.id,
          typeof_id: typeof p.id,
          title: p.title
        })));
        setPrograms(transformedPrograms);
        setLoading(false);
        
        // Fetch user enrollments to check enrollment status
        if (isAuthenticated) {
          try {
            await fetchEnrollments();
          } catch (enrollmentError) {
            console.log('Enrollment fetch failed, continuing without enrollment data:', enrollmentError.message);
            // Don't fail the whole course loading if enrollments fail
          }
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
        setError('Failed to load courses. Please try again later.');
        toast.error('Failed to load courses');
        setLoading(false);
        
        // Set empty state on error
        setPrograms([]);
      }
    };

    fetchPrograms();
  }, [isAuthenticated, fetchEnrollments]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: BookOpenIcon },
    { id: 'development', name: 'Development', icon: BriefcaseIcon },
    { id: 'design', name: 'Design', icon: HeartIcon },
    { id: 'marketing', name: 'Marketing', icon: ChartBarIcon },
    { id: 'data-science', name: 'Data Science', icon: ChartBarIcon },
    { id: 'business', name: 'Business', icon: CurrencyDollarIcon },
    { id: 'photography', name: 'Photography', icon: VideoCameraIcon },
    { id: 'music', name: 'Music', icon: SparklesIcon },
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'free', name: 'Free' },
    { id: 'paid', name: 'Paid' },
    { id: 'under-50', name: 'Under $50' },
    { id: '50-100', name: '$50 - $100' },
    { id: 'over-100', name: 'Over $100' },
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'newest', name: 'Newest' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
  ];

  const toggleWishlist = (programId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(programId)) {
        newWishlist.delete(programId);
      } else {
        newWishlist.add(programId);
      }
      return newWishlist;
    });
  };

  const handleEnrollProgram = async (programId, programTitle) => {
    console.log('🔍 Enrollment Debug - programId:', programId);
    console.log('🔍 Enrollment Debug - programTitle:', programTitle);
    console.log('🔍 Enrollment Debug - typeof programId:', typeof programId);
    
    if (!isAuthenticated) {
      toast.error('Please login to enroll in programs');
      return;
    }

    try {
      await enroll(programId, programTitle);
      toast.success('Enrolled successfully!');
      
      // Optimistic UI update - button will automatically update via store
      
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Enrollment failed!');
      // Error handling is done in the store
    }
  };

  const handleContinueLearning = (courseId) => {
    console.log('🔍 Continue Learning - courseId:', courseId);
    // Navigate to the student course learning page
    navigate(`/student/courses/${courseId}/lesson`);
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.trainer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || program.level === selectedLevel;
    const matchesPrice = selectedPrice === 'all' || 
                        (selectedPrice === 'free' && program.price === 0) ||
                        (selectedPrice === 'paid' && program.price > 0) ||
                        (selectedPrice === 'under-50' && program.price < 50) ||
                        (selectedPrice === '50-100' && program.price >= 50 && program.price <= 100) ||
                        (selectedPrice === 'over-100' && program.price > 100);
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  const sortedPrograms = [...filteredPrograms].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.employees - a.employees;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const ProgramCard = ({ program, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-premium overflow-hidden group cursor-pointer"
    >
      <div className="relative">
        <img 
          src={program.image} 
          alt={program.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Program Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {program.bestseller && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
              <FireIcon className="h-3 w-3 text-white" />
              Bestseller
            </span>
          )}
          {program.hot && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
              <SparklesIcon className="h-3 w-3 text-white" />
              Hot
            </span>
          )}
          {program.featured && (
            <span className="bg-purple-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(program.id)}
          className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          <HeartIcon 
            className={`h-4 w-4 ${wishlist.has(program.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
          />
        </button>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300">
            <PlayIcon className="h-6 w-6 text-gray-900 ml-1" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {program.title}
        </h3>
        
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{program.description}</p>

        <div className="flex items-center mb-3">
          <img 
            src={program.trainerAvatar} 
            alt={program.trainer}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-sm font-medium text-gray-800">{program.trainer}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIconSolid
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(program.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              {program.rating} ({program.reviews.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            {program.employees.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            {program.duration}
          </div>
          <div className="flex items-center">
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            {program.lessons} lessons
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {program.originalPrice > program.price && (
              <span className="text-sm text-gray-500 line-through mr-2">
                ${program.originalPrice}
              </span>
            )}
            <span className="text-xl font-bold text-gray-900">
              ${program.price}
            </span>
          </div>
          {isEnrolled(program.id) ? (
            <button 
              onClick={() => handleContinueLearning(program.id)}
              className="btn-premium text-sm bg-green-600 hover:bg-green-700"
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Continue Learning
            </button>
          ) : (
            <button 
              onClick={() => handleEnrollProgram(program.id, program.title)}
              disabled={isLoading(program.id)}
              className="btn-premium text-sm bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading(program.id) ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enrolling...
                </span>
              ) : (
                'Enroll Now'
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Discover Your Next Training Program
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Explore {programs.length}+ training programs from expert trainers
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for programs, topics, or trainers..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
                >
                  <FunnelIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:w-64 space-y-6"
              >
                <div className="card-premium p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card-premium p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Level</h3>
                  <div className="space-y-2">
                    {levels.map(level => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedLevel === level.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card-premium p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Price</h3>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPrice(range.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedPrice === range.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {range.name}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {sortedPrograms.length} Training Programs Available
                </h2>
                <p className="text-gray-600">
                  Find the perfect program for your professional development
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FunnelIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Courses</h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="btn-premium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Program Grid */}
            {!error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedPrograms.map((program, index) => (
                  <ProgramCard key={program.id} program={program} index={index} />
                ))}
              </div>
            )}

            {!error && sortedPrograms.length === 0 && (
              <div className="text-center py-12">
                <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No training programs found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseMarketplace;
