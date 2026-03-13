import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrophyIcon,
  FireIcon,
  CheckCircleIcon,
  SparklesIcon,
  AcademicCapIcon,
  StarIcon,
  ClockIcon,
  BookOpenIcon,
  HeartIcon,
  ShareIcon,
  CalendarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const StudentAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      
      // Mock achievements data
      const mockAchievements = [
        {
          id: 1,
          name: 'First Steps',
          description: 'Complete your first lesson',
          icon: CheckCircleIcon,
          category: 'learning',
          unlocked: true,
          progress: 100,
          unlockedDate: '2024-01-15',
          points: 50
        },
        {
          id: 2,
          name: 'Week Warrior',
          description: '7-day learning streak',
          icon: FireIcon,
          category: 'streak',
          unlocked: true,
          progress: 100,
          unlockedDate: '2024-01-22',
          points: 100
        },
        {
          id: 3,
          name: 'Course Master',
          description: 'Complete a full course',
          icon: TrophyIcon,
          category: 'learning',
          unlocked: false,
          progress: 75,
          unlockedDate: null,
          points: 200
        },
        {
          id: 4,
          name: 'Quick Learner',
          description: 'Complete 5 lessons in one day',
          icon: SparklesIcon,
          category: 'learning',
          unlocked: false,
          progress: 60,
          unlockedDate: null,
          points: 150
        },
        {
          id: 5,
          name: 'Knowledge Seeker',
          description: 'Ask 50 AI questions',
          icon: AcademicCapIcon,
          category: 'engagement',
          unlocked: false,
          progress: 30,
          unlockedDate: null,
          points: 100
        },
        {
          id: 6,
          name: 'Star Student',
          description: 'Maintain 90% average progress',
          icon: StarIcon,
          category: 'performance',
          unlocked: false,
          progress: 85,
          unlockedDate: null,
          points: 250
        },
        {
          id: 7,
          name: 'Time Master',
          description: 'Spend 100 hours learning',
          icon: ClockIcon,
          category: 'engagement',
          unlocked: false,
          progress: 45,
          unlockedDate: null,
          points: 300
        },
        {
          id: 8,
          name: 'Book Worm',
          description: 'Complete 10 courses',
          icon: BookOpenIcon,
          category: 'learning',
          unlocked: false,
          progress: 30,
          unlockedDate: null,
          points: 500
        }
      ];

      setAchievements(mockAchievements);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      setLoading(false);
    }
  };

  const categories = [
    { key: 'all', label: 'All Achievements' },
    { key: 'learning', label: 'Learning' },
    { key: 'streak', label: 'Streaks' },
    { key: 'engagement', label: 'Engagement' },
    { key: 'performance', label: 'Performance' }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-700">Loading Achievements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
              <p className="text-gray-600">Track your learning milestones and earn rewards</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">{unlockedCount}/{achievements.length}</div>
              <div className="text-sm text-gray-600">Unlocked</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{totalPoints}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
                <TrophyIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
                  <div className="text-sm text-gray-600">Completion</div>
                </div>
                <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">7</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <FireIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-xl shadow-sm overflow-hidden ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200'
                  : 'bg-gray-50 border border-gray-200 opacity-75'
              }`}
            >
              {/* Achievement Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-400'
                      : 'bg-gray-300'
                  }`}>
                    <achievement.icon className={`h-8 w-8 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">+{achievement.points}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>

                <h3 className={`text-lg font-semibold mb-2 ${
                  achievement.unlocked ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  {achievement.name}
                </h3>
                <p className={`text-sm mb-4 ${
                  achievement.unlocked ? 'text-gray-600' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                {!achievement.unlocked && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    achievement.unlocked
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}>
                    {achievement.unlocked ? 'Unlocked' : 'In Progress'}
                  </span>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <span className="text-xs text-gray-500">
                      <CalendarIcon className="h-4 w-4 inline mr-1" />
                      {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Badge Overlay */}
              {achievement.unlocked && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <StarIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-12 text-center"
          >
            <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No achievements yet</h3>
            <p className="text-gray-600">Start learning to unlock your first achievement!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentAchievements;
