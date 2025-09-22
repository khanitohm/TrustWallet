const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// อ่านไฟล์ตัวอย่าง 1 address ต่อบรรทัด
const listPath = path.join(__dirname, "../airdrop.txt");
if (!fs.existsSync(listPath)) throw new Error("create airdrop.txt with 1 addr/line");
const recipients = fs.readFileSync(listPath, "utf8").split(/\r?\n/).filter(Boolean);

async function main() {
    const tokenAddr = process.env.TOKEN_ADDR;
    if (!tokenAddr) throw new Error("export TOKEN_ADDR=0x...");
    const [sender] = await hre.ethers.getSigners();
    const token = await hre.ethers.getContractAt("USDTz", tokenAddr, sender);
    const amount = hre.ethers.parseUnits("1000000", 6); // 1M token
    console.log("Airdropping to", recipients.length, "wallets");
    for (const r of recipients) {
        const tx = await token.transfer(r, amount);
        await tx.wait();
        console.log(`Sent to ${r} | ${tx.hash}`);
    }
}
main().catch(console.error);
