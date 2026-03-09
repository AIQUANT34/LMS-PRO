import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpenIcon,
  PlayIcon,
  TrophyIcon,
  ClockIcon,
  ChartBarIcon,
  FireIcon,
  SparklesIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { formatDuration, calculatePercentage } from '../../utils/helpers';

const StudentDashboard = () => {
  const { user } = useAuthStore();

  // Mock data - replace with actual API calls
  const stats = {
    enrolledCourses: 12,
    completedCourses: 8,
    totalHours: 156,
    certificates: 5,
    currentStreak: 7,
    totalLessons: 234,
    completedLessons: 189,
  };

  const recentCourses = [
    {
      id: 1,
      title: 'Advanced React Development',
      instructor: 'John Doe',
      progress: 75,
      thumbnail: 'https://via.placeholder.com/300x200',
      lastAccessed: '2 hours ago',
      totalLessons: 45,
      completedLessons: 34,
    },
    {
      id: 2,
      title: 'Node.js Masterclass',
      instructor: 'Jane Smith',
      progress: 60,
      thumbnail: 'https://via.placeholder.com/300x200',
      lastAccessed: '1 day ago',
      totalLessons: 38,
      completedLessons: 23,
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      instructor: 'Mike Johnson',
      progress: 90,
      thumbnail: 'https://via.placeholder.com/300x200',
      lastAccessed: '3 days ago',
      totalLessons: 52,
      completedLessons: 47,
    },
  ];

  const achievements = [
    { id: 1, name: 'Fast Learner', description: 'Complete 5 courses in a month', icon: FireIcon, unlocked: true },
    { id: 2, name: 'Dedicated Student', description: '7-day learning streak', icon: SparklesIcon, unlocked: true },
    { id: 3, name: 'Course Master', description: 'Complete 10 courses', icon: TrophyIcon, unlocked: false },
    { id: 4, name: 'Knowledge Seeker', description: 'Complete 100 lessons', icon: AcademicCapIcon, unlocked: true },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-primary-100">
              Ready to continue your learning journey? You have a {stats.currentStreak}-day streak! 🔥
            </p>
          </div>
          <div className="hidden md:block">
            <AcademicCapIcon className="h-24 w-24 text-primary-200" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Enrolled Courses', value: stats.enrolledCourses, icon: BookOpenIcon, color: 'blue' },
          { label: 'Completed', value: stats.completedCourses, icon: TrophyIcon, color: 'green' },
          { label: 'Learning Hours', value: stats.totalHours, icon: ClockIcon, color: 'purple' },
          { label: 'Certificates', value: stats.certificates, icon: SparklesIcon, color: 'yellow' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-premium p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-premium p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Courses Completed</span>
              <span className="font-medium">{calculatePercentage(stats.completedCourses, stats.enrolledCourses)}%</span>
            </div>
            <div className="progress-premium">
              <div 
                className="progress-premium-bar"
                style={{ width: `${calculatePercentage(stats.completedCourses, stats.enrolledCourses)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Lessons Completed</span>
              <span className="font-medium">{calculatePercentage(stats.completedLessons, stats.totalLessons)}%</span>
            </div>
            <div className="progress-premium">
              <div 
                className="progress-premium-bar"
                style={{ width: `${calculatePercentage(stats.completedLessons, stats.totalLessons)}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-premium p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Courses</h2>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="card-premium overflow-hidden hover:shadow-premium-lg"
            >
              <div className="relative">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-xs">
                  {course.progress}% Complete
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                  <span>{course.lastAccessed}</span>
                </div>
                <div className="progress-premium mb-3">
                  <div 
                    className="progress-premium-bar"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <button className="w-full btn-premium-outline text-sm">
                  Continue Learning
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-premium p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`text-center p-4 rounded-xl ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200' 
                  : 'bg-gray-50 border border-gray-200 opacity-50'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-400' 
                  : 'bg-gray-300'
              }`}>
                <achievement.icon className={`h-6 w-6 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <h3 className={`font-semibold text-sm mb-1 ${
                achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {achievement.name}
              </h3>
              <p className={`text-xs ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
