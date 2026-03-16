import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  DocumentTextIcon,
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  LightBulbIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/apiService';
import { aiService } from '../../services/aiService';

const StudentQuizSystem = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const [quiz, setQuiz] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchQuizData();
  }, [courseId, quizId, isAuthenticated]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearTimeout(timer);
    };
  }, [quizStarted, timeLeft]);

  const fetchQuizData = async () => {
    try {
      const [quizRes, courseRes] = await Promise.all([
        apiService.get(`/api/assessments/quiz/${quizId}`),
        apiService.get(`/api/courses/${courseId}`)
      ]);
      
      setQuiz(quizRes.data);
      setCourse(courseRes.data);
      setTimeLeft(quizRes.data?.timeLimit || 1800); // 30 minutes default
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(quiz?.timeLimit || 1800);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitQuiz = async () => {
    try {
      const response = await apiService.post(`/api/assessments/${quizId}/submit`, {
        answers,
        timeSpent: (quiz?.timeLimit || 1800) - timeLeft
      });
      
      setQuizCompleted(true);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz');
    }
  };

  const calculateScore = () => {
    if (!quiz?.questions) return 0;
    
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to={`/student/courses/${courseId}`}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Course
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{quiz?.title}</h1>
        </div>
        {quizCompleted && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Quiz Completed
          </div>
        )}
      </div>

      {!quizStarted ? (
        /* Quiz Start Screen */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-8 text-center"
        >
          <div className="max-w-md mx-auto">
            <DocumentTextIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Quiz?</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Quiz Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Questions: {quiz?.questions?.length || 0}</p>
                  <p>Time Limit: {Math.floor((quiz?.timeLimit || 1800) / 60)} minutes</p>
                  <p>Passing Score: {quiz?.passingScore || 60}%</p>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-600" />
                  <span className="text-yellow-800">Please read carefully before starting. Once started, the quiz cannot be paused.</span>
                </div>
              </div>
              <button
                onClick={startQuiz}
                className="w-full btn-premium"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </motion.div>
      ) : showResults ? (
        /* Quiz Results */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-8"
        >
          <div className="text-center mb-6">
            <AcademicCapIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Results</h2>
          </div>
          
          <div className={`text-center p-6 rounded-lg ${getScoreColor(calculateScore())}`}>
            <p className="text-3xl font-bold mb-2">{calculateScore()}%</p>
            <p className="text-lg">
              {calculateScore() >= (quiz?.passingScore || 60) ? 'Congratulations! You Passed!' : 'Better Luck Next Time!'}
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <Link
              to={`/student/courses/${courseId}`}
              className="btn-premium"
            >
              Back to Course
            </Link>
          </div>
        </motion.div>
      ) : (
        /* Quiz Active */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Quiz Questions */}
          <div className="lg:col-span-2">
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Quiz Questions</h2>
                <div className="flex items-center space-x-4">
                  <div className={`text-center px-4 py-2 rounded-lg ${
                    timeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <ClockIcon className="h-5 w-5 mr-2" />
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {quiz?.questions?.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {quiz?.questions?.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 border rounded-lg ${
                      index === currentQuestion 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {index + 1}. {question.question}
                    </h3>
                    
                    {question.type === 'multiple-choice' && (
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option}
                              checked={answers[question.id] === option}
                              onChange={() => handleAnswerChange(question.id, option)}
                              className="mr-3"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    
                    {question.type === 'true-false' && (
                      <div className="space-y-2">
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value="true"
                            checked={answers[question.id] === 'true'}
                            onChange={() => handleAnswerChange(question.id, 'true')}
                            className="mr-3"
                          />
                          <span className="text-gray-700">True</span>
                        </label>
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value="false"
                            checked={answers[question.id] === 'false'}
                            onChange={() => handleAnswerChange(question.id, 'false')}
                            className="mr-3"
                          />
                          <span className="text-gray-700">False</span>
                        </label>
                      </div>
                    )}
                    
                    {question.type === 'short-answer' && (
                      <textarea
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={3}
                        placeholder="Type your answer here..."
                      />
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <button
                  onClick={submitQuiz}
                  className="btn-premium"
                  disabled={Object.keys(answers).length !== quiz?.questions?.length}
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
          
          {/* Quiz Info Panel */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-premium p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  <span>Total Questions: {quiz?.questions?.length || 0}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>Time Limit: {Math.floor((quiz?.timeLimit || 1800) / 60)} minutes</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  <span>Passing Score: {quiz?.passingScore || 60}%</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  <span>Attempts: {quiz?.maxAttempts || 1}</span>
                </div>
              </div>
            </motion.div>
            
            {/* AI Assistant */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-premium p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Study Assistant</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                  <LightBulbIcon className="h-5 w-5 mr-3 text-gray-600" />
                  <span className="font-medium text-gray-900">Get Hint for Current Question</span>
                </button>
                <button className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                  <LightBulbIcon className="h-5 w-5 mr-3 text-gray-600" />
                  <span className="font-medium text-gray-900">Explain This Concept</span>
                </button>
                <button className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                  <LightBulbIcon className="h-5 w-5 mr-3 text-gray-600" />
                  <span className="font-medium text-gray-900">Generate Practice Questions</span>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentQuizSystem;
