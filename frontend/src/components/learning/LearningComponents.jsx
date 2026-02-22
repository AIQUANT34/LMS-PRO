// ============================================================================
// FRONTEND INTEGRATION EXAMPLES - React Components
// Location: frontend/src/components/learning/
// ============================================================================

// ======================== 1. LESSON PLAYER COMPONENT ========================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LessonPlayer = ({ lessonId, enrollmentId, courseId }) => {
  const [lesson, setLesson] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch lesson details with access control
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(
          `/api/learning/lessons/${lessonId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setLesson(response.data);
        
        // Get video resume position
        if (response.data.type === 'video') {
          const progressResp = await axios.get(
            `/api/learning/video/${lessonId}/progress`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          setVideoProgress(progressResp.data.currentTime);
        }
      } catch (error) {
        console.error('Access denied or lesson not found');
      }
      setLoading(false);
    };
    
    fetchLesson();
  }, [lessonId]);

  // Save video playback position
  const handleVideoProgress = async (currentTime, duration) => {
    try {
      await axios.put(
        `/api/learning/video/${lessonId}/playback?enrollmentId=${enrollmentId}`,
        {
          currentTime,
          duration,
          quality: '720p',
          isSubtitlesEnabled: false,
          watchRate: 1,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
    } catch (error) {
      console.error('Failed to save progress');
    }
  };

  // Mark lesson complete
  const handleComplete = async () => {
    try {
      await axios.post(
        `/api/learning/progress/complete/${lessonId}?enrollmentId=${enrollmentId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setIsCompleted(true);
    } catch (error) {
      console.error('Failed to mark complete');
    }
  };

  if (loading) return <div>Loading lesson...</div>;
  if (!lesson) return <div>Lesson not found</div>;

  return (
    <div className="lesson-player">
      <h1>{lesson.title}</h1>
      
      {lesson.type === 'video' && (
        <video
          controls
          onTimeUpdate={(e) => handleVideoProgress(e.target.currentTime, e.target.duration)}
          onEnded={handleComplete}
          style={{ width: '100%', maxHeight: '500px' }}
        >
          <source src={lesson.videoUrl} type="video/mp4" />
        </video>
      )}

      {lesson.type === 'text' && (
        <div className="lesson-content" dangerHTMLFrom={lesson.content} />
      )}

      <p>{lesson.description}</p>

      {!isCompleted && lesson.type !== 'video' && (
        <button onClick={handleComplete}>Mark as Complete</button>
      )}

      {lesson.resources && (
        <div className="resources">
          <h3>Resources</h3>
          <ul>
            {lesson.resources.map((res, i) => (
              <li key={i}>
                <a href={res.url} target="_blank" rel="noopener noreferrer">
                  {res.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ======================== 2. QUIZ COMPONENT ========================

const QuizComponent = ({ lessonId, enrollmentId }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Load quiz questions from lesson
  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await axios.get(`/api/learning/lessons/${lessonId}`);
      // Parse quiz content (JSON structure)
      setQuestions(JSON.parse(response.data.content));
    };
    fetchQuiz();
  }, [lessonId]);

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const submitQuiz = async () => {
    // Calculate score (mock calculation)
    const correct = Object.keys(answers).filter(
      (q) => answers[q] === questions.find((x) => x.id == q)?.correct
    ).length;
    const calculatedScore = Math.round((correct / questions.length) * 100);

    try {
      const response = await axios.post(
        `/api/learning/quiz/${lessonId}/submit?enrollmentId=${enrollmentId}`,
        { score: calculatedScore, isPassed: calculatedScore >= 70 },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setScore(calculatedScore);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit quiz');
    }
  };

  if (!questions.length) return <div>Loading quiz...</div>;

  return (
    <div className="quiz-container">
      <h2>Quiz</h2>
      {!submitted ? (
        <>
          {questions.map((question) => (
            <div key={question.id} className="question">
              <p>{question.text}</p>
              {question.options.map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    onChange={() => handleAnswer(question.id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button onClick={submitQuiz}>Submit Quiz</button>
        </>
      ) : (
        <div className="quiz-result">
          <h3>Score: {score}%</h3>
          <p>{score >= 70 ? '✅ Passed!' : '❌ Failed. Try again.'}</p>
        </div>
      )}
    </div>
  );
};

// ======================== 3. PROGRESS BAR COMPONENT ========================

const ProgressBar = ({ courseId }) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `/api/learning/progress/course/${courseId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setProgress(response.data);
      } catch (error) {
        console.error('Failed to fetch progress');
      }
    };

    fetchProgress();
  }, [courseId]);

  if (!progress) return <div>Loading...</div>;

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span>{progress.completedLessons}/{progress.totalLessons} lessons completed</span>
        <span>{progress.progressPercentage}%</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress.progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

// ======================== 4. STUDENT DASHBOARD ========================

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          '/api/learning/dashboard',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setDashboard(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard');
      }
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!dashboard) return <div>Failed to load dashboard</div>;

  return (
    <div className="student-dashboard">
      <h1>My Learning Dashboard</h1>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{dashboard.totalEnrolled}</h3>
          <p>Total Enrolled</p>
        </div>
        <div className="stat-card">
          <h3>{dashboard.inProgress}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card">
          <h3>{dashboard.completed}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h3>{dashboard.certificatesEarned}</h3>
          <p>Certificates</p>
        </div>
      </div>

      {/* Enrolled Courses */}
      <section className="enrolled-courses">
        <h2>Your Courses</h2>
        <div className="courses-grid">
          {dashboard.enrollments.map((enrollment) => (
            <CourseCard key={enrollment._id} enrollment={enrollment} />
          ))}
        </div>
      </section>

      {/* Certificates */}
      {dashboard.certificatesEarned > 0 && (
        <section className="certificates">
          <h2>Certificates</h2>
          <div className="certificate-list">
            {dashboard.certificates.map((cert) => (
              <CertificateCard key={cert._id} certificate={cert} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// ======================== 5. COURSE CARD WITH RESUME ========================

const CourseCard = ({ enrollment }) => {
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axios.get(
          `/api/learning/resume/${enrollment.course._id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setResumeData(response.data);
      } catch (error) {
        console.error('Failed to fetch resume data');
      }
    };

    if (enrollment.status !== 'completed') {
      fetchResumeData();
    }
  }, [enrollment.course._id]);

  const handleResume = () => {
    // Navigate to lesson player with resume position
    window.location.href = `/learning/course/${enrollment.course._id}/lesson/${resumeData?.lastAccessedLesson?._id}`;
  };

  return (
    <div className="course-card">
      <img src={enrollment.course.thumbnail} alt={enrollment.course.title} />
      <div className="card-content">
        <h3>{enrollment.course.title}</h3>
        <p className="instructor">{enrollment.course.instructor}</p>

        {enrollment.status === 'completed' ? (
          <div className="completed-badge">✓ Completed</div>
        ) : (
          <div className="progress-section">
            <ProgressBar courseId={enrollment.course._id} />
            {resumeData && (
              <button onClick={handleResume} className="resume-btn">
                Resume from {Math.floor(resumeData.continueFromTime / 60)}m
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ======================== 6. CERTIFICATE DISPLAY ========================

const CertificateCard = ({ certificate }) => {
  const downloadCertificate = () => {
    window.open(certificate.certificateUrl, '_blank');
  };

  return (
    <div className="certificate-card">
      <div className="certificate-info">
        <h4>{certificate.courseId.title}</h4>
        <p>Completed: {new Date(certificate.issuedAt).toLocaleDateString()}</p>
        <p className="grade">Grade: {certificate.grade}</p>
      </div>
      <button onClick={downloadCertificate}>Download Certificate</button>
    </div>
  );
};

// ======================== 7. RESUME CARD ========================

const ResumeCard = ({ courseId }) => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(
          `/api/learning/resume/${courseId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setResumeData(response.data);
      } catch (error) {
        console.error('Failed to fetch resume data');
      }
      setLoading(false);
    };

    fetchResume();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (!resumeData?.lastAccessedLesson) return null;

  const remainingTime = (
    (resumeData.videoProgress.duration - resumeData.continueFromTime) /
    60
  ).toFixed(1);

  return (
    <div className="resume-card">
      <h3>Continue Learning</h3>
      <p>Course Progress: {resumeData.enrollmentProgress}%</p>
      <p>Last Lesson: {resumeData.lastAccessedLesson.title}</p>
      <p>Resume from: {Math.floor(resumeData.continueFromTime / 60)}m</p>
      <p className="remaining">~{remainingTime} minutes remaining</p>
      <a
        href={`/learning/lesson/${resumeData.lastAccessedLesson._id}`}
        className="resume-btn"
      >
        Resume Learning
      </a>
    </div>
  );
};

export {
  LessonPlayer,
  QuizComponent,
  ProgressBar,
  StudentDashboard,
  CourseCard,
  CertificateCard,
  ResumeCard,
};
