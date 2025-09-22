#!/usr/bin/env node
const tokenAddr = process.env.TOKEN_ADDR;
if (!tokenAddr) throw new Error("TOKEN_ADDR missing");
const logoURL = process.env.LOGO_URL || "https://raw.githubusercontent.com/khanitohm/usdtz.png/main/logo/logo.png";

const list = {
    name: "USDTz Custom List",
    timestamp: new Date().toISOString(),
    version: { major: 1, minor: 0, patch: 0 },
    keywords: ["usdtz", "custom"],
    tokens: [
        {
            chainId: 56,
            address: tokenAddr,
            name: "USDT.z",
            symbol: "USDTz",
            decimals: 18,
            logoURI: logoURL
        }
    ]
};
console.log(JSON.stringify(list, null, 2));
