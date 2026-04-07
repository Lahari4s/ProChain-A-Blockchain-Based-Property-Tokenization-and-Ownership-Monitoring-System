// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PropertyRegistry
 * @dev Main contract for property tokenization with enhanced security features
 */
contract PropertyRegistry is ERC721, ERC721URIStorage, AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    
    uint256 private _tokenIdCounter;
    uint256 public constant TRANSFER_TIMELOCK = 2 days;
    
    struct Property {
        string propertyAddress;
        string coordinates;
        uint256 size;
        string legalDescription;
        bytes32 documentHash;
        uint256 registrationDate;
        bool isVerified;
        bool isFrozen;
    }
    
    struct TransferRequest {
        address from;
        address to;
        uint256 tokenId;
        uint256 requestTime;
        bool isExecuted;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }
    
    struct OwnershipHistory {
        address owner;
        uint256 timestamp;
        bytes32 transactionHash;
    }
    
    mapping(uint256 => Property) public properties;
    mapping(uint256 => OwnershipHistory[]) public ownershipHistory;
    mapping(uint256 => TransferRequest) public transferRequests;
    mapping(uint256 => bool) public requiresMultiSig;
    mapping(address => bool) public blacklistedAddresses;
    
    uint256 public multiSigThreshold = 2;
    
    event PropertyRegistered(
        uint256 indexed tokenId,
        address indexed owner,
        string propertyAddress,
        bytes32 documentHash
    );
    
    event PropertyVerified(uint256 indexed tokenId, address indexed verifier);
    
    event TransferRequestCreated(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 requestTime
    );
    
    event TransferApproved(
        uint256 indexed tokenId,
        address indexed approver
    );
    
    event TransferExecuted(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );
    
    event PropertyFrozen(uint256 indexed tokenId, string reason);
    event PropertyUnfrozen(uint256 indexed tokenId);
    event SuspiciousActivity(uint256 indexed tokenId, address indexed actor, string reason);
    
    constructor() ERC721("ProChain Property", "PROP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }
    
    /**
     * @dev Register a new property as NFT
     */
    function registerProperty(
        string memory propertyAddress,
        string memory coordinates,
        uint256 size,
        string memory legalDescription,
        bytes32 documentHash,
        string memory tokenURI,
        bool requiresMultiSigTransfer
    ) public whenNotPaused returns (uint256) {
        require(!blacklistedAddresses[msg.sender], "Address is blacklisted");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        properties[tokenId] = Property({
            propertyAddress: propertyAddress,
            coordinates: coordinates,
            size: size,
            legalDescription: legalDescription,
            documentHash: documentHash,
            registrationDate: block.timestamp,
            isVerified: false,
            isFrozen: false
        });
        
        ownershipHistory[tokenId].push(OwnershipHistory({
            owner: msg.sender,
            timestamp: block.timestamp,
            transactionHash: blockhash(block.number - 1)
        }));
        
        requiresMultiSig[tokenId] = requiresMultiSigTransfer;
        
        emit PropertyRegistered(tokenId, msg.sender, propertyAddress, documentHash);
        
        return tokenId;
    }
    
    /**
     * @dev Verify property by authorized verifier
     */
    function verifyProperty(uint256 tokenId) public onlyRole(VERIFIER_ROLE) {
        require(_exists(tokenId), "Property does not exist");
        properties[tokenId].isVerified = true;
        emit PropertyVerified(tokenId, msg.sender);
    }
    
    /**
     * @dev Create a transfer request with timelock
     */
    function createTransferRequest(
        uint256 tokenId,
        address to
    ) public whenNotPaused nonReentrant {
        require(_exists(tokenId), "Property does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!properties[tokenId].isFrozen, "Property is frozen");
        require(!blacklistedAddresses[to], "Recipient is blacklisted");
        
        TransferRequest storage request = transferRequests[tokenId];
        request.from = msg.sender;
        request.to = to;
        request.tokenId = tokenId;
        request.requestTime = block.timestamp;
        request.isExecuted = false;
        request.approvalCount = 0;
        
        emit TransferRequestCreated(tokenId, msg.sender, to, block.timestamp);
    }
    
    /**
     * @dev Approve transfer request (for multi-sig)
     */
    function approveTransfer(uint256 tokenId) public onlyRole(VERIFIER_ROLE) {
        TransferRequest storage request = transferRequests[tokenId];
        require(!request.isExecuted, "Transfer already executed");
        require(!request.approvals[msg.sender], "Already approved");
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        
        emit TransferApproved(tokenId, msg.sender);
    }
    
    /**
     * @dev Execute transfer after timelock and approvals
     */
    function executeTransfer(uint256 tokenId) public whenNotPaused nonReentrant {
        TransferRequest storage request = transferRequests[tokenId];
        
        require(!request.isExecuted, "Transfer already executed");
        require(request.from == msg.sender, "Not the requester");
        require(
            block.timestamp >= request.requestTime + TRANSFER_TIMELOCK,
            "Timelock not expired"
        );
        
        if (requiresMultiSig[tokenId]) {
            require(
                request.approvalCount >= multiSigThreshold,
                "Insufficient approvals"
            );
        }
        
        request.isExecuted = true;
        
        _transfer(request.from, request.to, tokenId);
        
        ownershipHistory[tokenId].push(OwnershipHistory({
            owner: request.to,
            timestamp: block.timestamp,
            transactionHash: blockhash(block.number - 1)
        }));
        
        emit TransferExecuted(tokenId, request.from, request.to);
    }
    
    /**
     * @dev Freeze property in case of suspicious activity
     */
    function freezeProperty(uint256 tokenId, string memory reason) 
        public 
        onlyRole(ADMIN_ROLE) 
    {
        require(_exists(tokenId), "Property does not exist");
        properties[tokenId].isFrozen = true;
        emit PropertyFrozen(tokenId, reason);
    }
    
    /**
     * @dev Unfreeze property
     */
    function unfreezeProperty(uint256 tokenId) public onlyRole(ADMIN_ROLE) {
        require(_exists(tokenId), "Property does not exist");
        properties[tokenId].isFrozen = false;
        emit PropertyUnfrozen(tokenId);
    }
    
    /**
     * @dev Add address to blacklist
     */
    function blacklistAddress(address account) public onlyRole(ADMIN_ROLE) {
        blacklistedAddresses[account] = true;
    }
    
    /**
     * @dev Remove address from blacklist
     */
    function removeFromBlacklist(address account) public onlyRole(ADMIN_ROLE) {
        blacklistedAddresses[account] = false;
    }
    
    /**
     * @dev Get ownership history for a property
     */
    function getOwnershipHistory(uint256 tokenId) 
        public 
        view 
        returns (OwnershipHistory[] memory) 
    {
        return ownershipHistory[tokenId];
    }
    
    /**
     * @dev Get property details
     */
    function getProperty(uint256 tokenId) 
        public 
        view 
        returns (Property memory) 
    {
        require(_exists(tokenId), "Property does not exist");
        return properties[tokenId];
    }
    
    /**
     * @dev Emergency pause
     */
    function pause() public onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause
     */
    function unpause() public onlyRole(ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Report suspicious activity
     */
    function reportSuspiciousActivity(
        uint256 tokenId,
        address actor,
        string memory reason
    ) public onlyRole(VERIFIER_ROLE) {
        emit SuspiciousActivity(tokenId, actor, reason);
    }
    
    // Required overrides
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
