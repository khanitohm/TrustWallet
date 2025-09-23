#!/usr/bin/env node
const { ethers } = require("hardhat");

async function main() {
    console.log("🪙 MINTING TO 9M TOKENS TOTAL");
    
    const [deployer] = await ethers.getSigners();
    const USDTZ_ADDRESS = process.env.TOKEN_ADDR || "0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef";
    
    console.log("💰 Deployer:", deployer.address);
    console.log("📍 Contract:", USDTZ_ADDRESS);
    
    const USDTz = await ethers.getContractAt("USDTz", USDTZ_ADDRESS);
    
    // Check current status
    const totalSupply = await USDTz.totalSupply();
    const deployerBalance = await USDTz.balanceOf(deployer.address);
    const owner = await USDTz.owner();
    
    console.log("📊 Current Status:");
    console.log("• Total Supply:", ethers.formatEther(totalSupply), "USDTz");
    console.log("• Deployer Balance:", ethers.formatEther(deployerBalance), "USDTz");
    console.log("• Owner:", owner);
    console.log("• Deployer:", deployer.address);
    
    // Calculate how much to mint to reach 9M
    const currentSupply = parseFloat(ethers.formatEther(totalSupply));
    const targetSupply = 9_000_000;
    const toMint = targetSupply - currentSupply;
    
    console.log("🎯 Target: 9,000,000 USDTz");
    console.log("📈 Need to mint:", toMint.toLocaleString(), "USDTz");
    
    if (toMint <= 0) {
        console.log("✅ Already at or above target supply!");
        return;
    }
    
    if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
        console.log("❌ Deployer is not the owner!");
        console.log("🔑 Owner:", owner);
        console.log("👤 Deployer:", deployer.address);
        console.log("💡 Only the owner can mint tokens");
        
        // Try to find who has the tokens
        console.log("\n🔍 Checking token distribution...");
        const ownerBalance = await USDTz.balanceOf(owner);
        console.log("• Owner balance:", ethers.formatEther(ownerBalance), "USDTz");
        
        if (ownerBalance > 0) {
            console.log("💡 Owner has tokens! Ask owner to:");
            console.log("1. Transfer tokens to deployer, OR");
            console.log("2. Transfer ownership to deployer, OR");
            console.log("3. Mint more tokens directly");
        }
        return;
    }
    
    // Mint the additional tokens
    const mintAmount = ethers.parseEther(toMint.toString());
    
    console.log("🪙 Minting additional tokens...");
    console.log("• Amount:", toMint.toLocaleString(), "USDTz");
    console.log("• To:", deployer.address);
    
    try {
        const mintTx = await USDTz.mint(deployer.address, mintAmount);
        console.log("⏳ Transaction sent:", mintTx.hash);
        
        const receipt = await mintTx.wait();
        console.log("✅ Tokens minted successfully!");
        console.log("⛽ Gas used:", receipt.gasUsed.toString());
        
        // Verify new totals
        const newTotalSupply = await USDTz.totalSupply();
        const newDeployerBalance = await USDTz.balanceOf(deployer.address);
        
        console.log("📊 Updated Status:");
        console.log("• New Total Supply:", ethers.formatEther(newTotalSupply), "USDTz");
        console.log("• Deployer Balance:", ethers.formatEther(newDeployerBalance), "USDTz");
        
        if (parseFloat(ethers.formatEther(newTotalSupply)) >= 9_000_000) {
            console.log("🎉 SUCCESS! Reached 9M tokens target!");
            console.log("💡 Now you can add liquidity with:");
            console.log("   npx hardhat run scripts/add-liquidity-fix.js --network bsc");
        }
        
    } catch (error) {
        console.error("❌ Minting failed:", error.message);
        
        if (error.message.includes("insufficient funds")) {
            console.log("💡 Need more BNB for gas fees");
        } else if (error.message.includes("Ownable")) {
            console.log("💡 Only the contract owner can mint tokens");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("💥 Error:", error);
        process.exit(1);
    });