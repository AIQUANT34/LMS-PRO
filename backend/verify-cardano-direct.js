const https = require('https');

// Certificate data from your database
const certificate = {
  certificateId: "CERT-1773920582873-23zeoiusw",
  certificateReference: "CERT-2026-134423",
  blockchainTxId: "b1e4ea293d2733642bc2fbc3ae337d9ed858413236a1d50cd0211a31db0fe5e4",
  completionHash: "4dc21bf55b5a3a88a55fb17cea28b7e039f5a50abc32d835c85f79b4ed586ed2",
  studentName: "Abhishek",
  courseName: "Business Analytics",
  trainerName: "Anjali"
};

console.log('🔍 Verifying Certificate on Cardano Blockchain');
console.log('===========================================');

console.log('\n📋 Certificate Details:');
console.log(`Certificate ID: ${certificate.certificateId}`);
console.log(`Reference: ${certificate.certificateReference}`);
console.log(`Student: ${certificate.studentName}`);
console.log(`Course: ${certificate.courseName}`);
console.log(`Trainer: ${certificate.trainerName}`);
console.log(`Completion Hash: ${certificate.completionHash}`);
console.log(`Blockchain TxID: ${certificate.blockchainTxId}`);

console.log('\n🌐 Blockchain Explorer Links:');
console.log(`Cardano Explorer: https://preview.cardanoscan.io/transaction/${certificate.blockchainTxId}`);
console.log(`CExplorer: https://cexplorer.io/tx/${certificate.blockchainTxId}?tab=metadata`);
console.log(`Cardanoscan (Mainnet): https://cardanoscan.io/transaction/${certificate.blockchainTxId}`);

console.log('\n🔍 What to Look For:');
console.log('1. Transaction should exist and be confirmed');
console.log('2. Look for metadata with label "674"');
console.log('3. Metadata should contain:');
console.log('   - msg: ["Certificate verification hash: 4dc21bf55b5a3a88a55fb17cea28b7e039f5a50abc32d835c85f79b4ed586ed2"]');
console.log('   - timestamp: [ISO date]');
console.log('   - purpose: "LMS Certificate Verification"');

console.log('\n📱 Verification Steps:');
console.log('1. Click on any of the explorer links above');
console.log('2. Check if the transaction exists and is confirmed');
console.log('3. Look at the "Metadata" section');
console.log('4. Find label "674" and verify the hash matches');
console.log('5. The hash should exactly match your completion hash');

console.log('\n🔗 Quick Check via API:');
console.log('You can also verify via the verification API:');
console.log(`GET http://localhost:3001/certificates/verify/${certificate.certificateReference}`);

// Function to check transaction via API
function checkTransaction() {
  const url = `https://preview.cardanoscan.io/api/transaction/summary?txHash=${certificate.blockchainTxId}`;
  
  https.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('\n📊 API Response:');
        if (result.success && result.data) {
          console.log('✅ Transaction found!');
          console.log(`Block: ${result.data.blockHeight || 'N/A'}`);
          console.log(`Slot: ${result.data.slot || 'N/A'}`);
          console.log(`Time: ${result.data.epochSlot || 'N/A'}`);
          
          if (result.data.metadata) {
            console.log('\n📋 Metadata Found:');
            console.log(JSON.stringify(result.data.metadata, null, 2));
          }
        } else {
          console.log('❌ Transaction not found or API error');
        }
      } catch (error) {
        console.log('❌ Error parsing API response:', error.message);
      }
    });
  }).on('error', (error) => {
    console.log('❌ API request failed:', error.message);
  });
}

console.log('\n🔄 Checking transaction via API...');
checkTransaction();

console.log('\n✅ Verification Complete!');
console.log('If the transaction exists and metadata matches, your certificate is verified on Cardano blockchain!');