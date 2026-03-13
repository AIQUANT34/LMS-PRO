import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { API_ENDPOINTS } from '../config/api';

const TestAPI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test basic API connection through proxy
      const response = await apiService.get('/api/');
      setData(response);
      console.log('API Response:', response);
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testPublicCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test courses endpoint through proxy
      const response = await apiService.get('/api/courses/public');
      setData(response);
      console.log('Courses Response:', response);
    } catch (err) {
      setError(err.message);
      console.error('Courses Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Connection Test</h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Basic Connection'}
        </button>
        
        <button
          onClick={testPublicCourses}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 ml-2"
        >
          {loading ? 'Testing...' : 'Test Courses API'}
        </button>
      </div>

      {loading && (
        <div className="text-blue-600">
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Success!</strong> API connection working.
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestAPI;
