const { connect, connection } = require('mongoose');
require('dotenv').config();

async function updateCourseEnrollmentCounts() {
  try {
    // Connect to MongoDB
    const conn = await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lmsdb');
    console.log('🔗 Connected to MongoDB');

    // Get collections
    const db = conn.connection.db;
    const coursesCollection = db.collection('courses');
    const enrollmentsCollection = db.collection('enrollments');

    // Get all courses
    const courses = await coursesCollection.find({}).toArray();
    console.log(`📋 Found ${courses.length} courses`);

    for (const course of courses) {
      // Count enrollments for this course
      const enrollmentCount = await enrollmentsCollection.countDocuments({ course: course._id.toString() });
      
      console.log(`🎯 Course: ${course.title} - Enrollments: ${enrollmentCount}`);
      
      // Update course enrollmentCount
      await coursesCollection.updateOne(
        { _id: course._id },
        { 
          $set: { 
            enrollmentCount: enrollmentCount
          }
        }
      );
      
      console.log(`✅ Updated course "${course.title}" enrollmentCount to ${enrollmentCount}`);
    }

    console.log('🎉 Course enrollment counts updated successfully');
    await conn.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

updateCourseEnrollmentCounts();
