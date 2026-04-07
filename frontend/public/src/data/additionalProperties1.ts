import { Property } from '../types/property';

// Properties 16-30
export const additionalProperties1: Property[] = [
  {
    id: "16",
    tokenId: "0x5a6b7c...8d9e0f",
    name: "Riverside Apartment",
    address: "245 River Road, Waterside, WS 20301",
    status: "active",
    type: "Residential",
    size: "1,900 sq ft",
    registrationDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
        timestamp: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xriv001..."
      }
    ],
  },
  {
    id: "17",
    tokenId: "0x1b2c3d...4e5f6g",
    name: "Corporate Headquarters",
    address: "1000 Enterprise Way, Business Park, BP 85201",
    status: "active",
    type: "Commercial",
    size: "45,000 sq ft",
    registrationDate: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x3456789aBcDeF0123456789AbCdEf0123456789A",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x3456789aBcDeF0123456789AbCdEf0123456789A",
        timestamp: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xcorp01..."
      },
      {
        owner: "0x9876543210aBcDeF0123456789AbCdEf01234567",
        timestamp: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xcorp02..."
      }
    ],
  },
  {
    id: "18",
    tokenId: "0x7h8i9j...0k1l2m",
    name: "Garden Villa",
    address: "567 Blossom Street, Flower District, FD 44101",
    status: "pending",
    type: "Residential",
    size: "3,100 sq ft",
    registrationDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x4567890AbCdEf1234567890AbCdEf1234567890",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0x4567890AbCdEf1234567890AbCdEf1234567890",
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xgard01..."
      }
    ],
  },
  {
    id: "19",
    tokenId: "0x3n4o5p...6q7r8s",
    name: "Fraudulent Estate",
    address: "13 Dark Alley, Suspicious Area, SA 13313",
    status: "frozen",
    type: "Residential",
    size: "7,200 sq ft",
    registrationDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x5678901BcDef2345678901BcDef2345678901Bc",
    documentHash: "FAKE_DOCUMENTS_HASH_999888777",
    requiresMultiSig: false,
    fraudAlerts: 4,
    lastVerificationDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    ownershipHistory: [
      {
        owner: "0x5678901BcDef2345678901BcDef2345678901Bc",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud44..."
      },
      {
        owner: "0xFraudster111111111111111111111111111111",
        timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud55..."
      }
    ],
  },
  {
    id: "20",
    tokenId: "0x9t8u7v...6w5x4y",
    name: "Resort Hotel",
    address: "888 Paradise Avenue, Tourist Zone, TZ 96815",
    status: "active",
    type: "Commercial",
    size: "65,000 sq ft",
    registrationDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x6789012CdEf3456789012CdEf3456789012CdE",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x6789012CdEf3456789012CdEf3456789012CdE",
        timestamp: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xresort1..."
      }
    ],
  },
  {
    id: "21",
    tokenId: "0x1z2a3b...4c5d6e",
    name: "City Apartment Complex",
    address: "2200 Urban Plaza, Metropolitan, MT 10019",
    status: "active",
    type: "Residential",
    size: "28,000 sq ft",
    registrationDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x7890123DeF4567890123DeF4567890123DeF45",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x7890123DeF4567890123DeF4567890123DeF45",
        timestamp: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xapt001..."
      },
      {
        owner: "0x1234567890aBcDeF1234567890aBcDeF123456",
        timestamp: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xapt002..."
      }
    ],
  },
  {
    id: "22",
    tokenId: "0x7f8g9h...0i1j2k",
    name: "Farmhouse Estate",
    address: "3500 Country Lane, Farmlands, FL 50301",
    status: "pending",
    type: "Residential",
    size: "4,500 sq ft",
    registrationDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x8901234Ef5678901234Ef5678901234Ef567890",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0x8901234Ef5678901234Ef5678901234Ef567890",
        timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfarm01..."
      }
    ],
  },
  {
    id: "23",
    tokenId: "0x3l4m5n...6o7p8q",
    name: "Commercial Strip Mall",
    address: "4750 Retail Street, Shopping Center, SC 30301",
    status: "active",
    type: "Commercial",
    size: "22,000 sq ft",
    registrationDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x9012345F6789012345F6789012345F6789012F",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x9012345F6789012345F6789012345F6789012F",
        timestamp: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xmall01..."
      }
    ],
  },
  {
    id: "24",
    tokenId: "0x9r0s1t...2u3v4w",
    name: "Suspicious Villa",
    address: "666 Crime Street, Fraud District, FD 06666",
    status: "frozen",
    type: "Residential",
    size: "5,800 sq ft",
    registrationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xa123456789BcDeF0123456789BcDeF0123456789",
    documentHash: "FORGED_HASH_DETECTED_555666777",
    requiresMultiSig: false,
    fraudAlerts: 6,
    lastVerificationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    ownershipHistory: [
      {
        owner: "0xa123456789BcDeF0123456789BcDeF0123456789",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud66..."
      },
      {
        owner: "0xScammer9999999999999999999999999999999",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud77..."
      },
      {
        owner: "0xFraudster222222222222222222222222222222",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud88..."
      }
    ],
  },
  {
    id: "25",
    tokenId: "0x5x6y7z...8a9b0c",
    name: "Vineyard Estate",
    address: "7200 Grape Valley Road, Wine Country, WC 95401",
    status: "active",
    type: "Land",
    size: "25 acres",
    registrationDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xb234567890CdEf1234567890CdEf1234567890C",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0xb234567890CdEf1234567890CdEf1234567890C",
        timestamp: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xvine01..."
      }
    ],
  },
  {
    id: "26",
    tokenId: "0x1d2e3f...4g5h6i",
    name: "Modern Loft",
    address: "130 Artist Alley, Creative District, CD 11201",
    status: "active",
    type: "Residential",
    size: "2,100 sq ft",
    registrationDate: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xc345678901DeF2345678901DeF2345678901De",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0xc345678901DeF2345678901DeF2345678901De",
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xloft01..."
      },
      {
        owner: "0x2345678901DeF2345678901DeF2345678901De",
        timestamp: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xloft02..."
      }
    ],
  },
  {
    id: "27",
    tokenId: "0x7j8k9l...0m1n2o",
    name: "Office Tower",
    address: "5000 Skyscraper Boulevard, Financial District, FD 02110",
    status: "active",
    type: "Commercial",
    size: "120,000 sq ft",
    registrationDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xd456789012Ef3456789012Ef3456789012Ef34",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0xd456789012Ef3456789012Ef3456789012Ef34",
        timestamp: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xtower1..."
      },
      {
        owner: "0x3456789012Ef3456789012Ef3456789012Ef34",
        timestamp: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xtower2..."
      }
    ],
  },
  {
    id: "28",
    tokenId: "0x3p4q5r...6s7t8u",
    name: "Beach House",
    address: "92 Sunset Drive, Coastal Paradise, CP 33140",
    status: "pending",
    type: "Residential",
    size: "3,800 sq ft",
    registrationDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xe567890123F4567890123F4567890123F45678",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0xe567890123F4567890123F4567890123F45678",
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xbeach1..."
      }
    ],
  },
  {
    id: "29",
    tokenId: "0x9v0w1x...2y3z4a",
    name: "Mountain Resort",
    address: "1800 Peak Avenue, Alpine Region, AR 81611",
    status: "active",
    type: "Commercial",
    size: "42,000 sq ft",
    registrationDate: new Date(Date.now() - 220 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xf678901234G5678901234G5678901234G56789",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0xf678901234G5678901234G5678901234G56789",
        timestamp: new Date(Date.now() - 220 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xmtn001..."
      }
    ],
  },
  {
    id: "30",
    tokenId: "0x5b6c7d...8e9f0g",
    name: "Suburban House",
    address: "315 Maple Drive, Quiet Neighborhood, QN 46260",
    status: "active",
    type: "Residential",
    size: "2,600 sq ft",
    registrationDate: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x0789012345H6789012345H6789012345H67890",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0x0789012345H6789012345H6789012345H67890",
        timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xsub001..."
      },
      {
        owner: "0x6789012345H6789012345H6789012345H67890",
        timestamp: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xsub002..."
      }
    ],
  },
];
