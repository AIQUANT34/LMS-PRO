const { connect, connection } = require('mongoose');
require('dotenv').config();

async function cleanupCertificates() {
  try {
    // Connect to MongoDB
    const conn = await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lmsdb');
    console.log('🔗 Connected to MongoDB');

    // Get certificates collection
    const db = conn.connection.db;
    const certificatesCollection = db.collection('certificates');

    // Find certificates with null certificateReference
    const nullCertificates = await certificatesCollection.find({ 
      certificateReference: null 
    }).toArray();

    console.log(`📋 Found ${nullCertificates.length} certificates with null certificateReference`);

    if (nullCertificates.length > 0) {
      // Update each certificate with a unique reference
      for (const cert of nullCertificates) {
        const newReference = `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        await certificatesCollection.updateOne(
          { _id: cert._id },
          { 
            $set: { 
              certificateReference: newReference,
              certificateId: cert.certificateId || newReference
            }
          }
        );
        
        console.log(`✅ Updated certificate ${cert._id} with reference: ${newReference}`);
      }
    }

    console.log('🎉 Certificate cleanup completed successfully');
    await conn.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanupCertificates();
