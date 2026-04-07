# 🔗 Wallet Connection Guide

Your ProChain application now has **full Web3 wallet connection** using RainbowKit!

## ✅ What Was Set Up

1. **RainbowKit Integration** - Modern wallet connection UI
2. **Wagmi Provider** - React hooks for Ethereum
3. **Multi-Wallet Support** - MetaMask, WalletConnect, Coinbase Wallet, and more
4. **Network Support** - Polygon Mumbai (testnet) and Polygon mainnet

## 🚀 How to Connect Your Wallet

### Option 1: MetaMask (Recommended)

1. **Install MetaMask**
   - Go to https://metamask.io
   - Download the browser extension
   - Create a new wallet or import an existing one

2. **Connect to ProChain**
   - Open http://localhost:8080
   - Login as admin or buyer
   - Click the **"Connect Wallet"** button in the top navigation
   - Select **MetaMask** from the wallet list
   - Approve the connection in MetaMask

3. **Switch to Polygon Mumbai Testnet**
   - Click on the network dropdown in MetaMask
   - Enable "Show test networks" in MetaMask settings
   - Select **Polygon Mumbai** or let ProChain auto-switch

### Option 2: WalletConnect (Mobile & Desktop)

1. **Click "Connect Wallet"** button
2. Select **WalletConnect** option
3. Scan the QR code with your mobile wallet app
4. Approve the connection

### Option 3: Coinbase Wallet

1. Install Coinbase Wallet extension or mobile app
2. Click **"Connect Wallet"** button
3. Select **Coinbase Wallet**
4. Approve the connection

## 🎯 Supported Wallets

RainbowKit automatically supports:
- 🦊 **MetaMask** - Most popular wallet
- 🔗 **WalletConnect** - Mobile wallet connection
- 🪙 **Coinbase Wallet** - Coinbase's official wallet
- 🌈 **Rainbow** - Beautiful mobile wallet
- 🔐 **Ledger** - Hardware wallet support
- And many more...

## 🌐 Network Configuration

### Polygon Mumbai Testnet (Current Default)
- **Network Name:** Polygon Mumbai
- **RPC URL:** https://rpc-mumbai.maticvigil.com
- **Chain ID:** 80001
- **Currency Symbol:** MATIC
- **Block Explorer:** https://mumbai.polygonscan.com

### Get Test MATIC
To test transactions on Mumbai testnet:
1. Go to https://faucet.polygon.technology
2. Select "Mumbai" network
3. Enter your wallet address
4. Receive free test MATIC tokens

## 🔧 What You Can Do After Connecting

Once your wallet is connected:
- ✅ Register new properties as NFTs
- ✅ Transfer property ownership
- ✅ Sign transactions on the blockchain
- ✅ View your wallet address and balance
- ✅ Switch between networks
- ✅ Disconnect and reconnect easily

## 💡 Wallet Button Features

The **Connect Wallet** button shows:
- Your wallet address (shortened)
- Current network
- Account balance
- Easy disconnect option

## 🎨 Custom Wallet Button

The RainbowKit button is fully styled and includes:
- Modern gradient design
- Network indicator
- Balance display
- Account switcher
- Copy address functionality
- Recent transactions

## 📝 For Development

### Using Your Own WalletConnect Project ID

To get your own WalletConnect Project ID:

1. Go to https://cloud.walletconnect.com
2. Create a free account
3. Create a new project
4. Copy your Project ID
5. Update `.env` file:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

### Testing Without a Wallet

If you don't have a wallet yet:
- The app will show login pages for mock authentication
- You can still browse properties and see data
- Wallet connection is required for blockchain transactions

## 🔒 Security Notes

- ✅ Your private keys never leave your wallet
- ✅ ProChain only requests permission to view your address
- ✅ All transactions require your explicit approval
- ✅ You can disconnect at any time
- ✅ Use test networks for development

## 🐛 Troubleshooting

### "Wallet not detected"
- Make sure MetaMask (or your wallet) is installed
- Refresh the page
- Try a different browser

### "Wrong network"
- Click "Switch Network" when prompted
- Or manually switch to Polygon Mumbai in your wallet

### "Connection failed"
- Check your internet connection
- Disable browser ad blockers
- Clear browser cache and cookies

### "Transaction failed"
- Make sure you have enough MATIC for gas fees
- Get test MATIC from the faucet
- Check if you're on the correct network

## 📱 Mobile Support

RainbowKit works great on mobile:
- Use WalletConnect to scan QR codes
- Mobile wallets open automatically
- Responsive design for all screen sizes

## 🎉 Ready to Connect!

1. Refresh your browser: `http://localhost:8080`
2. Login to the app
3. Look for the **"Connect Wallet"** button in the top-right corner
4. Click it and choose your wallet
5. Start using ProChain with blockchain! 🚀

---

**Need help?** Check the [main README](./README.md) or [Quick Start Guide](./QUICKSTART.md)
