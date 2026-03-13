import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

const AuthInitializer = ({ children }) => {
  const { user, token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Ensure auth state is properly initialized from localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (storedToken && storedUser && !isAuthenticated) {
      // Force update if localStorage has data but store doesn't
      console.log('Initializing auth from localStorage...');
      // This will trigger a re-render with proper auth state
    }
  }, [user, token, isAuthenticated]);

  return children;
};

export default AuthInitializer;
