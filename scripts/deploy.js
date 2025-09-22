#!/usr/bin/env node
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer :", deployer.address);
    console.log("Balance  :", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

    const USDTz = await hre.ethers.getContractFactory("USDTz");
    const token = await USDTz.deploy(
        "USDT.z",   // name
        "USDTz",    // symbol
        18,         // decimals
        1_000_000   // initialSupply (full token)
    );
    await token.waitForDeployment();
    const addr = await token.getAddress();
    console.log("USDTz deployed to :", addr);

    // auto-verify on BscScan (if network != hardhat)
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        try {
            await hre.run("verify:verify", {
                address: addr,
                constructorArguments: ["USDT.z", "USDTz", 18, 1_000_000],
            });
            console.log("Contract verified ✅");
        } catch (e) {
            console.log("Verify error (maybe already verified):", e.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
