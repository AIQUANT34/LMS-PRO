import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UsersIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  FireIcon,
  AcademicCapIcon,
  TrophyIcon,
  ClockIcon,
  ArrowRightIcon,
  HeartIcon,
  ShareIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/apiService';
import toast from 'react-hot-toast';

const CommunityPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Posts', icon: ChatBubbleLeftRightIcon },
    { id: 'announcements', name: 'Announcements', icon: TrophyIcon },
    { id: 'discussions', name: 'Discussions', icon: UsersIcon },
    { id: 'study-groups', name: 'Study Groups', icon: AcademicCapIcon },
    { id: 'help', name: 'Help & Support', icon: QuestionMarkCircleIcon }
  ];

  const mockPosts = [
    {
      id: 1,
      category: 'announcements',
      title: 'New AI Features Released!',
      content: 'We\'re excited to announce the release of our new AI-powered learning assistant. Get personalized help 24/7 with course-specific guidance.',
      author: 'ProTrain Team',
      authorRole: 'admin',
      authorAvatar: '/images/team-avatar.jpg',
      likes: 245,
      comments: 32,
      views: 1520,
      tags: ['announcement', 'ai', 'features'],
      pinned: true,
      createdAt: '2024-03-15T10:30:00Z',
      featured: true
    },
    {
      id: 2,
      category: 'discussions',
      title: 'Best Study Techniques for Online Learning?',
      content: 'I\'ve been using ProTrain for 3 months and wanted to share some effective study strategies that have helped me succeed. Here\'s what works for me:\n\n1. **Time Blocking**: Set specific study times and stick to them\n2. **Active Learning**: Take notes while watching videos, not just passive watching\n3. **Practice Quizzes**: Retake quizzes until you get 100%\n4. **Study Groups**: Join virtual study sessions with classmates\n\nWhat techniques work best for you?',
      author: 'Sarah Johnson',
      authorRole: 'student',
      authorAvatar: '/images/student-avatar-1.jpg',
      likes: 89,
      comments: 45,
      views: 567,
      tags: ['study-tips', 'discussion', 'strategies'],
      createdAt: '2024-03-14T14:20:00Z'
    },
    {
      id: 3,
      category: 'study-groups',
      title: 'Study Group: Advanced JavaScript Course',
      content: 'Looking for study partners for the Advanced JavaScript course! We meet every Tuesday and Thursday at 6 PM EST. Currently have 5 members, looking for 2-3 more. We use breakout rooms for problem-solving and share notes via Google Docs.',
      author: 'Mike Chen',
      authorRole: 'student',
      authorAvatar: '/images/student-avatar-2.jpg',
      likes: 34,
      comments: 12,
      views: 234,
      tags: ['study-group', 'javascript', 'collaboration'],
      createdAt: '2024-03-13T09:15:00Z'
    },
    {
      id: 4,
      category: 'help',
      title: 'Video Playback Issues on Mobile',
      content: 'Having trouble playing course videos on your mobile device? Here are some solutions that worked for me:\n\n1. **Update Browser**: Make sure you\'re using the latest version of Chrome/Safari\n2. **Clear Cache**: Clear browser cache and cookies\n3. **Check Connection**: Use WiFi instead of cellular data\n4. **Try Desktop**: If issues persist, try accessing from a computer\n\nStill having problems? Contact support!',
      author: 'Emily Davis',
      authorRole: 'student',
      authorAvatar: '/images/student-avatar-3.jpg',
      likes: 156,
      comments: 28,
      views: 890,
      tags: ['help', 'troubleshooting', 'mobile'],
      createdAt: '2024-03-12T16:45:00Z'
    }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPosts(mockPosts);
      } catch (error) {
        console.error('Error fetching community posts:', error);
        toast.error('Failed to load community posts');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const filteredPosts = posts.filter(post => 
    selectedCategory === 'all' || post.category === selectedCategory
  ).filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLike = async (postId) => {
    try {
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1, userLiked: true }
          : post
      ));
      toast.success('Post liked!');
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      toast.success('Comment added!');
      // In real app, this would make an API call
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg max-w-md">
            <UsersIcon className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="mb-4">
              Please sign in to access the ProTrain community forum and connect with fellow learners.
            </p>
            <Link
              to="/login"
              className="btn-premium block w-full"
            >
              Sign In to Join Community
            </Link>
          </div>
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
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowRightIcon className="h-5 w-5 rotate-180 mr-2" />
                <span className="text-lg font-semibold">Back to Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Community Forum</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search community posts..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Create Post Button */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Post</h3>
                <button className="w-full btn-premium">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  Share Your Thoughts
                </button>
              </div>

              {/* Community Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Members</span>
                    <span className="text-2xl font-bold text-blue-600">12,453</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Now</span>
                    <span className="text-2xl font-bold text-green-600">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Posts Today</span>
                    <span className="text-2xl font-bold text-purple-600">28</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Study Groups</span>
                    <span className="text-2xl font-bold text-orange-600">156</span>
                  </div>
                </div>
              </motion.div>

              {/* Trending Topics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['JavaScript', 'React', 'Python', 'AI Learning', 'Study Tips'].map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Posts Feed */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or browse different categories.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
                      post.featured ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.author}</h3>
                          <p className="text-sm text-gray-600">
                            {post.authorRole} • {formatTimeAgo(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      {post.pinned && (
                        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          <TrophyIcon className="h-3 w-3 mr-1" />
                          Pinned
                        </div>
                      )}
                    </div>

                    {/* Post Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Post Content */}
                    <div className="prose max-w-none text-gray-700 mb-6">
                      {post.content.split('\n').map((line, lineIndex) => (
                        <p key={lineIndex}>{line}</p>
                      ))}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <EyeIcon className="h-4 w-4" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{formatTimeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                            post.userLiked
                              ? 'bg-red-100 text-red-700'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <HeartIcon className={`h-4 w-4 ${post.userLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>
                        
                        <button
                          onClick={() => handleComment(post.id, 'Great post!')}
                          className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          <span>Comment</span>
                        </button>
                        
                        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700">
                          <ShareIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
