import { apiService } from './apiService';

// Enhanced AI Service for student learning assistance
export const aiService = {
  // Ask AI about course content
  askQuestion: async (question, courseId = null, lessonId = null) => {
    try {
      const response = await apiService.post('/api/ai/ask', {
        question,
        courseId,
        lessonId,
        context: 'student_learning',
        studentFocus: true
      });
      return response.data;
    } catch (error) {
      console.error('AI Question Error:', error);
      throw error;
    }
  },

  // Get personalized learning recommendations
  getRecommendations: async (studentId, courseId) => {
    try {
      const response = await apiService.get(`/api/ai/recommendations/${studentId}/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('AI Recommendations Error:', error);
      throw error;
    }
  },

  // Generate learning progress summary
  getProgressSummary: async (studentId, courseId) => {
    try {
      const response = await apiService.post(`/api/ai/progress-summary/${studentId}/${courseId}`, {
        includeWeakAreas: true,
        includeSuggestions: true,
        includeNextSteps: true
      });
      return response.data;
    } catch (error) {
      console.error('AI Progress Summary Error:', error);
      throw error;
    }
  },

  // Generate quiz questions from content
  generateQuiz: async (content, difficulty = 'medium', questionCount = 5) => {
    try {
      const response = await apiService.post('/api/ai/generate-quiz', {
        content,
        difficulty,
        questionCount,
        questionTypes: ['multiple-choice', 'true-false', 'short-answer'],
        studentLevel: 'adaptive'
      });
      return response.data;
    } catch (error) {
      console.error('AI Quiz Generation Error:', error);
      throw error;
    }
  },

  // Generate personalized learning path
  generateLearningPath: async (studentId, goals, currentLevel = 'beginner') => {
    try {
      const response = await apiService.post('/api/ai/generate-path', {
        goals,
        currentLevel,
        studentId,
        timeframe: '12-weeks',
        learningStyle: 'visual',
        pace: 'adaptive'
      });
      return response.data;
    } catch (error) {
      console.error('AI Learning Path Error:', error);
      throw error;
    }
  },

  // Analyze learning patterns and suggest improvements
  analyzePerformance: async (studentId, timeframe = '30-days') => {
    try {
      const response = await apiService.post('/api/ai/analyze-performance', {
        studentId,
        timeframe,
        includeRecommendations: true,
        focusAreas: ['completion_rate', 'time_spent', 'assessment_scores']
      });
      return response.data;
    } catch (error) {
      console.error('AI Performance Analysis Error:', error);
      throw error;
    }
  }
};
