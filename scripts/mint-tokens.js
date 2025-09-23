#!/usr/bin/env node
const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🪙 MINTING TOKENS FOR LIQUIDITY");
    
    const [deployer] = await ethers.getSigners();
    const USDTZ_ADDRESS = process.env.TOKEN_ADDR || "0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef";
    
    console.log("💰 Deployer:", deployer.address);
    console.log("📍 Token Address:", USDTZ_ADDRESS);
    
    // Get contract
    const USDTz = await ethers.getContractAt("USDTz", USDTZ_ADDRESS);
    
    // Check current balances
    const totalSupply = await USDTz.totalSupply();
    const deployerBalance = await USDTz.balanceOf(deployer.address);
    const owner = await USDTz.owner();
    
    console.log("📊 Current Status:");
    console.log("• Total Supply:", ethers.formatEther(totalSupply));
    console.log("• Deployer Balance:", ethers.formatEther(deployerBalance));
    console.log("• Contract Owner:", owner);
    console.log("• Deployer Address:", deployer.address);
    
    if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
        console.log("❌ Deployer is not the owner!");
        console.log("💡 Only the owner can mint tokens");
        console.log("🔑 Owner address:", owner);
        console.log("👤 Deployer address:", deployer.address);
        return;
    }
    
    if (deployerBalance > 0) {
        console.log("✅ Deployer already has tokens!");
        console.log("💰 Balance:", ethers.formatEther(deployerBalance), "USDTz");
        return;
    }
    
    // Mint tokens for liquidity
    const mintAmount = ethers.parseEther("100000"); // 100k tokens for liquidity
    
    console.log("🪙 Minting tokens...");
    console.log("• Amount:", ethers.formatEther(mintAmount), "USDTz");
    console.log("• To:", deployer.address);
    
    try {
        const mintTx = await USDTz.mint(deployer.address, mintAmount);
        console.log("⏳ Transaction sent:", mintTx.hash);
        
        const receipt = await mintTx.wait();
        console.log("✅ Tokens minted successfully!");
        console.log("⛽ Gas used:", receipt.gasUsed.toString());
        
        // Check new balance
        const newBalance = await USDTz.balanceOf(deployer.address);
        const newTotalSupply = await USDTz.totalSupply();
        
        console.log("📊 Updated Status:");
        console.log("• New Total Supply:", ethers.formatEther(newTotalSupply));
        console.log("• Deployer Balance:", ethers.formatEther(newBalance));
        
        console.log("🎉 MINTING COMPLETE!");
        console.log("💡 Now you can add liquidity with:");
        console.log("   npx hardhat run scripts/add-liquidity-fix.js --network bsc");
        
    } catch (error) {
        console.error("❌ Minting failed:", error.message);
        
        if (error.message.includes("Ownable: caller is not the owner")) {
            console.log("💡 You need to use the owner's private key");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("💥 Error:", error);
        process.exit(1);
    });