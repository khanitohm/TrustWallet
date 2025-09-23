#!/usr/bin/env node
const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("👑 TRANSFERRING OWNERSHIP TO DEPLOYER");
    
    const [deployer] = await ethers.getSigners();
    const USDTZ_ADDRESS = process.env.TOKEN_ADDR || "0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef";
    
    console.log("💰 Deployer:", deployer.address);
    console.log("📍 Token Address:", USDTZ_ADDRESS);
    
    // Get contract
    const USDTz = await ethers.getContractAt("USDTz", USDTZ_ADDRESS);
    
    // Check current owner
    const currentOwner = await USDTz.owner();
    console.log("🔑 Current Owner:", currentOwner);
    
    if (currentOwner.toLowerCase() === deployer.address.toLowerCase()) {
        console.log("✅ Deployer is already the owner!");
        return;
    }
    
    console.log("❌ Current deployer is not the owner");
    console.log("💡 You have two options:");
    console.log("1. Use the owner's private key in .env file");
    console.log("2. Ask the owner to transfer ownership to you");
    console.log("");
    console.log("🔍 To check who has tokens:");
    console.log("   - Owner balance:", ethers.formatEther(await USDTz.balanceOf(currentOwner)));
    console.log("   - Deployer balance:", ethers.formatEther(await USDTz.balanceOf(deployer.address)));
    
    // If deployer is the owner, try to transfer ownership
    try {
        console.log("🔄 Attempting to transfer ownership...");
        const transferTx = await USDTz.transferOwnership(deployer.address);
        console.log("⏳ Transaction sent:", transferTx.hash);
        
        const receipt = await transferTx.wait();
        console.log("✅ Ownership transferred successfully!");
        console.log("👑 New owner:", deployer.address);
        
    } catch (error) {
        console.error("❌ Transfer failed:", error.message);
        
        if (error.message.includes("Ownable: caller is not the owner")) {
            console.log("💡 The current private key is not the owner's key");
            console.log("🔑 Owner address:", currentOwner);
            console.log("👤 Your address:", deployer.address);
            console.log("");
            console.log("📋 SOLUTION OPTIONS:");
            console.log("1. Get the owner's private key and update .env");
            console.log("2. Deploy a new contract with current deployer as owner");
            console.log("3. Ask owner to mint tokens and transfer to deployer");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("💥 Error:", error);
        process.exit(1);
    });