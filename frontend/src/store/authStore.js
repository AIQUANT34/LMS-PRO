import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiService from '../services/apiService';

const useAuthStore = create(
  persist(
    (set, get) => {
      // Initialize from localStorage
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      
      return {
        // State
        user: user,
        token: token,
        isAuthenticated: !!token && !!user,
        isLoading: false,
        error: null,

        // Actions
        login: async (credentials) => {
          set({ isLoading: true, error: null });
          try {
            console.log('Frontend login attempt with credentials:', credentials);
            const response = await apiService.login(credentials);
            console.log('Frontend received response:', response);
            const { user, token } = response;
            console.log('Frontend extracted user data:', user);
            console.log('Frontend extracted token:', token);
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('Frontend stored user in localStorage:', JSON.stringify(user));
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            return { success: true, user };
          } catch (error) {
            console.error('Frontend login error:', error);
            const errorMessage = error.response?.data?.message || 'Login failed';
            set({
              isLoading: false,
              error: errorMessage,
              isAuthenticated: false,
              user: null,
              token: null,
            });
            return { success: false, error: errorMessage };
          }
        },

        register: async (userData) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiService.register(userData);
            const { user, token } = response;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            return { success: true, user };
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            set({
              isLoading: false,
              error: errorMessage,
              isAuthenticated: false,
              user: null,
              token: null,
            });
            return { success: false, error: errorMessage };
          }
        },

        logout: async () => {
          try {
            await apiService.logout();
          } catch (error) {
            console.error('Logout error:', error);
          } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              error: null,
            });
          }
        },

        updateProfile: async (userData) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiService.updateProfile(userData);
            const updatedUser = response.data;
            
            set({
              user: updatedUser,
              isLoading: false,
              error: null,
            });
            
            return { success: true, user: updatedUser };
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'Profile update failed';
            set({
              isLoading: false,
              error: errorMessage,
            });
            return { success: false, error: errorMessage };
          }
        },

        // Refresh user data from server
        refreshUserData: async () => {
          try {
            const response = await apiService.get('/auth/profile');
            if (response.data) {
              // Update both store and localStorage
              localStorage.setItem('user', JSON.stringify(response.data));
              set({
                user: response.data,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              console.log('User data refreshed:', response.data);
            }
          } catch (error) {
            console.error('Error refreshing user data:', error);
          }
        },

        clearError: () => set({ error: null }),

        // Check if user has specific role
        hasRole: (role) => {
          const { user } = get();
          return user?.role === role || (role === 'employee' && user?.role === 'student') || (role === 'trainer' && user?.role === 'student');
        },

        // Check if user has any of the specified roles
        hasAnyRole: (roles) => {
          const { user } = get();
          return roles.includes(user?.role);
        },

        // Get user role
        getUserRole: () => {
          const { user } = get();
          return user?.role;
        },

        // Check if user is verified trainer
        isVerifiedTrainer: () => {
          const { user } = get();
          return user?.isVerifiedTrainer === true;
        },

        // Get trainer request status
        getTrainerRequestStatus: () => {
          const { user } = get();
          return user?.trainerRequest || 'none';
        }
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export { useAuthStore };
