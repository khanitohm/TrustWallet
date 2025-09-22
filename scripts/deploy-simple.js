const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🚀 Simple Deploy USDT.z Token");
    
    try {
        const [deployer] = await ethers.getSigners();
        console.log("💰 Deployer:", deployer.address);
        
        const balance = await deployer.provider.getBalance(deployer.address);
        console.log("💳 BNB Balance:", ethers.formatEther(balance));
        
        // Simple deployment
        const USDTz = await ethers.getContractFactory("USDTz");
        console.log("🏗️ Deploying...");
        
        const token = await USDTz.deploy(
            "USDT.z",        // name
            "USDTz",         // symbol  
            18,              // decimals
            9000000          // supply
        );
        
        console.log("⏳ Waiting for deployment...");
        await token.waitForDeployment();
        
        const address = await token.getAddress();
        console.log("✅ Deployed at:", address);
        
        // Update .env
        const fs = require('fs');
        let envContent = fs.readFileSync('.env', 'utf8');
        envContent = envContent.replace(/TOKEN_ADDR=.*/, `TOKEN_ADDR=${address}`);
        fs.writeFileSync('.env', envContent);
        
        console.log("✅ Done!");
        
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

main();
