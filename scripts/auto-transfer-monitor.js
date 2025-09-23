#!/usr/bin/env node
const { ethers } = require("hardhat");
const fs = require("fs");
require("dotenv").config();

async function main() {
    console.log("🤖 AUTO-TRANSFER MONITOR: Real-time Automation System");
    
    const [deployer] = await ethers.getSigners();
    const USDTZ_ADDRESS = process.env.TOKEN_ADDR || "0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef";
    
    console.log("📍 Monitoring Token:", USDTZ_ADDRESS);
    console.log("👤 Monitor Account:", deployer.address);
    
    // Get contract
    const USDTz = await ethers.getContractAt("USDTz", USDTZ_ADDRESS);
    
    // Event monitoring setup
    let eventCount = 0;
    const eventLog = [];
    
    console.log("🎧 Starting event listener...");
    console.log("⚡ Automation will trigger on every transfer");
    console.log("📊 Press Ctrl+C to stop monitoring");
    
    // Listen for Transfer events
    USDTz.on("Transfer", async (from, to, amount, event) => {
        eventCount++;
        const timestamp = new Date().toISOString();
        const blockNumber = event.blockNumber;
        const txHash = event.transactionHash;
        
        console.log(`\n🔔 TRANSFER EVENT #${eventCount}`);
        console.log(`⏰ Time: ${timestamp}`);
        console.log(`📦 Block: ${blockNumber}`);
        console.log(`🔗 TX: ${txHash}`);
        console.log(`📤 From: ${from}`);
        console.log(`📥 To: ${to}`);
        console.log(`💰 Amount: ${ethers.formatEther(amount)} USDTz`);
        
        // Create event record
        const eventRecord = {
            eventNumber: eventCount,
            timestamp,
            blockNumber,
            txHash,
            from,
            to,
            amount: ethers.formatEther(amount),
            amountRaw: amount.toString()
        };
        
        eventLog.push(eventRecord);
        
        // 🤖 AUTOMATION TRIGGERS
        await executeAutomation(eventRecord, USDTz);
        
        // Save event log
        fs.writeFileSync(
            "transfer-events.json",
            JSON.stringify(eventLog, null, 2)
        );
        
        console.log("💾 Event logged to transfer-events.json");
        console.log("─".repeat(60));
    });
    
    // Keep the process running
    console.log("✅ Event listener active - monitoring all transfers...");
    
    // Periodic status update
    setInterval(() => {
        console.log(`📊 Status: ${eventCount} events processed, monitoring active...`);
    }, 60000); // Every minute
    
    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log("\n🛑 Shutting down monitor...");
        console.log(`📊 Final stats: ${eventCount} events processed`);
        console.log("💾 All events saved to transfer-events.json");
        process.exit(0);
    });
}

async function executeAutomation(eventRecord, contract) {
    console.log("🤖 EXECUTING AUTOMATION...");
    
    try {
        // 1. Large transfer alert
        const amount = parseFloat(eventRecord.amount);
        if (amount > 1000) {
            console.log("🚨 LARGE TRANSFER ALERT!");
            console.log(`💎 Amount: ${amount} USDTz (>1000)`);
            
            // Could send webhook, email, etc.
            await sendAlert("large_transfer", eventRecord);
        }
        
        // 2. Burn detection (transfer to zero address)
        if (eventRecord.to === "0x0000000000000000000000000000000000000000") {
            console.log("🔥 BURN DETECTED!");
            console.log(`💰 Burned: ${eventRecord.amount} USDTz`);
            
            await sendAlert("burn", eventRecord);
        }
        
        // 3. Mint detection (transfer from zero address)
        if (eventRecord.from === "0x0000000000000000000000000000000000000000") {
            console.log("🪙 MINT DETECTED!");
            console.log(`💰 Minted: ${eventRecord.amount} USDTz`);
            
            await sendAlert("mint", eventRecord);
        }
        
        // 4. Update analytics
        await updateAnalytics(eventRecord);
        
        // 5. Auto-pricing update (if needed)
        await updatePricing(eventRecord);
        
        console.log("✅ Automation completed");
        
    } catch (error) {
        console.error("❌ Automation error:", error.message);
    }
}

async function sendAlert(type, eventRecord) {
    console.log(`📢 Sending ${type} alert...`);
    
    const alert = {
        type,
        timestamp: new Date().toISOString(),
        event: eventRecord,
        message: `${type.toUpperCase()}: ${eventRecord.amount} USDTz`
    };
    
    // Save alert to file
    const alertsFile = "alerts.json";
    let alerts = [];
    
    try {
        if (fs.existsSync(alertsFile)) {
            alerts = JSON.parse(fs.readFileSync(alertsFile, "utf8"));
        }
    } catch (e) {}
    
    alerts.push(alert);
    fs.writeFileSync(alertsFile, JSON.stringify(alerts, null, 2));
    
    console.log("📝 Alert saved to alerts.json");
    
    // Here you could add:
    // - Webhook calls
    // - Email notifications
    // - Discord/Telegram bots
    // - Database updates
}

async function updateAnalytics(eventRecord) {
    console.log("📊 Updating analytics...");
    
    const analyticsFile = "analytics.json";
    let analytics = {
        totalTransfers: 0,
        totalVolume: "0",
        lastUpdate: null,
        dailyStats: {}
    };
    
    try {
        if (fs.existsSync(analyticsFile)) {
            analytics = JSON.parse(fs.readFileSync(analyticsFile, "utf8"));
        }
    } catch (e) {}
    
    // Update stats
    analytics.totalTransfers++;
    analytics.totalVolume = (parseFloat(analytics.totalVolume) + parseFloat(eventRecord.amount)).toString();
    analytics.lastUpdate = new Date().toISOString();
    
    // Daily stats
    const today = new Date().toISOString().split('T')[0];
    if (!analytics.dailyStats[today]) {
        analytics.dailyStats[today] = { transfers: 0, volume: "0" };
    }
    
    analytics.dailyStats[today].transfers++;
    analytics.dailyStats[today].volume = (
        parseFloat(analytics.dailyStats[today].volume) + parseFloat(eventRecord.amount)
    ).toString();
    
    fs.writeFileSync(analyticsFile, JSON.stringify(analytics, null, 2));
    console.log("📈 Analytics updated");
}

async function updatePricing(eventRecord) {
    console.log("💱 Checking price update...");
    
    // Here you could:
    // - Update price feeds
    // - Trigger rebalancing
    // - Update liquidity
    // - Sync with external APIs
    
    console.log("💰 Price check completed");
}

main()
    .catch((error) => {
        console.error("💥 Monitor failed:", error);
        process.exit(1);
    });