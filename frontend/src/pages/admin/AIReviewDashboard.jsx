import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import apiService from '../../services/apiService';

const AIReviewDashboard = () => {
  const [activeTab, setActiveTab] = useState('unreviewed');
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLogs, setSelectedLogs] = useState(new Set());

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'analytics') {
        const response = await apiService.get('/ai-review/analytics');
        setAnalytics(response.data);
      } else {
        const endpoint = activeTab === 'unreviewed' ? '/ai-review/unreviewed' : '/ai-review/flagged';
        const response = await apiService.get(endpoint);
        setLogs(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch AI review data');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (logId, reviewed, flagged, reviewNotes) => {
    try {
      await apiService.put(`/ai-review/review/${logId}`, {
        reviewed,
        flagged,
        reviewNotes
      });
      
      toast.success('AI interaction reviewed successfully');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to review AI interaction');
    }
  };

  const handleBulkReview = async () => {
    if (selectedLogs.size === 0) {
      toast.warning('Please select logs to review');
      return;
    }

    try {
      await apiService.post('/ai-review/bulk-review', {
        logIds: Array.from(selectedLogs),
        reviewed: true,
        flagged: false,
        reviewNotes: 'Bulk approved'
      });
      
      toast.success(`Reviewed ${selectedLogs.size} interactions`);
      setSelectedLogs(new Set());
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to bulk review');
    }
  };

  const toggleLogSelection = (logId) => {
    const newSelected = new Set(selectedLogs);
    if (newSelected.has(logId)) {
      newSelected.delete(logId);
    } else {
      newSelected.add(logId);
    }
    setSelectedLogs(newSelected);
  };

  const selectAll = () => {
    if (selectedLogs.size === logs.length) {
      setSelectedLogs(new Set());
    } else {
      setSelectedLogs(new Set(logs.map(log => log._id)));
    }
  };

  const renderAnalytics = () => {
    if (!analytics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-sm font-medium text-gray-500">Total Interactions</h3>
          <p className="text-2xl font-bold text-blue-600">{analytics.totalInteractions}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-sm font-medium text-gray-500">Unreviewed</h3>
          <p className="text-2xl font-bold text-orange-600">{analytics.unreviewedCount}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-sm font-medium text-gray-500">Flagged</h3>
          <p className="text-2xl font-bold text-red-600">{analytics.flaggedCount}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-sm font-medium text-gray-500">Review Rate</h3>
          <p className="text-2xl font-bold text-green-600">{analytics.reviewRate}%</p>
        </motion.div>
      </div>
    );
  };

  const renderLogItem = (log) => (
    <motion.div
      key={log._id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow p-6 mb-4 border-l-4 ${
        log.flagged ? 'border-red-500' : 'border-blue-500'
      }"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={selectedLogs.has(log._id)}
            onChange={() => toggleLogSelection(log._id)}
            className="rounded border-gray-300"
          />
          <div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              log.aiFeature === 'tutor' ? 'bg-blue-100 text-blue-800' :
              log.aiFeature === 'quiz' ? 'bg-green-100 text-green-800' :
              log.aiFeature === 'summary' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {log.aiFeature?.toUpperCase() || 'OTHER'}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              {log.userType} • {new Date(log.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {log.flagged && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
              FLAGGED
            </span>
          )}
          <span className="text-sm text-gray-500">
            {log.responseTime}s
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-1">User Input:</div>
        <div className="bg-gray-50 p-3 rounded text-sm">
          {log.input.length > 200 ? `${log.input.substring(0, 200)}...` : log.input}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-1">AI Response:</div>
        <div className="bg-blue-50 p-3 rounded text-sm">
          {log.aiResponse.length > 300 ? `${log.aiResponse.substring(0, 300)}...` : log.aiResponse}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => handleReview(log._id, true, false, 'Approved')}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Approve
        </button>
        <button
          onClick={() => handleReview(log._id, true, true, 'Flagged for review')}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Flag
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">AI Review Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and review AI interactions for quality assurance</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg shadow p-1">
          {['unreviewed', 'flagged', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'unreviewed' && analytics && (
                <span className="ml-2 bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {analytics.unreviewedCount}
                </span>
              )}
              {tab === 'flagged' && analytics && (
                <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {analytics.flaggedCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Analytics */}
        {activeTab === 'analytics' && renderAnalytics()}

        {/* Bulk Actions */}
        {activeTab !== 'analytics' && logs.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedLogs.size === logs.length && logs.length > 0}
                onChange={selectAll}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">
                {selectedLogs.size} of {logs.length} selected
              </span>
            </div>
            <button
              onClick={handleBulkReview}
              disabled={selectedLogs.size === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Approve Selected
            </button>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : activeTab === 'analytics' ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">Feature Usage</h3>
              <div className="space-y-4">
                {analytics?.featureStats?.map((stat) => (
                  <div key={stat._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium capitalize">{stat._id}</span>
                    <div className="text-right">
                      <div className="text-lg font-bold">{stat.count}</div>
                      <div className="text-sm text-gray-500">{stat.avgResponseTime.toFixed(1)}s avg</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {activeTab} AI interactions found
            </div>
          ) : (
            logs.map(renderLogItem)
          )}
        </div>
      </div>
    </div>
  );
};

export default AIReviewDashboard;
