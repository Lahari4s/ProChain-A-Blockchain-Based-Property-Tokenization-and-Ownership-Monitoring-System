# ProChain Quick Start Guide

Get ProChain up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies (Already Done!)
```bash
npm install
```
✅ **Status:** Complete - All packages installed

### 2. Start Development Server (Already Running!)
```bash
npm run dev
```
✅ **Status:** Running at http://localhost:8080

### 3. Connect Your Wallet

1. Open http://localhost:8080 in your browser
2. Click "Connect Wallet" in the top right
3. Select MetaMask (or your preferred wallet)
4. Approve the connection

**Note:** You'll need Mumbai testnet MATIC for testing. Get free testnet tokens from:
- https://faucet.polygon.technology

### 4. Configure for Full Functionality

To enable all features, create a `.env` file:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and add:

```env
# Get from https://cloud.walletconnect.com
VITE_WALLETCONNECT_PROJECT_ID=your_project_id

# Get from https://pinata.cloud (for IPFS)
VITE_PINATA_API_KEY=your_api_key
VITE_PINATA_API_SECRET=your_api_secret
```

**Important:** After adding credentials, restart the dev server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 📱 Explore the Application

### Available Pages

1. **Landing Page** - http://localhost:8080
   - Overview of ProChain features
   - Click "Get Started" to go to dashboard

2. **Dashboard** - http://localhost:8080/dashboard
   - View your property portfolio
   - See stats and alerts
   - Click "Register Property" to add new property

3. **Property Registration** - http://localhost:8080/register
   - Register new properties as NFTs
   - Upload documents to IPFS
   - Configure security settings

4. **Property Details** - http://localhost:8080/property/:tokenId
   - View detailed property information
   - See ownership history
   - Access documents

## 🎯 Try These Features

### Test Property Registration (Mock Mode)
1. Go to Dashboard → Click "Register Property"
2. Fill in property details:
   - Address: "123 Test Street, City, State"
   - Coordinates: "40.7128° N, 74.0060° W"
   - Size: 2500
   - Legal description: "Test property for demo"
3. Upload test files (any PDF or image)
4. Click "Register Property"
5. See the property in your dashboard

### Test Property Transfer
1. Go to a property details page
2. Click "Transfer Property"
3. Enter a test wallet address
4. Review security features (timelock, multi-sig)
5. Create transfer request

## 🔧 Current Status

### ✅ Implemented Features
- Modern UI with shadcn/ui components
- Wallet connection with RainbowKit
- Property registration interface
- Property transfer workflow
- Property details view
- Responsive design
- Dark mode support

### 🚧 Requires Smart Contract Deployment
- Actual blockchain transactions
- NFT minting
- On-chain property storage
- IPFS document storage

## 📝 Next Steps

### For Development
1. **Deploy Smart Contracts** (see DEPLOYMENT_GUIDE.md)
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.ts --network mumbai
   ```

2. **Update Contract Addresses**
   - Copy deployed addresses to `.env`
   - Update `src/config/web3Config.ts`

3. **Test with Real Blockchain**
   - Register actual properties
   - Test transfers with timelock

### For Production
1. Deploy contracts to Polygon mainnet
2. Set up IPFS pinning service
3. Deploy frontend to Vercel/Netlify

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Compile smart contracts (after Hardhat setup)
npx hardhat compile

# Run smart contract tests
npx hardhat test

# Deploy contracts
npx hardhat run scripts/deploy.ts --network mumbai
```

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.ts` to customize colors:

```typescript
theme: {
  extend: {
    colors: {
      primary: {...},
      secondary: {...},
    }
  }
}
```

### Add New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Navbar.tsx`

## 📚 Documentation

- **Full README:** [README.md](README.md)
- **Deployment Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Smart Contracts:** See `contracts/` folder

## 🆘 Troubleshooting

### Wallet Won't Connect
- Make sure you have MetaMask installed
- Switch to Polygon Mumbai testnet in MetaMask
- Refresh the page

### Page Shows "Wallet Connection Required"
- Click "Connect Wallet" button
- Approve the connection in MetaMask

### Changes Not Showing
- Check if dev server is running
- Refresh browser (Ctrl+R)
- Clear browser cache

### Port 8080 Already in Use
```bash
# Kill the process using port 8080
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Then restart:
npm run dev
```

## 💡 Tips

1. **Use Mumbai Testnet** for development - it's free!
2. **Save your test wallet** private key securely
3. **Check console** for detailed error messages
4. **Use browser DevTools** to inspect blockchain calls
5. **Join Discord** for community support

## 🎓 Learning Resources

- [Ethereum Documentation](https://ethereum.org/developers)
- [Polygon Documentation](https://docs.polygon.technology)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com)
- [IPFS Documentation](https://docs.ipfs.tech)
- [React Documentation](https://react.dev)

## 🤝 Need Help?

- **Issues:** Open an issue on GitHub
- **Questions:** Ask in Discord community
- **Email:** support@prochain.io

---

Happy Building! 🏗️
