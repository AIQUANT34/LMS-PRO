const { connect, connection } = require('mongoose');
require('dotenv').config();

async function updateCourseLessonCounts() {
  try {
    // Connect to MongoDB
    const conn = await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lmsdb');
    console.log('🔗 Connected to MongoDB');

    // Get collections
    const db = conn.connection.db;
    const coursesCollection = db.collection('courses');
    const lessonsCollection = db.collection('lessons');

    // Get all courses
    const courses = await coursesCollection.find({}).toArray();
    console.log(`📋 Found ${courses.length} courses`);

    for (const course of courses) {
      // Count lessons for this course
      const lessonCount = await lessonsCollection.countDocuments({ courseId: course._id.toString() });
      
      console.log(`🎯 Course: ${course.title} - Lessons: ${lessonCount}`);
      
      // Update course totalLessons
      await coursesCollection.updateOne(
        { _id: course._id },
        { 
          $set: { 
            totalLessons: lessonCount
          }
        }
      );
      
      console.log(`✅ Updated course "${course.title}" totalLessons to ${lessonCount}`);
    }

    console.log('🎉 Course lesson counts updated successfully');
    await conn.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

updateCourseLessonCounts();
