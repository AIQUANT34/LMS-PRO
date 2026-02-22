# Learning Experience & Progress Tracking System - Implementation Guide

## Overview
This is a production-ready Learning Experience & Progress Tracking System built with NestJS and MongoDB, similar to platforms like Udemy and Coursera.

---

## 📊 Database Schema Architecture

### 1. Lesson Schema
Stores individual lesson information within courses.

**Key Fields:**
- `title` - Lesson title
- `courseId` - Reference to course
- `moduleId` - Module identifier
- `type` - Video, text, or quiz
- `videoUrl` - URL of video content
- `videoDuration` - Duration in seconds
- `isFree` - Public/premium content indicator
- `sequence` - Order within module
- `resources` - Additional materials (PDFs, code, etc.)
- `seo` - Meta information for SEO

**Indexes:**
- `courseId + moduleId + sequence` - Fast lesson retrieval

---

### 2. Progress Schema
Tracks student progress on individual lessons.

**Key Fields:**
- `userId` - Student ID
- `courseId` - Course reference
- `lessonId` - Lesson reference
- `enrollmentId` - Enrollment record
- `isCompleted` - Completion status
- `completedAt` - Completion timestamp
- `videoProgress` - Current playback time, duration, percentage
- `isQuizPassed` - Quiz completion status
- `quizScore` - Quiz score (0-100)
- `timeSpentSeconds` - Total time on lesson
- `certificateEarned` - Certificate status

**Unique Indexes:**
- `userId + lessonId` - One progress record per student per lesson

---

### 3. VideoHistory Schema
Maintains video playback state for resume functionality.

**Key Fields:**
- `userId` - Student ID
- `lessonId` - Video lesson
- `currentTime` - Last paused position (seconds)
- `videoDuration` - Total video length
- `lastWatchedAt` - Resumption timestamp
- `quality` - Video quality setting
- `isSubtitlesEnabled` - Subtitle preference
- `watchRate` - Playback speed (1x, 1.5x, 2x)

**Unique Index:**
- `userId + lessonId` - One video history per student per lesson

---

### 4. Certificate Schema
Issued upon course completion.

**Key Fields:**
- `userId` - Student ID
- `courseId` - Course reference
- `certificateId` - Unique cert identifier
- `certificateUrl` - PDF URL
- `issuedAt` - Issue date
- `grade` - Letter grade (A-F)
- `score` - Percentage score
- `completionPercentage` - % of course completed

---

### 5. Enrollment Schema (Updated)
Links students to courses with progress tracking.

**Fields:**
- `user` - Student reference
- `course` - Course reference
- `progress` - Overall percentage (0-100)
- `status` - active | completed | cancelled
- `paymentStatus` - pending | paid | failed
- `isCompleted` - Course completion flag

---

## 🔐 Access Control Architecture

### Lesson Access Rules

```
┌─────────────────────────────┐
│  Lesson Request             │
└──────────────┬──────────────┘
               │
         ┌─────▼─────┐
         │ Is Free?  │
         └─────┬─────┘
          Y /  \ N
           /    \
          ▼      ┌────────────────┐
        Allow    │ Is Enrolled?   │
                 └────────┬───────┘
                      Y / \ N
                       /   \
                      ▼     ▼
                    Allow  Forbid
```

### Role-Based Permissions

| Role | Create Lesson | Access Own Lessons | Access Free Lessons | Access Enrolled |
|------|---------------|-------------------|-------------------|-----------------|
| Instructor | ✅ Own courses | ✅ | ✅ | If enrolled |
| Admin | ✅ All courses | ✅ | ✅ | ✅ |
| Student | ❌ | ❌ | ✅ | ✅ |

---

## 🎬 Lesson Player Features

### Video Playback Tracking

**Auto-save Features:**
- Current playback position saved every 10 seconds
- Video quality preference saved
- Playback speed saved
- Subtitles preference tracked

**Resume Functionality:**
- When resuming, player loads from `lastWatchedAt`
- Only resumes if < 95% watched (completion check)
- Shows resume prompt if > 60 seconds into video

**Completion Detection:**
- Auto-complete when watched 95%+ of video
- Manual completion by instructor button
- Quiz completion via score threshold

---

## 📊 Progress Calculation Algorithm

```typescript
Course Progress = (Completed Lessons / Total Lessons) × 100

// Auto-completion when:
// 1. All lessons marked complete
// 2. Course Progress = 100%
// 3. Enrollment status → 'completed'
// 4. Certificate auto-generated
```

**Progress Sync:**
- Real-time updates on lesson completion
- Batch updates for video progress (debounced)
- Automatic enrollment status updates

---

## 🛡️ Secure Lesson Access Implementation

### Video Streaming Secret Key Flow

```
1. Student requests lesson → GET /learning/lessons/:lessonId
   └─ Service validates enrollment
   └─ Returns lesson with signed video URL

2. Student accesses video URL → Signed S3 URL (expires in 1 hour)
   └─ S3 validates signature
   └─ Streams encrypted video

3. PlaybackEvents tracked → PUT /learning/video/:lessonId/playback
   └─ Updates videoHistory with position
   └─ Prevents unauthorized sharing of same video URL
```

### Prevention Methods
- ✅ Video URLs are signed (1-hour expiry)
- ✅ Download disabled in player
- ✅ Device fingerprinting (optional)
- ✅ Watermarking (for premium courses)
- ✅ Rate limiting on API calls

---

## 📱 Frontend Integration Points

### Lesson Player Component (React)
```jsx
<LessonPlayer
  lessonId={lessonId}
  enrollmentId={enrollmentId}
  videoUrl={lesson.videoUrl}
  resumePosition={videoProgress.currentTime}
  onVideoProgress={handleProgress}
  onCompletion={handleCompletion}
/>
```

### Resume Learning
```jsx
<ResumeCard
  course={resumeData.course}
  lastLesson={resumeData.lastAccessedLesson}
  progress={resumeData.enrollmentProgress}
  continueFromTime={resumeData.videoProgress.currentTime}
/>
```

### Dashboard
```jsx
<StudentDashboard
  enrolledCourses={enrollments}
  certificates={certificates}
  inProgressCount={inProgress}
  completedCount={completed}
/>
```

---

## 📡 API Routes Summary

### Lessons
| Method | Route | Auth | Role | Purpose |
|--------|-------|------|------|---------|
| POST | `/learning/lessons/:courseId` | ✅ | Instructor | Create lesson |
| GET | `/learning/lessons/:lessonId` | ✅ | Any | Get lesson details |
| GET | `/learning/courses/:courseId/lessons` | ✅ | Any | List course lessons |

### Progress
| Method | Route | Auth | Role | Purpose |
|--------|-------|------|------|---------|
| POST | `/learning/progress/complete/:lessonId` | ✅ | Student | Mark complete |
| GET | `/learning/progress/course/:courseId` | ✅ | Student | Get progress |

### Video Playback
| Method | Route | Auth | Role | Purpose |
|--------|-------|------|------|---------|
| PUT | `/learning/video/:lessonId/playback` | ✅ | Student | Save position |
| GET | `/learning/video/:lessonId/progress` | ✅ | Student | Get resume info |

### Quiz
| Method | Route | Auth | Role | Purpose |
|--------|-------|------|------|---------|
| POST | `/learning/quiz/:lessonId/submit` | ✅ | Student | Submit quiz |

### Certificate
| Method | Route | Auth | Role | Purpose |
|--------|-------|------|------|---------|
| GET | `/learning/certificate/:courseId` | ✅ | Student | Get certificate |

### Dashboard
| Method | Route | Auth | Role | Purpose |
|--------|-------|------|------|---------|
| GET | `/learning/dashboard` | ✅ | Student | Dashboard with enrollments |
| GET | `/learning/resume/:courseId` | ✅ | Student | Resume data |

---

## 🔄 Data Flow Diagrams

### Enrollment Flow
```
User → Enroll in Course
  ↓
Create Enrollment Record
  ↓
Progress = 0%
  ↓
Status = 'active'
  ↓
Ready to learn
```

### Lesson Completion Flow
```
Student Watches Video (95%+)
  ↓
Auto-mark completion
  ↓
Update Progress Record
  ↓
Calculate Course Progress
  ↓
Is Course 100%? → YES → Auto-generate Certificate
                ↓ NO
            Update Enrollment
```

### Resume Flow
```
GET /learning/resume/:courseId
  ↓
Find last accessed lesson
  ↓
Get video playback position
  ↓
Calculate remaining time
  ↓
Return resume data
```

---

## ⚡ Performance Optimizations

### Database Indexes
```typescript
// Lesson indexes
courseId + moduleId + sequence // Fast curriculum loading

// Progress indexes
userId + courseId // Dashboard queries
userId + lessonId (unique) // Prevent duplicates

// Video history indexes
userId + lessonId (unique) // Fast resume lookup
```

### Query Optimization
```typescript
// Lean queries for read-only operations
this.lessonModel.find({courseId}).lean()

// Population only when needed
.populate('courseId', 'title instructor')

// Batch updates for multiple records
updateMany({userId, courseId}, {progress: 50})
```

### Caching Strategy
```
// Redis cache for:
- Student dashboard (1 hour)
- Course lessons list (24 hours)
- Video URLs (1 hour)
- User enrollments (30 minutes)
```

---

## 🚀 Scalability Considerations

### Video Streaming
- **S3 Storage** - Cloud storage for videos
- **CloudFront CDN** - Global video delivery
- **HLS Streaming** - Adaptive bitrate streaming
- **Signed URLs** - Secure, temporary access

### Database Scaling
- **MongoDB Sharding** - By userId for horizontal scaling
- **Read Replicas** - For heavy read workloads
- **Aggregation Pipeline** - For complex progress calculations

### Background Jobs
```typescript
// Bull Queue for async tasks:
- Certificate generation
- Progress calculations
- Email notifications
- Video transcoding
```

---

## 🔐 Security Best Practices Implemented

✅ **JWT Authentication** - All endpoints
✅ **Role-Based Access Control** - Instructor/Student/Admin
✅ **Enrollment Validation** - Access only own enrollments
✅ **Signed Video URLs** - S3 time-limited access
✅ **Input Validation** - Class-validator DTOs
✅ **Audit Logging** - Track all access
✅ **Rate Limiting** - Prevent API abuse
✅ **CORS Configuration** - Frontend origin validation

---

## 📊 Metrics & Analytics

### Tracked Metrics
- Course completion rate
- Average time per lesson
- Video quality preferences
- Quiz performance
- Certificate issuance
- Drop-off points in curriculum

### Query Examples
```typescript
// Top performing lessons
db.progress.aggregate([
  { $group: { _id: '$lessonId', avg_score: {$avg: '$quizScore'} } }
])

// Student engagement
db.videoHistory.aggregate([
  { $group: { _id: '$userId', total_hours: {$sum: '$videoDuration'} } }
])
```

---

## 🎓 Student Learning Dashboard

### Components Displayed
1. **In-Progress Courses** - With progress bars
2. **Completed Courses** - With certificates
3. **Recent Activity** - Last accessed lessons
4. **Achievements** - Certificates earned
5. **Stats** - Total courses, completion rate

### Resume Button
- Shows last accessed lesson
- Displays playback position
- Time remaining indicator
- One-click resume

---

## 🏆 Certificate Generation

### Certificate Triggers
- ✅ Course progress reaches 100%
- ✅ All lessons marked complete
- ✅ Quiz average ≥ 70%

### Certificate Data
- Unique certificate ID
- Issue date
- Student name
- Course title
- Completion percentage
- Grade/Score
- Instructor signature (digital)

### Verification
- Downloadable PDF
- QR code linking to verification page
- Certificate expiry (optional)
- Digital wallet integration (future)

---

## ✅ Testing Scenarios

### Happy Path
1. ✅ Enroll in free lesson
2. ✅ Watch video to 95%
3. ✅ Auto-complete
4. ✅ Move to next lesson
5. ✅ Complete course
6. ✅ Receive certificate

### Edge Cases
- ❌ Try accessing non-free lesson without enrollment
- ❌ Multiple concurrent progress updates
- ❌ Resume video after 30 days
- ❌ Submit quiz multiple times
- ❌ Complete lessons out of order

---

## 🔮 Future Enhancements

1. **Live Classes** - WebRTC integration
2. **Discussion Forum** - Peer-to-peer learning
3. **Peer Reviews** - Student assignment feedback
4. **Gamification** - Badges, leaderboards
5. **AI Recommendations** - Course suggestions
6. **Mobile App** - Native iOS/Android
7. **Analytics Dashboard** - Instructor insights
8. **Payment Integration** - Stripe/Razorpay
9. **Social Sharing** - Quick certificate sharing
10. **Adaptive Learning** - AI-based paths

---

## 📞 Support & Documentation

For questions or issues, refer to:
- Service layer documentation
- API route comments
- Schema inline comments
- DTO validation rules

---

**Last Updated:** February 18, 2026
**Status:** Production Ready