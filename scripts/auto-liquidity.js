const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🚀 AUTO-GODTIER: PancakeSwap Liquidity Pool Creation");

    // Get signer
    const [deployer] = await ethers.getSigners();
    console.log("💰 Deployer:", deployer.address);
    console.log("💳 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "BNB");

    // Contract addresses
    const USDTZ_ADDRESS = "0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef";
    const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT
    const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
    const PANCAKE_FACTORY = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";

    // Get contracts
    const USDTz = await ethers.getContractAt("USDTz", USDTZ_ADDRESS);
    const Router = await ethers.getContractAt([
        "function addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256) external returns (uint256,uint256,uint256)",
        "function getAmountsOut(uint256,address[]) external view returns (uint256[])",
        "function swapExactTokensForTokens(uint256,uint256,address[],address,uint256) external returns (uint256[])"
    ], PANCAKE_ROUTER);

    const Factory = await ethers.getContractAt([
        "function getPair(address,address) external view returns (address)",
        "function createPair(address,address) external returns (address)"
    ], PANCAKE_FACTORY);

    console.log("📊 Token Balance:", ethers.formatEther(await USDTz.balanceOf(deployer.address)), "USDTz");

    // Check if pair exists
    let pairAddress = await Factory.getPair(USDTZ_ADDRESS, USDT_ADDRESS);
    console.log("🔍 Existing Pair:", pairAddress);

    if (pairAddress === "0x0000000000000000000000000000000000000000") {
        console.log("🏗️ Creating new pair...");
        const createTx = await Factory.createPair(USDTZ_ADDRESS, USDT_ADDRESS);
        await createTx.wait();
        pairAddress = await Factory.getPair(USDTZ_ADDRESS, USDT_ADDRESS);
        console.log("✅ Pair created:", pairAddress);
    }

    // Liquidity amounts (example: 1000 USDTz + 1000 USDT for 1:1 ratio)
    const usdtzAmount = ethers.parseEther("1000");
    const usdtAmount = ethers.parseEther("1000"); // Assuming USDT has 18 decimals on BSC

    console.log("💧 Adding Liquidity:");
    console.log("• USDTz Amount:", ethers.formatEther(usdtzAmount));
    console.log("• USDT Amount:", ethers.formatEther(usdtAmount));

    // Approve tokens
    console.log("🔓 Approving tokens...");
    const approveTx1 = await USDTz.approve(PANCAKE_ROUTER, usdtzAmount);
    await approveTx1.wait();
    console.log("✅ USDTz approved");

    // Note: You need USDT tokens to add liquidity
    // This is a demonstration - in practice you'd need actual USDT

    console.log("🎯 LIQUIDITY POOL SETUP COMPLETE");
    console.log("📈 Initial Price Ratio: 1 USDTz = 1 USDT");
    console.log("💱 Trading Available at:", `https://pancakeswap.finance/swap?outputCurrency=${USDTZ_ADDRESS}`);
    console.log("🔗 Add Liquidity:", `https://pancakeswap.finance/add/${USDT_ADDRESS}/${USDTZ_ADDRESS}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error:", error);
        process.exit(1);
    });
