import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon,
  PlayIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  FireIcon,
  ChartBarIcon,
  BookOpenIcon,
  VideoCameraIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const CourseMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());

  // Mock course data
  const courses = [
    {
      id: 1,
      title: 'Complete React Development Course - 2024',
      description: 'Master React from scratch to advanced concepts including Redux, Next.js, and deployment',
      instructor: 'John Doe',
      instructorAvatar: 'https://via.placeholder.com/40x40',
      rating: 4.8,
      reviews: 2341,
      students: 15234,
      price: 89.99,
      originalPrice: 199.99,
      image: 'https://via.placeholder.com/400x250',
      category: 'development',
      level: 'intermediate',
      duration: '42 hours',
      lessons: 234,
      language: 'English',
      lastUpdated: '2024-01-15',
      bestseller: true,
      hot: true,
      featured: true
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts & ES6+',
      description: 'Deep dive into JavaScript advanced concepts, async programming, and modern ES6+ features',
      instructor: 'Jane Smith',
      instructorAvatar: 'https://via.placeholder.com/40x40',
      rating: 4.9,
      reviews: 1876,
      students: 12456,
      price: 79.99,
      originalPrice: 179.99,
      image: 'https://via.placeholder.com/400x250',
      category: 'development',
      level: 'advanced',
      duration: '38 hours',
      lessons: 198,
      language: 'English',
      lastUpdated: '2024-01-20',
      bestseller: true
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of user interface and user experience design from industry experts',
      instructor: 'Mike Johnson',
      instructorAvatar: 'https://via.placeholder.com/40x40',
      rating: 4.7,
      reviews: 987,
      students: 8234,
      price: 69.99,
      originalPrice: 149.99,
      image: 'https://via.placeholder.com/400x250',
      category: 'design',
      level: 'beginner',
      duration: '28 hours',
      lessons: 156,
      language: 'English',
      lastUpdated: '2024-01-10'
    },
    {
      id: 4,
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js, Express, MongoDB and REST APIs',
      instructor: 'Sarah Wilson',
      instructorAvatar: 'https://via.placeholder.com/40x40',
      rating: 4.6,
      reviews: 1456,
      students: 9876,
      price: 94.99,
      originalPrice: 199.99,
      image: 'https://via.placeholder.com/400x250',
      category: 'development',
      level: 'intermediate',
      duration: '45 hours',
      lessons: 267,
      language: 'English',
      lastUpdated: '2024-01-18',
      hot: true
    },
    {
      id: 5,
      title: 'Digital Marketing Masterclass',
      description: 'Complete guide to digital marketing including SEO, social media, and content marketing',
      instructor: 'David Brown',
      instructorAvatar: 'https://via.placeholder.com/40x40',
      rating: 4.5,
      reviews: 789,
      students: 6789,
      price: 59.99,
      originalPrice: 129.99,
      image: 'https://via.placeholder.com/400x250',
      category: 'marketing',
      level: 'beginner',
      duration: '32 hours',
      lessons: 189,
      language: 'English',
      lastUpdated: '2024-01-12'
    },
    {
      id: 6,
      title: 'Python for Data Science',
      description: 'Learn Python programming with focus on data science, machine learning, and data analysis',
      instructor: 'Emily Davis',
      instructorAvatar: 'https://via.placeholder.com/40x40',
      rating: 4.8,
      reviews: 2134,
      students: 18765,
      price: 99.99,
      originalPrice: 219.99,
      image: 'https://via.placeholder.com/400x250',
      category: 'data-science',
      level: 'intermediate',
      duration: '56 hours',
      lessons: 312,
      language: 'English',
      lastUpdated: '2024-01-22',
      bestseller: true,
      featured: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: BookOpenIcon },
    { id: 'development', name: 'Development', icon: AcademicCapIcon },
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

  const toggleWishlist = (courseId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(courseId)) {
        newWishlist.delete(courseId);
      } else {
        newWishlist.add(courseId);
      }
      return newWishlist;
    });
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesPrice = selectedPrice === 'all' || 
                        (selectedPrice === 'free' && course.price === 0) ||
                        (selectedPrice === 'paid' && course.price > 0) ||
                        (selectedPrice === 'under-50' && course.price < 50) ||
                        (selectedPrice === '50-100' && course.price >= 50 && course.price <= 100) ||
                        (selectedPrice === 'over-100' && course.price > 100);
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.students - a.students;
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

  const CourseCard = ({ course, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-premium overflow-hidden group cursor-pointer"
    >
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Course Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {course.bestseller && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
              <FireIcon className="h-3 w-3" />
              Bestseller
            </span>
          )}
          {course.hot && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
              <SparklesIcon className="h-3 w-3" />
              Hot
            </span>
          )}
          {course.featured && (
            <span className="bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(course.id)}
          className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          <HeartIcon 
            className={`h-4 w-4 ${wishlist.has(course.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
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
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

        <div className="flex items-center mb-3">
          <img 
            src={course.instructorAvatar} 
            alt={course.instructor}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-sm text-gray-700">{course.instructor}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIconSolid
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              {course.rating} ({course.reviews.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            {course.students.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            {course.duration}
          </div>
          <div className="flex items-center">
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            {course.lessons} lessons
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {course.originalPrice > course.price && (
              <span className="text-sm text-gray-400 line-through mr-2">
                ${course.originalPrice}
              </span>
            )}
            <span className="text-xl font-bold text-gray-900">
              ${course.price}
            </span>
          </div>
          <button className="btn-premium text-sm">
            Enroll Now
          </button>
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
              Discover Your Next Learning Adventure
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Explore {courses.length}+ courses from expert instructors
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for courses, topics, or instructors..."
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
                  {sortedCourses.length} Courses Available
                </h2>
                <p className="text-gray-600">
                  Find the perfect course for your learning journey
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

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>

            {sortedCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No courses found
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
