// Contract ABIs - These will be generated after compiling the smart contracts
// For now, we'll define the essential function signatures

export const PropertyRegistryABI = [
  "function registerProperty(string propertyAddress, string coordinates, uint256 size, string legalDescription, bytes32 documentHash, string tokenURI, bool requiresMultiSigTransfer) returns (uint256)",
  "function verifyProperty(uint256 tokenId)",
  "function createTransferRequest(uint256 tokenId, address to)",
  "function approveTransfer(uint256 tokenId)",
  "function executeTransfer(uint256 tokenId)",
  "function freezeProperty(uint256 tokenId, string reason)",
  "function unfreezeProperty(uint256 tokenId)",
  "function getProperty(uint256 tokenId) view returns (tuple(string propertyAddress, string coordinates, uint256 size, string legalDescription, bytes32 documentHash, uint256 registrationDate, bool isVerified, bool isFrozen))",
  "function getOwnershipHistory(uint256 tokenId) view returns (tuple(address owner, uint256 timestamp, bytes32 transactionHash)[])",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "event PropertyRegistered(uint256 indexed tokenId, address indexed owner, string propertyAddress, bytes32 documentHash)",
  "event PropertyVerified(uint256 indexed tokenId, address indexed verifier)",
  "event TransferRequestCreated(uint256 indexed tokenId, address indexed from, address indexed to, uint256 requestTime)",
  "event TransferExecuted(uint256 indexed tokenId, address indexed from, address indexed to)",
  "event PropertyFrozen(uint256 indexed tokenId, string reason)",
  "event SuspiciousActivity(uint256 indexed tokenId, address indexed actor, string reason)"
];

export const OwnershipVerificationABI = [
  "function submitKYC(bytes32 documentHash, bytes32 governmentIdHash)",
  "function verifyKYC(address user)",
  "function revokeKYC(address user, string reason)",
  "function isKYCValid(address user) view returns (bool)",
  "function recordSignature(bytes32 signatureHash)",
  "function verifySignature(address signer, bytes32 signatureHash) view returns (bool)",
  "function fileDispute(address respondent, string reason) returns (uint256)",
  "function resolveDispute(uint256 disputeId, string resolution)",
  "function getKYCStatus(address user) view returns (bool isVerified, uint256 verificationDate, uint256 expiryDate, address verifier)",
  "function getDispute(uint256 disputeId) view returns (tuple(uint256 disputeId, address claimant, address respondent, string reason, uint256 filedDate, uint8 status, address resolver, string resolution))",
  "event KYCSubmitted(address indexed user, bytes32 documentHash)",
  "event KYCVerified(address indexed user, address indexed verifier)",
  "event DisputeFiled(uint256 indexed disputeId, address indexed claimant, address indexed respondent)"
];
