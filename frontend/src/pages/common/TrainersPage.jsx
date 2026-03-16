import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon,
  StarIcon,
  BookOpenIcon,
  TrophyIcon,
  MapPinIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../../services/apiService';
import toast from 'react-hot-toast';

const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  // Fetch trainers
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from backend, fallback to mock data if API fails
        let response;
        try {
          // First try the test endpoint to verify server is working
          const testResponse = await apiService.get('/test-trainers');
          // Silent test - no console log to prevent HTML errors
          
          // Then try the actual trainers endpoint
          response = await apiService.get('/api/trainers/public');
          
          // Log successful API response for debugging
          console.log('API Response:', response);
        } catch (apiError) {
          // Silent fallback - no console log to prevent HTML errors
          // Mock data for demonstration
          response = {
            data: {
              trainers: [
                {
                  _id: '1',
                  name: 'John Smith',
                  title: 'Senior React Developer',
                  bio: 'Passionate React developer with 8+ years of experience building scalable web applications. Specialized in React, Next.js, and modern JavaScript ecosystems.',
                  avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCBmaWxsPSIjZTVlN2ViIiB3aWR0aD0iODAgaGVpZ2h0PSI4MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZiNzI4MCIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5KUzwvdGV4dD48L3N2Zz4=',
                  rating: 4.8,
                  totalStudents: 1250,
                  totalCourses: 12,
                  experience: 8,
                  location: 'San Francisco, CA',
                  specialties: ['development', 'react', 'javascript'],
                  isVerified: true
                },
                {
                  _id: '2', 
                  name: 'Sarah Johnson',
                  title: 'UI/UX Design Expert',
                  bio: 'Creative designer focused on user-centered design principles. Expert in Figma, Adobe Creative Suite, and modern design tools.',
                  avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCBmaWxsPSIjZTVlN2ViIiB3aWR0aD0iODAgaGVpZ2h0PSI4MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZiNzI4MCIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5VWDwvdGV4dD48L3N2Zz4=',
                  rating: 4.9,
                  totalStudents: 890,
                  totalCourses: 8,
                  experience: 6,
                  location: 'New York, NY',
                  specialties: ['design', 'ui', 'ux'],
                  isVerified: true
                },
                {
                  _id: '3',
                  name: 'Michael Chen',
                  title: 'Full-Stack Developer',
                  bio: 'Versatile developer with expertise in both frontend and backend technologies. Passionate about teaching complex concepts in simple ways.',
                  avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCBmaWxsPSIjZTVlN2ViIiB3aWR0aD0iODAgaGVpZ2h0PSI4MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZiNzI4MCIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5Ob2RlPC90ZXh0Pjwvc3ZnPg==',
                  rating: 4.7,
                  totalStudents: 650,
                  totalCourses: 6,
                  experience: 5,
                  location: 'Austin, TX',
                  specialties: ['development', 'node', 'python'],
                  isVerified: false
                },
                {
                  _id: '4',
                  name: 'Emily Davis',
                  title: 'Marketing Specialist',
                  bio: 'Digital marketing expert with proven track record in growing online businesses. Specialized in SEO, content marketing, and analytics.',
                  avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCBmaWxsPSIjZTVlN2ViIiB3aWR0aD0iODAgaGVpZ2h0PSI4MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZiNzI4MCIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5NS1Q8L3RleHQ+PC9zdmc+',
                  rating: 4.6,
                  totalStudents: 430,
                  totalCourses: 4,
                  experience: 4,
                  location: 'Los Angeles, CA',
                  specialties: ['marketing', 'seo', 'analytics'],
                  isVerified: true
                }
              ]
            }
          };
        }
        
        // Handle both API response formats: response.data.trainers or response.trainers
        const trainersData = response.data?.trainers || response.trainers || [];
        console.log('Setting trainers:', trainersData);
        setTrainers(trainersData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load trainers:', error);
        toast.error('Failed to load trainers');
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // Filter and sort trainers
  const filteredTrainers = trainers
    .filter(trainer => {
      const matchesSearch = trainer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trainer.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trainer.specialties?.some(specialty => 
                             specialty.toLowerCase().includes(searchQuery.toLowerCase())
                           );
      const matchesSpecialty = selectedSpecialty === 'all' || 
                              trainer.specialties?.includes(selectedSpecialty);
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'students':
          return (b.totalStudents || 0) - (a.totalStudents || 0);
        case 'courses':
          return (b.totalCourses || 0) - (a.totalCourses || 0);
        case 'experience':
          return (b.experience || 0) - (a.experience || 0);
        default:
          return 0;
      }
    });

  const specialties = ['all', 'development', 'design', 'marketing', 'business', 'data-science'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Expert Trainers</h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Learn from industry experts with real-world experience
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trainers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Specialty Filter */}
            <div className="lg:w-48">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="rating">Highest Rated</option>
                <option value="students">Most Students</option>
                <option value="courses">Most Courses</option>
                <option value="experience">Most Experience</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Trainers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredTrainers.length === 0 ? (
          <div className="text-center py-16">
            <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No trainers found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTrainers.map((trainer, index) => (
              <motion.div
                key={trainer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Trainer Header */}
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <img
                        src={trainer.avatar || 'https://via.placeholder.com/80x80'}
                        alt={trainer.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      {trainer.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircleIcon className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{trainer.name}</h3>
                      <p className="text-sm text-gray-600">{trainer.title}</p>
                    </div>
                  </div>

                  {/* Trainer Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">{trainer.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                      <p className="text-xs text-gray-600">Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{trainer.totalStudents || 0}</div>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{trainer.totalCourses || 0}</div>
                      <p className="text-xs text-gray-600">Courses</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {trainer.bio || 'Passionate trainer dedicated to helping students achieve their learning goals.'}
                  </p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {trainer.specialties?.slice(0, 3).map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Experience & Location */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{trainer.experience || 0} years exp</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{trainer.location || 'Remote'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                      View Profile
                    </button>
                    <button className="flex-1 border border-indigo-600 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium">
                      View Courses
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainersPage;
