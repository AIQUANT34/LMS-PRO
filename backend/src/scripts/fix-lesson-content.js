const { connect, connection } = require('mongoose');
require('dotenv').config();

async function fixLessonContent() {
  try {
    // Connect to MongoDB
    const conn = await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lmsdb');
    console.log('🔗 Connected to MongoDB');

    // Get lessons collection
    const db = conn.connection.db;
    const lessonsCollection = db.collection('lessons');

    // Find lessons with malformed content
    const lessons = await lessonsCollection.find({
      content: { $regex: '^{"videoUrl"' }
    }).toArray();

    console.log(`📋 Found ${lessons.length} lessons with malformed content`);

    for (const lesson of lessons) {
      try {
        // Fix the content format
        const fixedContent = lesson.content.replace('{"videoUrl"', '{"videoUrl"');
        
        await lessonsCollection.updateOne(
          { _id: lesson._id },
          { 
            $set: { 
              content: fixedContent
            }
          }
        );
        
        console.log(`✅ Fixed content for lesson: ${lesson.title}`);
      } catch (error) {
        console.error(`❌ Failed to fix lesson ${lesson._id}:`, error);
      }
    }

    console.log('🎉 Lesson content fixed successfully');
    await conn.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  }
}

fixLessonContent();
