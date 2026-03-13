import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CreditCardIcon,
  WalletIcon,
  FunnelIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const TrainerEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  // Mock data
  const mockEarnings = {
    overview: {
      totalEarnings: 45678,
      currentMonth: 12567,
      lastMonth: 10890,
      pendingEarnings: 2345,
      withdrawnEarnings: 43333,
      averageMonthly: 15226,
      projectedAnnual: 182712
    },
    monthlyEarnings: [
      { month: 'Jan', earnings: 12000, students: 234, courses: 8 },
      { month: 'Feb', earnings: 15000, students: 289, courses: 8 },
      { month: 'Mar', earnings: 13500, students: 267, courses: 8 },
      { month: 'Apr', earnings: 18000, students: 345, courses: 8 },
      { month: 'May', earnings: 22000, students: 412, courses: 8 },
      { month: 'Jun', earnings: 25678, students: 456, courses: 8 }
    ],
    courseEarnings: [
      {
        id: 1,
        title: 'Complete React Development Course',
        earnings: 23456,
        students: 1523,
        price: 89.99,
        growth: 12.5
      },
      {
        id: 2,
        title: 'Advanced React Development',
        earnings: 15678,
        students: 876,
        price: 129.99,
        growth: 8.3
      },
      {
        id: 3,
        title: 'Node.js Backend Development',
        earnings: 8765,
        students: 432,
        price: 99.99,
        growth: -2.1
      }
    ],
    transactions: [
      {
        id: 1,
        date: '2024-06-15',
        type: 'course_sale',
        amount: 89.99,
        course: 'Complete React Development Course',
        student: 'John Doe',
        status: 'completed'
      },
      {
        id: 2,
        date: '2024-06-14',
        type: 'course_sale',
        amount: 129.99,
        course: 'Advanced React Development',
        student: 'Jane Smith',
        status: 'completed'
      },
      {
        id: 3,
        date: '2024-06-13',
        type: 'withdrawal',
        amount: -5000,
        description: 'Monthly withdrawal',
        status: 'processing'
      }
    ],
    paymentMethods: [
      { method: 'Bank Transfer', percentage: 60, amount: 27407 },
      { method: 'PayPal', percentage: 30, amount: 13703 },
      { method: 'Credit Card', percentage: 10, amount: 4568 }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setEarnings(mockEarnings);
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

  const monthlyGrowth = ((earnings.overview.currentMonth - earnings.overview.lastMonth) / earnings.overview.lastMonth * 100).toFixed(1);

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
              <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
              <p className="text-gray-600 mt-2">Track your revenue and manage payments</p>
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
              <button className="btn-premium">
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export Report
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
                  <div className="text-2xl font-bold text-gray-900">${earnings.overview.totalEarnings.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span>+${earnings.overview.currentMonth.toLocaleString()} this month</span>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BanknotesIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${earnings.overview.pendingEarnings.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <CalendarIcon className="h-4 w-4" />
                <span>Clearing in 3 days</span>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <WalletIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${earnings.overview.withdrawnEarnings.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Withdrawn</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <CreditCardIcon className="h-4 w-4" />
                <span>Available now</span>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${earnings.overview.averageMonthly.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Monthly Average</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span>Steady growth</span>
              </div>
            </div>
          </div>

          {/* Earnings Chart */}
          <div className="card-premium p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings Trend</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {earnings.monthlyEarnings.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                    style={{ height: `${(data.earnings / 26000) * 100}%` }}
                  />
                  <span className="text-xs text-gray-600">{data.month}</span>
                  <span className="text-xs font-medium text-gray-700">${data.earnings.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Earnings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings by Course</h3>
              <div className="space-y-4">
                {earnings.courseEarnings.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-600">
                        {course.students} students × ${course.price}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">${course.earnings.toLocaleString()}</div>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-4">
                {earnings.paymentMethods.map((method, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{method.method}</span>
                      <span className="text-sm text-gray-600">${method.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${method.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{method.percentage}% of total</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600">{transaction.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'course_sale' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type.replace('_', ' ').charAt(0).toUpperCase() + transaction.type.replace('_', ' ').slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {transaction.course || transaction.description}
                        {transaction.student && (
                          <div className="text-xs text-gray-500">Student: {transaction.student}</div>
                        )}
                      </td>
                      <td className={`py-3 px-4 font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainerEarnings;
