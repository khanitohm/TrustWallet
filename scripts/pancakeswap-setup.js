const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🥞 GODTIER: PancakeSwap Integration Setup");
    console.log("=".repeat(50));

    const tokenAddress = process.env.TOKEN_ADDR;
    const tokenName = process.env.TOKEN_NAME;
    const tokenSymbol = process.env.TOKEN_SYMBOL;

    console.log("📊 Token Details:");
    console.log("• Contract:", tokenAddress);
    console.log("• Name:", tokenName);
    console.log("• Symbol:", tokenSymbol);
    console.log();

    // PancakeSwap Router and Factory addresses
    const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
    const PANCAKE_FACTORY = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
    const WBNB = "0xbb4CdB9CBd36B01bD1cBaeBF2De08d9173bc095c";
    const USDT = "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT

    console.log("🥞 PancakeSwap Configuration:");
    console.log("• Router:", PANCAKE_ROUTER);
    console.log("• Factory:", PANCAKE_FACTORY);
    console.log("• WBNB:", WBNB);
    console.log("• USDT:", USDT);
    console.log();

    // Generate PancakeSwap URLs
    const addLiquidityURL = `https://pancakeswap.finance/add/${tokenAddress}/${USDT}`;
    const swapURL = `https://pancakeswap.finance/swap?outputCurrency=${tokenAddress}`;
    const infoURL = `https://pancakeswap.finance/info/tokens/${tokenAddress}`;

    console.log("🔗 PancakeSwap URLs:");
    console.log("🌊 Add Liquidity (USDTz/USDT):", addLiquidityURL);
    console.log("🔄 Swap Page:", swapURL);
    console.log("📊 Token Info:", infoURL);
    console.log();

    // Check token contract
    const [deployer] = await ethers.getSigners();
    console.log("💰 Deployer Wallet:", deployer.address);

    const tokenContract = await ethers.getContractAt("USDTz", tokenAddress);
    const balance = await tokenContract.balanceOf(deployer.address);
    const totalSupply = await tokenContract.totalSupply();

    console.log("💎 Token Balance:", ethers.formatUnits(balance, 18));
    console.log("💰 Total Supply:", ethers.formatUnits(totalSupply, 18));
    console.log();

    // PancakeSwap Liquidity Instructions
    console.log("🎯 GODTIER PANCAKESWAP SETUP GUIDE:");
    console.log("=".repeat(50));
    console.log();
    console.log("1️⃣  PREPARE LIQUIDITY:");
    console.log("   • Have USDTz tokens in your wallet");
    console.log("   • Get USDT tokens for pairing");
    console.log("   • Recommended ratio: 1 USDTz = 1 USDT");
    console.log();
    console.log("2️⃣  ADD LIQUIDITY:");
    console.log("   • Visit:", addLiquidityURL);
    console.log("   • Connect your wallet");
    console.log("   • Set amounts (e.g., 10,000 USDTz + 10,000 USDT)");
    console.log("   • Approve tokens if needed");
    console.log("   • Add liquidity and receive LP tokens");
    console.log();
    console.log("3️⃣  ENABLE TRADING:");
    console.log("   • Once liquidity is added, token becomes tradeable");
    console.log("   • Share swap URL with users:", swapURL);
    console.log("   • Monitor price and volume at:", infoURL);
    console.log();
    console.log("4️⃣  PRICE DISCOVERY:");
    console.log("   • Initial price = your liquidity ratio");
    console.log("   • Price changes based on trading volume");
    console.log("   • More liquidity = less price volatility");
    console.log();

    // Generate quick commands
    console.log("⚡ QUICK ACTIONS:");
    console.log("• Open Add Liquidity: npm run pancake-add");
    console.log("• Open Swap Page: npm run pancake-swap");
    console.log("• Open Token Info: npm run pancake-info");
    console.log("• Check Token Balance: npm run check-balance");
    console.log();

    // Trust Wallet integration reminder
    console.log("📱 TRUST WALLET INTEGRATION:");
    console.log("• Add Token URL: https://khanitohm.github.io/TrustWallet/add-usdtz.html");
    console.log("• Direct Link: https://link.trustwallet.com/add_asset?asset=c56_t" + tokenAddress);
    console.log("• Logo URL:", process.env.LOGO_URL);
    console.log();

    console.log("🎉 GODTIER SETUP COMPLETE!");
    console.log("Ready for PancakeSwap deployment! 🚀");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error:", error);
        process.exit(1);
    });
