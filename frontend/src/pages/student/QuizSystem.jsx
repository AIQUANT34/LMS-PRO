import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  TrophyIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  StarIcon,
  ChartBarIcon,
  DownloadIcon,
  ShareIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  BookmarkIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const QuizSystem = () => {
  const { courseId, quizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Mock quiz data
  const quiz = {
    id: quizId,
    title: 'React Fundamentals Assessment',
    description: 'Test your knowledge of React core concepts',
    duration: 30, // minutes
    totalQuestions: 10,
    passingScore: 70,
    attempts: 2,
    maxAttempts: 3,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What is the primary purpose of React components?',
        options: [
          'To style web pages',
          'To build reusable UI elements',
          'To manage database connections',
          'To handle HTTP requests'
        ],
        correctAnswer: 1,
        explanation: 'React components are the building blocks of React applications, designed to create reusable and independent UI elements.'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'Which hook is used to manage state in functional components?',
        options: [
          'useEffect',
          'useContext',
          'useState',
          'useReducer'
        ],
        correctAnswer: 2,
        explanation: 'useState is the primary hook for managing state in functional React components.'
      },
      {
        id: 3,
        type: 'true-false',
        question: 'React hooks can only be used in functional components.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'React hooks are specifically designed to work with functional components and cannot be used in class components.'
      },
      {
        id: 4,
        type: 'multiple-choice',
        question: 'What does JSX stand for?',
        options: [
          'JavaScript XML',
          'JavaScript Extension',
          'Java Syntax Extension',
          'JavaScript and XML'
        ],
        correctAnswer: 0,
        explanation: 'JSX stands for JavaScript XML, which is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.'
      },
      {
        id: 5,
        type: 'multiple-answer',
        question: 'Which of the following are React hooks? (Select all that apply)',
        options: [
          'useState',
          'useEffect',
          'useComponent',
          'useContext',
          'useElement'
        ],
        correctAnswer: [0, 1, 3],
        explanation: 'useState, useEffect, and useContext are all built-in React hooks. useComponent and useElement do not exist.'
      }
    ]
  };

  useEffect(() => {
    if (timeLeft > 0 && !showResults && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults, isSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleMultipleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      const newAnswers = currentAnswers.includes(optionIndex)
        ? currentAnswers.filter(i => i !== optionIndex)
        : [...currentAnswers, optionIndex];
      return {
        ...prev,
        [questionId]: newAnswers
      };
    });
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[question.id];
      if (question.type === 'multiple-answer') {
        const correctSet = new Set(question.correctAnswer);
        const userSet = new Set(userAnswer || []);
        if (correctSet.size === userSet.size && 
            [...correctSet].every(val => userSet.has(val))) {
          correct++;
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          correct++;
        }
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setShowResults(true);
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setIsSubmitted(false);
    setTimeLeft(quiz.duration * 60);
    setReviewMode(false);
  };

  const getAnswerStatus = (questionId) => {
    const question = quiz.questions.find(q => q.id === questionId);
    const userAnswer = answers[questionId];
    
    if (!userAnswer) return 'unanswered';
    
    if (question.type === 'multiple-answer') {
      const correctSet = new Set(question.correctAnswer);
      const userSet = new Set(userAnswer || []);
      const isCorrect = correctSet.size === userSet.size && 
                      [...correctSet].every(val => userSet.has(val));
      return isCorrect ? 'correct' : 'incorrect';
    } else {
      return userAnswer === question.correctAnswer ? 'correct' : 'incorrect';
    }
  };

  const QuestionCard = ({ question, index }) => {
    const userAnswer = answers[question.id];
    const answerStatus = isSubmitted ? getAnswerStatus(question.id) : null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`card-premium p-6 mb-6 ${
          isSubmitted && answerStatus === 'correct' ? 'border-green-500 bg-green-50' :
          isSubmitted && answerStatus === 'incorrect' ? 'border-red-500 bg-red-50' : ''
        }`}
      >
        {/* Question Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              isSubmitted && answerStatus === 'correct' ? 'bg-green-500 text-white' :
              isSubmitted && answerStatus === 'incorrect' ? 'bg-red-500 text-white' :
              'bg-primary-100 text-primary-600'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{question.question}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="badge-info">{question.type}</span>
                {isSubmitted && answerStatus === 'correct' && (
                  <span className="badge-success">Correct</span>
                )}
                {isSubmitted && answerStatus === 'incorrect' && (
                  <span className="badge-error">Incorrect</span>
                )}
              </div>
            </div>
          </div>
          
          {isSubmitted && (
            <div className="flex items-center gap-2">
              {answerStatus === 'correct' ? (
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              ) : (
                <XCircleIcon className="h-6 w-6 text-red-500" />
              )}
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.type === 'multiple-choice' || question.type === 'true-false' ? (
            question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  isSubmitted && optionIndex === question.correctAnswer ? 'bg-green-100 border-green-500' :
                  isSubmitted && userAnswer === optionIndex && optionIndex !== question.correctAnswer ? 'bg-red-100 border-red-500' :
                  userAnswer === optionIndex ? 'bg-primary-100 border-primary-500' :
                  'bg-gray-50 border-gray-200 hover:bg-gray-100'
                } border-2`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={optionIndex}
                  checked={userAnswer === optionIndex}
                  onChange={() => handleAnswerSelect(question.id, optionIndex)}
                  disabled={isSubmitted}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="flex-1 text-gray-700">{option}</span>
                {isSubmitted && optionIndex === question.correctAnswer && (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                )}
                {isSubmitted && userAnswer === optionIndex && optionIndex !== question.correctAnswer && (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
              </label>
            ))
          ) : question.type === 'multiple-answer' ? (
            question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  isSubmitted && question.correctAnswer.includes(optionIndex) ? 'bg-green-100 border-green-500' :
                  isSubmitted && (userAnswer || []).includes(optionIndex) && !question.correctAnswer.includes(optionIndex) ? 'bg-red-100 border-red-500' :
                  (userAnswer || []).includes(optionIndex) ? 'bg-primary-100 border-primary-500' :
                  'bg-gray-50 border-gray-200 hover:bg-gray-100'
                } border-2`}
              >
                <input
                  type="checkbox"
                  checked={(userAnswer || []).includes(optionIndex)}
                  onChange={() => handleMultipleAnswerSelect(question.id, optionIndex)}
                  disabled={isSubmitted}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="flex-1 text-gray-700">{option}</span>
                {isSubmitted && question.correctAnswer.includes(optionIndex) && (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                )}
                {isSubmitted && (userAnswer || []).includes(optionIndex) && !question.correctAnswer.includes(optionIndex) && (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
              </label>
            ))
          ) : null}
        </div>

        {/* Explanation (shown after submission) */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900 mb-1">Explanation</div>
                <div className="text-sm text-blue-700">{question.explanation}</div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const QuizHeader = () => (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600 mt-1">{quiz.description}</p>
        </div>
        
        {!isSubmitted && (
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <ClockIcon className="h-4 w-4" />
              Time Remaining
            </div>
            <div className={`text-2xl font-bold ${
              timeLeft < 300 ? 'text-red-600' : 'text-gray-900'
            }`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
        <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Quiz Info */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{quiz.totalQuestions}</div>
          <div className="text-sm text-gray-600">Questions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{quiz.duration} min</div>
          <div className="text-sm text-gray-600">Duration</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{quiz.passingScore}%</div>
          <div className="text-sm text-gray-600">Passing Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{quiz.maxAttempts}</div>
          <div className="text-sm text-gray-600">Max Attempts</div>
        </div>
      </div>
    </div>
  );

  const ResultsPage = () => {
    const score = calculateScore();
    const passed = score >= quiz.passingScore;
    const correctAnswers = quiz.questions.filter((q, index) => {
      const userAnswer = answers[q.id];
      if (q.type === 'multiple-answer') {
        const correctSet = new Set(q.correctAnswer);
        const userSet = new Set(userAnswer || []);
        return correctSet.size === userSet.size && 
               [...correctSet].every(val => userSet.has(val));
      } else {
        return userAnswer === q.correctAnswer;
      }
    }).length;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-6"
      >
        {/* Results Header */}
        <div className={`card-premium p-8 text-center ${
          passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
        }`}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center">
            {passed ? (
              <TrophyIcon className="h-12 w-12 text-green-600" />
            ) : (
              <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
            )}
          </div>
          
          <h2 className={`text-3xl font-bold mb-2 ${
            passed ? 'text-green-900' : 'text-red-900'
          }`}>
            {passed ? 'Congratulations!' : 'Try Again'}
          </h2>
          
          <p className={`text-lg mb-6 ${
            passed ? 'text-green-700' : 'text-red-700'
          }`}>
            {passed 
              ? `You passed the quiz with a score of ${score}%!` 
              : `You scored ${score}%, but need ${quiz.passingScore}% to pass.`
            }
          </p>

          {/* Score Breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{score}%</div>
              <div className="text-sm text-gray-600">Your Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{quiz.questions.length - correctAnswers}</div>
              <div className="text-sm text-gray-600">Incorrect Answers</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setReviewMode(!reviewMode)}
              className="btn-premium-outline"
            >
              {reviewMode ? 'Hide Review' : 'Review Answers'}
            </button>
            
            {quiz.attempts < quiz.maxAttempts && !passed && (
              <button
                onClick={handleRetakeQuiz}
                className="btn-premium"
              >
                Retake Quiz
              </button>
            )}
            
            {passed && (
              <Link to={`/student/courses/${courseId}/certificate`} className="btn-premium">
                View Certificate
              </Link>
            )}
            
            <Link to={`/student/courses/${courseId}`} className="btn-premium-outline">
              Back to Course
            </Link>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Results</h3>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const answerStatus = getAnswerStatus(question.id);
              return (
                <div key={question.id} className="card-premium p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        answerStatus === 'correct' ? 'bg-green-500 text-white' :
                        answerStatus === 'incorrect' ? 'bg-red-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{question.question}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Your answer: {question.options[answers[question.id]] || 'Not answered'}
                        </p>
                        {answerStatus !== 'correct' && (
                          <p className="text-sm text-green-600 mt-1">
                            Correct answer: {Array.isArray(question.correctAnswer) 
                              ? question.correctAnswer.map(i => question.options[i]).join(', ')
                              : question.options[question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {answerStatus === 'correct' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : answerStatus === 'incorrect' ? (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        <QuizHeader />
        <ResultsPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <QuizHeader />
      
      <div className="max-w-4xl mx-auto p-6">
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="btn-premium-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-primary-600 text-white'
                    : answers[quiz.questions[index].id]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="btn-premium"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
              className="btn-premium"
            >
              Next
            </button>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.slice(currentQuestion, currentQuestion + 1).map((question, index) => (
            <QuestionCard key={question.id} question={question} index={currentQuestion + index} />
          ))}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showConfirmSubmit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Quiz?</h3>
                <p className="text-gray-600">
                  You have answered {Object.keys(answers).length} out of {quiz.questions.length} questions.
                  {Object.keys(answers).length < quiz.questions.length && 
                    ' Unanswered questions will be marked as incorrect.'}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 btn-premium-outline"
                >
                  Review Answers
                </button>
                <button
                  onClick={handleSubmitQuiz}
                  className="flex-1 btn-premium"
                >
                  Submit Quiz
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizSystem;
