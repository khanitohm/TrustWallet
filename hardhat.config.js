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
            url: process.env.RPC_URL || "https://bsc-dataseed1.binance.org/",
            accounts: [key],
            chainId: 56,
            gasPrice: 3000000000, // 3 gwei
            gasLimit: 8000000,
            timeout: 120000
        },
        bscTestnet: {
            url: "https://data-seed-prebsc-1-s1.binance.org:8545",
            accounts: [key],
            chainId: 97,
            gasPrice: 10000000000, // 10 gwei
            gas: 8000000,
            timeout: 120000
        }
    },
    etherscan: {
        apiKey: process.env.BSCSCAN_KEY
    }
};
