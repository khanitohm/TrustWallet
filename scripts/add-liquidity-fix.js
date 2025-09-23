#!/usr/bin/env node
const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("💧 ADDING LIQUIDITY TO PANCAKESWAP");
    console.log("🎯 This will enable USD value display in wallets");

    const [deployer] = await ethers.getSigners();
    console.log("💰 Deployer:", deployer.address);
    
    const bnbBalance = await deployer.provider.getBalance(deployer.address);
    console.log("💳 BNB Balance:", ethers.formatEther(bnbBalance), "BNB");

    // Contract addresses
    const USDTZ_ADDRESS = process.env.TOKEN_ADDR || "0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef";
    const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
    const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
    const PANCAKE_FACTORY = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";

    console.log("📍 USDTz Address:", USDTZ_ADDRESS);
    console.log("📍 WBNB Address:", WBNB_ADDRESS);

    // Get contracts
    const USDTz = await ethers.getContractAt("USDTz", USDTZ_ADDRESS);
    
    const routerABI = [
        "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)",
        "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
    ];
    
    const factoryABI = [
        "function getPair(address tokenA, address tokenB) external view returns (address pair)",
        "function createPair(address tokenA, address tokenB) external returns (address pair)"
    ];

    const Router = await ethers.getContractAt(routerABI, PANCAKE_ROUTER);
    const Factory = await ethers.getContractAt(factoryABI, PANCAKE_FACTORY);

    // Check token balance
    const tokenBalance = await USDTz.balanceOf(deployer.address);
    console.log("🪙 USDTz Balance:", ethers.formatEther(tokenBalance), "USDTz");

    if (tokenBalance === 0n) {
        console.log("❌ No USDTz tokens to add liquidity!");
        console.log("💡 Run: npx hardhat run scripts/deploy.js --network bsc");
        return;
    }

    // Check if pair exists
    let pairAddress = await Factory.getPair(USDTZ_ADDRESS, WBNB_ADDRESS);
    console.log("🔍 Existing Pair:", pairAddress);

    if (pairAddress === "0x0000000000000000000000000000000000000000") {
        console.log("🏗️ Creating new USDTz/WBNB pair...");
        const createTx = await Factory.createPair(USDTZ_ADDRESS, WBNB_ADDRESS);
        await createTx.wait();
        pairAddress = await Factory.getPair(USDTZ_ADDRESS, WBNB_ADDRESS);
        console.log("✅ Pair created:", pairAddress);
    } else {
        console.log("✅ Pair already exists:", pairAddress);
    }

    // Liquidity amounts
    const tokenAmount = ethers.parseEther("10000"); // 10k USDTz
    const bnbAmount = ethers.parseEther("0.1");     // 0.1 BNB
    
    console.log("💧 Liquidity to add:");
    console.log("• USDTz Amount:", ethers.formatEther(tokenAmount));
    console.log("• BNB Amount:", ethers.formatEther(bnbAmount));
    console.log("• Initial Price: 1 USDTz = 0.00001 BNB");

    // Check if we have enough tokens and BNB
    if (tokenBalance < tokenAmount) {
        console.log("⚠️ Insufficient USDTz tokens, using available amount");
        tokenAmount = tokenBalance;
    }

    if (bnbBalance < bnbAmount) {
        console.log("❌ Insufficient BNB for liquidity!");
        console.log(`💡 Need at least ${ethers.formatEther(bnbAmount)} BNB`);
        return;
    }

    // Approve tokens
    console.log("🔓 Approving USDTz for router...");
    const approveTx = await USDTz.approve(PANCAKE_ROUTER, tokenAmount);
    await approveTx.wait();
    console.log("✅ USDTz approved");

    // Add liquidity
    console.log("💧 Adding liquidity...");
    
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
    const minTokenAmount = tokenAmount * 95n / 100n; // 5% slippage
    const minBnbAmount = bnbAmount * 95n / 100n;     // 5% slippage

    try {
        const liquidityTx = await Router.addLiquidityETH(
            USDTZ_ADDRESS,
            tokenAmount,
            minTokenAmount,
            minBnbAmount,
            deployer.address,
            deadline,
            { value: bnbAmount }
        );

        console.log("⏳ Transaction sent:", liquidityTx.hash);
        const receipt = await liquidityTx.wait();
        console.log("✅ Liquidity added successfully!");
        console.log("⛽ Gas used:", receipt.gasUsed.toString());

        // Save liquidity info
        const liquidityInfo = {
            timestamp: new Date().toISOString(),
            txHash: liquidityTx.hash,
            pairAddress: pairAddress,
            tokenAmount: ethers.formatEther(tokenAmount),
            bnbAmount: ethers.formatEther(bnbAmount),
            gasUsed: receipt.gasUsed.toString()
        };

        require("fs").writeFileSync(
            "liquidity-added.json", 
            JSON.stringify(liquidityInfo, null, 2)
        );

        console.log("🎉 LIQUIDITY SUCCESSFULLY ADDED!");
        console.log("📊 Results:");
        console.log("• Pair Address:", pairAddress);
        console.log("• Transaction:", liquidityTx.hash);
        console.log("• PancakeSwap:", `https://pancakeswap.finance/info/pool/${pairAddress}`);
        console.log("• Trading:", `https://pancakeswap.finance/swap?outputCurrency=${USDTZ_ADDRESS}`);
        
        console.log("\n💡 NEXT STEPS:");
        console.log("1. Wait 10-30 minutes for price data to propagate");
        console.log("2. Check Trust Wallet - token should now show USD value");
        console.log("3. Make a few small trades to generate volume");
        console.log("4. Submit to CoinGecko/CoinMarketCap for listing");

    } catch (error) {
        console.error("❌ Failed to add liquidity:", error.message);
        
        if (error.message.includes("INSUFFICIENT_A_AMOUNT")) {
            console.log("💡 Try reducing token amount or increasing BNB amount");
        } else if (error.message.includes("INSUFFICIENT_B_AMOUNT")) {
            console.log("💡 Try reducing BNB amount or increasing token amount");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("💥 Error:", error);
        process.exit(1);
    });