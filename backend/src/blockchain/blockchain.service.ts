import { Injectable, Logger } from '@nestjs/common';
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';



@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private Blockfrost: any;
  private Lucid: any;
  private lucid: any;

  private async loadLucid() {
    if (!this.Lucid) {
      const lucidModule: any = await import("lucid-cardano");

      // IMPORTANT: handle ESM export structure
      this.Lucid = lucidModule.Lucid || lucidModule.default?.Lucid;
      this.Blockfrost =
        lucidModule.Blockfrost || lucidModule.default?.Blockfrost;

      this.logger.log("✅ Lucid loaded correctly");
    }
  }

  private async getLucid(): Promise<any> {
    if(!this.lucid){
      await this.initializeLucid()
    }
    return this.lucid;
  }

  private async initializeLucid() {
    await this.loadLucid();

    const network = process.env.CARDANO_NETWORK || "preprod";
    const projectId = process.env.CARDANO_PROJECT_ID!;
    const seedPhrase = process.env.CARDANO_SEED_PHRASE!;

    this.logger.log(`🔗 Initializing Lucid with network: ${network}`);

    const provider = new this.Blockfrost(
      network === "mainnet"
        ? "https://cardano-mainnet.blockfrost.io/api/v0"
        : "https://cardano-preprod.blockfrost.io/api/v0",
      projectId
    );

    // ✅ create instance with retry logic
    try {
      this.lucid = await this.Lucid.new(
        provider,
        network === "mainnet" ? "Mainnet" : "Preprod"
      );
    } catch (error) {
      this.logger.error('❌ Failed to create Lucid instance:', error.message);
      if (error.message?.includes('fetch failed') || error.message?.includes('ETIMEDOUT')) {
        throw new Error('Network connectivity issue. Please check your internet connection and Blockfrost API status.');
      }
      throw error;
    }

    // ✅ Use correct v0.10.11 API - selectWalletFromSeed method
    await this.lucid.selectWalletFromSeed(seedPhrase);

    // ✅ Quick Runtime Check (Add Debug)
    const addr = await this.lucid.wallet.address();
    this.logger.log("Wallet:", addr);

    this.logger.log("✅ Wallet selected successfully");
  }

  async submitHashToCardano(certificateData: {
    certificateReference: string;
    completionHash: string;
  }): Promise<string> {
    try {
      this.logger.log('🔗 Submitting certificate to Cardano blockchain...');
      this.logger.log(`🔗 Certificate Reference: ${certificateData.certificateReference}`);
      this.logger.log(`🔗 Completion Hash: ${certificateData.completionHash}`);
      
      // Ensure Lucid is initialized
      if (!this.lucid) {
        await this.initializeLucid();
      }

      // Get wallet address and balance
      const walletAddress = await this.lucid.wallet.address();
      const utxos = await this.lucid.wallet.getUtxos();
      
      this.logger.log(`🔗 Wallet Address: ${walletAddress}`);
      this.logger.log(`🔗 Available UTXOs: ${utxos?.length || 0}`);
      
      if (!utxos || utxos.length === 0) {
        throw new Error('No UTXOs available in wallet. Please fund the wallet with test ADA.');
      }

      // Create metadata with required structure
      const metadata = {
        [674]: {
          certificateReference: certificateData.certificateReference,
          completionHash: certificateData.completionHash,
          purpose: "LMS Certificate Verification",
          timestamp: new Date().toISOString()
        }
      };

      this.logger.log('🔗 Metadata created:', JSON.stringify(metadata, null, 2));

      // Build transaction
      const tx = await this.lucid
        .newTx()
        .addSigner(walletAddress)
        .attachMetadata(674, (metadata as any)[674])
        .complete();

      // Sign transaction
      const signedTx = await tx.sign().complete();
      
      // Submit transaction
      const txHash = await signedTx.submit();
      
      this.logger.log(`✅ Transaction submitted successfully!`);
      this.logger.log(`🔗 Transaction Hash: ${txHash}`);
      this.logger.log(`🔗 Explorer URL: https://preprod.cardanoscan.io/transaction/${txHash}`);
      
      return txHash;
      
    } catch (error) {
      this.logger.error('❌ Cardano transaction failed:', error);
      
      // Handle specific errors
      if (error.message?.includes('No UTXOs')) {
        throw new Error('Wallet has no funds. Please fund wallet with test ADA from preprod faucet.');
      }
      
      if (error.message?.includes('private key')) {
        throw new Error('Invalid private key. Please check CARDANO_PRIVATE_KEY environment variable.');
      }
      
      if (error.message?.includes('projectId')) {
        throw new Error('Invalid Blockfrost project ID. Please check CARDANO_PROJECT_ID environment variable.');
      }
      
      throw new Error(`Cardano transaction failed: ${error.message}`);
    }
  }

  async getTransactionStatus(txId: string): Promise<any> {
    try {
      this.logger.log(`🔍 Checking transaction status: ${txId}`);
      
      // Use Blockfrost API to get transaction info
      const txInfo = await (this.Blockfrost as any).tx(txId);
      
      if (txInfo) {
        this.logger.log(`✅ Transaction found: ${txInfo.hash}`);
        this.logger.log(`🔗 Block: ${txInfo.block}`);
        this.logger.log(`🔗 Confirmations: ${txInfo.confirmations}`);
        return txInfo;
      } else {
        this.logger.warn(`⚠️ Transaction not found: ${txId}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`❌ Failed to get transaction status for ${txId}:`, error);
      return null;
    }
  }

  async waitForTransactionConfirmation(txId: string, maxWaitTime: number = 300000): Promise<boolean> {
    try {
      this.logger.log(`⏳ Waiting for transaction confirmation: ${txId}`);
      
      const startTime = Date.now();
      
      while (Date.now() - startTime < maxWaitTime) {
        const txInfo = await this.getTransactionStatus(txId);
        
        if (txInfo && txInfo.confirmations > 0) {
          this.logger.log(`✅ Transaction confirmed: ${txId}`);
          return true;
        }
        
        // Wait 10 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
      
      this.logger.warn(`⏰ Transaction confirmation timeout: ${txId}`);
      return false;
    } catch (error) {
      this.logger.error(`❌ Error waiting for confirmation: ${txId}`, error);
      return false;
    }
  }

  async getWalletInfo(): Promise<any> {
    try {
      if (!this.lucid) {
        await this.initializeLucid();
      }
      
      const address = await this.lucid.wallet.address();
      const utxos = await this.lucid.wallet.getUtxos();
      const balance = await this.lucid.wallet.balance();
      
      return {
        address,
        utxos: utxos?.length || 0,
        balance: balance,
        network: process.env.CARDANO_NETWORK || 'preprod'
      };
    } catch (error) {
      this.logger.error('❌ Failed to get wallet info:', error);
      return null;
    }
  }
}
