#!/bin/bash

echo "🚀 Installing Cardano dependencies..."

# Install Lucid Cardano
npm install lucid-cardano

# Install types for better TypeScript support
npm install --save-dev @types/lucid-cardano

echo "✅ Cardano dependencies installed successfully!"
echo ""
echo "📋 Required environment variables (.env):"
echo "CARDANO_PROJECT_ID=your_blockfrost_project_id"
echo "CARDANO_PRIVATE_KEY=your_wallet_private_key"
echo "CARDANO_NETWORK=preprod"
echo ""
echo "🔗 Get test ADA from faucet:"
echo "https://docs.cardano.org/cardano-testnet-faucet"
