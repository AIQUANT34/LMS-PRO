import React, { useEffect } from 'react';

const RegisterPage = () => {
  useEffect(() => {
    console.log('RegisterPage component mounted');
    console.log('Current URL:', window.location.href);
  }, []);

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
        
        <p style={{ 
          color: '#6c757d', 
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Join LMS Pro and start learning today
        </p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500' }}>
              Full Name
            </label>
            <input 
              type="text" 
              placeholder="Enter your full name"
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
              placeholder="Enter your email"
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
              placeholder="Create a password"
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
            style={{ 
              backgroundColor: '#007bff', 
              color: 'white', 
              padding: '12px 24px', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            Sign Up
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
