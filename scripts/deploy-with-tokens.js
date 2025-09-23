#!/usr/bin/env node
const hre = require("hardhat");

async function main() {
    console.log("🚀 DEPLOYING NEW USDTZ WITH TOKENS");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("💰 Deployer:", deployer.address);
    console.log("💳 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "BNB");

    const USDTz = await hre.ethers.getContractFactory("USDTz");
    
    console.log("📋 Deploying with parameters:");
    console.log("• Name: USDT.z");
    console.log("• Symbol: USDTz");
    console.log("• Decimals: 18");
    console.log("• Initial Supply: 1,000,000 tokens");
    console.log("• All tokens will be minted to deployer");
    
    const token = await USDTz.deploy(
        "USDT.z",   // name
        "USDTz",    // symbol
        18,         // decimals
        1_000_000   // initialSupply (1M tokens) - will be minted to deployer
    );
    
    await token.waitForDeployment();
    const addr = await token.getAddress();
    
    console.log("✅ USDTz deployed to:", addr);
    
    // Check balances
    const totalSupply = await token.totalSupply();
    const deployerBalance = await token.balanceOf(deployer.address);
    const owner = await token.owner();
    
    console.log("📊 Contract Status:");
    console.log("• Total Supply:", ethers.formatEther(totalSupply));
    console.log("• Deployer Balance:", ethers.formatEther(deployerBalance));
    console.log("• Owner:", owner);
    console.log("• Deployer:", deployer.address);
    
    if (deployerBalance > 0) {
        console.log("🎉 SUCCESS! Deployer has tokens and can add liquidity");
    }
    
    // Auto-verify on BscScan
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        try {
            console.log("🔍 Verifying contract on BscScan...");
            await hre.run("verify:verify", {
                address: addr,
                constructorArguments: ["USDT.z", "USDTz", 18, 1_000_000],
            });
            console.log("✅ Contract verified!");
        } catch (e) {
            console.log("⚠️ Verify error (maybe already verified):", e.message);
        }
    }
    
    console.log("🎯 NEXT STEPS:");
    console.log("1. Update .env TOKEN_ADDR to:", addr);
    console.log("2. Update trust-token-list.json address to:", addr);
    console.log("3. Create new Trust Wallet assets folder");
    console.log("4. Add liquidity with: npx hardhat run scripts/add-liquidity-fix.js --network bsc");
    
    // Save deployment info
    const deploymentInfo = {
        address: addr,
        deployer: deployer.address,
        totalSupply: ethers.formatEther(totalSupply),
        deployerBalance: ethers.formatEther(deployerBalance),
        timestamp: new Date().toISOString(),
        network: hre.network.name
    };
    
    require("fs").writeFileSync(
        "new-deployment.json",
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("💾 Deployment info saved to new-deployment.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error:", error);
        process.exit(1);
    });