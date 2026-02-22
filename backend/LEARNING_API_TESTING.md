# Learning System API Testing Guide

## Environment Setup

```bash
# Base URL
BASE_URL=http://localhost:3000/api

# Token (from login)
TOKEN=your_jwt_token_here

# Example Enrollment ID (from enrollment response)
ENROLLMENT_ID=enrollment_id_here

# Example Course ID
COURSE_ID=course_id_here

# Example Lesson ID
LESSON_ID=lesson_id_here
```

---

## 1. LESSON MANAGEMENT APIs

### Create a Lesson
```bash
curl -X POST \
  ${BASE_URL}/learning/lessons/${COURSE_ID} \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to JavaScript",
    "description": "Learn the basics of JavaScript programming",
    "moduleId": "module-1",
    "type": "video",
    "videoUrl": "https://example.com/video.mp4",
    "videoDuration": 1800,
    "isFree": true,
    "sequence": 1,
    "durationMinutes": 30,
    "resources": [
      {
        "title": "Sample Code",
        "url": "https://example.com/code.zip"
      },
      {
        "title": "Slides",
        "url": "https://example.com/slides.pdf"
      }
    ]
  }'
```

**Response:**
```json
{
  "message": "Lesson created successfully",
  "lesson": {
    "_id": "lesson_id",
    "title": "Introduction to JavaScript",
    "courseId": "course_id",
    "type": "video",
    "sequence": 1,
    "createdAt": "2026-02-18T10:00:00.000Z"
  }
}
```

---

### Get Lesson Details
```bash
curl -X GET \
  ${BASE_URL}/learning/lessons/${LESSON_ID} \
  -H "Authorization: Bearer ${TOKEN}"
```

**Response:**
```json
{
  "_id": "lesson_id",
  "title": "Introduction to JavaScript",
  "description": "Learn the basics...",
  "courseId": "course_id",
  "type": "video",
  "videoUrl": "https://example.com/video.mp4",
  "videoDuration": 1800,
  "isFree": true,
  "sequence": 1,
  "resources": [...]
}
```

---

### Get All Lessons in a Course
```bash
curl -X GET \
  "${BASE_URL}/learning/courses/${COURSE_ID}/lessons" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Response:**
```json
{
  "lessons": [
    {
      "_id": "lesson_1",
      "title": "Lesson 1",
      "type": "video",
      "isFree": true
    },
    {
      "_id": "lesson_2",
      "title": "Lesson 2",
      "type": "video",
      "isFree": false
    }
  ],
  "isEnrolled": true
}
```

---

## 2. PROGRESS TRACKING APIs

### Mark Lesson as Complete
```bash
curl -X POST \
  "${BASE_URL}/learning/progress/complete/${LESSON_ID}?enrollmentId=${ENROLLMENT_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Response:**
```json
{
  "message": "Lesson marked as complete",
  "progress": {
    "_id": "progress_id",
    "userId": "user_id",
    "lessonId": "lesson_id",
    "isCompleted": true,
    "completedAt": "2026-02-18T10:30:00.000Z"
  }
}
```

---

### Get Course Progress
```bash
curl -X GET \
  "${BASE_URL}/learning/progress/course/${COURSE_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Response:**
```json
{
  "courseId": "course_id",
  "totalLessons": 10,
  "completedLessons": 4,
  "progressPercentage": 40,
  "lessons": [
    {
      "_id": "progress_1",
      "lessonId": {
        "title": "Lesson 1",
        "type": "video"
      },
      "isCompleted": true,
      "completedAt": "2026-02-18T10:30:00.000Z"
    }
  ]
}
```

---

## 3. VIDEO PLAYBACK APIs

### Save Video Playback Position
```bash
curl -X PUT \
  "${BASE_URL}/learning/video/${LESSON_ID}/playback?enrollmentId=${ENROLLMENT_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "currentTime": 642,
    "duration": 1800,
    "quality": "720p",
    "isSubtitlesEnabled": false,
    "watchRate": 1
  }'
```

**Response:**
```json
{
  "message": "Video playback saved",
  "videoHistory": {
    "_id": "video_history_id",
    "userId": "user_id",
    "lessonId": "lesson_id",
    "currentTime": 642,
    "videoDuration": 1800,
    "quality": "720p",
    "lastWatchedAt": "2026-02-18T10:45:00.000Z"
  }
}
```

---

### Get Video Progress (Resume Position)
```bash
curl -X GET \
  "${BASE_URL}/learning/video/${LESSON_ID}/progress" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Response:**
```json
{
  "currentTime": 642,
  "videoDuration": 1800,
  "quality": "720p",
  "isSubtitlesEnabled": false,
  "watchRate": 1,
  "lastWatchedAt": "2026-02-18T10:45:00.000Z"
}
```

---

## 4. QUIZ APIs

### Submit Quiz
```bash
curl -X POST \
  "${BASE_URL}/learning/quiz/${LESSON_ID}/submit?enrollmentId=${ENROLLMENT_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 85,
    "isPassed": true,
    "attempts": 1
  }'
```

**Response:**
```json
{
  "message": "Quiz submitted successfully",
  "score": 85,
  "passed": true,
  "progress": {
    "_id": "progress_id",
    "quizScore": 85,
    "isQuizPassed": true,
    "isCompleted": true
  }
}
```

---

## 5. CERTIFICATE APIs

### Get Certificate
```bash
curl -X GET \
  "${BASE_URL}/learning/certificate/${COURSE_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Response:**
```json
{
  "_id": "certificate_id",
  "userId": "user_id",
  "courseId": "course_id",
  "certificateId": "CERT-1708076400000-user_id",
  "certificateUrl": "/certificates/user_id/course_id.pdf",
  "issuedAt": "2026-02-18T11:00:00.000Z",
  "grade": "A",
  "score": 92,
  "completionPercentage": 100
}
```

---

## 6. DASHBOARD APIs

### Get Student Dashboard
```bash
curl -X GET \
  "${BASE_URL}/learning/dashboard" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Response:**
```json
{
  "totalEnrolled": 5,
  "inProgress": 3,
  "completed": 2,
  "certificatesEarned": 2,
  "enrollments": [
    {
      "_id": "enrollment_1",
      "user": "user_id",
      "course": {
        "_id": "course_1",
        "title": "Python for Beginners",
        "thumbnail": "url"
      },
      "progress": 60,
      "status": "active"
    }
  ],
  "certificates": [
    {
      "_id": "cert_1",
      "courseId": "course_2",
      "grade": "A",
      "issuedAt": "2026-02-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Resume Data
```bash
curl -X GET \
  "${BASE_URL}/learning/resume/${COURSE_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Response:**
```json
{
  "enrollmentProgress": 45,
  "lastAccessedLesson": {
    "_id": "lesson_id",
    "title": "Variables and Data Types",
    "type": "video"
  },
  "videoProgress": {
    "currentTime": 642,
    "videoDuration": 1800,
    "quality": "720p",
    "watchRate": 1,
    "lastWatchedAt": "2026-02-18T10:45:00.000Z"
  },
  "continueFromTime": 642
}
```

---

## Complete Testing Workflow

### Step 1: Enroll in a Course
```bash
# Use the enrollment API (from enrollments module)
curl -X POST \
  "${BASE_URL}/enrollments/enroll" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "'"${COURSE_ID}"'"
  }'

# Save the enrollment ID
ENROLLMENT_ID=<enrollment_id_from_response>
```

### Step 2: Get Course Lessons
```bash
curl -X GET \
  "${BASE_URL}/learning/courses/${COURSE_ID}/lessons" \
  -H "Authorization: Bearer ${TOKEN}"

# Save a lesson ID
LESSON_ID=<lesson_id_from_response>
```

### Step 3: Start Watching Video
```bash
curl -X GET \
  "${BASE_URL}/learning/lessons/${LESSON_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Step 4: Track Video Progress (Simulate Watch)
```bash
# After 5 minutes
curl -X PUT \
  "${BASE_URL}/learning/video/${LESSON_ID}/playback?enrollmentId=${ENROLLMENT_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"currentTime": 300, "duration": 1800}'

# After 10 minutes
curl -X PUT \
  "${BASE_URL}/learning/video/${LESSON_ID}/playback?enrollmentId=${ENROLLMENT_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"currentTime": 600, "duration": 1800}'

# After watching 95%
curl -X PUT \
  "${BASE_URL}/learning/video/${LESSON_ID}/playback?enrollmentId=${ENROLLMENT_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"currentTime": 1710, "duration": 1800}'
# This should auto-complete the lesson!
```

### Step 5: Check Course Progress
```bash
curl -X GET \
  "${BASE_URL}/learning/progress/course/${COURSE_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Step 6: Get Dashboard
```bash
curl -X GET \
  "${BASE_URL}/learning/dashboard" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Step 7: Complete All Lessons
Repeat steps 2-5 for all lessons in the course

### Step 8: Check Certificate (after 100% completion)
```bash
curl -X GET \
  "${BASE_URL}/learning/certificate/${COURSE_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
```

---

## Error Handling Examples

### Unauthorized Access (Not Enrolled)
```bash
curl -X GET \
  "${BASE_URL}/learning/lessons/${LESSON_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Response (403):**
```json
{
  "statusCode": 403,
  "message": "You must be enrolled to access this lesson",
  "error": "Forbidden"
}
```

---

### Not Found
```bash
curl -X GET \
  "${BASE_URL}/learning/lessons/invalid_id" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Response (404):**
```json
{
  "statusCode": 404,
  "message": "Lesson not found",
  "error": "Not Found"
}
```

---

## Postman Collection Template

```json
{
  "info": {
    "name": "LMS Learning System",
    "description": "API collection for learning module"
  },
  "item": [
    {
      "name": "Create Lesson",
      "request": {
        "method": "POST",
        "url": "{{BASE_URL}}/learning/lessons/{{COURSE_ID}}",
        "header": [
          {"key": "Authorization", "value": "Bearer {{TOKEN}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"title\": \"...\", \"type\": \"video\"}"
        }
      }
    },
    {
      "name": "Get Lesson",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/learning/lessons/{{LESSON_ID}}",
        "header": [
          {"key": "Authorization", "value": "Bearer {{TOKEN}}"}
        ]
      }
    }
  ]
}
```

---

## Performance Testing

### Load Test Video Progress Endpoint
```bash
# Using Apache Bench for concurrent requests
ab -n 1000 -c 50 \
  -H "Authorization: Bearer ${TOKEN}" \
  -p payload.json \
  ${BASE_URL}/learning/video/${LESSON_ID}/playback?enrollmentId=${ENROLLMENT_ID}
```

### Payload (payload.json)
```json
{
  "currentTime": 600,
  "duration": 1800
}
```

---

## Debugging Tips

1. **Check JWT Token Expiry**
   ```bash
   echo ${TOKEN} | base64 -d | jq
   ```

2. **Verify Enrollment**
   ```bash
   curl -X GET \
     "${BASE_URL}/enrollments/my-enrollments" \
     -H "Authorization: Bearer ${TOKEN}"
   ```

3. **Check Database Directly**
   ```bash
   # MongoDB
   mongo
   use lms-db
   db.progresses.find({userId: "user_id"})
   ```

4. **Enable Verbose Logging**
   ```bash
   # Add to curl for more details
   curl -v ...
   ```

---

## Success Criteria

- ✅ Lesson created for instructor
- ✅ Student can access free lessons
- ✅ Premium lessons blocked without enrollment
- ✅ Video playback position saved
- ✅ Progress percentage calculated
- ✅ Auto-completion at 95% watch
- ✅ Quiz submission tracked
- ✅ Certificate generated at 100%
- ✅ Dashboard shows all enrollments
- ✅ Resume continues from last position

---

**Last Updated:** February 18, 2026