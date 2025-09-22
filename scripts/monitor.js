const { ethers } = require("hardhat");
const fs = require("fs");
require("dotenv").config();

async function main() {
    console.log("📊 GODTIER MONITOR: Real-time Ecosystem Analytics");

    const [deployer] = await ethers.getSigners();
    const USDTZ_ADDRESS = "0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef";
    const USDTz = await ethers.getContractAt("USDTz", USDTZ_ADDRESS);

    // Monitor function
    async function monitor() {
        try {
            const totalSupply = await USDTz.totalSupply();
            const balance = await USDTz.balanceOf(deployer.address);
            const bnbBalance = await deployer.provider.getBalance(deployer.address);

            const stats = {
                timestamp: new Date().toISOString(),
                totalSupply: ethers.formatEther(totalSupply),
                deployerBalance: ethers.formatEther(balance),
                bnbBalance: ethers.formatEther(bnbBalance),
                contract: USDTZ_ADDRESS,
                network: "BSC",
                status: "OPERATIONAL"
            };

            console.log("📈 ECOSYSTEM STATS:");
            console.log(`⏰ Time: ${stats.timestamp}`);
            console.log(`💎 Total Supply: ${stats.totalSupply} USDTz`);
            console.log(`💰 Deployer Balance: ${stats.deployerBalance} USDTz`);
            console.log(`⚡ BNB Balance: ${stats.bnbBalance} BNB`);
            console.log(`🔗 Contract: ${stats.contract}`);
            console.log(`📊 Status: ${stats.status}`);

            // Save to log file
            const logFile = "ecosystem-monitor.json";
            let logs = [];

            try {
                const existingLogs = fs.readFileSync(logFile, "utf8");
                logs = JSON.parse(existingLogs);
            } catch (error) {
                // File doesn't exist yet
            }

            logs.push(stats);

            // Keep only last 100 entries
            if (logs.length > 100) {
                logs = logs.slice(-100);
            }

            fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

            console.log("💾 Stats saved to:", logFile);
            console.log("─".repeat(50));

        } catch (error) {
            console.error("❌ Monitor Error:", error.message);
        }
    }

    // Initial run
    await monitor();

    // Set up interval monitoring (every 5 minutes)
    console.log("🔄 Starting continuous monitoring (5-minute intervals)...");
    console.log("Press Ctrl+C to stop");

    setInterval(monitor, 5 * 60 * 1000); // 5 minutes
}

if (require.main === module) {
    main()
        .catch((error) => {
            console.error("❌ Monitor failed:", error);
            process.exit(1);
        });
}

module.exports = { main };
