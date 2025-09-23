#!/usr/bin/env node
const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🔍 FIXING CONTRACT VERIFICATION");
    
    const contractAddress = process.env.TOKEN_ADDR || "0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef";
    
    console.log("📍 Contract Address:", contractAddress);
    console.log("🌐 Network:", hre.network.name);
    
    // Correct constructor arguments matching deploy.js
    const constructorArgs = [
        "USDT.z",   // name
        "USDTz",    // symbol  
        18,         // decimals
        9_000_000   // initialSupply (9M tokens) - FIXED!
    ];
    
    console.log("📋 Constructor Args:", constructorArgs);
    
    try {
        console.log("⏳ Verifying contract...");
        
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: constructorArgs,
        });
        
        console.log("✅ CONTRACT VERIFIED SUCCESSFULLY!");
        console.log(`🔗 View on BscScan: https://bscscan.com/address/${contractAddress}#code`);
        
    } catch (error) {
        if (error.message.includes("already verified")) {
            console.log("✅ Contract already verified!");
        } else {
            console.error("❌ Verification failed:", error.message);
            
            // Try alternative verification
            console.log("🔄 Trying alternative verification...");
            try {
                await hre.run("verify:verify", {
                    address: contractAddress,
                    constructorArguments: constructorArgs,
                    contract: "contracts/USDTz.sol:USDTz"
                });
                console.log("✅ Alternative verification successful!");
            } catch (altError) {
                console.error("❌ Alternative verification also failed:", altError.message);
            }
        }
    }
}

main()
    .then(() => {
        console.log("🎉 VERIFICATION PROCESS COMPLETE");
        process.exit(0);
    })
    .catch((error) => {
        console.error("💥 Fatal error:", error);
        process.exit(1);
    });