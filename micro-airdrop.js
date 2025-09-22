const hre = require("hardhat");

async function main() {
  const list = ["0xUser1", "0xUser2"]; // ใส่จริง
  const amt = ethers.parseUnits("1", 18); // 1 token แค่โชว์
  const token = await ethers.getContractAt("USDTz", process.env.TOKEN_ADDR);
  for (const r of list) {
    const tx = await token.transfer(r, amt);
    console.log(`Sent 1 USDT.z to ${r}  tx=${tx.hash}`);
  }
}

main().catch(console.error);
