#!/usr/bin/env node
const { ethers } = require("hardhat");
const axios = require("axios");
require("dotenv").config();

async function main() {
    console.log("🔍 CHECKING TOKEN STATUS - COMPREHENSIVE ANALYSIS");
    
    const [deployer] = await ethers.getSigners();
    const USDTZ_ADDRESS = process.env.TOKEN_ADDR || "0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef";
    
    console.log("📍 Token Address:", USDTZ_ADDRESS);
    console.log("👤 Deployer:", deployer.address);
    console.log("🌐 Network:", hre.network.name);
    
    try {
        // 1. Check contract on blockchain
        console.log("\n📋 1. BLOCKCHAIN STATUS:");
        const USDTz = await ethers.getContractAt("USDTz", USDTZ_ADDRESS);
        
        const name = await USDTz.name();
        const symbol = await USDTz.symbol();
        const decimals = await USDTz.decimals();
        const totalSupply = await USDTz.totalSupply();
        const deployerBalance = await USDTz.balanceOf(deployer.address);
        
        console.log("✅ Contract accessible");
        console.log("• Name:", name);
        console.log("• Symbol:", symbol);
        console.log("• Decimals:", decimals);
        console.log("• Total Supply:", ethers.formatEther(totalSupply));
        console.log("• Deployer Balance:", ethers.formatEther(deployerBalance));
        
        // 2. Check BscScan verification
        console.log("\n🔍 2. BSCSCAN VERIFICATION:");
        try {
            const bscscanAPI = `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${USDTZ_ADDRESS}&apikey=${process.env.BSCSCAN_KEY}`;
            const response = await axios.get(bscscanAPI);
            
            if (response.data.result[0].SourceCode) {
                console.log("✅ Contract is VERIFIED on BscScan");
                console.log("• Contract Name:", response.data.result[0].ContractName);
                console.log("• Compiler Version:", response.data.result[0].CompilerVersion);
            } else {
                console.log("❌ Contract is NOT VERIFIED on BscScan");
                console.log("💡 Run: npx hardhat run scripts/verify-fix.js --network bsc");
            }
        } catch (error) {
            console.log("⚠️ Could not check BscScan verification:", error.message);
        }
        
        // 3. Check PancakeSwap pair
        console.log("\n🥞 3. PANCAKESWAP LIQUIDITY:");
        const PANCAKE_FACTORY = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
        const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        
        const factoryABI = [
            "function getPair(address tokenA, address tokenB) external view returns (address pair)"
        ];
        
        const Factory = await ethers.getContractAt(factoryABI, PANCAKE_FACTORY);
        const pairAddress = await Factory.getPair(USDTZ_ADDRESS, WBNB_ADDRESS);
        
        if (pairAddress !== "0x0000000000000000000000000000000000000000") {
            console.log("✅ Liquidity pair EXISTS");
            console.log("• Pair Address:", pairAddress);
            console.log("• PancakeSwap Info:", `https://pancakeswap.finance/info/pool/${pairAddress}`);
            
            // Check pair balance
            const pairABI = [
                "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
                "function token0() external view returns (address)",
                "function token1() external view returns (address)"
            ];
            
            try {
                const Pair = await ethers.getContractAt(pairABI, pairAddress);
                const reserves = await Pair.getReserves();
                const token0 = await Pair.token0();
                const token1 = await Pair.token1();
                
                console.log("• Token0:", token0);
                console.log("• Token1:", token1);
                console.log("• Reserve0:", ethers.formatEther(reserves.reserve0));
                console.log("• Reserve1:", ethers.formatEther(reserves.reserve1));
                
                if (reserves.reserve0 > 0 && reserves.reserve1 > 0) {
                    console.log("✅ Pair has LIQUIDITY - Price data available");
                } else {
                    console.log("❌ Pair exists but NO LIQUIDITY");
                    console.log("💡 Run: npx hardhat run scripts/add-liquidity-fix.js --network bsc");
                }
            } catch (error) {
                console.log("⚠️ Could not check pair reserves:", error.message);
            }
        } else {
            console.log("❌ NO liquidity pair found");
            console.log("💡 Run: npx hardhat run scripts/add-liquidity-fix.js --network bsc");
        }
        
        // 4. Check Trust Wallet assets
        console.log("\n🛡️ 4. TRUST WALLET ASSETS:");
        const fs = require("fs");
        const assetPath = `blockchains/smartchain/assets/${USDTZ_ADDRESS}`;
        
        if (fs.existsSync(assetPath)) {
            console.log("✅ Asset folder exists");
            
            if (fs.existsSync(`${assetPath}/info.json`)) {
                console.log("✅ info.json exists");
            } else {
                console.log("❌ info.json missing");
            }
            
            if (fs.existsSync(`${assetPath}/logo.png`)) {
                console.log("✅ logo.png exists");
            } else {
                console.log("❌ logo.png missing");
            }
        } else {
            console.log("❌ Asset folder missing");
            console.log("💡 Run: npx hardhat run scripts/create-trust-assets.js");
        }
        
        // 5. Check token list
        console.log("\n📋 5. TOKEN LIST:");
        if (fs.existsSync("trust-token-list-fixed.json")) {
            const tokenList = JSON.parse(fs.readFileSync("trust-token-list-fixed.json", "utf8"));
            const token = tokenList.tokens.find(t => t.address.toLowerCase() === USDTZ_ADDRESS.toLowerCase());
            
            if (token) {
                console.log("✅ Token in list with correct address");
                console.log("• Logo URL:", token.logoURI);
            } else {
                console.log("❌ Token not found in list or wrong address");
            }
        } else {
            console.log("❌ Fixed token list not found");
            console.log("💡 Use trust-token-list-fixed.json instead of trust-token-list.json");
        }
        
        // 6. Summary and recommendations
        console.log("\n🎯 SUMMARY & RECOMMENDATIONS:");
        
        const issues = [];
        const solutions = [];
        
        // Check verification
        try {
            const bscscanAPI = `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${USDTZ_ADDRESS}&apikey=${process.env.BSCSCAN_KEY}`;
            const response = await axios.get(bscscanAPI);
            if (!response.data.result[0].SourceCode) {
                issues.push("Contract not verified");
                solutions.push("npx hardhat run scripts/verify-fix.js --network bsc");
            }
        } catch (e) {}
        
        // Check liquidity
        if (pairAddress === "0x0000000000000000000000000000000000000000") {
            issues.push("No liquidity pair");
            solutions.push("npx hardhat run scripts/add-liquidity-fix.js --network bsc");
        }
        
        // Check assets
        if (!fs.existsSync(`blockchains/smartchain/assets/${USDTZ_ADDRESS}/info.json`)) {
            issues.push("Missing Trust Wallet assets");
            solutions.push("npx hardhat run scripts/create-trust-assets.js");
        }
        
        if (issues.length === 0) {
            console.log("🎉 ALL SYSTEMS OPERATIONAL!");
            console.log("✅ Token should display properly in wallets");
            console.log("✅ Logo should be visible");
            console.log("✅ USD value should show (if liquidity exists)");
        } else {
            console.log("⚠️ Issues found:", issues.length);
            issues.forEach((issue, i) => {
                console.log(`${i + 1}. ${issue}`);
                console.log(`   Solution: ${solutions[i]}`);
            });
        }
        
    } catch (error) {
        console.error("❌ Error checking token status:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("💥 Fatal error:", error);
        process.exit(1);
    });