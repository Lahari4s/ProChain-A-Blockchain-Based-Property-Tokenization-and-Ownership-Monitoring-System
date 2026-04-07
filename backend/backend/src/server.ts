import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { BlockchainMonitor } from './services/BlockchainMonitor.js';
import { NotificationService } from './services/NotificationService.js';
import { FraudDetectionService } from './services/FraudDetectionService.js';
import { WebSocketService } from './services/WebSocketService.js';
import { DatabaseService } from './services/DatabaseService.js';
import { logger } from './utils/logger.js';
import apiRoutes from './routes/api.js';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const WS_PORT = process.env.WEBSOCKET_PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', apiRoutes);

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ port: Number(WS_PORT) });

// Initialize services
const dbService = new DatabaseService();
const notificationService = new NotificationService();
const fraudDetectionService = new FraudDetectionService();
const wsService = new WebSocketService(wss);
const blockchainMonitor = new BlockchainMonitor(
  wsService,
  notificationService,
  fraudDetectionService,
  dbService
);

// Start services
async function startServer() {
  try {
    logger.info('Starting ProChain Monitoring Service...');

    // Connect to database
    await dbService.connect();
    logger.info('Database connected');

    // Initialize Firebase
    await notificationService.initialize();
    logger.info('Firebase initialized');

    // Start blockchain monitoring
    await blockchainMonitor.start();
    logger.info('Blockchain monitoring started');

    // Start HTTP server
    server.listen(PORT, () => {
      logger.info(`HTTP Server running on port ${PORT}`);
      logger.info(`WebSocket Server running on port ${WS_PORT}`);
      logger.info(`Monitoring network: ${process.env.NETWORK || 'mumbai'}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  
  await blockchainMonitor.stop();
  await dbService.disconnect();
  
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  
  await blockchainMonitor.stop();
  await dbService.disconnect();
  
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

export { app, wss };
