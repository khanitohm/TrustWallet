# Trust Wallet Assets PR Submission Script
# Run this in Git Bash or WSL for Windows compatibility

#!/bin/bash

# Set your GitHub credentials
GITHUB_USER="khanitohm"
GITHUB_TOKEN="YOUR_GITHUB_TOKEN_HERE"

# Create temp directory
mkdir -p temp_assets
cd temp_assets

# Initialize git repo with sparse checkout
git init
git remote add origin https://github.com/trustwallet/assets.git
git config core.sparseCheckout true
echo "blockchains/smartchain/assets/" >> .git/info/sparse-checkout

# Pull only smartchain assets
git pull origin master

# Copy our USDTz assets
cp -r ../blockchains/smartchain/assets/0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef blockchains/smartchain/assets/

# Configure git
git config user.name "$GITHUB_USER"
git config user.email "$GITHUB_USER@github.com"

# Add, commit, push
git add .
git commit -m "Add USDTz token (0xAAcB463C5B4bb419D47f94058D6aB6fB1B84adef)

- Name: USDT.z
- Symbol: USDTz
- Decimals: 18
- Type: BEP20
- Chain: Binance Smart Chain"

# Push to your fork (create fork first if not exists)
# You'll need to create a fork of trustwallet/assets first
git push https://$GITHUB_TOKEN@github.com/$GITHUB_USER/assets.git master

echo "✅ Files committed and pushed!"
echo "Now create a Pull Request at: https://github.com/trustwallet/assets/compare"
