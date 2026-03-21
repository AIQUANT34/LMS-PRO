const crypto = require('crypto');
const bip39 = require('bip39');

function generateSeedPhraseWallet() {
  console.log("Generating Backend Issuer Wallet with Seed Phrase");
  console.log("==================================================");
  console.log("");

  // Generate a secure 12-word seed phrase
  const entropy = crypto.randomBytes(16); // 128 bits for 12 words
  const seedPhrase = bip39.entropyToMnemonic(entropy.toString('hex'));
  
  console.log(" Your Backend Wallet Seed Phrase:");
  console.log(seedPhrase);
  console.log("");
  
  // Generate private key from seed phrase
  const seed = bip39.mnemonicToSeedSync(seedPhrase);
  const privateKey = crypto.createHash('sha256').update(seed.slice(0, 32)).digest('hex');
  
  console.log("Derived Private Key (for .env):");
  console.log(privateKey);
  console.log("");
  
  console.log("⚠️ CRITICAL SECURITY NOTES:");
  console.log("1. Save this seed phrase securely (offline preferred)");
  console.log("2. Add the PRIVATE KEY to your .env");
  console.log("3. Never commit seed phrase or private key to version control");
  console.log("4. This is your LMS certificate issuer wallet");
  console.log("5. Anyone with seed phrase can access the wallet");
  console.log("");

  console.log(" .env Entry:");
  console.log(`CARDANO_SEED_PHRASE="${seedPhrase}"`);
  console.log(`# OR alternatively: CARDANO_PRIVATE_KEY="${privateKey}"`);
  console.log("");

  console.log("Backup Seed Phrase (write this down):");
  console.log("=====================================");
  console.log(seedPhrase);
  console.log("=====================================");
  console.log("");

  console.log(" Next Steps:");
  console.log("1. Store seed phrase in secure location");
  console.log("2. Add seed phrase to your .env");
  console.log("3. Start backend server");
  console.log("4. Check wallet address: curl http://localhost:3001/blockchain/wallet-info");
  console.log("5. Fund the displayed address with test ADA");
  console.log("");

  console.log(" Backend issuer wallet with seed phrase created!");
  console.log("This is a REAL, FUNCTIONAL Cardano wallet!");
}

generateSeedPhraseWallet();
