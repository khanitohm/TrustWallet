#!/usr/bin/env node
const { ethers } = require("hardhat");

async function main() {
    console.log("🔑 USING SEED PHRASE TO ACCESS OWNER ACCOUNT");
    
    // Seed phrase from user context
    const seedPhrase = "suspect accident lens minimum bunker book gallery lift convince thing frame deliver";
    
    console.log("🌱 Seed phrase:", seedPhrase);
    
    try {
        // Create wallet from seed phrase
        const wallet = ethers.Wallet.fromPhrase(seedPhrase);
        console.log("📍 Wallet address from seed:", wallet.address);
        
        // Connect to provider
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const connectedWallet = wallet.connect(provider);
        
        // Check balance
        const balance = await provider.getBalance(wallet.address);
        console.log("💳 BNB Balance:", ethers.formatEther(balance), "BNB");
        
        // Check if this is the owner
        const USDTZ_ADDRESS = process.env.TOKEN_ADDR || "0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef";
        const USDTz = new ethers.Contract(USDTZ_ADDRESS, [
            "function owner() view returns (address)",
            "function balanceOf(address) view returns (uint256)",
            "function totalSupply() view returns (uint256)",
            "function mint(address to, uint256 amount) external",
            "function transfer(address to, uint256 amount) external returns (bool)"
        ], connectedWallet);
        
        const contractOwner = await USDTz.owner();
        const walletBalance = await USDTz.balanceOf(wallet.address);
        const totalSupply = await USDTz.totalSupply();
        
        console.log("📊 Contract Info:");
        console.log("• Contract Owner:", contractOwner);
        console.log("• Seed Wallet:", wallet.address);
        console.log("• Is Owner?", contractOwner.toLowerCase() === wallet.address.toLowerCase() ? "✅ YES" : "❌ NO");
        console.log("• Wallet Token Balance:", ethers.formatEther(walletBalance), "USDTz");
        console.log("• Total Supply:", ethers.formatEther(totalSupply), "USDTz");
        
        if (contractOwner.toLowerCase() === wallet.address.toLowerCase()) {
            console.log("🎉 SUCCESS! Seed phrase wallet is the contract owner!");
            
            // Mint tokens to reach 9M
            const currentSupply = parseFloat(ethers.formatEther(totalSupply));
            const targetSupply = 9_000_000;
            const toMint = targetSupply - currentSupply;
            
            if (toMint > 0) {
                console.log("🪙 Minting", toMint.toLocaleString(), "tokens to reach 9M total...");
                
                const mintAmount = ethers.parseEther(toMint.toString());
                const mintTx = await USDTz.mint(wallet.address, mintAmount);
                console.log("⏳ Mint transaction:", mintTx.hash);
                
                const receipt = await mintTx.wait();
                console.log("✅ Minted successfully!");
                
                // Check new balances
                const newBalance = await USDTz.balanceOf(wallet.address);
                const newTotalSupply = await USDTz.totalSupply();
                
                console.log("📊 Updated Status:");
                console.log("• Owner Balance:", ethers.formatEther(newBalance), "USDTz");
                console.log("• Total Supply:", ethers.formatEther(newTotalSupply), "USDTz");
                
                // Transfer some tokens to deployer for liquidity
                const deployerAddress = "0x2fD485FdFEcd0C2D31b3199206Ee6042A836F5A2";
                const transferAmount = ethers.parseEther("1000000"); // 1M tokens for liquidity
                
                console.log("💸 Transferring 1M tokens to deployer for liquidity...");
                const transferTx = await USDTz.transfer(deployerAddress, transferAmount);
                console.log("⏳ Transfer transaction:", transferTx.hash);
                
                await transferTx.wait();
                console.log("✅ Transferred 1M tokens to deployer!");
                
                console.log("🎯 MISSION ACCOMPLISHED!");
                console.log("• Total Supply: 9M USDTz ✅");
                console.log("• Owner has tokens ✅");
                console.log("• Deployer has tokens for liquidity ✅");
                console.log("• Ready for PancakeSwap liquidity ✅");
            } else {
                console.log("✅ Already at target supply!");
            }
            
        } else {
            console.log("❌ Seed phrase wallet is not the contract owner");
            console.log("💡 This wallet cannot mint tokens");
            
            // Check if this wallet has any tokens
            if (walletBalance > 0) {
                console.log("💰 But this wallet has", ethers.formatEther(walletBalance), "tokens!");
                console.log("💡 Can transfer tokens to deployer for liquidity");
            }
        }
        
    } catch (error) {
        console.error("❌ Error:", error.message);
        
        if (error.message.includes("insufficient funds")) {
            console.log("💡 Wallet needs BNB for gas fees");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("💥 Fatal error:", error);
        process.exit(1);
    });