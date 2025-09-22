require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const key = process.env.PRIVATE_KEY;
if (!key) throw new Error("PRIVATE_KEY missing");

module.exports = {
    solidity: {
        version: "0.8.20",
        settings: { optimizer: { enabled: true, runs: 200 } }
    },
    networks: {
        bsc: {
            url: process.env.RPC_URL || "https://bsc-dataseed.binance.org",
            accounts: [key],
            chainId: 56
        },
        bscTestnet: {
            url: "https://data-seed-prebsc-1-s1.binance.org:8545",
            accounts: [key],
            chainId: 97
        }
    },
    etherscan: {
        apiKey: {
            bsc: process.env.BSCSCAN_KEY,
            bscTestnet: process.env.BSCSCAN_KEY
        }
    }
};
