console.log('🔍 Cardano Testnet Certificate Verification');
console.log('==========================================');

const certificate = {
  blockchainTxId: "b1e4ea293d2733642bc2fbc3ae337d9ed858413236a1d50cd0211a31db0fe5e4",
  completionHash: "4dc21bf55b5a3a88a55fb17cea28b7e039f5a50abc32d835c85f79b4ed586ed2",
  certificateReference: "CERT-2026-134423"
};

console.log('\n📋 Certificate Info:');
console.log(`Reference: ${certificate.certificateReference}`);
console.log(`TxID: ${certificate.blockchainTxId}`);
console.log(`Hash: ${certificate.completionHash}`);

console.log('\n🌐 Testnet Explorer Links:');
console.log(`Primary: https://preview.cardanoscan.io/transaction/${certificate.blockchainTxId}`);
console.log(`Alternative: https://cexplorer.io/tx/${certificate.blockchainTxId}?tab=metadata`);

console.log('\n✅ Testnet Verification:');
console.log('1. Click the Primary link above');
console.log('2. Look for "Metadata" section');
console.log('3. Find label "674"');
console.log('4. Verify hash matches: 4dc21bf55b5a3a88a55fb17cea28b7e039f5a50abc32d835c85f79b4ed586ed2');
console.log('5. Check for "LMS Certificate Verification" purpose');

console.log('\n🎯 Expected Metadata Structure:');
console.log(JSON.stringify({
  "674": {
    "msg": [`Certificate verification hash: ${certificate.completionHash}`],
    "timestamp": "2026-03-19T...",
    "purpose": "LMS Certificate Verification"
  }
}, null, 2));

console.log('\n📱 API Verification:');
console.log(`GET http://localhost:3001/certificates/verify/${certificate.certificateReference}`);

console.log('\n✨ Your certificate is on Cardano Testnet!');
console.log('This is perfect for testing and development.');
console.log('The same verification process applies to mainnet when you deploy.');
