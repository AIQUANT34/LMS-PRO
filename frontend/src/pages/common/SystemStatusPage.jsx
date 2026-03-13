import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ServerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ClockIcon,
  GlobeAltIcon,
  CogIcon,
  DocumentTextIcon,
  BellIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SystemStatusPage = () => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        // Simulate API call to get system status
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockStatusData = {
          overall: 'operational',
          services: [
            {
              name: 'Core Platform',
              status: 'operational',
              description: 'All systems running normally',
              uptime: 99.98,
              responseTime: 142,
              lastChecked: new Date().toISOString()
            },
            {
              name: 'Database',
              status: 'operational',
              description: 'MongoDB cluster running optimally',
              uptime: 99.95,
              responseTime: 89,
              lastChecked: new Date().toISOString()
            },
            {
              name: 'AI Services',
              status: 'degraded',
              description: 'AI assistant experiencing high load times',
              uptime: 98.5,
              responseTime: 1250,
              lastChecked: new Date().toISOString()
            },
            {
              name: 'Video Streaming',
              status: 'operational',
              description: 'CDN delivering content efficiently',
              uptime: 99.99,
              responseTime: 234,
              lastChecked: new Date().toISOString()
            },
            {
              name: 'Authentication',
              status: 'operational',
              description: 'Login and registration working normally',
              uptime: 100,
              responseTime: 156,
              lastChecked: new Date().toISOString()
            },
            {
              name: 'File Storage',
              status: 'operational',
              description: 'Cloud storage services operational',
              uptime: 99.97,
              responseTime: 267,
              lastChecked: new Date().toISOString()
            }
          ],
          incidents: [
            {
              id: 1,
              title: 'AI Service Degradation',
              description: 'Users experienced slower response times from AI assistant between 2:00 PM - 4:00 PM EST',
              severity: 'medium',
              status: 'resolved',
              startTime: '2024-03-15T14:00:00Z',
              endTime: '2024-03-15T16:30:00Z',
              resolvedAt: '2024-03-15T16:30:00Z'
            },
            {
              id: 2,
              title: 'Scheduled Maintenance',
              description: 'Database optimization completed successfully',
              severity: 'low',
              status: 'resolved',
              startTime: '2024-03-14T02:00:00Z',
              endTime: '2024-03-14T04:30:00Z',
              resolvedAt: '2024-03-14T04:30:00Z'
            }
          ],
          performance: {
            avgResponseTime: 287,
            uptime: 99.96,
            requestsPerMinute: 15420,
            errorRate: 0.02
          },
          lastUpdated: new Date().toISOString()
        };
        
        setStatusData(mockStatusData);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching system status:', error);
        toast.error('Failed to load system status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'outage': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return CheckCircleIcon;
      case 'degraded': return ExclamationTriangleIcon;
      case 'outage': return ExclamationTriangleIcon;
      default: return CogIcon;
    }
  };

  const formatUptime = (uptime) => {
    return `${(uptime * 100).toFixed(2)}%`;
  };

  const formatResponseTime = (time) => {
    return `${time}ms`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowPathIcon className="h-5 w-5 rotate-180 mr-2" />
                <span className="text-lg font-semibold">Back to Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">System Status</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ClockIcon className="h-4 w-4" />
                <span>Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Loading...'}</span>
              </div>
              
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Overall Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${getStatusColor(statusData.overall)}`}>
                  {React.createElement(getStatusIcon(statusData.overall), { className: "h-8 w-8" })}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {statusData.overall === 'operational' ? 'All Systems Operational' : 
                   statusData.overall === 'degraded' ? 'Some Systems Degraded' : 'Systems Experiencing Issues'}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {statusData.overall === 'operational' 
                    ? 'All ProTrain services are running normally'
                    : 'We are experiencing some technical difficulties'
                  }
                </p>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{formatUptime(statusData.performance.uptime)}</div>
                  <div className="text-sm text-gray-600">Uptime (30 days)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{formatResponseTime(statusData.performance.avgResponseTime)}</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{statusData.performance.requestsPerMinute.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Requests/Min</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{(statusData.performance.errorRate * 100).toFixed(3)}%</div>
                  <div className="text-sm text-gray-600">Error Rate</div>
                </div>
              </div>
            </motion.div>

            {/* Service Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Status</h3>
              <div className="space-y-4">
                {statusData.services.map((service, index) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(service.status)}`}>
                        {React.createElement(getStatusIcon(service.status), { className: "h-5 w-5" })}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs">
                          <span className="flex items-center space-x-1">
                            <ClockIcon className="h-3 w-3" />
                            <span>Uptime: {formatUptime(service.uptime)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <ServerIcon className="h-3 w-3" />
                            <span>Response: {formatResponseTime(service.responseTime)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {service.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Incidents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Incidents</h3>
              <div className="space-y-4">
                {statusData.incidents.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900">No Recent Incidents</h4>
                    <p className="text-gray-600">
                      All systems have been running smoothly for the past 30 days.
                    </p>
                  </div>
                ) : (
                  statusData.incidents.map((incident, index) => (
                    <div
                      key={incident.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(incident.status)}`}>
                            {incident.status === 'resolved' && (
                              <CheckCircleIcon className="h-2 w-2 text-white" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{incident.title}</h4>
                            <p className="text-sm text-gray-600">{incident.description}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(incident.status)}`}>
                            {incident.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            {new Date(incident.startTime).toLocaleString()} - {new Date(incident.endTime).toLocaleString()}
                          </span>
                        </div>
                        {incident.status === 'resolved' && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircleIcon className="h-4 w-4" />
                            <span>Resolved at {new Date(incident.resolvedAt).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => window.open('/api/docs', '_blank')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-3 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">API Documentation</div>
                    <div className="text-sm text-gray-600">View technical documentation</div>
                  </div>
                </button>
                
                <Link
                  to="/contact"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
                >
                  <BellIcon className="h-5 w-5 mr-3 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Contact Support</div>
                    <div className="text-sm text-gray-600">Get help from our team</div>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemStatusPage;
