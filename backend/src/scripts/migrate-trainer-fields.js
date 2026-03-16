const mongoose = require('mongoose');
require('dotenv').config();

// Migration script to fix trainer field inconsistencies
async function migrateTrainerFields() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find all users with trainer role
    const trainerUsers = await usersCollection.find({ role: 'trainer' }).toArray();
    console.log(`Found ${trainerUsers.length} trainer users`);

    for (const user of trainerUsers) {
      console.log(`\nProcessing user: ${user.email}`);
      console.log('Current fields:', {
        isVerifiedTrainer: user.isVerifiedTrainer,
        isVerifiedInstructor: user.isVerifiedInstructor,
        trainerRequest: user.trainerRequest,
        instructorRequest: user.instructorRequest
      });

      const updateData = {};

      // Migrate from old field names if they exist
      if (user.isVerifiedInstructor !== undefined && user.isVerifiedTrainer === undefined) {
        updateData.isVerifiedTrainer = user.isVerifiedInstructor;
        updateData.$unset = { isVerifiedInstructor: 1 };
        console.log(`Migrating isVerifiedInstructor (${user.isVerifiedInstructor}) -> isVerifiedTrainer`);
      }

      // Migrate from old request field names if they exist
      if (user.instructorRequest !== undefined && user.trainerRequest === undefined) {
        updateData.trainerRequest = user.instructorRequest;
        if (!updateData.$unset) updateData.$unset = {};
        updateData.$unset.instructorRequest = 1;
        console.log(`Migrating instructorRequest (${user.instructorRequest}) -> trainerRequest`);
      }

      // Ensure isVerifiedTrainer is set for approved trainers
      if (user.trainerRequest === 'approved' && user.isVerifiedTrainer === undefined) {
        updateData.isVerifiedTrainer = true;
        console.log('Setting isVerifiedTrainer = true for approved trainer');
      }

      // Apply updates if needed
      if (Object.keys(updateData).length > 0) {
        await usersCollection.updateOne(
          { _id: user._id },
          updateData
        );
        console.log('Updated user:', updateData);
      } else {
        console.log('No migration needed for this user');
      }
    }

    console.log('\nMigration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateTrainerFields();
