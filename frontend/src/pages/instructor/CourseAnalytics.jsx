import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  ChartBarIcon,
  TrendingUpIcon,
  UsersIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  PlayIcon,
  EyeIcon,
  CalendarIcon,
  ArrowRightIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  AcademicCapIcon,
  FireIcon,
  SparklesIcon,
  BeakerIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
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
  GlobeAltIcon,
  ServerIcon,
  FolderIcon,
  ShieldCheckIcon,
  KeyIcon,
  FlagIcon,
  HeartIcon,
  BellIcon,
  Cog6TootIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ArrowRightIcon as ArrowRightIconOutline,
  PlusIcon,
  MinusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  TruckIcon,
  PackageIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  ChartPieIcon,
  ChartLineIcon,
  CubeIcon,
  CircleStackIcon,
  ArchiveBoxIcon,
  InboxIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const CourseAnalytics = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Mock course data
  const mockCourseData = {
    id: courseId,
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
    language: 'English',
    duration: 24, // hours
    lessons: 45,
    enrolledStudents: 1234,
    completedStudents: 567,
    rating: 4.8,
    reviews: 234,
    thumbnail: 'https://via.placeholder.com/400x225',
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-01',
    publishedAt: '2024-01-20'
  };

  // Mock analytics data
  const mockAnalyticsData = {
    overview: {
      totalRevenue: 45678.90,
      thisMonthRevenue: 15678.90,
      totalEnrollments: 1234,
      thisMonthEnrollments: 156,
      completionRate: 78.5,
      averageRating: 4.8,
      averageTimeToComplete: 18.5,
      refundRate: 2.3,
      engagementScore: 85.2
    },
    revenue: [
      { month: 'Jan', revenue: 12500, enrollments: 142, avgPerStudent: 88.03 },
      { month: 'Feb', revenue: 14500, enrollments: 167, avgPerStudent: 86.83 },
      { month: 'Mar', revenue: 15678.90, enrollments: 156, avgPerStudent: 100.50 },
      { month: 'Apr', revenue: 16700, enrollments: 189, avgPerStudent: 88.36 },
      { month: 'May', revenue: 17800, enrollments: 201, avgPerStudent: 88.56 },
      { month: 'Jun', revenue: 18900, enrollments: 223, avgPerStudent: 84.75 }
    ],
    enrollments: [
      { date: '2024-03-01', enrollments: 12, completions: 3, refunds: 0 },
      { date: '2024-03-02', enrollments: 18, completions: 5, refunds: 1 },
      { date: '2024-03-03', enrollments: 15, completions: 7, refunds: 0 },
      { date: '2024-03-04', enrollments: 22, completions: 9, refunds: 0 },
      { date: '2024-03-05', enrollments: 25, completions: 11, refunds: 1 },
      { date: '2024-03-06', enrollments: 28, completions: 14, refunds: 0 },
      { date: '2024-03-07', enrollments: 36, completions: 18, refunds: 0 }
    ],
    engagement: {
      lessonViews: 45678,
      averageWatchTime: 12.5, // minutes
      completionRate: 78.5,
      dropOffPoints: [
        { lesson: 5, dropOffRate: 15.2, reason: 'Content difficulty' },
        { lesson: 12, dropOffRate: 12.8, reason: 'Time constraints' },
        { lesson: 18, dropOffRate: 18.5, reason: 'Technical issues' }
      ],
      interactionRate: 65.3,
      discussionPosts: 234,
      averageResponseTime: 2.5 // hours
    },
    demographics: {
      ageGroups: [
        { range: '18-24', percentage: 35.2 },
        { range: '25-34', percentage: 42.8 },
        { range: '35-44', percentage: 15.6 },
        { range: '45+', percentage: 6.4 }
      ],
      locations: [
        { country: 'United States', students: 456 },
        { country: 'United Kingdom', students: 234 },
        { country: 'Canada', students: 123 },
        { country: 'Australia', students: 89 },
        { country: 'Germany', students: 67 },
        { country: 'India', students: 156 }
      ],
      professions: [
        { profession: 'Software Developer', percentage: 45.3 },
        { profession: 'Designer', percentage: 12.8 },
        { profession: 'Product Manager', percentage: 8.5 },
        { profession: 'Data Scientist', percentage: 15.2 },
        { profession: 'Student', percentage: 18.2 }
      ]
    },
    feedback: {
      averageRating: 4.8,
      totalReviews: 234,
      ratingDistribution: [
        { rating: 5, count: 156 },
        { rating: 4, count: 67 },
        { rating: 3, count: 8 },
        { rating: 2, count: 2 },
        { rating: 1, count: 1 }
      ],
      commonThemes: [
        { theme: 'Comprehensive content', mentions: 89 },
        { theme: 'Expert instructor', mentions: 76 },
        { theme: 'Practical examples', mentions: 65 },
        { theme: 'Great support', mentions: 54 }
      ],
      improvementSuggestions: [
        { suggestion: 'More advanced topics', mentions: 23 },
        { suggestion: 'More practice exercises', mentions: 18 },
        { suggestion: 'Better video quality', mentions: 12 }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourseData(mockCourseData);
      setAnalyticsData(mockAnalyticsData);
      setIsLoading(false);
    }, 1000);
  }, [courseId]);

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'all', label: 'All time' }
  ];

  const metrics = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'revenue', label: 'Revenue', icon: CurrencyDollarIcon },
    { id: 'enrollments', label: 'Enrollments', icon: UsersIcon },
    { id: 'engagement', label: 'Engagement', icon: EyeIcon },
    { id: 'demographics', label: 'Demographics', icon: GlobeAltIcon },
    { id: 'feedback', label: 'Feedback', icon: StarIcon }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const OverviewMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.overview.totalRevenue)}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <TrendingUpIcon className="h-4 w-4" />
          <span>+{formatCurrency(analyticsData.overview.thisMonthRevenue)} this month</span>
        </div>
      </div>

      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <UsersIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalEnrollments.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Enrollments</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <TrendingUpIcon className="h-4 w-4" />
          <span>+{analyticsData.overview.thisMonthEnrollments} this month</span>
        </div>
      </div>

      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <StarIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{analyticsData.overview.averageRating}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <StarIconSolid className="h-4 w-4" />
          <span>{analyticsData.overview.totalReviews} reviews</span>
        </div>
      </div>

      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <BookOpenIcon className="h-6 w-6 text-orange-600" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{formatPercentage(analyticsData.overview.completionRate)}</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-orange-600 text-sm">
          <ClockIcon className="h-4 w-4" />
          <span>{analyticsData.overview.averageTimeToComplete} days avg</span>
        </div>
      </div>
    </div>
  );

  const RevenueChart = () => (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
      <div className="space-y-4">
        {analyticsData.revenue.map((data, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{data.month}</div>
              <div className="text-sm text-gray-600">{data.enrollments} enrollments</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{formatCurrency(data.revenue)}</div>
              <div className="text-sm text-gray-600">{formatCurrency(data.avgPerStudent)} avg</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EnrollmentChart = () => (
    <div className="card-premium p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trends</h3>
      <div className="space-y-4">
        {analyticsData.enrollments.map((data, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{data.date}</div>
              <div className="text-sm text-gray-600">
                {data.completions} completed ({formatPercentage((data.completions / data.enrollments) * 100)})
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{data.enrollments}</div>
              <div className="text-sm text-red-600">{data.refunds} refunds</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EngagementMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <EyeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{analyticsData.engagement.lessonViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{analyticsData.engagement.averageWatchTime}m</div>
              <div className="text-sm text-gray-600">Avg. Watch Time</div>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{formatPercentage(analyticsData.engagement.completionRate)}</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ChatBubbleLeftIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{formatPercentage(analyticsData.engagement.interactionRate)}</div>
              <div className="text-sm text-gray-600">Interaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Drop-off Points</h3>
        <div className="space-y-3">
          {analyticsData.engagement.dropOffPoints.map((point, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Lesson {point.lesson}</div>
                <div className="text-sm text-gray-600">{point.reason}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-red-600">{formatPercentage(point.dropOffRate)}</div>
                <div className="text-sm text-gray-600">drop-off</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DemographicsChart = () => (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
        <div className="space-y-3">
          {analyticsData.demographics.ageGroups.map((group, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">{group.range}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${group.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{group.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
        <div className="space-y-3">
          {analyticsData.demographics.locations.map((location, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <GlobeAltIcon className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{location.country}</span>
              </div>
              <div className="text-sm text-gray-600">{location.students} students</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professions</h3>
        <div className="space-y-3">
          {analyticsData.demographics.professions.map((profession, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <BriefcaseIcon className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{profession.profession}</span>
              </div>
              <span className="text-sm text-gray-600">{profession.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FeedbackAnalysis = () => (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {analyticsData.feedback.ratingDistribution.map((rating, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">{rating.rating} stars</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${(rating.count / analyticsData.feedback.totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{rating.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Themes</h3>
        <div className="space-y-3">
          {analyticsData.feedback.commonThemes.map((theme, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{theme.theme}</span>
              <span className="text-sm text-gray-600">{theme.mentions} mentions</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvement Suggestions</h3>
        <div className="space-y-3">
          {analyticsData.feedback.improvementSuggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-orange-900">{suggestion.suggestion}</span>
              <span className="text-sm text-orange-600">{suggestion.mentions} mentions</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Analytics</h1>
              <p className="text-gray-600">{courseData?.title}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              
              <button className="btn-premium-outline">
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export
              </button>
              
              <button className="btn-premium-outline">
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Navigation */}
        <div className="flex space-x-1 mb-8 overflow-x-auto">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                selectedMetric === metric.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <metric.icon className="h-4 w-4" />
              {metric.label}
            </button>
          ))}
        </div>

        {/* Metric Content */}
        <div className="space-y-8">
          {selectedMetric === 'overview' && <OverviewMetrics />}
          {selectedMetric === 'revenue' && <RevenueChart />}
          {selectedMetric === 'enrollments' && <EnrollmentChart />}
          {selectedMetric === 'engagement' && <EngagementMetrics />}
          {selectedMetric === 'demographics' && <DemographicsChart />}
          {selectedMetric === 'feedback' && <FeedbackAnalysis />}
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics;
