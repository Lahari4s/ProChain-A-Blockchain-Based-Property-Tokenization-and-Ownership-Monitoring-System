import { ethers } from 'ethers';
import { logger } from '../utils/logger.js';
import { WebSocketService } from './WebSocketService.js';
import { NotificationService } from './NotificationService.js';
import { FraudDetectionService } from './FraudDetectionService.js';
import { DatabaseService } from './DatabaseService.js';
import { PropertyRegistryABI, MonitoringOracleABI } from '../contracts/abis.js';

interface BlockchainEvent {
  eventName: string;
  transactionHash: string;
  blockNumber: number;
  tokenId?: string;
  from?: string;
  to?: string;
  data: any;
  timestamp: number;
}

export class BlockchainMonitor {
  private provider: ethers.JsonRpcProvider;
  private propertyRegistryContract: ethers.Contract;
  private monitoringOracleContract: ethers.Contract;
  private isRunning: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor(
    private wsService: WebSocketService,
    private notificationService: NotificationService,
    private fraudDetectionService: FraudDetectionService,
    private dbService: DatabaseService
  ) {
    const rpcUrl = process.env.POLYGON_RPC_URL || 'https://rpc-mumbai.maticvigil.com';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Initialize contracts
    const propertyRegistryAddress = process.env.PROPERTY_REGISTRY_ADDRESS || '';
    const monitoringOracleAddress = process.env.MONITORING_ORACLE_ADDRESS || '';

    this.propertyRegistryContract = new ethers.Contract(
      propertyRegistryAddress,
      PropertyRegistryABI,
      this.provider
    );

    this.monitoringOracleContract = new ethers.Contract(
      monitoringOracleAddress,
      MonitoringOracleABI,
      this.provider
    );
  }

  async start() {
    if (this.isRunning) {
      logger.warn('Blockchain monitor is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting blockchain event monitoring...');

    try {
      // Listen to PropertyRegistry events
      this.setupPropertyRegistryListeners();
      
      // Listen to MonitoringOracle events
      this.setupMonitoringOracleListeners();

      // Monitor for block confirmations
      this.setupBlockMonitoring();

      // Setup connection error handling
      this.setupErrorHandling();

      logger.info('Blockchain monitoring active');
    } catch (error) {
      logger.error('Error starting blockchain monitor:', error);
      this.isRunning = false;
      throw error;
    }
  }

  private setupPropertyRegistryListeners() {
    // Transfer event
    this.propertyRegistryContract.on('Transfer', async (from, to, tokenId, event) => {
      logger.info(`Transfer detected: Token ${tokenId} from ${from} to ${to}`);
      
      const blockchainEvent: BlockchainEvent = {
        eventName: 'Transfer',
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
        tokenId: tokenId.toString(),
        from,
        to,
        data: { from, to, tokenId: tokenId.toString() },
        timestamp: Date.now()
      };

      await this.processEvent(blockchainEvent);
    });

    // PropertyRegistered event
    this.propertyRegistryContract.on('PropertyRegistered', async (tokenId, owner, ipfsHash, event) => {
      logger.info(`Property registered: Token ${tokenId} by ${owner}`);
      
      const blockchainEvent: BlockchainEvent = {
        eventName: 'PropertyRegistered',
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
        tokenId: tokenId.toString(),
        data: { tokenId: tokenId.toString(), owner, ipfsHash },
        timestamp: Date.now()
      };

      await this.processEvent(blockchainEvent);
    });

    // TransferRequestCreated event
    this.propertyRegistryContract.on('TransferRequestCreated', async (tokenId, from, to, requestId, event) => {
      logger.info(`Transfer request created: Token ${tokenId} from ${from} to ${to}`);
      
      const blockchainEvent: BlockchainEvent = {
        eventName: 'TransferRequestCreated',
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
        tokenId: tokenId.toString(),
        from,
        to,
        data: { tokenId: tokenId.toString(), from, to, requestId: requestId.toString() },
        timestamp: Date.now()
      };

      await this.processEvent(blockchainEvent);
      
      // Check for suspicious activity
      await this.checkForSuspiciousTransfer(tokenId.toString(), from, to);
    });

    // PropertyFrozen event
    this.propertyRegistryContract.on('PropertyFrozen', async (tokenId, reason, event) => {
      logger.warn(`Property frozen: Token ${tokenId}`);
      
      const blockchainEvent: BlockchainEvent = {
        eventName: 'PropertyFrozen',
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
        tokenId: tokenId.toString(),
        data: { tokenId: tokenId.toString(), reason },
        timestamp: Date.now()
      };

      await this.processEvent(blockchainEvent);
      
      // Send critical alert
      await this.sendCriticalAlert(tokenId.toString(), 'Property Frozen', reason);
    });
  }

  private setupMonitoringOracleListeners() {
    // AlertTriggered event
    this.monitoringOracleContract.on('AlertTriggered', async (alertId, tokenId, actor, alertType, severity, event) => {
      logger.warn(`Alert triggered: Alert ${alertId} for token ${tokenId}`);
      
      const blockchainEvent: BlockchainEvent = {
        eventName: 'AlertTriggered',
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
        tokenId: tokenId.toString(),
        data: {
          alertId: alertId.toString(),
          tokenId: tokenId.toString(),
          actor,
          alertType: alertType.toString(),
          severity: severity.toString()
        },
        timestamp: Date.now()
      };

      await this.processEvent(blockchainEvent);
      
      // Send alert notification
      await this.sendAlertNotification(alertId.toString(), tokenId.toString(), actor, alertType, severity);
    });

    // AddressFlagged event
    this.monitoringOracleContract.on('AddressFlagged', async (account, reason, event) => {
      logger.warn(`Address flagged: ${account}`);
      
      const blockchainEvent: BlockchainEvent = {
        eventName: 'AddressFlagged',
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
        data: { account, reason },
        timestamp: Date.now()
      };

      await this.processEvent(blockchainEvent);
    });

    // PatternDetected event
    this.monitoringOracleContract.on('PatternDetected', async (account, pattern, event) => {
      logger.warn(`Suspicious pattern detected for ${account}: ${pattern}`);
      
      const blockchainEvent: BlockchainEvent = {
        eventName: 'PatternDetected',
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
        data: { account, pattern },
        timestamp: Date.now()
      };

      await this.processEvent(blockchainEvent);
    });
  }

  private setupBlockMonitoring() {
    this.provider.on('block', async (blockNumber) => {
      logger.debug(`New block: ${blockNumber}`);
      
      // Broadcast block update via WebSocket
      this.wsService.broadcast({
        type: 'BLOCK_UPDATE',
        data: { blockNumber, timestamp: Date.now() }
      });
    });
  }

  private setupErrorHandling() {
    this.provider.on('error', async (error) => {
      logger.error('Provider error:', error);
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        logger.info(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        setTimeout(async () => {
          await this.reconnect();
        }, 5000 * this.reconnectAttempts);
      } else {
        logger.error('Max reconnection attempts reached. Manual intervention required.');
      }
    });
  }

  private async reconnect() {
    try {
      await this.stop();
      await this.start();
      this.reconnectAttempts = 0;
      logger.info('Reconnection successful');
    } catch (error) {
      logger.error('Reconnection failed:', error);
    }
  }

  private async processEvent(event: BlockchainEvent) {
    try {
      // Save event to database
      await this.dbService.saveEvent(event);

      // Broadcast to WebSocket clients
      this.wsService.broadcast({
        type: 'BLOCKCHAIN_EVENT',
        data: event
      });

      // Run fraud detection
      const fraudAnalysis = await this.fraudDetectionService.analyzeEvent(event);
      
      if (fraudAnalysis.isSuspicious) {
        logger.warn(`Suspicious activity detected: ${fraudAnalysis.reason}`);
        
        // Trigger alert
        await this.triggerAlert(event, fraudAnalysis);
      }

      logger.info(`Event processed: ${event.eventName} - ${event.transactionHash}`);
    } catch (error) {
      logger.error('Error processing event:', error);
    }
  }

  private async checkForSuspiciousTransfer(tokenId: string, from: string, to: string) {
    try {
      // Check if addresses are flagged
      const [isFromFlagged, isToFlagged] = await Promise.all([
        this.monitoringOracleContract.isAddressFlagged(from),
        this.monitoringOracleContract.isAddressFlagged(to)
      ]);

      if (isFromFlagged || isToFlagged) {
        logger.warn(`Flagged address detected in transfer of token ${tokenId}`);
        
        await this.sendCriticalAlert(
          tokenId,
          'Flagged Address Transfer',
          `Transfer involving flagged address detected`
        );
      }

      // Check transaction velocity
      const velocityCheck = await this.fraudDetectionService.checkTransactionVelocity(from);
      
      if (velocityCheck.suspicious) {
        logger.warn(`High transaction velocity detected for ${from}`);
        
        await this.sendAlertNotification(
          'velocity_' + Date.now(),
          tokenId,
          from,
          'SuspiciousVelocity',
          'High'
        );
      }
    } catch (error) {
      logger.error('Error checking for suspicious transfer:', error);
    }
  }

  private async triggerAlert(event: BlockchainEvent, fraudAnalysis: any) {
    const alert = {
      eventId: event.transactionHash,
      tokenId: event.tokenId,
      alertType: fraudAnalysis.alertType,
      severity: fraudAnalysis.severity,
      description: fraudAnalysis.reason,
      timestamp: event.timestamp,
      data: event.data
    };

    // Save alert
    await this.dbService.saveAlert(alert);

    // Broadcast alert
    this.wsService.broadcast({
      type: 'ALERT',
      data: alert
    });

    // Send notifications
    await this.notificationService.sendAlert(alert);
  }

  private async sendAlertNotification(
    alertId: string,
    tokenId: string,
    actor: string,
    alertType: any,
    severity: any
  ) {
    const alert = {
      alertId,
      tokenId,
      actor,
      alertType: this.getAlertTypeName(alertType),
      severity: this.getSeverityName(severity),
      timestamp: Date.now()
    };

    await this.notificationService.sendAlert(alert);
  }

  private async sendCriticalAlert(tokenId: string, title: string, message: string) {
    const alert = {
      tokenId,
      alertType: 'Critical',
      severity: 'Critical',
      description: message,
      timestamp: Date.now()
    };

    await this.notificationService.sendCriticalAlert(alert);
  }

  private getAlertTypeName(alertType: any): string {
    const types = [
      'UnauthorizedTransfer',
      'SuspiciousVelocity',
      'BlacklistedAddress',
      'InvalidSignature',
      'DuplicateRegistration',
      'FrozenProperty',
      'DocumentMismatch'
    ];
    return types[Number(alertType)] || 'Unknown';
  }

  private getSeverityName(severity: any): string {
    const severities = ['Low', 'Medium', 'High', 'Critical'];
    return severities[Number(severity)] || 'Unknown';
  }

  async stop() {
    if (!this.isRunning) {
      logger.warn('Blockchain monitor is not running');
      return;
    }

    logger.info('Stopping blockchain monitor...');
    
    // Remove all listeners
    this.propertyRegistryContract.removeAllListeners();
    this.monitoringOracleContract.removeAllListeners();
    this.provider.removeAllListeners();
    
    this.isRunning = false;
    logger.info('Blockchain monitor stopped');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      network: process.env.NETWORK || 'mumbai',
      reconnectAttempts: this.reconnectAttempts
    };
  }
}
