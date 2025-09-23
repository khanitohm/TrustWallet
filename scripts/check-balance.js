const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const tokenAddress = process.env.TOKEN_ADDR;
    const [deployer] = await ethers.getSigners();

    console.log("🔍 Checking balances for USDTz token");
    console.log("Contract:", tokenAddress);
    console.log("Deployer:", deployer.address);

    const token = await ethers.getContractAt("USDTz", tokenAddress);

    const owner = await token.owner();
    console.log("Owner:", owner);

    const totalSupply = await token.totalSupply();
    console.log("Total Supply:", ethers.formatEther(totalSupply));

    const ownerBalance = await token.balanceOf(owner);
    console.log("Owner Balance:", ethers.formatEther(ownerBalance));

    const deployerBalance = await token.balanceOf(deployer.address);
    console.log("Deployer Balance:", ethers.formatEther(deployerBalance));

    const contractBalance = await token.balanceOf(tokenAddress);
    console.log("Contract Balance:", ethers.formatEther(contractBalance));

    // Check BNB balance
    const bnbBalance = await deployer.provider.getBalance(deployer.address);
    console.log("BNB Balance:", ethers.formatEther(bnbBalance));

    // Check USDT balance
    const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
    const usdt = await ethers.getContractAt("ERC20", usdtAddress);
    const usdtBalance = await usdt.balanceOf(deployer.address);
    console.log("USDT Balance:", ethers.formatEther(usdtBalance));
}

main().catch(console.error);
