import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('RegisterPage component mounted');
    console.log('Current URL:', window.location.href);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.post('/api/auth/register', formData);
      setSuccess('Registration successful! Redirecting to login...');
      
      // Store user data for potential auto-login
      localStorage.setItem('tempUser', JSON.stringify(response.data));
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'white', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '40px', 
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          color: '#2c3e50', 
          fontSize: '28px', 
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Create Account
        </h1>
        
        {/* Success Message */}
        {success && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <p style={{ 
          color: '#6c757d', 
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Join ProTrain and start learning today
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500' }}>
              Full Name
            </label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ced4da', 
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500' }}>
              Email Address
            </label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ced4da', 
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500' }}>
              Password
            </label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength="6"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ced4da', 
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }} 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              backgroundColor: loading ? '#6c757d' : '#007bff', 
              color: 'white', 
              padding: '12px 24px', 
              border: 'none', 
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #dee2e6'
        }}>
          <span style={{ color: '#6c757d' }}>Already have an account? </span>
          <a 
            href="/login" 
            style={{ 
              color: '#007bff', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
