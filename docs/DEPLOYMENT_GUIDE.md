# ProChain Deployment Guide

This guide will walk you through deploying the ProChain application from development to production.

## Prerequisites

- Node.js 18+ and npm
- MetaMask wallet with MATIC tokens
- WalletConnect Project ID
- Pinata account for IPFS
- (Optional) Hardhat for smart contract deployment

## Step 1: Environment Setup

### 1.1 Clone and Install

```bash
git clone <your-repo-url>
cd prochain-guard-main
npm install
```

### 1.2 Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# WalletConnect Project ID
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Pinata IPFS
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_API_SECRET=your_pinata_secret

# Contract Addresses (update after deployment)
VITE_PROPERTY_REGISTRY_ADDRESS=0x...
VITE_OWNERSHIP_VERIFICATION_ADDRESS=0x...
VITE_MONITORING_ORACLE_ADDRESS=0x...

# Network
VITE_CHAIN_ID=80001
VITE_RPC_URL=https://rpc-mumbai.maticvigil.com
```

### 1.3 Get Required Credentials

**WalletConnect Project ID:**
1. Visit https://cloud.walletconnect.com
2. Create a new project
3. Copy the Project ID

**Pinata API Keys:**
1. Visit https://pinata.cloud
2. Sign up for a free account
3. Go to API Keys section
4. Generate new API key and secret

## Step 2: Smart Contract Deployment

### 2.1 Install Hardhat

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
```

### 2.2 Initialize Hardhat

```bash
npx hardhat init
```

Select "Create a TypeScript project"

### 2.3 Configure Hardhat

Create `hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 80001
    },
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 137
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  }
};

export default config;
```

### 2.4 Create Deployment Script

Create `scripts/deploy.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ProChain contracts...");

  // Deploy PropertyRegistry
  const PropertyRegistry = await ethers.getContractFactory("PropertyRegistry");
  const propertyRegistry = await PropertyRegistry.deploy();
  await propertyRegistry.waitForDeployment();
  const propertyRegistryAddress = await propertyRegistry.getAddress();
  console.log("PropertyRegistry deployed to:", propertyRegistryAddress);

  // Deploy OwnershipVerification
  const OwnershipVerification = await ethers.getContractFactory("OwnershipVerification");
  const ownershipVerification = await OwnershipVerification.deploy();
  await ownershipVerification.waitForDeployment();
  const ownershipVerificationAddress = await ownershipVerification.getAddress();
  console.log("OwnershipVerification deployed to:", ownershipVerificationAddress);

  // Deploy MonitoringOracle
  const MonitoringOracle = await ethers.getContractFactory("MonitoringOracle");
  const monitoringOracle = await MonitoringOracle.deploy();
  await monitoringOracle.waitForDeployment();
  const monitoringOracleAddress = await monitoringOracle.getAddress();
  console.log("MonitoringOracle deployed to:", monitoringOracleAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("PropertyRegistry:", propertyRegistryAddress);
  console.log("OwnershipVerification:", ownershipVerificationAddress);
  console.log("MonitoringOracle:", monitoringOracleAddress);
  console.log("\nUpdate these addresses in your .env file!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 2.5 Deploy to Mumbai Testnet

```bash
# Add your private key to .env
echo "PRIVATE_KEY=your_private_key_here" >> .env

# Deploy contracts
npx hardhat run scripts/deploy.ts --network mumbai
```

### 2.6 Verify Contracts

```bash
npx hardhat verify --network mumbai <PROPERTY_REGISTRY_ADDRESS>
npx hardhat verify --network mumbai <OWNERSHIP_VERIFICATION_ADDRESS>
npx hardhat verify --network mumbai <MONITORING_ORACLE_ADDRESS>
```

### 2.7 Update Environment Variables

Update `.env` with deployed contract addresses:

```env
VITE_PROPERTY_REGISTRY_ADDRESS=0x...
VITE_OWNERSHIP_VERIFICATION_ADDRESS=0x...
VITE_MONITORING_ORACLE_ADDRESS=0x...
```

Also update `src/config/web3Config.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  PropertyRegistry: '0x...',
  OwnershipVerification: '0x...',
  MonitoringOracle: '0x...',
};
```

## Step 3: Frontend Deployment

### 3.1 Build the Application

```bash
npm run build
```

This creates a `dist` folder with production-ready files.

### 3.2 Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add all variables from `.env`

### 3.3 Deploy to Netlify (Alternative)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod
```

4. Add environment variables in Netlify dashboard

### 3.4 Deploy to Custom Server

```bash
# Build the app
npm run build

# Copy dist folder to your server
scp -r dist/* user@your-server:/var/www/prochain

# Configure nginx
sudo nano /etc/nginx/sites-available/prochain
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/prochain;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Step 4: Post-Deployment Configuration

### 4.1 Grant Contract Roles

Connect to deployed contracts and grant necessary roles:

```javascript
// Using ethers.js
const propertyRegistry = new ethers.Contract(
  PROPERTY_REGISTRY_ADDRESS,
  PropertyRegistryABI,
  signer
);

// Grant VERIFIER_ROLE
await propertyRegistry.grantRole(
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("VERIFIER_ROLE")),
  verifierAddress
);

// Grant ADMIN_ROLE
await propertyRegistry.grantRole(
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE")),
  adminAddress
);
```

### 4.2 Configure IPFS

Test IPFS upload functionality:

```javascript
const pinata = require('@pinata/sdk');
const pinataClient = pinata(PINATA_API_KEY, PINATA_API_SECRET);

// Test upload
const result = await pinataClient.pinJSONToIPFS({
  test: "ProChain IPFS Test"
});
console.log("IPFS Hash:", result.IpfsHash);
```

### 4.3 Set Up Monitoring Service

Create a monitoring worker that listens to blockchain events:

```javascript
// monitoring-worker.js
const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(
  PROPERTY_REGISTRY_ADDRESS,
  PropertyRegistryABI,
  provider
);

// Listen to events
contract.on("PropertyRegistered", (tokenId, owner, address, hash) => {
  console.log("New property registered:", tokenId);
  // Send notifications
});

contract.on("SuspiciousActivity", (tokenId, actor, reason) => {
  console.log("ALERT: Suspicious activity detected!");
  // Trigger alerts
});
```

Run the worker:
```bash
node monitoring-worker.js
```

## Step 5: Testing

### 5.1 Test Wallet Connection

1. Visit your deployed site
2. Click "Connect Wallet"
3. Verify MetaMask connection works

### 5.2 Test Property Registration

1. Navigate to Register Property page
2. Fill in property details
3. Upload test documents
4. Submit transaction
5. Verify property appears in dashboard

### 5.3 Test Transfer Flow

1. Select a property
2. Initiate transfer
3. Enter recipient address
4. Verify timelock is enforced
5. Complete transfer after timelock

### 5.4 Test Monitoring

1. Check monitoring dashboard
2. Verify alerts appear
3. Test alert resolution

## Step 6: Production Checklist

- [ ] All smart contracts deployed and verified
- [ ] Contract addresses updated in frontend
- [ ] Environment variables configured
- [ ] IPFS integration tested
- [ ] Wallet connection working
- [ ] Property registration tested
- [ ] Transfer flow tested
- [ ] Monitoring service running
- [ ] Alert system configured
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Analytics set up
- [ ] Error tracking configured (Sentry)
- [ ] Backup strategy in place

## Troubleshooting

### Contract Deployment Fails
- Check you have enough MATIC for gas
- Verify network configuration
- Check Hardhat config syntax

### Wallet Won't Connect
- Verify WalletConnect Project ID
- Check network configuration
- Clear browser cache

### IPFS Upload Fails
- Verify Pinata API credentials
- Check file size limits
- Test API connection

### Transactions Fail
- Check gas limits
- Verify contract addresses
- Check wallet has sufficient MATIC

## Maintenance

### Regular Tasks
- Monitor gas prices
- Check IPFS pin status
- Review alert logs
- Update dependencies
- Backup off-chain data

### Security Updates
- Monitor OpenZeppelin releases
- Update dependencies regularly
- Review smart contract events
- Audit access control

## Support

For deployment issues:
- Check documentation: https://docs.prochain.io
- Discord: https://discord.gg/prochain
- Email: support@prochain.io

---

Last updated: 2024
