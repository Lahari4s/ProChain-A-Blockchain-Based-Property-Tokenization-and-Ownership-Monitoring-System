// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title OwnershipVerification
 * @dev Contract for KYC verification and ownership validation
 */
contract OwnershipVerification is AccessControl, ReentrancyGuard {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant NOTARY_ROLE = keccak256("NOTARY_ROLE");
    
    struct KYCData {
        bytes32 documentHash;
        bytes32 governmentIdHash;
        uint256 verificationDate;
        bool isVerified;
        address verifier;
        uint256 expiryDate;
    }
    
    struct DigitalSignature {
        bytes32 signatureHash;
        address signer;
        uint256 timestamp;
        bool isValid;
    }
    
    struct DisputeResolution {
        uint256 disputeId;
        address claimant;
        address respondent;
        string reason;
        uint256 filedDate;
        DisputeStatus status;
        address resolver;
        string resolution;
    }
    
    enum DisputeStatus {
        Pending,
        UnderReview,
        Resolved,
        Rejected
    }
    
    mapping(address => KYCData) public kycRecords;
    mapping(address => DigitalSignature[]) public signatures;
    mapping(uint256 => DisputeResolution) public disputes;
    mapping(address => bool) public verifiedUsers;
    
    uint256 private disputeCounter;
    uint256 public constant KYC_VALIDITY_PERIOD = 365 days;
    
    event KYCSubmitted(address indexed user, bytes32 documentHash);
    event KYCVerified(address indexed user, address indexed verifier);
    event KYCRevoked(address indexed user, string reason);
    event SignatureRecorded(address indexed signer, bytes32 signatureHash);
    event DisputeFiled(uint256 indexed disputeId, address indexed claimant, address indexed respondent);
    event DisputeResolved(uint256 indexed disputeId, string resolution);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        _grantRole(NOTARY_ROLE, msg.sender);
    }
    
    /**
     * @dev Submit KYC data hash for verification
     */
    function submitKYC(
        bytes32 documentHash,
        bytes32 governmentIdHash
    ) public nonReentrant {
        require(documentHash != bytes32(0), "Invalid document hash");
        require(governmentIdHash != bytes32(0), "Invalid ID hash");
        
        kycRecords[msg.sender] = KYCData({
            documentHash: documentHash,
            governmentIdHash: governmentIdHash,
            verificationDate: 0,
            isVerified: false,
            verifier: address(0),
            expiryDate: 0
        });
        
        emit KYCSubmitted(msg.sender, documentHash);
    }
    
    /**
     * @dev Verify user's KYC by authorized verifier
     */
    function verifyKYC(address user) public onlyRole(VERIFIER_ROLE) {
        require(kycRecords[user].documentHash != bytes32(0), "No KYC submission found");
        
        kycRecords[user].isVerified = true;
        kycRecords[user].verifier = msg.sender;
        kycRecords[user].verificationDate = block.timestamp;
        kycRecords[user].expiryDate = block.timestamp + KYC_VALIDITY_PERIOD;
        verifiedUsers[user] = true;
        
        emit KYCVerified(user, msg.sender);
    }
    
    /**
     * @dev Revoke KYC verification
     */
    function revokeKYC(address user, string memory reason) 
        public 
        onlyRole(VERIFIER_ROLE) 
    {
        kycRecords[user].isVerified = false;
        verifiedUsers[user] = false;
        emit KYCRevoked(user, reason);
    }
    
    /**
     * @dev Check if user's KYC is valid
     */
    function isKYCValid(address user) public view returns (bool) {
        KYCData memory kyc = kycRecords[user];
        return kyc.isVerified && block.timestamp <= kyc.expiryDate;
    }
    
    /**
     * @dev Record digital signature
     */
    function recordSignature(bytes32 signatureHash) public {
        require(isKYCValid(msg.sender), "KYC not valid");
        
        signatures[msg.sender].push(DigitalSignature({
            signatureHash: signatureHash,
            signer: msg.sender,
            timestamp: block.timestamp,
            isValid: true
        }));
        
        emit SignatureRecorded(msg.sender, signatureHash);
    }
    
    /**
     * @dev Verify signature validity
     */
    function verifySignature(
        address signer,
        bytes32 signatureHash
    ) public view returns (bool) {
        DigitalSignature[] memory userSignatures = signatures[signer];
        
        for (uint i = 0; i < userSignatures.length; i++) {
            if (userSignatures[i].signatureHash == signatureHash && 
                userSignatures[i].isValid) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev File ownership dispute
     */
    function fileDispute(
        address respondent,
        string memory reason
    ) public returns (uint256) {
        require(isKYCValid(msg.sender), "Claimant KYC not valid");
        require(isKYCValid(respondent), "Respondent KYC not valid");
        
        uint256 disputeId = disputeCounter++;
        
        disputes[disputeId] = DisputeResolution({
            disputeId: disputeId,
            claimant: msg.sender,
            respondent: respondent,
            reason: reason,
            filedDate: block.timestamp,
            status: DisputeStatus.Pending,
            resolver: address(0),
            resolution: ""
        });
        
        emit DisputeFiled(disputeId, msg.sender, respondent);
        return disputeId;
    }
    
    /**
     * @dev Update dispute status
     */
    function updateDisputeStatus(
        uint256 disputeId,
        DisputeStatus newStatus
    ) public onlyRole(NOTARY_ROLE) {
        require(disputes[disputeId].filedDate > 0, "Dispute does not exist");
        disputes[disputeId].status = newStatus;
        disputes[disputeId].resolver = msg.sender;
    }
    
    /**
     * @dev Resolve dispute
     */
    function resolveDispute(
        uint256 disputeId,
        string memory resolution
    ) public onlyRole(NOTARY_ROLE) {
        require(disputes[disputeId].filedDate > 0, "Dispute does not exist");
        
        disputes[disputeId].status = DisputeStatus.Resolved;
        disputes[disputeId].resolution = resolution;
        disputes[disputeId].resolver = msg.sender;
        
        emit DisputeResolved(disputeId, resolution);
    }
    
    /**
     * @dev Get user's KYC status
     */
    function getKYCStatus(address user) 
        public 
        view 
        returns (
            bool isVerified,
            uint256 verificationDate,
            uint256 expiryDate,
            address verifier
        ) 
    {
        KYCData memory kyc = kycRecords[user];
        return (
            kyc.isVerified,
            kyc.verificationDate,
            kyc.expiryDate,
            kyc.verifier
        );
    }
    
    /**
     * @dev Get dispute details
     */
    function getDispute(uint256 disputeId) 
        public 
        view 
        returns (DisputeResolution memory) 
    {
        return disputes[disputeId];
    }
    
    /**
     * @dev Get all signatures for a user
     */
    function getUserSignatures(address user) 
        public 
        view 
        returns (DigitalSignature[] memory) 
    {
        return signatures[user];
    }
}
