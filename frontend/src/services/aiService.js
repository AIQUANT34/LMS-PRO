import { apiService } from './apiService';

// Enhanced AI Service for student learning assistance
export const aiService = {
  // Ask AI about course content
  askQuestion: async (question, courseId = null, lessonId = null) => {
    try {
      console.log('🔍 AI Service - Making request:', {
        question,
        courseId,
        lessonId,
        context: 'student_learning',
        studentFocus: true
      });

      const response = await apiService.post('/ai/ask', {
        question,
        courseId,
        lessonId,
        context: 'student_learning',
        studentFocus: true
      });

      console.log('Raw axios response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      console.log('Response headers:', response.headers);
      
      // Handle different response structures
      if (response.data) {
        console.log('Returning response.data:', response.data);
        return response.data;
      } else if (response) {
        console.log('Returning raw response:', response);
        // If response is a string, wrap it in the expected format
        if (typeof response === 'string') {
          return {
            success: true,
            data: {
              response: response,
              suggestions: [
                'Tell me more about this topic',
                'Show me practical examples',
                'Explain this differently',
                'Create practice exercises'
              ]
            }
          };
        }
        return response;
      } else {
        console.log('No response data available');
        return null;
      }
    } catch (error) {
      console.error('🔍 AI Question Error:', error);
      console.error('🔍 Error response:', error.response);
      console.error('🔍 Error status:', error.response?.status);
      console.error('🔍 Error message:', error.response?.data?.message || error.message);
      
      // Return fallback response instead of throwing
      return {
        success: false,
        data: {
          response: 'I apologize, but I\'m having trouble connecting to the AI service. Please try again in a moment.',
          suggestions: ['Try rephrasing your question', 'Check your internet connection', 'Contact support if the issue persists']
        }
      };
    }
  },

  // Get personalized learning recommendations
  getRecommendations: async (studentId, courseId) => {
    try {
      const response = await apiService.get(`/ai/recommendations/${studentId}/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('AI Recommendations Error:', error);
      throw error;
    }
  },

  // Generate learning progress summary
  getProgressSummary: async (studentId, courseId) => {
    try {
      const response = await apiService.post(`/ai/progress-summary/${studentId}/${courseId}`, {
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
      const response = await apiService.post('/ai/generate-quiz', {
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
      const response = await apiService.post('/ai/generate-path', {
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
      const response = await apiService.post('/ai/analyze-performance', {
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
