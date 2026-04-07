import { WebSocketServer, WebSocket } from 'ws';
import { logger } from '../utils/logger.js';
import { IncomingMessage } from 'http';

interface Client {
  ws: WebSocket;
  userId?: string;
  subscriptions: Set<string>;
  isAlive: boolean;
}

interface WSMessage {
  type: string;
  data: any;
  timestamp?: number;
}

export class WebSocketService {
  private clients: Map<string, Client> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(private wss: WebSocketServer) {
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      const clientId = this.generateClientId();
      
      const client: Client = {
        ws,
        subscriptions: new Set(),
        isAlive: true,
      };

      this.clients.set(clientId, client);
      logger.info(`Client connected: ${clientId} (Total: ${this.clients.size})`);

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'CONNECTED',
        data: { clientId, timestamp: Date.now() },
      });

      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
        } catch (error) {
          logger.error('Error parsing WebSocket message:', error);
        }
      });

      // Handle pong response
      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.isAlive = true;
        }
      });

      // Handle disconnect
      ws.on('close', () => {
        this.clients.delete(clientId);
        logger.info(`Client disconnected: ${clientId} (Total: ${this.clients.size})`);
      });

      // Handle errors
      ws.on('error', (error) => {
        logger.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });
    });

    // Start heartbeat
    this.startHeartbeat();

    logger.info('WebSocket service initialized');
  }

  private handleClientMessage(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    logger.debug(`Message from ${clientId}:`, message);

    switch (message.type) {
      case 'AUTHENTICATE':
        this.handleAuthentication(clientId, message.data);
        break;

      case 'SUBSCRIBE':
        this.handleSubscription(clientId, message.data);
        break;

      case 'UNSUBSCRIBE':
        this.handleUnsubscription(clientId, message.data);
        break;

      case 'PING':
        this.sendToClient(clientId, { type: 'PONG', data: { timestamp: Date.now() } });
        break;

      default:
        logger.warn(`Unknown message type: ${message.type}`);
    }
  }

  private handleAuthentication(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // TODO: Implement proper JWT authentication
    const { userId, token } = data;

    // For now, just set userId
    client.userId = userId;

    this.sendToClient(clientId, {
      type: 'AUTHENTICATED',
      data: { userId, timestamp: Date.now() },
    });

    logger.info(`Client ${clientId} authenticated as user ${userId}`);
  }

  private handleSubscription(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { channels } = data;

    if (Array.isArray(channels)) {
      channels.forEach((channel) => {
        client.subscriptions.add(channel);
        logger.info(`Client ${clientId} subscribed to ${channel}`);
      });
    }

    this.sendToClient(clientId, {
      type: 'SUBSCRIBED',
      data: { channels: Array.from(client.subscriptions), timestamp: Date.now() },
    });
  }

  private handleUnsubscription(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { channels } = data;

    if (Array.isArray(channels)) {
      channels.forEach((channel) => {
        client.subscriptions.delete(channel);
        logger.info(`Client ${clientId} unsubscribed from ${channel}`);
      });
    }

    this.sendToClient(clientId, {
      type: 'UNSUBSCRIBED',
      data: { channels: Array.from(client.subscriptions), timestamp: Date.now() },
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((client, clientId) => {
        if (!client.isAlive) {
          logger.info(`Terminating inactive client: ${clientId}`);
          client.ws.terminate();
          this.clients.delete(clientId);
          return;
        }

        client.isAlive = false;
        client.ws.ping();
      });
    }, 30000); // 30 seconds
  }

  broadcast(message: WSMessage) {
    const messageStr = JSON.stringify({
      ...message,
      timestamp: message.timestamp || Date.now(),
    });

    let sentCount = 0;

    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
        sentCount++;
      }
    });

    logger.debug(`Broadcast message to ${sentCount} clients`);
  }

  broadcastToChannel(channel: string, message: WSMessage) {
    const messageStr = JSON.stringify({
      ...message,
      timestamp: message.timestamp || Date.now(),
    });

    let sentCount = 0;

    this.clients.forEach((client) => {
      if (client.subscriptions.has(channel) && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
        sentCount++;
      }
    });

    logger.debug(`Broadcast message to ${sentCount} clients on channel ${channel}`);
  }

  broadcastToUser(userId: string, message: WSMessage) {
    const messageStr = JSON.stringify({
      ...message,
      timestamp: message.timestamp || Date.now(),
    });

    let sentCount = 0;

    this.clients.forEach((client) => {
      if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
        sentCount++;
      }
    });

    logger.debug(`Broadcast message to user ${userId} (${sentCount} connections)`);
  }

  sendToClient(clientId: string, message: WSMessage) {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      client.ws.send(JSON.stringify({
        ...message,
        timestamp: message.timestamp || Date.now(),
      }));
      return true;
    } catch (error) {
      logger.error(`Error sending message to client ${clientId}:`, error);
      return false;
    }
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getStats() {
    const stats = {
      totalClients: this.clients.size,
      authenticatedClients: 0,
      subscriptions: new Map<string, number>(),
    };

    this.clients.forEach((client) => {
      if (client.userId) {
        stats.authenticatedClients++;
      }

      client.subscriptions.forEach((channel) => {
        stats.subscriptions.set(channel, (stats.subscriptions.get(channel) || 0) + 1);
      });
    });

    return stats;
  }

  shutdown() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.clients.forEach((client) => {
      client.ws.close();
    });

    this.clients.clear();
    logger.info('WebSocket service shut down');
  }
}
