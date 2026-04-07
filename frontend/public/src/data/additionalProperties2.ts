import { Property } from '../types/property';

// Properties 31-45
export const additionalProperties2: Property[] = [
  {
    id: "31",
    tokenId: "0x1h2i3j...4k5l6m",
    name: "Illegal Construction",
    address: "404 Not Found Street, Nowhere, NW 00000",
    status: "frozen",
    type: "Residential",
    size: "4,900 sq ft",
    registrationDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x1890123456I7890123456I7890123456I78901",
    documentHash: "ILLEGAL_BUILD_HASH_333444555",
    requiresMultiSig: false,
    fraudAlerts: 7,
    lastVerificationDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    ownershipHistory: [
      {
        owner: "0x1890123456I7890123456I7890123456I78901",
        timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud99..."
      },
      {
        owner: "0xFraudster333333333333333333333333333333",
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud00..."
      }
    ],
  },
  {
    id: "32",
    tokenId: "0x7n8o9p...0q1r2s",
    name: "Factory Building",
    address: "3300 Industrial Road, Manufacturing Zone, MZ 48201",
    status: "active",
    type: "Industrial",
    size: "55,000 sq ft",
    registrationDate: new Date(Date.now() - 280 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x2901234567J8901234567J8901234567J89012",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x2901234567J8901234567J8901234567J89012",
        timestamp: new Date(Date.now() - 280 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfact01..."
      }
    ],
  },
  {
    id: "33",
    tokenId: "0x3t4u5v...6w7x8y",
    name: "Historic Manor",
    address: "77 Heritage Lane, Old Town, OT 02139",
    status: "active",
    type: "Residential",
    size: "6,200 sq ft",
    registrationDate: new Date(Date.now() - 160 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x3012345678K9012345678K9012345678K90123",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x3012345678K9012345678K9012345678K90123",
        timestamp: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xmanor1..."
      },
      {
        owner: "0x9012345678K9012345678K9012345678K90123",
        timestamp: new Date(Date.now() - 160 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xmanor2..."
      }
    ],
  },
  {
    id: "34",
    tokenId: "0x9z0a1b...2c3d4e",
    name: "Parking Garage",
    address: "600 Park Place, Downtown Core, DC 20001",
    status: "active",
    type: "Commercial",
    size: "38,000 sq ft",
    registrationDate: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x4123456789L0123456789L0123456789L01234",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0x4123456789L0123456789L0123456789L01234",
        timestamp: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xpark01..."
      }
    ],
  },
  {
    id: "35",
    tokenId: "0x5f6g7h...8i9j0k",
    name: "Student Housing",
    address: "950 Campus Drive, University Area, UA 47401",
    status: "pending",
    type: "Residential",
    size: "15,000 sq ft",
    registrationDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x5234567890M1234567890M1234567890M12345",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x5234567890M1234567890M1234567890M12345",
        timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xstud01..."
      }
    ],
  },
  {
    id: "36",
    tokenId: "0x1l2m3n...4o5p6q",
    name: "Golf Course Estate",
    address: "1500 Fairway Drive, Golf Community, GC 33458",
    status: "active",
    type: "Land",
    size: "50 acres",
    registrationDate: new Date(Date.now() - 320 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x6345678901N2345678901N2345678901N23456",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x6345678901N2345678901N2345678901N23456",
        timestamp: new Date(Date.now() - 320 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xgolf01..."
      }
    ],
  },
  {
    id: "37",
    tokenId: "0x7r8s9t...0u1v2w",
    name: "Duplex Residence",
    address: "420 Twin Homes Lane, Residential Area, RA 78701",
    status: "active",
    type: "Residential",
    size: "3,400 sq ft",
    registrationDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x7456789012O3456789012O3456789012O34567",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0x7456789012O3456789012O3456789012O34567",
        timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xdup001..."
      },
      {
        owner: "0x3456789012O3456789012O3456789012O34567",
        timestamp: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xdup002..."
      }
    ],
  },
  {
    id: "38",
    tokenId: "0x3x4y5z...6a7b8c",
    name: "Restaurant Property",
    address: "235 Culinary Street, Food District, FD 10014",
    status: "active",
    type: "Commercial",
    size: "4,800 sq ft",
    registrationDate: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x8567890123P4567890123P4567890123P45678",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0x8567890123P4567890123P4567890123P45678",
        timestamp: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xrest01..."
      }
    ],
  },
  {
    id: "39",
    tokenId: "0x9d8e7f...6g5h4i",
    name: "Counterfeit Property",
    address: "1313 Fake Street, Scam City, SC 31313",
    status: "frozen",
    type: "Residential",
    size: "4,400 sq ft",
    registrationDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x9678901234Q5678901234Q5678901234Q56789",
    documentHash: "COUNTERFEIT_HASH_111222333",
    requiresMultiSig: false,
    fraudAlerts: 8,
    lastVerificationDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    ownershipHistory: [
      {
        owner: "0x9678901234Q5678901234Q5678901234Q56789",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud111..."
      },
      {
        owner: "0xScammer4444444444444444444444444444444",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud222..."
      },
      {
        owner: "0xFraudster555555555555555555555555555555",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud333..."
      }
    ],
  },
  {
    id: "40",
    tokenId: "0x1j2k3l...4m5n6o",
    name: "Boutique Hotel",
    address: "440 Hospitality Row, Tourism District, TD 98101",
    status: "active",
    type: "Commercial",
    size: "32,000 sq ft",
    registrationDate: new Date(Date.now() - 175 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xa789012345R6789012345R6789012345R67890",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0xa789012345R6789012345R6789012345R67890",
        timestamp: new Date(Date.now() - 175 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xhotel1..."
      }
    ],
  },
  {
    id: "41",
    tokenId: "0x7p8q9r...0s1t2u",
    name: "Storage Facility",
    address: "3800 Warehouse Way, Storage District, SD 33126",
    status: "active",
    type: "Industrial",
    size: "48,000 sq ft",
    registrationDate: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xb890123456S7890123456S7890123456S78901",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0xb890123456S7890123456S7890123456S78901",
        timestamp: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xstore1..."
      }
    ],
  },
  {
    id: "42",
    tokenId: "0x3v4w5x...6y7z8a",
    name: "Scam Property Alert",
    address: "911 Fraud Avenue, Scam Zone, SZ 91191",
    status: "frozen",
    type: "Residential",
    size: "5,200 sq ft",
    registrationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xc901234567T8901234567T8901234567T89012",
    documentHash: "SCAM_ALERT_HASH_777888999",
    requiresMultiSig: false,
    fraudAlerts: 9,
    lastVerificationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    ownershipHistory: [
      {
        owner: "0xc901234567T8901234567T8901234567T89012",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud444..."
      },
      {
        owner: "0xScammer6666666666666666666666666666666",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud555..."
      }
    ],
  },
  {
    id: "43",
    tokenId: "0x9b0c1d...2e3f4g",
    name: "Luxury Penthouse",
    address: "5500 Elite Tower, Upscale District, UD 10022",
    status: "active",
    type: "Residential",
    size: "5,500 sq ft",
    registrationDate: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xd012345678U9012345678U9012345678U90123",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0xd012345678U9012345678U9012345678U90123",
        timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xlux001..."
      },
      {
        owner: "0x0012345678U9012345678U9012345678U90123",
        timestamp: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xlux002..."
      }
    ],
  },
  {
    id: "44",
    tokenId: "0x5h6i7j...8k9l0m",
    name: "Convention Center",
    address: "2000 Event Plaza, Exhibition District, ED 60601",
    status: "active",
    type: "Commercial",
    size: "150,000 sq ft",
    registrationDate: new Date(Date.now() - 350 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xe123456789V0123456789V0123456789V01234",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0xe123456789V0123456789V0123456789V01234",
        timestamp: new Date(Date.now() - 350 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xconv01..."
      }
    ],
  },
  {
    id: "45",
    tokenId: "0x1n2o3p...4q5r6s",
    name: "Eco-Friendly Home",
    address: "888 Green Street, Sustainable City, SC 97201",
    status: "pending",
    type: "Residential",
    size: "2,900 sq ft",
    registrationDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0xf234567890W1234567890W1234567890W12345",
    requiresMultiSig: false,
    ownershipHistory: [
      {
        owner: "0xf234567890W1234567890W1234567890W12345",
        timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xeco001..."
      }
    ],
  },
];
