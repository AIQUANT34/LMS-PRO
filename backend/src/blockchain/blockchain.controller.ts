import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('wallet-info')
  async getWalletInfo() {
    try {
      const info = await this.blockchainService.getWalletInfo();
      return {
        success: true,
        data: info,
        message: 'Wallet information retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve wallet information'
      };
    }
  }

  @Post('submit')
  async submitTransaction(@Body() body: { certificateReference: string; completionHash: string }) {
    try {
      const txHash = await this.blockchainService.submitHashToCardano({
        certificateReference: body.certificateReference,
        completionHash: body.completionHash
      });
      
      return {
        success: true,
        data: {
          transactionHash: txHash,
          explorerUrl: `https://preprod.cardanoscan.io/transaction/${txHash}`
        },
        message: 'Transaction submitted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to submit transaction'
      };
    }
  }

  @Get('status/:txId')
  async getTransactionStatus(@Param('txId') txId: string) {
    try {
      const status = await this.blockchainService.getTransactionStatus(txId);
      
      return {
        success: true,
        data: status,
        message: 'Transaction status retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve transaction status'
      };
    }
  }

  @Get('confirm/:txId')
  async confirmTransaction(@Param('txId') txId: string) {
    try {
      const confirmed = await this.blockchainService.waitForTransactionConfirmation(txId);
      
      return {
        success: true,
        data: { confirmed },
        message: confirmed ? 'Transaction confirmed' : 'Transaction confirmation timeout'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to confirm transaction'
      };
    }
  }
}
