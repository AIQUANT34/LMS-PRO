import { create } from 'zustand';

const useUIStore = create((set) => ({
  // Theme
  theme: 'light',
  setTheme: (theme) => set({ theme }),

  // Sidebar
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  openSidebar: () => set({ sidebarOpen: true }),

  // Loading states
  loading: false,
  setLoading: (loading) => set({ loading }),

  // Notifications
  notifications: [
    { id: 1, type: 'info', title: 'Welcome!', message: 'Explore our courses and start learning today.' },
    { id: 2, type: 'success', title: 'New Course Available', message: 'Check out our latest Web Development course.' }
  ],
  addNotification: (notification) => 
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id: Date.now() }]
    })),
  removeNotification: (id) => 
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })),
  clearNotifications: () => set({ notifications: [] }),

  // Modals
  modals: {},
  openModal: (modalName, data) => 
    set((state) => ({
      modals: { ...state.modals, [modalName]: { open: true, data } }
    })),
  closeModal: (modalName) => 
    set((state) => ({
      modals: { ...state.modals, [modalName]: { open: false, data: null } }
    })),
  isModalOpen: (modalName) => {
    const state = useUIStore.getState();
    return state.modals[modalName]?.open || false;
  },

  // Course player
  currentCourse: null,
  currentLesson: null,
  setCurrentCourse: (course) => set({ currentCourse: course }),
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Filters
  filters: {},
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
}));

export { useUIStore };
