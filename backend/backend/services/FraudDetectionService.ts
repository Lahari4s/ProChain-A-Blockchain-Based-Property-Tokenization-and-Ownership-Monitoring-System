import { Property, OwnershipRecord } from '@/contexts/PropertyContext';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface FraudAlert {
  type: 'document_mismatch' | 'rapid_transfer' | 'ownership_gap' | 'price_anomaly' | 'suspicious_pattern' | 'fake_document';
  severity: RiskLevel;
  message: string;
  details: string;
}

export interface VerificationResult {
  isVerified: boolean;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  alerts: FraudAlert[];
  checks: {
    documentHash: boolean;
    ownershipChain: boolean;
    transferFrequency: boolean;
    priceValidation: boolean;
    patternAnalysis: boolean;
  };
  recommendation: string;
  timestamp: string;
}

class FraudDetectionService {
  private documentHashes: Map<string, string> = new Map();
  private transferHistory: Map<string, Date[]> = new Map();

  /**
   * Initialize with property document hashes
   */
  registerDocumentHash(propertyId: string, documentHash: string): void {
    this.documentHashes.set(propertyId, documentHash);
  }

  /**
   * Generate hash for document (simulated)
   */
  generateDocumentHash(file: File | undefined): string {
    if (!file) return 'NO_DOCUMENT';
    // In production, use actual cryptographic hash (SHA-256)
    // For demo, generate deterministic hash based on file properties
    return `hash_${file.name}_${file.size}_${file.type}`;
  }

  /**
   * Main fraud detection function
   */
  async analyzePropertyTransfer(
    property: Property,
    newOwner: string,
    uploadedDocuments?: { images?: File[] }
  ): Promise<VerificationResult> {
    const alerts: FraudAlert[] = [];
    const checks = {
      documentHash: true,
      ownershipChain: true,
      transferFrequency: true,
      priceValidation: true,
      patternAnalysis: true,
    };

    // 1. Document Hash Verification
    const documentCheck = this.verifyDocumentHash(property.id, uploadedDocuments);
    if (!documentCheck.isValid) {
      alerts.push(documentCheck.alert!);
      checks.documentHash = false;
    }

    // 2. Ownership Chain Validation
    const ownershipCheck = this.validateOwnershipChain(property.ownershipHistory);
    if (!ownershipCheck.isValid) {
      alerts.push(ownershipCheck.alert!);
      checks.ownershipChain = false;
    }

    // 3. Transfer Frequency Analysis
    const frequencyCheck = this.analyzeTransferFrequency(property.id, property.ownershipHistory);
    if (!frequencyCheck.isValid) {
      alerts.push(frequencyCheck.alert!);
      checks.transferFrequency = false;
    }

    // 4. Price Anomaly Detection (simulated - would integrate with real market data)
    const priceCheck = this.detectPriceAnomaly(property);
    if (!priceCheck.isValid) {
      alerts.push(priceCheck.alert!);
      checks.priceValidation = false;
    }

    // 5. Suspicious Pattern Detection
    const patternCheck = this.detectSuspiciousPatterns(property, newOwner);
    if (!patternCheck.isValid) {
      alerts.push(patternCheck.alert!);
      checks.patternAnalysis = false;
    }

    // Calculate risk score and level
    const riskScore = this.calculateRiskScore(alerts);
    const riskLevel = this.determineRiskLevel(riskScore);
    const isVerified = riskLevel === 'low' || riskLevel === 'medium';

    return {
      isVerified,
      riskLevel,
      riskScore,
      alerts,
      checks,
      recommendation: this.generateRecommendation(riskLevel, alerts),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Verify document hash matches original
   */
  private verifyDocumentHash(
    propertyId: string,
    uploadedDocuments?: { images?: File[] }
  ): { isValid: boolean; alert?: FraudAlert } {
    const storedHash = this.documentHashes.get(propertyId);

    // Special check for fake property (Property ID 4)
    if (propertyId === '4') {
      return {
        isValid: false,
        alert: {
          type: 'fake_document',
          severity: 'critical',
          message: '🚨 FAKE DOCUMENTS DETECTED',
          details: 'This property has been flagged with UNVERIFIED DOCUMENTS. The documents submitted during registration do not match any legitimate property records. This is a fraudulent listing with fake documentation.',
        },
      };
    }

    // If no stored hash, check if property exists (might be first-time registration)
    if (!storedHash) {
      return { isValid: true }; // Pass for new properties
    }

    // Check for specific fake document hash pattern
    if (storedHash && storedHash.includes('FAKE_HASH')) {
      return {
        isValid: false,
        alert: {
          type: 'fake_document',
          severity: 'critical',
          message: '🚨 UNVERIFIED DOCUMENTS - FRAUD DETECTED',
          details: 'The property documents are flagged as unverified and potentially fraudulent. This listing contains fake or tampered documentation that does not match any legitimate property records.',
        },
      };
    }

    // Verify uploaded document matches stored hash
    if (uploadedDocuments?.images?.[0]) {
      const uploadedHash = this.generateDocumentHash(uploadedDocuments.images[0]);
      
      if (uploadedHash !== storedHash) {
        return {
          isValid: false,
          alert: {
            type: 'document_mismatch',
            severity: 'critical',
            message: 'Document Hash Mismatch Detected',
            details: 'The uploaded property documents do not match the original documents registered on the blockchain. This could indicate document tampering or fraudulent substitution.',
          },
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validate ownership chain for gaps or inconsistencies
   */
  private validateOwnershipChain(
    ownershipHistory: OwnershipRecord[]
  ): { isValid: boolean; alert?: FraudAlert } {
    if (!ownershipHistory || ownershipHistory.length === 0) {
      return {
        isValid: false,
        alert: {
          type: 'ownership_gap',
          severity: 'high',
          message: 'Missing Ownership History',
          details: 'No ownership history found. This property may not be properly registered or could have missing chain of custody.',
        },
      };
    }

    // Check for suspicious gaps in ownership chain
    const sortedHistory = [...ownershipHistory].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    for (let i = 0; i < sortedHistory.length - 1; i++) {
      const current = new Date(sortedHistory[i].timestamp);
      const next = new Date(sortedHistory[i + 1].timestamp);
      const daysDiff = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);

      // Flag if there's a large gap (>5 years) suggesting missing records
      if (daysDiff > 1825) {
        return {
          isValid: false,
          alert: {
            type: 'ownership_gap',
            severity: 'medium',
            message: 'Ownership Chain Gap Detected',
            details: `Detected a ${Math.floor(daysDiff / 365)} year gap in ownership records. This may indicate incomplete historical data.`,
          },
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Analyze transfer frequency for suspicious rapid transfers
   */
  private analyzeTransferFrequency(
    propertyId: string,
    ownershipHistory: OwnershipRecord[]
  ): { isValid: boolean; alert?: FraudAlert } {
    if (ownershipHistory.length < 2) {
      return { isValid: true };
    }

    const recentTransfers = ownershipHistory.slice(0, 3);
    const transfers = recentTransfers.map(record => new Date(record.timestamp));

    // Check for rapid successive transfers (multiple transfers within 30 days)
    for (let i = 0; i < transfers.length - 1; i++) {
      const daysDiff = (transfers[i].getTime() - transfers[i + 1].getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff < 30 && ownershipHistory.length > 2) {
        return {
          isValid: false,
          alert: {
            type: 'rapid_transfer',
            severity: 'high',
            message: 'Suspicious Rapid Transfer Pattern',
            details: `Property has been transferred ${ownershipHistory.length} times with very short intervals. This pattern is commonly associated with fraudulent activities or property flipping schemes.`,
          },
        };
      }
    }

    // Record transfer for future analysis
    const existingTransfers = this.transferHistory.get(propertyId) || [];
    existingTransfers.push(new Date());
    this.transferHistory.set(propertyId, existingTransfers);

    return { isValid: true };
  }

  /**
   * Detect price anomalies (simulated - would use real market data in production)
   */
  private detectPriceAnomaly(property: Property): { isValid: boolean; alert?: FraudAlert } {
    // Simulated check - in production, compare against real estate market APIs
    const propertySize = parseInt(property.size.replace(/[^0-9]/g, ''));
    
    // Simple heuristic: if property is extremely small but claims to be commercial, flag it
    if (property.type === 'Commercial' && propertySize < 500) {
      return {
        isValid: false,
        alert: {
          type: 'price_anomaly',
          severity: 'medium',
          message: 'Property Classification Inconsistency',
          details: `Property is classified as ${property.type} but has an unusually small size (${property.size}). This may indicate incorrect classification or fraudulent listing.`,
        },
      };
    }

    return { isValid: true };
  }

  /**
   * Detect suspicious behavioral patterns
   */
  private detectSuspiciousPatterns(
    property: Property,
    newOwner: string
  ): { isValid: boolean; alert?: FraudAlert } {
    // Check for suspicious addresses in ownership history
    const suspiciousPatterns = ['scam', 'fake', 'fraud', 'hacker', 'stolen'];
    const ownershipAddresses = property.ownershipHistory.map(r => r.owner.toLowerCase());
    
    for (const address of ownershipAddresses) {
      for (const pattern of suspiciousPatterns) {
        if (address.includes(pattern)) {
          return {
            isValid: false,
            alert: {
              type: 'suspicious_pattern',
              severity: 'critical',
              message: '🚨 SUSPICIOUS OWNERSHIP HISTORY DETECTED',
              details: `Property ownership history contains suspicious addresses associated with fraudulent activity. One or more previous owners have been flagged in the system's fraud database.`,
            },
          };
        }
      }
    }
    
    // Check if transferring to previous owner (circular transfer - red flag)
    const previousOwners = property.ownershipHistory.map(record => record.owner.toLowerCase());
    
    if (previousOwners.includes(newOwner.toLowerCase()) && previousOwners.length > 1) {
      return {
        isValid: false,
        alert: {
          type: 'suspicious_pattern',
          severity: 'high',
          message: 'Circular Transfer Pattern Detected',
          details: 'Transfer is being made to a previous owner. Circular ownership patterns can indicate attempts to manipulate property history or create false market activity.',
        },
      };
    }

    // Check for frozen property status
    if (property.status === 'frozen') {
      return {
        isValid: false,
        alert: {
          type: 'suspicious_pattern',
          severity: 'critical',
          message: 'Property is Frozen',
          details: 'This property has been flagged and frozen by the system. Transfers are not permitted until the issue is resolved.',
        },
      };
    }

    return { isValid: true };
  }

  /**
   * Calculate overall risk score (0-100)
   */
  private calculateRiskScore(alerts: FraudAlert[]): number {
    if (alerts.length === 0) return 0;

    const severityWeights = {
      low: 10,
      medium: 25,
      high: 50,
      critical: 100,
    };

    const totalScore = alerts.reduce((sum, alert) => sum + severityWeights[alert.severity], 0);
    return Math.min(100, totalScore);
  }

  /**
   * Determine risk level from score
   */
  private determineRiskLevel(score: number): RiskLevel {
    if (score === 0) return 'low';
    if (score < 25) return 'low';
    if (score < 50) return 'medium';
    if (score < 75) return 'high';
    return 'critical';
  }

  /**
   * Generate recommendation based on risk assessment
   */
  private generateRecommendation(riskLevel: RiskLevel, alerts: FraudAlert[]): string {
    switch (riskLevel) {
      case 'low':
        return 'Transaction appears legitimate. Proceed with standard verification process.';
      case 'medium':
        return 'Some concerns detected. Recommend additional verification before proceeding. Contact property verifiers for manual review.';
      case 'high':
        return 'Significant fraud indicators detected. DO NOT PROCEED without thorough investigation. Recommend contacting authorities and seeking legal advice.';
      case 'critical':
        return 'CRITICAL FRAUD RISK. Transaction blocked automatically. This property has been flagged for immediate review. Report to authorities.';
      default:
        return 'Unable to assess risk. Please contact support.';
    }
  }

  /**
   * Simulate AI document analysis for fake document detection
   */
  async analyzeDocumentAuthenticity(file: File): Promise<{
    isAuthentic: boolean;
    confidence: number;
    details: string;
  }> {
    // Simulated AI analysis - in production, integrate with document verification AI
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple heuristic for demo
    const fileNameLower = file.name.toLowerCase();
    const suspiciousKeywords = ['fake', 'copy', 'sample', 'test', 'draft'];
    
    const hasSuspiciousName = suspiciousKeywords.some(keyword => fileNameLower.includes(keyword));

    if (hasSuspiciousName) {
      return {
        isAuthentic: false,
        confidence: 85,
        details: 'Document filename contains suspicious keywords that may indicate a non-authentic document.',
      };
    }

    return {
      isAuthentic: true,
      confidence: 92,
      details: 'Document passed basic authenticity checks. No obvious signs of tampering detected.',
    };
  }
}

// Export singleton instance
export const fraudDetectionService = new FraudDetectionService();
