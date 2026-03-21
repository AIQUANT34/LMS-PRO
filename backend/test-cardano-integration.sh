#!/bin/bash

echo "🚀 Testing Cardano Integration"
echo "================================"

# Test 1: Check if backend is running
echo "📍 Test 1: Checking backend health..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running. Please start it first:"
    echo "   npm run start:dev"
    exit 1
fi

# Test 2: Check wallet info
echo ""
echo "📍 Test 2: Checking wallet configuration..."
response=$(curl -s http://localhost:3001/blockchain/wallet-info)
if echo "$response" | grep -q "success.*true"; then
    echo "✅ Wallet is configured"
    echo "📊 Wallet Details:"
    echo "$response" | grep -o '"address":"[^"]*"' | sed 's/"address":"//; s/"//'
    echo "$response" | grep -o '"network":"[^"]*"' | sed 's/"network":"//; s/"//'
else
    echo "❌ Wallet configuration error"
    echo "💡 Check your .env file for CARDANO_PROJECT_ID and CARDANO_PRIVATE_KEY"
fi

# Test 3: Test transaction submission
echo ""
echo "📍 Test 3: Testing transaction submission..."
test_response=$(curl -s -X POST http://localhost:3001/blockchain/submit \
  -H "Content-Type: application/json" \
  -d '{
    "certificateReference": "TEST-'$(date +%s)'",
    "completionHash": "test_hash_'$(date +%s)'"
  }')

if echo "$test_response" | grep -q "success.*true"; then
    echo "✅ Transaction submission working"
    tx_hash=$(echo "$test_response" | grep -o '"transactionHash":"[^"]*"' | sed 's/"transactionHash":"//; s/"//')
    echo "🔗 Test Transaction Hash: $tx_hash"
    echo "🔗 Explorer: https://preprod.cardanoscan.io/transaction/$tx_hash"
else
    echo "❌ Transaction submission failed"
    echo "💡 Check wallet has test ADA and network is 'preprod'"
fi

# Test 4: Check certificate verification
echo ""
echo "📍 Test 4: Testing certificate verification..."
if echo "$test_response" | grep -q "transactionHash"; then
    tx_hash=$(echo "$test_response" | grep -o '"transactionHash":"[^"]*"' | sed 's/"transactionHash":"//; s/"//')
    verify_response=$(curl -s http://localhost:3001/blockchain/status/$tx_hash)
    if echo "$verify_response" | grep -q "success.*true"; then
        echo "✅ Transaction verification working"
    else
        echo "⚠️ Transaction verification may need time"
    fi
fi

echo ""
echo "🎉 Cardano Integration Tests Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Approve a certificate in your LMS"
echo "2. Check the blockchain transaction appears on explorer"
echo "3. Verify the metadata structure matches requirements"
echo ""
echo "🔗 Useful Links:"
echo "- Preprod Explorer: https://preprod.cardanoscan.io/"
echo "- Faucet: https://docs.cardano.org/cardano-testnet-faucet"
echo "- Setup Guide: CARDANO_SETUP.md"
