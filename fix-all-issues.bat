@echo off
echo 🚀 FIXING ALL USDTZ TOKEN ISSUES
echo ================================

echo.
echo 📋 Step 1: Checking current status...
call npx hardhat run scripts/check-token-status.js --network bsc

echo.
echo 🔍 Step 2: Verifying contract on BscScan...
call npx hardhat run scripts/verify-fix.js --network bsc

echo.
echo 💧 Step 3: Adding liquidity to PancakeSwap...
call npx hardhat run scripts/add-liquidity-fix.js --network bsc

echo.
echo 🛡️ Step 4: Creating Trust Wallet assets...
call npx hardhat run scripts/create-trust-assets.js

echo.
echo 📋 Step 5: Final status check...
call npx hardhat run scripts/check-token-status.js --network bsc

echo.
echo 🎉 ALL FIXES COMPLETED!
echo.
echo 📝 NEXT STEPS:
echo 1. Replace trust-token-list.json with trust-token-list-fixed.json
echo 2. Wait 10-30 minutes for changes to propagate
echo 3. Test adding token to Trust Wallet manually
echo 4. Start monitoring: npx hardhat run scripts/auto-transfer-monitor.js --network bsc
echo.
echo 🔗 USEFUL LINKS:
echo • BscScan: https://bscscan.com/address/0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef
echo • PancakeSwap: https://pancakeswap.finance/swap?outputCurrency=0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef
echo • Add to Trust Wallet: Use contract address 0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef

pause