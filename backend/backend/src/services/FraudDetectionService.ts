import { logger } from '../utils/logger.js';

interface FraudAnalysis {
  isSuspicious: boolean;
  reason?: string;
  alertType?: string;
  severity?: string;
  score: number;
}

export class FraudDetectionService {
  private transactionHistory: Map<string, any[]> = new Map();
  private blacklistedAddresses: Set<string> = new Set();
  private readonly VELOCITY_THRESHOLD = 3;
  private readonly VELOCITY_WINDOW = 3600000;
  private readonly SUSPICIOUS_SCORE_THRESHOLD = 70;

  async analyzeEvent(event: any): Promise<FraudAnalysis> {
    let suspiciousScore = 0;
    const reasons: string[] = [];

    if (event.from && this.blacklistedAddresses.has(event.from.toLowerCase())) {
      suspiciousScore += 100;
      reasons.push('Blacklisted address detected');
    }

    const velocityCheck = await this.checkTransactionVelocity(event.from || event.actor);
    if (velocityCheck.suspicious) {
      suspiciousScore += 40;
      reasons.push('High transaction velocity');
    }

    this.recordTransaction(event);

    return {
      isSuspicious: suspiciousScore >= this.SUSPICIOUS_SCORE_THRESHOLD,
      reason: reasons.join('; '),
      alertType: 'SuspiciousActivity',
      severity: this.calculateSeverity(suspiciousScore),
      score: suspiciousScore,
    };
  }

  async checkTransactionVelocity(address: string): Promise<{ suspicious: boolean; count?: number }> {
    if (!address) return { suspicious: false };

    const transactions = this.transactionHistory.get(address.toLowerCase()) || [];
    const now = Date.now();
    const recentTransactions = transactions.filter(tx => now - tx.timestamp < this.VELOCITY_WINDOW);

    return {
      suspicious: recentTransactions.length > this.VELOCITY_THRESHOLD,
      count: recentTransactions.length,
    };
  }

  private recordTransaction(event: any) {
    const address = (event.from || event.actor)?.toLowerCase();
    if (!address) return;

    if (!this.transactionHistory.has(address)) {
      this.transactionHistory.set(address, []);
    }

    this.transactionHistory.get(address)!.push({
      timestamp: event.timestamp || Date.now(),
      type: event.eventName,
      tokenId: event.tokenId,
    });
  }

  private calculateSeverity(score: number): string {
    if (score >= 90) return 'Critical';
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  }

  flagAddress(address: string) {
    this.blacklistedAddresses.add(address.toLowerCase());
    logger.info(`Address flagged: ${address}`);
  }

  unflagAddress(address: string) {
    this.blacklistedAddresses.delete(address.toLowerCase());
    logger.info(`Address unflagged: ${address}`);
  }
}
