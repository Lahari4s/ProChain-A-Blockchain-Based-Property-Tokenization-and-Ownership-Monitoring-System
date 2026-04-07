export interface OwnershipRecord {
  owner: string;
  timestamp: string;
  transactionHash: string;
}

export interface Property {
  id: string;
  tokenId: string;
  name: string;
  ownerName?: string;
  userId?: number;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  size: string;
  legalDescription?: string;
  status: 'active' | 'pending' | 'frozen';
  type: 'Residential' | 'Commercial' | 'Industrial' | 'Land';
  registrationDate: string;
  owner: string;
  documents?: Array<{
    name: string;
    hash: string;
    uploadDate: string;
  }>;
  documentHash?: string;
  requiresMultiSig: boolean;
  ownershipHistory: OwnershipRecord[];
  fraudAlerts?: number;
  lastVerificationDate?: string;
}
