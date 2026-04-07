import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon, polygonMumbai } from 'viem/chains';

// WalletConnect Project ID - Get yours at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c8c7d5c8e8f7d8e8f7d8e8f7d8e8f7d8';

export const wagmiConfig = getDefaultConfig({
  appName: 'ProChain - Property Tokenization',
  projectId: projectId,
  chains: [polygonMumbai, polygon],
  ssr: false,
});

// Contract addresses (update after deployment)
export const CONTRACT_ADDRESSES = {
  PropertyRegistry: '0x0000000000000000000000000000000000000000',
  OwnershipVerification: '0x0000000000000000000000000000000000000000',
};

// Network configuration
export const NETWORK_CONFIG = {
  chainId: 80001, // Mumbai testnet
  chainName: 'Polygon Mumbai',
  rpcUrl: 'https://rpc-mumbai.maticvigil.com',
  blockExplorer: 'https://mumbai.polygonscan.com',
};

// IPFS configuration
export const IPFS_CONFIG = {
  gateway: 'https://gateway.pinata.cloud/ipfs/',
  apiKey: import.meta.env.VITE_PINATA_API_KEY || '',
  apiSecret: import.meta.env.VITE_PINATA_API_SECRET || '',
};
