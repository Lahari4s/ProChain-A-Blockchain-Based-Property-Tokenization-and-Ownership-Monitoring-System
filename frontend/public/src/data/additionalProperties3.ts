import { Property } from '../types/property';

// Properties 46-50
export const additionalProperties3: Property[] = [
  {
    id: "46",
    tokenId: "0x7t8u9v...0w1x2y",
    name: "Data Center",
    address: "4400 Tech Boulevard, Server District, SD 98052",
    status: "active",
    type: "Industrial",
    size: "80,000 sq ft",
    registrationDate: new Date(Date.now() - 190 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x0345678901X2345678901X2345678901X23456",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x0345678901X2345678901X2345678901X23456",
        timestamp: new Date(Date.now() - 190 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xdata01..."
      }
    ],
  },
  {
    id: "47",
    tokenId: "0x3z4a5b...6c7d8e",
    name: "Forged Title Property",
    address: "777 Illegal Way, Forged District, FG 77777",
    status: "frozen",
    type: "Residential",
    size: "6,100 sq ft",
    registrationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x1456789012Y3456789012Y3456789012Y34567",
    documentHash: "FORGED_TITLE_HASH_000111222",
    requiresMultiSig: false,
    fraudAlerts: 10,
    lastVerificationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    ownershipHistory: [
      {
        owner: "0x1456789012Y3456789012Y3456789012Y34567",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud666..."
      },
      {
        owner: "0xScammer7777777777777777777777777777777",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud777..."
      },
      {
        owner: "0xFraudster888888888888888888888888888888",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud888..."
      },
      {
        owner: "0xCriminal999999999999999999999999999999",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xfraud999..."
      }
    ],
  },
  {
    id: "48",
    tokenId: "0x9f0g1h...2i3j4k",
    name: "Seaside Villa",
    address: "150 Oceanfront Drive, Coastal Heights, CH 92037",
    status: "active",
    type: "Residential",
    size: "4,800 sq ft",
    registrationDate: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x2567890123Z4567890123Z4567890123Z45678",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x2567890123Z4567890123Z4567890123Z45678",
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xsea001..."
      },
      {
        owner: "0x5567890123Z4567890123Z4567890123Z45678",
        timestamp: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xsea002..."
      }
    ],
  },
  {
    id: "49",
    tokenId: "0x5l6m7n...8o9p0q",
    name: "Mixed-Use Development",
    address: "3100 Multi-Purpose Drive, Development Zone, DZ 78701",
    status: "active",
    type: "Commercial",
    size: "95,000 sq ft",
    registrationDate: new Date(Date.now() - 270 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x3678901234A5678901234A5678901234A56789",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x3678901234A5678901234A5678901234A56789",
        timestamp: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xmixed1..."
      },
      {
        owner: "0x6678901234A5678901234A5678901234A56789",
        timestamp: new Date(Date.now() - 270 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xmixed2..."
      }
    ],
  },
  {
    id: "50",
    tokenId: "0x1r2s3t...4u5v6w",
    name: "Ranch Estate",
    address: "9000 Prairie Road, Rural Territory, RT 59001",
    status: "pending",
    type: "Land",
    size: "100 acres",
    registrationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    owner: "0x4789012345B6789012345B6789012345B67890",
    requiresMultiSig: true,
    ownershipHistory: [
      {
        owner: "0x4789012345B6789012345B6789012345B67890",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: "0xranch1..."
      }
    ],
  },
];
