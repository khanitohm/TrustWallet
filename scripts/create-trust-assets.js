const fs = require('fs');
const path = require('path');
require("dotenv").config();

async function main() {
    console.log("🎨 GODTIER: Creating Trust Wallet Assets");
    
    const TOKEN_ADDR = process.env.TOKEN_ADDR;
    const TOKEN_NAME = process.env.TOKEN_NAME || "USDT.z";
    const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL || "USDTz";
    const TOKEN_DECIMALS = process.env.TOKEN_DECIMALS || "18";
    const LOGO_URL = process.env.LOGO_URL;
    
    if (!TOKEN_ADDR) {
        console.log("❌ TOKEN_ADDR not found in .env");
        console.log("💡 Deploy contract first: npm run deploy-new-token");
        return;
    }
    
    console.log("📊 Creating assets for:", TOKEN_ADDR);
    
    // Create directory structure
    const assetsDir = `blockchains/smartchain/assets/${TOKEN_ADDR}`;
    fs.mkdirSync(assetsDir, { recursive: true });
    
    // Create info.json
    const info = {
        name: TOKEN_NAME,
        symbol: TOKEN_SYMBOL,
        type: "BEP20",
        decimals: parseInt(TOKEN_DECIMALS),
        description: `${TOKEN_NAME} - BEP20 Token on Binance Smart Chain with ${process.env.TOKEN_SUPPLY || '9,000,000'} total supply`,
        website: "https://khanitohm.github.io/TrustWallet/",
        explorer: `https://bscscan.com/token/${TOKEN_ADDR}`,
        status: "active",
        id: TOKEN_ADDR,
        links: [
            {
                name: "github",
                url: "https://github.com/khanitohm/TrustWallet"
            },
            {
                name: "explorer", 
                url: `https://bscscan.com/token/${TOKEN_ADDR}`
            },
            {
                name: "twitter",
                url: "https://twitter.com/USDTz_Official"
            },
            {
                name: "telegram",
                url: "https://t.me/USDTz_Community"
            }
        ],
        tags: [
            "deflationary",
            "stablecoin",
            "defi"
        ]
    };
    
    fs.writeFileSync(path.join(assetsDir, 'info.json'), JSON.stringify(info, null, 2));
    console.log("✅ info.json created");
    
    // Create/copy logo.png (placeholder if not exists)
    const logoPath = path.join(assetsDir, 'logo.png');
    if (fs.existsSync('logo.png')) {
        fs.copyFileSync('logo.png', logoPath);
        console.log("✅ logo.png copied");
    } else {
        console.log("⚠️ logo.png not found, please add 256x256 PNG logo");
    }
    
    // Update trust-token-list.json
    const tokenList = {
        name: `${TOKEN_SYMBOL} Custom List`,
        timestamp: new Date().toISOString(),
        version: {
            major: 1,
            minor: 0,
            patch: 0
        },
        keywords: [
            TOKEN_SYMBOL.toLowerCase(),
            "custom"
        ],
        tokens: [
            {
                chainId: 56,
                address: TOKEN_ADDR,
                name: TOKEN_NAME,
                symbol: TOKEN_SYMBOL,
                decimals: parseInt(TOKEN_DECIMALS),
                logoURI: `https://khanitohm.github.io/TrustWallet/blockchains/smartchain/assets/${TOKEN_ADDR}/logo.png`
            }
        ]
    };
    
    fs.writeFileSync('trust-token-list.json', JSON.stringify(tokenList, null, 2));
    console.log("✅ trust-token-list.json updated");
    
    // Create add-token page
    const addTokenHTML = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>เพิ่ม ${TOKEN_NAME} ใน Trust Wallet</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .container { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 20px; padding: 30px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
        .logo { width: 80px; height: 80px; background: white; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #667eea; }
        h1 { margin: 0 0 10px 0; font-size: 24px; }
        .subtitle { opacity: 0.8; margin-bottom: 30px; }
        .btn { background: linear-gradient(45deg, #4CAF50, #45a049); color: white; border: none; padding: 15px 30px; border-radius: 50px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; margin: 10px 0; transition: transform 0.2s; text-decoration: none; display: inline-block; box-sizing: border-box; }
        .btn:hover { transform: translateY(-2px); }
        .btn.secondary { background: linear-gradient(45deg, #2196F3, #1976D2); }
        .info { background: rgba(255,255,255,0.1); border-radius: 10px; padding: 15px; margin: 20px 0; text-align: left; font-size: 14px; }
        .qr-container { margin: 20px 0; }
        .manual-info { background: rgba(255,255,255,0.1); border-radius: 10px; padding: 15px; margin: 20px 0; font-size: 12px; }
        .copy-btn { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 5px 10px; border-radius: 5px; font-size: 10px; margin-left: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">${TOKEN_SYMBOL}</div>
        <h1>เพิ่ม ${TOKEN_NAME}</h1>
        <p class="subtitle">ใน Trust Wallet ของคุณ</p>
        
        <div class="info">
            <strong>📱 วิธีการเพิ่ม Token:</strong><br>
            1. เปิด Trust Wallet<br>
            2. กดปุ่ม "เพิ่ม Token อัตโนมัติ"<br>
            3. ยืนยันการเพิ่ม Token<br>
            4. เสร็จสิ้น!
        </div>
        
        <a href="https://link.trustwallet.com/add_asset?asset=c56_t${TOKEN_ADDR}" class="btn" onclick="trackClick('auto_add')">
            🚀 เพิ่ม Token อัตโนมัติ
        </a>
        
        <a href="#" onclick="showQR()" class="btn secondary">
            📱 แสดง QR Code
        </a>
        
        <div id="qr-container" class="qr-container" style="display:none;">
            <img id="qr-code" style="width: 200px; height: 200px; margin: 10px auto; display: block; background: white; padding: 10px; border-radius: 10px;">
        </div>
        
        <div class="manual-info">
            <strong>🔧 เพิ่มแบบ Manual:</strong><br>
            <strong>Contract Address:</strong><br>
            <span style="font-size: 10px; word-break: break-all;">${TOKEN_ADDR}</span>
            <button class="copy-btn" onclick="copyToClipboard('${TOKEN_ADDR}')">Copy</button><br>
            <strong>Symbol:</strong> ${TOKEN_SYMBOL}<br>
            <strong>Decimals:</strong> ${TOKEN_DECIMALS}
        </div>
    </div>

    <script>
        function showQR() {
            const container = document.getElementById('qr-container');
            const qrCode = document.getElementById('qr-code');
            const deeplink = 'https://link.trustwallet.com/add_asset?asset=c56_t${TOKEN_ADDR}';
            qrCode.src = \`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=\${encodeURIComponent(deeplink)}\`;
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        }
        
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('คัดลอกแล้ว! 📋');
            });
        }
        
        function trackClick(type) {
            console.log('Token add clicked:', type);
        }
    </script>
</body>
</html>`;
    
    fs.writeFileSync(`add-${TOKEN_SYMBOL.toLowerCase()}.html`, addTokenHTML);
    console.log(`✅ add-${TOKEN_SYMBOL.toLowerCase()}.html created`);
    
    console.log("🎯 Trust Wallet Assets Created Successfully!");
    console.log("📂 Assets location:", assetsDir);
    console.log("🌐 Add Token URL:", `https://khanitohm.github.io/TrustWallet/add-${TOKEN_SYMBOL.toLowerCase()}.html`);
    console.log("🔗 Token List:", "https://khanitohm.github.io/TrustWallet/trust-token-list.json");
    
    console.log("\n🚀 Next Steps:");
    console.log("1. Add logo.png (256x256) to project root");
    console.log("2. npm run deploy-github-assets");
    console.log("3. npm run create-liquidity");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error:", error);
        process.exit(1);
    });
