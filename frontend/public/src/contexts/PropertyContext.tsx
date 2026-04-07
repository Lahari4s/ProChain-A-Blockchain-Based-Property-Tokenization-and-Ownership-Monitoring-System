import React, { createContext, useContext, useState, ReactNode } from 'react';
import { fraudDetectionService } from '@/services/FraudDetectionService';
import { additionalProperties1 } from '@/data/additionalProperties1';
import { additionalProperties2 } from '@/data/additionalProperties2';
import { additionalProperties3 } from '@/data/additionalProperties3';
import type { Property, OwnershipRecord } from '@/types/property';

// Re-export types for backward compatibility
export type { Property, OwnershipRecord };

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'tokenId' | 'registrationDate' | 'owner' | 'status' | 'ownershipHistory'>) => void;
  getProperty: (id: string) => Property | undefined;
  updatePropertyStatus: (id: string, status: Property['status']) => void;
  transferProperty: (id: string, newOwner: string) => void;
  reportFraudAlert: (id: string) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// Initial mock properties - 15 properties with variety
const initialProperties: Property[] = [
  {
    id: "1",
    tokenId: "0x742d35...8f4a3b",
    name: "Luxury Villa Residence",
    address: "123 Blockchain Avenue, Crypto City, CC 90210",
    status: "active",
    type: "Residential",
    size: "3,500 sq ft",
    registrationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xabc123..."
      }
    ],
  },
  {
    id: "2",
    tokenId: "0x8a3f42...9e7d1c",
    name: "Downtown Office Complex",
    address: "456 Digital Street, Web3 District, WD 94102",
    status: "active",
    type: "Commercial",
    size: "12,000 sq ft",
    registrationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
        timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xghi789..."
      }
    ],
  },
  {
    id: "3",
    tokenId: "0x5c9d21...3b8f6a",
    name: "Beachfront Property",
    address: "789 Ocean Drive, Coastal City, OC 33139",
    status: "pending",
    type: "Residential",
    size: "2,800 sq ft",
    registrationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xjkl012..."
      }
    ],
  },
  {
    id: "4",
    tokenId: "0x9f3e87...4d2a1b",
    name: "Palm Villa",
    address: "838 Food Street, Yelahanka, 582101",
    status: "frozen",
    type: "Residential",
    size: "5,000 sq ft",
    registrationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    documentHash: "FAKE_HASH_UNVERIFIED_DOCUMENTS_123456789",
    requiresMultiSig: false,
    fraudAlerts: 3,
    lastVerificationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    ownershipHistory: [
      {
        owner: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfake123..."
      },
      {
        owner: "0xScammer1234567890123456789012345678abcd",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfake456..."
      }
    ],
  },
  {
    id: "5",
    tokenId: "0x1a2b3c...4d5e6f",
    name: "Industrial Warehouse",
    address: "2500 Factory Lane, Industrial Park, IP 45001",
    status: "active",
    type: "Industrial",
    size: "25,000 sq ft",
    registrationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        timestamp: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0x789abc..."
      }
    ],
  },
  {
    id: "6",
    tokenId: "0x7f8e9d...2c1b0a",
    name: "Mountain Cabin Retreat",
    address: "150 Alpine Road, Mountain View, MV 80401",
    status: "active",
    type: "Residential",
    size: "1,800 sq ft",
    registrationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
        timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xmno345..."
      }
    ],
  },
  {
    id: "7",
    tokenId: "0x3e4f5g...6h7i8j",
    name: "Shopping Mall Complex",
    address: "800 Commerce Boulevard, Metro City, MC 60001",
    status: "active",
    type: "Commercial",
    size: "50,000 sq ft",
    registrationDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
        timestamp: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xpqr678..."
      }
    ],
  },
  {
    id: "8",
    tokenId: "0x9k8l7m...6n5o4p",
    name: "Suburban Family Home",
    address: "425 Maple Street, Suburbia, SB 75201",
    status: "pending",
    type: "Residential",
    size: "2,400 sq ft",
    registrationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xstu901..."
      }
    ],
  },
  {
    id: "9",
    tokenId: "0x2q3w4e...5r6t7y",
    name: "Agricultural Land Plot",
    address: "5000 Farm Road, Rural County, RC 88001",
    status: "active",
    type: "Land",
    size: "10 acres",
    registrationDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
        timestamp: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xvwx234..."
      }
    ],
  },
  {
    id: "10",
    tokenId: "0x8u9i0o...1p2a3s",
    name: "Penthouse Suite",
    address: "1200 Skyline Tower, Downtown, DT 10001",
    status: "active",
    type: "Residential",
    size: "4,200 sq ft",
    registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xyzd567..."
      }
    ],
  },
  {
    id: "11",
    tokenId: "0x4d5f6g...7h8j9k",
    name: "Suspicious Estate",
    address: "999 Shadow Lane, Unknown District, UD 66666",
    status: "frozen",
    type: "Residential",
    size: "6,500 sq ft",
    registrationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
    documentHash: "SUSPICIOUS_HASH_FLAGGED_987654321",
    requiresMultiSig: false,
    fraudAlerts: 5,
    lastVerificationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    ownershipHistory: [
      {
        owner: "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud11..."
      },
      {
        owner: "0xFraud9876543210987654321098765432109876",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud22..."
      },
      {
        owner: "0xScammer1234567890123456789012345678abcd",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud33..."
      }
    ],
  },
  {
    id: "12",
    tokenId: "0x1l2m3n...4o5p6q",
    name: "Tech Startup Office",
    address: "350 Innovation Drive, Tech Hub, TH 94301",
    status: "active",
    type: "Commercial",
    size: "8,000 sq ft",
    registrationDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
        timestamp: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xabc890..."
      }
    ],
  },
  {
    id: "13",
    tokenId: "0x7r8s9t...0u1v2w",
    name: "Lakeside Cottage",
    address: "88 Waterfront Path, Lake District, LD 55401",
    status: "pending",
    type: "Residential",
    size: "1,500 sq ft",
    registrationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xdef123..."
      }
    ],
  },
  {
    id: "14",
    tokenId: "0x3x4y5z...6a7b8c",
    name: "Medical Center Building",
    address: "1500 Healthcare Plaza, Medical District, MD 77001",
    status: "active",
    type: "Commercial",
    size: "35,000 sq ft",
    registrationDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
        timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xghi456..."
      }
    ],
  },
  {
    id: "15",
    tokenId: "0x9d8e7f...6g5h4i",
    name: "Disputed Property",
    address: "777 Conflict Street, Legal Zone, LZ 33301",
    status: "frozen",
    type: "Residential",
    size: "3,200 sq ft",
    registrationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
    documentHash: "DISPUTED_DOCS_HASH_112233445566",
    requiresMultiSig: false,
    fraudAlerts: 2,
    lastVerificationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    ownershipHistory: [
      {
        owner: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xdispute1..."
      },
      {
        owner: "0xDisputed123456789012345678901234567890",
        timestamp: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xdispute2..."
      },
      {
        owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xdispute3..."
      }
    ],
  },
];

// Combine all properties (15 initial + 35 additional = 50 total)
const allProperties = [
  ...initialProperties,
  ...additionalProperties1,
  ...additionalProperties2,
  ...additionalProperties3,
];

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(allProperties);

  const generateTokenId = () => {
    const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
    return `0x${hex}...${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`;
  };

  const addProperty = (propertyData: Omit<Property, 'id' | 'tokenId' | 'registrationDate' | 'owner' | 'status' | 'ownershipHistory'>) => {
    const currentOwner = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"; // Mock wallet address
    const timestamp = new Date().toISOString();
    
    // Use existing document hash if available
    const documentHash = propertyData.documents?.[0]?.hash || propertyData.documentHash;
    
    if (documentHash) {
      fraudDetectionService.registerDocumentHash(
        (properties.length + 1).toString(),
        documentHash
      );
    }
    
    const newProperty: Property = {
      ...propertyData,
      id: (properties.length + 1).toString(),
      tokenId: generateTokenId(),
      registrationDate: timestamp,
      owner: currentOwner,
      status: 'pending', // New properties start as pending
      documentHash,
      fraudAlerts: 0,
      lastVerificationDate: timestamp,
      ownershipHistory: [
        {
          owner: currentOwner,
          timestamp: timestamp,
          transactionHash: `0x${Math.random().toString(16).substr(2, 8)}...`
        }
      ]
    };

    setProperties(prev => [...prev, newProperty]);
  };

  const getProperty = (id: string) => {
    return properties.find(p => p.id === id || p.tokenId === id);
  };

  const updatePropertyStatus = (id: string, status: Property['status']) => {
    setProperties(prev => 
      prev.map(p => p.id === id ? { ...p, status } : p)
    );
  };

  const transferProperty = (id: string, newOwner: string) => {
    console.log('transferProperty called with id:', id, 'newOwner:', newOwner);
    setProperties(prev => {
      const updated = prev.map(p => {
        if (p.id === id || p.tokenId === id) {
          console.log('Found property to transfer:', p.id, p.name);
          const newRecord: OwnershipRecord = {
            owner: newOwner,
            timestamp: new Date().toISOString(),
            transactionHash: `0x${Math.random().toString(16).substr(2, 8)}...`
          };
          const updatedProperty = {
            ...p,
            owner: newOwner,
            ownershipHistory: [newRecord, ...p.ownershipHistory],
            lastVerificationDate: new Date().toISOString()
          };
          console.log('Updated ownership history:', updatedProperty.ownershipHistory);
          return updatedProperty;
        }
        return p;
      });
      console.log('Updated properties array:', updated);
      return updated;
    });
  };

  const reportFraudAlert = (id: string) => {
    setProperties(prev =>
      prev.map(p =>
        p.id === id || p.tokenId === id
          ? { ...p, fraudAlerts: (p.fraudAlerts || 0) + 1, status: 'frozen' }
          : p
      )
    );
  };

  return (
    <PropertyContext.Provider value={{ properties, addProperty, getProperty, updatePropertyStatus, transferProperty, reportFraudAlert }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
