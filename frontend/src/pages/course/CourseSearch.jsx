import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  BookOpenIcon,
  TrophyIcon,
  ArrowUpTrayIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  SparklesIcon,
  BeakerIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  LinkIcon,
  CameraIcon,
  VideoCameraIcon,
  PhotoIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  DocumentIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  BuildingOfficeIcon,
  TruckIcon,
  CubeIcon,
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
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  StarIcon,
  CogIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CalendarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const CourseSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    price: 'all',
    rating: 'all',
    duration: 'all'
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const mockCourses = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      description: 'Master advanced React patterns and techniques for building scalable applications',
      instructor: {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@example.com',
        avatar: 'https://via.placeholder.com/100x100'
      },
      category: 'Development',
      level: 'Advanced',
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.8,
      reviews: 234,
      enrolledStudents: 1234,
      thumbnail: 'https://via.placeholder.com/400x225',
      previewVideo: 'https://example.com/preview.mp4',
      tags: ['React', 'JavaScript', 'Frontend', 'Advanced'],
      duration: 24, // hours
      lessons: 45,
      language: 'English',
      lastUpdated: '2024-03-01',
      isFeatured: true,
      isBestseller: true,
      isNew: false
    },
    {
      id: 2,
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the fundamentals of user interface and user experience design',
      instructor: {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        avatar: 'https://via.placeholder.com/100x100'
      },
      category: 'Design',
      level: 'Beginner',
      price: 49.99,
      originalPrice: 79.99,
      rating: 4.6,
      reviews: 123,
      enrolledStudents: 890,
      thumbnail: 'https://via.placeholder.com/400x225',
      previewVideo: 'https://example.com/preview.mp4',
      tags: ['UI', 'UX', 'Design', 'Figma'],
      duration: 16,
      lessons: 32,
      language: 'English',
      lastUpdated: '2024-02-28',
      isFeatured: false,
      isBestseller: false,
      isNew: true
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      description: 'Complete guide to digital marketing strategies and techniques',
      instructor: {
        id: 3,
        name: 'Mike Wilson',
        email: 'mike.wilson@example.com',
        avatar: 'https://via.placeholder.com/100x100'
      },
      category: 'Marketing',
      level: 'Intermediate',
      price: 69.99,
      originalPrice: 99.99,
      rating: 4.5,
      reviews: 89,
      enrolledStudents: 567,
      thumbnail: 'https://via.placeholder.com/400x225',
      previewVideo: 'https://example.com/preview.mp4',
      tags: ['Marketing', 'SEO', 'Social Media', 'Analytics'],
      duration: 20,
      lessons: 38,
      language: 'English',
      lastUpdated: '2024-03-01',
      isFeatured: true,
      isBestseller: false,
      isNew: false
    }
  ];

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const results = mockCourses.filter(course =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setIsLoading(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const CourseCard = ({ course }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-6 hover:shadow-premium-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-16 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
            {course.category}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">
            {course.level}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Instructor</div>
          <div className="font-medium text-gray-900 text-sm">{course.instructor.name}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Price</div>
          <div className="font-medium text-gray-900 text-sm">
            ${course.price}
            {course.originalPrice > course.price && (
              <span className="text-gray-500 line-through ml-1">${course.originalPrice}</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Students</div>
          <div className="font-medium text-gray-900 text-sm">{course.enrolledStudents.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Rating</div>
          <div className="flex items-center gap-1">
            <StarIconSolid className="h-4 w-4 text-yellow-400" />
            <span className="font-medium text-gray-900 text-sm">{course.rating}</span>
            <span className="text-gray-500 text-sm">({course.reviews})</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {course.duration}h • {course.lessons} lessons
          </span>
          {course.isFeatured && (
            <StarIcon className="h-4 w-4 text-yellow-500" />
          )}
          {course.isBestseller && (
            <FireIcon className="h-4 w-4 text-orange-500" />
          )}
          {course.isNew && (
            <SparklesIcon className="h-4 w-4 text-blue-500" />
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            to={`/courses/${course.id}`}
            className="btn-premium-outline text-sm"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Search</h1>
              <p className="text-gray-600">Find the perfect course for your learning journey</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for courses, instructors, or topics..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              autoFocus
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-premium-outline"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="rating">Sort by Rating</option>
                <option value="price-low">Sort by Price (Low to High)</option>
                <option value="price-high">Sort by Price (High to Low)</option>
                <option value="newest">Sort by Newest</option>
                <option value="popular">Sort by Popular</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-4 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="data-science">Data Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={filters.level}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <select
                    value={filters.price}
                    onChange={(e) => handleFilterChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                    <option value="0-50">$0 - $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100+">$100+</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Search Results */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching courses...</p>
            </div>
          ) : searchQuery && searchResults.length > 0 ? (
            <>
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  Found {searchResults.length} courses for "{searchQuery}"
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          ) : searchQuery && searchResults.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start searching for courses</h3>
              <p className="text-gray-600">Enter a search term above to find courses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseSearch;
