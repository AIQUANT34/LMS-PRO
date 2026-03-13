import React from 'react';
// import { Outlet } from 'react-router-dom';

const AuthLayout = ({children}) => {
  console.log('AuthLayout rendered');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: 'calc(100vh - 40px)'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '500px',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {/* <Outlet /> */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
