import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto'

@Injectable()
export class BlockchainService {
    async submitHashToCardano(hash: string): Promise<string>{
    //simulate blockchain tx id
    // later replace this with real cardano testnet cell

    const txId = crypto
      .createHash('sha256')
      .update(hash + Date.now().toString())
      .digest('hex')

    return txId
  }

}