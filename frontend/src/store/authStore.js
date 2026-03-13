import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api/api';

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
            const response = await authAPI.login(credentials);
            const { user, token } = response.data;
            
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
            const response = await authAPI.register(userData);
            const { user, token } = response.data;
            
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
            await authAPI.logout();
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
            const response = await authAPI.updateProfile(userData);
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

        clearError: () => set({ error: null }),

        // Check if user has specific role
        hasRole: (role) => {
          const { user } = get();
          return user?.role === role || (role === 'employee' && user?.role === 'student');
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
