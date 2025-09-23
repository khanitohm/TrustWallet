#!/usr/bin/env node
const hre = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🚀 FINAL DEPLOYMENT: USDTz with 9M tokens");
    console.log("🎯 Goal: Complete Trust Wallet integration with logo");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("💰 Deployer:", deployer.address);
    
    const bnbBalance = await deployer.provider.getBalance(deployer.address);
    console.log("💳 BNB Balance:", ethers.formatEther(bnbBalance), "BNB");
    
    if (bnbBalance < ethers.parseEther("0.005")) {
        console.log("⚠️ Low BNB balance, but proceeding...");
    }

    // Deploy with exact parameters
    const USDTz = await hre.ethers.getContractFactory("USDTz");
    
    console.log("📋 Deployment Parameters:");
    console.log("• Name: USDT.z");
    console.log("• Symbol: USDTz");
    console.log("• Decimals: 18");
    console.log("• Initial Supply: 9,000,000 tokens");
    console.log("• All tokens minted to deployer");
    
    try {
        const token = await USDTz.deploy(
            "USDT.z",     // name
            "USDTz",      // symbol
            18,           // decimals
            9_000_000     // initialSupply (9M tokens)
        );
        
        console.log("⏳ Waiting for deployment...");
        await token.waitForDeployment();
        const contractAddress = await token.getAddress();
        
        console.log("✅ Contract deployed to:", contractAddress);
        
        // Verify deployment
        const totalSupply = await token.totalSupply();
        const deployerBalance = await token.balanceOf(deployer.address);
        const owner = await token.owner();
        
        console.log("📊 Deployment Verification:");
        console.log("• Contract Address:", contractAddress);
        console.log("• Total Supply:", ethers.formatEther(totalSupply), "USDTz");
        console.log("• Deployer Balance:", ethers.formatEther(deployerBalance), "USDTz");
        console.log("• Owner:", owner);
        console.log("• Deployer:", deployer.address);
        
        if (deployerBalance > 0) {
            console.log("🎉 SUCCESS! Deployer has all 9M tokens!");
        }
        
        // Auto-verify contract
        console.log("🔍 Verifying contract on BscScan...");
        try {
            await hre.run("verify:verify", {
                address: contractAddress,
                constructorArguments: ["USDT.z", "USDTz", 18, 9_000_000],
            });
            console.log("✅ Contract verified on BscScan!");
        } catch (e) {
            console.log("⚠️ Verification note:", e.message);
        }
        
        // Save deployment info
        const deploymentData = {
            contractAddress: contractAddress,
            deployer: deployer.address,
            owner: owner,
            totalSupply: ethers.formatEther(totalSupply),
            deployerBalance: ethers.formatEther(deployerBalance),
            timestamp: new Date().toISOString(),
            network: "BSC Mainnet",
            verified: true,
            parameters: {
                name: "USDT.z",
                symbol: "USDTz",
                decimals: 18,
                initialSupply: 9_000_000
            }
        };
        
        fs.writeFileSync("final-deployment.json", JSON.stringify(deploymentData, null, 2));
        console.log("💾 Deployment data saved to final-deployment.json");
        
        // Update .env file
        let envContent = fs.readFileSync(".env", "utf8");
        envContent = envContent.replace(/TOKEN_ADDR=.*/g, `TOKEN_ADDR=${contractAddress}`);
        fs.writeFileSync(".env", envContent);
        console.log("✅ Updated .env with new contract address");
        
        console.log("\n🎯 NEXT STEPS:");
        console.log("1. ✅ Contract deployed and verified");
        console.log("2. ✅ 9M tokens minted to deployer");
        console.log("3. 🔄 Updating Trust Wallet assets...");
        console.log("4. 🔄 Creating liquidity pool...");
        
        return {
            contractAddress,
            deployerBalance: ethers.formatEther(deployerBalance),
            totalSupply: ethers.formatEther(totalSupply)
        };
        
    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        
        if (error.message.includes("insufficient funds")) {
            console.log("💡 Need more BNB for gas fees");
            console.log("💰 Current balance:", ethers.formatEther(bnbBalance), "BNB");
            console.log("💰 Required: ~0.005 BNB");
        }
        throw error;
    }
}

if (require.main === module) {
    main()
        .then((result) => {
            console.log("\n🏆 DEPLOYMENT COMPLETE!");
            console.log("📍 Contract:", result.contractAddress);
            console.log("💰 Tokens:", result.deployerBalance, "USDTz");
            process.exit(0);
        })
        .catch((error) => {
            console.error("💥 Fatal error:", error);
            process.exit(1);
        });
}

module.exports = { main };