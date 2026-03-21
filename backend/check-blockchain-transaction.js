const mongoose = require('mongoose');

async function checkBlockchainTransaction() {
  try {
    console.log('🔍 Checking certificate blockchain transaction...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/lms-pro');
    console.log('Connected to MongoDB');
    
    // List all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections in database:`);
    
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name}`);
    });
    
    // Check if certificates collection exists
    const certificatesCollection = collections.find(c => c.name === 'certificates');
    if (!certificatesCollection) {
      console.log(' No certificates collection found');
      
      // Check for alternative collection names
      const alternativeNames = ['certificate', 'Certificate', 'certs', 'certification'];
      const found = [];
      
      for (const altName of alternativeNames) {
        try {
          const altCollection = db.collection(altName);
          const count = await altCollection.countDocuments();
          if (count > 0) {
            found.push({ name: altName, count });
          }
        } catch (err) {
          // Collection doesn't exist, skip
        }
      }
      
      if (found.length > 0) {
        console.log('🔍 Found alternative certificate collections:');
        found.forEach(f => console.log(`   ${f.name}: ${f.count} documents`));
        
        // Check the first found collection
        const altCollection = db.collection(found[0].name);
        const certs = await altCollection.find({}).toArray();
        
        console.log('\n Certificates in alternative collection:');
        certs.forEach((cert, index) => {
          console.log(`${index + 1}. Certificate ID: ${cert.certificateId || cert._id}`);
          console.log(`   Student: ${cert.studentName || 'N/A'}`);
          console.log(`   Course: ${cert.courseName || 'N/A'}`);
          console.log(`   Has TxID: ${!!cert.blockchainTxId}`);
          console.log(`   BlockchainTxId: ${cert.blockchainTxId || 'none'}`);
          console.log('---');
        });
        
        if (certs.length > 0 && certs[0].blockchainTxId) {
          const certificate = certs[0];
          console.log('\n🔗 Blockchain Transaction ID:', certificate.blockchainTxId);
          console.log('🌐 Cardano Explorer URL:', `https://preview.cardanoscan.io/transaction/${certificate.blockchainTxId}`);
        }
      } else {
        console.log(' No certificate collections found');
      }
      return;
    }
    
    // If certificates collection exists, check its contents
    const certificates = db.collection('certificates');
    const allCertificates = await certificates.find({}).toArray();
    console.log(` Found ${allCertificates.length} certificates in database:`);
    
    allCertificates.forEach((cert, index) => {
      console.log(`${index + 1}. Certificate ID: ${cert.certificateId}`);
      console.log(`   Reference: ${cert.certificateReference || 'undefined'}`);
      console.log(`   Student: ${cert.studentName}`);
      console.log(`   Course: ${cert.courseName}`);
      console.log(`   Approved: ${cert.isApproved}`);
      console.log(`   Has Hash: ${!!cert.completionHash}`);
      console.log(`   Has TxID: ${!!cert.blockchainTxId}`);
      console.log(`   BlockchainTxId: ${cert.blockchainTxId || 'none'}`);
      console.log('---');
    });
    
    if (allCertificates.length === 0) {
      console.log('❌ No certificates found in database');
      return;
    }
    
    // Use the first certificate that has blockchainTxId
    const certificate = allCertificates.find(cert => cert.blockchainTxId) || allCertificates[0];
    
    console.log('\n🔍 Analyzing certificate:', certificate.certificateId);
    
    if (!certificate.blockchainTxId) {
      console.log('❌ No blockchain transaction ID found');
      console.log('💡 The certificate needs to be approved to generate blockchain transaction');
      return;
    }
    
    console.log('🔗 Blockchain Transaction ID:', certificate.blockchainTxId);
    console.log('🌐 Cardano Explorer URL:', `https://preview.cardanoscan.io/transaction/${certificate.blockchainTxId}`);
    
  } catch (error) {
    console.error('❌ Error checking blockchain transaction:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkBlockchainTransaction();
