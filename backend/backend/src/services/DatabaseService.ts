import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const EventSchema = new mongoose.Schema({
  eventName: String,
  transactionHash: String,
  blockNumber: Number,
  tokenId: String,
  from: String,
  to: String,
  data: mongoose.Schema.Types.Mixed,
  timestamp: Number,
  createdAt: { type: Date, default: Date.now }
});

const AlertSchema = new mongoose.Schema({
  eventId: String,
  tokenId: String,
  alertType: String,
  severity: String,
  description: String,
  timestamp: Number,
  isResolved: { type: Boolean, default: false },
  resolvedAt: Date,
  resolvedBy: String,
  data: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', EventSchema);
const Alert = mongoose.model('Alert', AlertSchema);

export class DatabaseService {
  private isConnected: boolean = false;

  async connect() {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/prochain';
      await mongoose.connect(uri);
      this.isConnected = true;
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('Database disconnected');
    }
  }

  async saveEvent(event: any) {
    try {
      const newEvent = new Event(event);
      await newEvent.save();
      logger.debug(`Event saved: ${event.transactionHash}`);
    } catch (error) {
      logger.error('Error saving event:', error);
      throw error;
    }
  }

  async saveAlert(alert: any) {
    try {
      const newAlert = new Alert(alert);
      await newAlert.save();
      logger.info(`Alert saved: ${alert.alertType}`);
    } catch (error) {
      logger.error('Error saving alert:', error);
      throw error;
    }
  }

  async getRecentEvents(limit: number = 50) {
    return await Event.find().sort({ timestamp: -1 }).limit(limit);
  }

  async getUnresolvedAlerts() {
    return await Alert.find({ isResolved: false }).sort({ timestamp: -1 });
  }

  async resolveAlert(alertId: string, resolvedBy: string) {
    return await Alert.findByIdAndUpdate(alertId, {
      isResolved: true,
      resolvedAt: new Date(),
      resolvedBy
    });
  }
}
