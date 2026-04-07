# ProChain - Blockchain-Based Property Tokenization System

![ProChain](https://img.shields.io/badge/ProChain-Property%20Tokenization-blue)
![Blockchain](https://img.shields.io/badge/Blockchain-Polygon-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 🏠 Overview

ProChain is a comprehensive blockchain-based property tokenization dApp that prevents fraud through immutable records and automated alerts. Built on Polygon blockchain with ERC-721 NFT standard for unique property tokens.

## ✨ Key Features

### 🔐 Security & Fraud Prevention
- **Immutable Blockchain Records** - All property records permanently stored on-chain
- **Multi-Signature Verification** - High-value transfers require multiple approvals
- **Time-Locked Transactions** - 2-day safety period for all transfers
- **Intelligent Fraud Detection** - AI-powered pattern recognition and risk scoring
- **Address Reputation System** - Tracks and flags suspicious addresses

### 🏘️ Property Management
- **NFT Tokenization** - Each property as unique ERC-721 token
- **Complete Ownership History** - Full chain of custody tracking
- **Document Storage** - IPFS integration for secure document storage
- **KYC Verification** - Built-in identity verification system
- **Dispute Resolution** - On-chain dispute management


## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **shadcn/ui** - Modern UI components
- **Tailwind CSS** - Utility-first styling
- **RainbowKit** - Wallet connection
- **wagmi** - React hooks for Ethereum
- **ethers.js** - Blockchain interaction

### Smart Contracts
- **Solidity ^0.8.20**
- **OpenZeppelin** - Security libraries
- **ERC-721** - NFT standard
- **Polygon/Mumbai** - Testnet deployment

### Backend & Infrastructure
- **IPFS** - Decentralized document storage
- **Pinata** - IPFS pinning service

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Polygon Mumbai testnet MATIC (for testing)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd prochain-guard-main
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- WalletConnect Project ID (get from https://cloud.walletconnect.com)
- Pinata API credentials (get from https://pinata.cloud)
- Contract addresses (after deployment)

4. **Start frontend development server**
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 📝 Smart Contract Deployment

### Setup Hardhat (if not already done)
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

### Deploy Contracts
```bash
# Compile contracts
npx hardhat compile

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Verify contracts
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

Update contract addresses in `.env` after deployment.

## 🏗️ Project Structure

```
prochain-guard-main/
├── contracts/                 # Smart contracts
│   ├── PropertyRegistry.sol
│   └── OwnershipVerification.sol
├── src/
│   ├── components/           # React components
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx
│   │   ├── PropertyRegistration.tsx
│   │   ├── PropertyTransfer.tsx
│   │   └── PropertyDetails.tsx
│   ├── config/              # Configuration
│   │   └── web3Config.ts
│   ├── contracts/           # Contract ABIs
│   │   └── abis.ts
│   └── hooks/               # Custom React hooks
├── public/                  # Static assets
└── README.md
```

## 🔑 Key Components

### Smart Contracts

#### PropertyRegistry.sol
- Property tokenization (ERC-721)
- Transfer management with timelock
- Multi-signature support
- Emergency freeze functionality
- Ownership history tracking

#### OwnershipVerification.sol
- KYC data management
- Digital signature verification
- Dispute resolution system
- Government ID integration

## 📱 User Workflows

### Register Property
1. Connect wallet
2. Complete KYC verification
3. Upload property documents to IPFS
4. Fill property details form
5. Sign minting transaction
6. Receive property NFT

### Transfer Property
1. Initiate transfer request
2. Enter recipient address
3. Both parties verify details
4. Sign multi-sig transaction
5. Wait for timelock period
6. Execute transfer
7. NFT transferred to new owner


## 🔒 Security Features

- **Private Key Management** - Never stored on servers
- **IPFS Content Addressing** - Document integrity verification
- **Hash-Based Verification** - SHA-256 for all documents
- **Rate Limiting** - API endpoint protection
- **Smart Contract Pausability** - Emergency stop mechanism
- **Reentrancy Guards** - Protection against attacks
- **Access Control** - Role-based permissions

## 🧪 Testing

```bash
# Run smart contract tests
npx hardhat test

# Run frontend tests
npm test

# E2E tests
npm run test:e2e
```


## 🌐 Network Configuration

### Mumbai Testnet (Development)
- Chain ID: 80001
- RPC: https://rpc-mumbai.maticvigil.com
- Explorer: https://mumbai.polygonscan.com
- Faucet: https://faucet.polygon.technology

### Polygon Mainnet (Production)
- Chain ID: 137
- RPC: https://polygon-rpc.com
- Explorer: https://polygonscan.com

## 📚 Documentation

### Essential Guides
- **[Quick Start](./QUICKSTART.md)** - Get started quickly
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Production deployment

### Additional Resources
- [Project Summary](./PROJECT_SUMMARY.md)
- Smart Contract Documentation
- API Documentation
- User Guide

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenZeppelin for security libraries
- Polygon for blockchain infrastructure
- IPFS for decentralized storage
- shadcn/ui for beautiful components

## 📞 Support

For support, email support@prochain.io or join our Discord community.

## 🗺️ Roadmap

### ✅ Completed
- [x] Property tokenization (ERC-721)
- [x] KYC verification system
- [x] Multi-signature transfers
- [x] Time-locked transactions

### 🚧 In Progress
- [ ] Smart contract audit
- [ ] Mobile app (React Native)
- [ ] Machine learning fraud detection

### 📋 Planned
- [ ] Mainnet deployment
- [ ] Fractional ownership (ERC-1155)
- [ ] Property auction system
- [ ] Insurance integration
- [ ] Government API integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Historical pattern analysis

---

Built with ❤️ for secure property ownership
