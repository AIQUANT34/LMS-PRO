import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  TrendingUpIcon,
  UserGroupIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  StarIcon,
  ClockIcon,
  ArrowPathIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const TrainerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data
  const mockAnalytics = {
    overview: {
      totalRevenue: 45678,
      thisMonthRevenue: 12567,
      totalStudents: 1234,
      activeStudents: 892,
      totalCourses: 8,
      averageRating: 4.7,
      completionRate: 78.5,
      engagementRate: 85.2
    },
    revenueChart: [
      { month: 'Jan', revenue: 12000, students: 234 },
      { month: 'Feb', revenue: 15000, students: 289 },
      { month: 'Mar', revenue: 13500, students: 267 },
      { month: 'Apr', revenue: 18000, students: 345 },
      { month: 'May', revenue: 22000, students: 412 },
      { month: 'Jun', revenue: 25678, students: 456 }
    ],
    topCourses: [
      {
        id: 1,
        title: 'Complete React Development Course',
        students: 1523,
        revenue: 23456,
        rating: 4.8,
        completionRate: 82.3,
        growth: 12.5
      },
      {
        id: 2,
        title: 'Advanced React Development',
        students: 876,
        revenue: 15678,
        rating: 4.9,
        completionRate: 79.1,
        growth: 8.3
      },
      {
        id: 3,
        title: 'Node.js Backend Development',
        students: 432,
        revenue: 8765,
        rating: 4.6,
        completionRate: 76.8,
        growth: -2.1
      }
    ],
    studentProgress: [
      { course: 'React Development', completed: 456, inProgress: 234, notStarted: 89 },
      { course: 'Advanced React', completed: 234, inProgress: 189, notStarted: 67 },
      { course: 'Node.js Backend', completed: 123, inProgress: 145, notStarted: 34 }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-2">Track your course performance and student engagement</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${analytics.overview.totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span>+${analytics.overview.thisMonthRevenue.toLocaleString()} this month</span>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{analytics.overview.totalStudents.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span>{analytics.overview.activeStudents} active</span>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <StarIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{analytics.overview.averageRating}</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <StarIcon className="h-4 w-4" />
                <span>Excellent feedback</span>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{analytics.overview.completionRate}%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <TrendingUpIcon className="h-4 w-4" />
                <span>Above average</span>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {analytics.revenueChart.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${(data.revenue / 26000) * 100}%` }}
                    />
                    <span className="text-xs text-gray-600">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Growth</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {analytics.revenueChart.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                      style={{ height: `${(data.students / 500) * 100}%` }}
                    />
                    <span className="text-xs text-gray-600">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Courses */}
          <div className="card-premium p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Courses</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Course</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Students</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Revenue</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Rating</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Completion</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topCourses.map((course) => (
                    <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{course.title}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{course.students.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-600">${course.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                          <span className="text-gray-600">{course.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{course.completionRate}%</td>
                      <td className="py-3 px-4">
                        <div className={`flex items-center gap-1 text-sm ${
                          course.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {course.growth > 0 ? (
                            <ArrowTrendingUpIcon className="h-4 w-4" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4" />
                          )}
                          <span>{Math.abs(course.growth)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Progress */}
          <div className="card-premium p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Progress by Course</h3>
            <div className="space-y-4">
              {analytics.studentProgress.map((progress, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{progress.course}</span>
                    <span className="text-sm text-gray-500">
                      {progress.completed} completed, {progress.inProgress} in progress
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-l-full"
                      style={{ width: `${(progress.completed / (progress.completed + progress.inProgress + progress.notStarted)) * 100}%` }}
                    />
                    <div 
                      className="bg-yellow-500 h-2"
                      style={{ 
                        width: `${(progress.inProgress / (progress.completed + progress.inProgress + progress.notStarted)) * 100}%`,
                        marginLeft: `-${(progress.completed / (progress.completed + progress.inProgress + progress.notStarted)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainerAnalytics;
