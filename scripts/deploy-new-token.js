const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🚀 GODTIER: New USDT.z Token Creation (9M Supply)");

    const [deployer] = await ethers.getSigners();
    console.log("💰 Deployer:", deployer.address);

    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💳 BNB Balance:", ethers.formatEther(balance));

    if (balance === 0n) {
        console.log("❌ Insufficient BNB for deployment");
        console.log("🔗 Get BNB from: https://faucet.bnbchain.org/");
        console.log("💰 Mainnet: Need at least 0.01 BNB");
        console.log("🧪 Testnet: Use faucet to get test BNB");
        return;
    }

    // Token parameters from .env
    const TOKEN_NAME = process.env.TOKEN_NAME || "USDT.z";
    const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL || "USDTz";
    const TOKEN_SUPPLY = process.env.TOKEN_SUPPLY || "9000000";
    const TOKEN_DECIMALS = process.env.TOKEN_DECIMALS || "18";

    console.log("📊 Token Parameters:");
    console.log("• Name:", TOKEN_NAME);
    console.log("• Symbol:", TOKEN_SYMBOL);
    console.log("• Supply:", TOKEN_SUPPLY);
    console.log("• Decimals:", TOKEN_DECIMALS);

    try {
        console.log("🏗️ Deploying contract...");

        const USDTz = await ethers.getContractFactory("USDTz");
        const token = await USDTz.deploy(
            TOKEN_NAME,
            TOKEN_SYMBOL,
            parseInt(TOKEN_DECIMALS),
            parseInt(TOKEN_SUPPLY)
        );

        await token.waitForDeployment();
        const contractAddress = await token.getAddress();

        console.log("✅ Contract deployed successfully!");
        console.log("📍 Address:", contractAddress);
        console.log("🔗 BSCScan:", `https://bscscan.com/address/${contractAddress}`);

        // Update .env with new contract address
        const fs = require('fs');
        const envPath = '.env';
        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(/TOKEN_ADDR=.*/, `TOKEN_ADDR=${contractAddress}`);
        fs.writeFileSync(envPath, envContent);

        console.log("💾 Updated .env with new contract address");

        // Verify contract if on mainnet/testnet
        if (network.name !== "hardhat") {
            console.log("🔍 Verifying contract on BSCScan...");
            try {
                await hre.run("verify:verify", {
                    address: contractAddress,
                    constructorArguments: [
                        TOKEN_NAME,
                        TOKEN_SYMBOL,
                        parseInt(TOKEN_DECIMALS),
                        parseInt(TOKEN_SUPPLY)
                    ],
                });
                console.log("✅ Contract verified on BSCScan");
            } catch (error) {
                console.log("⚠️ Verification failed:", error.message);
            }
        }

        // Create summary
        const summary = {
            timestamp: new Date().toISOString(),
            network: network.name,
            deployer: deployer.address,
            contract: contractAddress,
            name: TOKEN_NAME,
            symbol: TOKEN_SYMBOL,
            decimals: parseInt(TOKEN_DECIMALS),
            supply: TOKEN_SUPPLY,
            bscscan: `https://bscscan.com/address/${contractAddress}`,
            status: "DEPLOYED"
        };

        fs.writeFileSync('deployment-summary.json', JSON.stringify(summary, null, 2));
        console.log("📋 Deployment summary saved to deployment-summary.json");

        console.log("🎯 Next Steps:");
        console.log("1. npm run create-trust-assets");
        console.log("2. npm run deploy-github-assets");
        console.log("3. npm run create-liquidity");
        console.log("4. npm run generate-trust-integration");

    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("💥 Error:", error);
        process.exit(1);
    });
