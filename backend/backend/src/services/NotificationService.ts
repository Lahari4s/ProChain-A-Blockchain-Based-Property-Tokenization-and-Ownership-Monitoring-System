import admin from 'firebase-admin';
import { logger } from '../utils/logger.js';
import axios from 'axios';

interface Alert {
  alertId?: string;
  tokenId?: string;
  actor?: string;
  alertType: string;
  severity: string;
  description?: string;
  timestamp: number;
  data?: any;
}

interface NotificationPreferences {
  userId: string;
  email?: string;
  phone?: string;
  fcmToken?: string;
  enableEmail: boolean;
  enableSMS: boolean;
  enablePush: boolean;
  alertThreshold: 'Low' | 'Medium' | 'High' | 'Critical';
}

export class NotificationService {
  private firebaseApp: admin.app.App | null = null;
  private isInitialized: boolean = false;

  async initialize() {
    try {
      // Initialize Firebase Admin SDK
      if (!admin.apps.length) {
        const serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        };

        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL,
        });
      } else {
        this.firebaseApp = admin.app();
      }

      this.isInitialized = true;
      logger.info('Firebase Admin SDK initialized');
    } catch (error) {
      logger.error('Failed to initialize Firebase:', error);
      throw error;
    }
  }

  async sendAlert(alert: Alert) {
    if (!this.isInitialized) {
      logger.warn('Firebase not initialized, skipping notification');
      return;
    }

    try {
      // Get users subscribed to this property
      const subscribers = await this.getPropertySubscribers(alert.tokenId);

      // Send notifications to all subscribers
      await Promise.all(
        subscribers.map(async (subscriber) => {
          try {
            await this.sendNotificationToUser(subscriber, alert);
          } catch (error) {
            logger.error(`Failed to send notification to user ${subscriber.userId}:`, error);
          }
        })
      );

      logger.info(`Alert notifications sent for token ${alert.tokenId}`);
    } catch (error) {
      logger.error('Error sending alert notifications:', error);
    }
  }

  async sendCriticalAlert(alert: Alert) {
    if (!this.isInitialized) {
      logger.warn('Firebase not initialized, skipping critical notification');
      return;
    }

    try {
      // Critical alerts bypass user preferences
      const subscribers = await this.getPropertySubscribers(alert.tokenId);

      await Promise.all(
        subscribers.map(async (subscriber) => {
          // Send via all available channels for critical alerts
          await this.sendPushNotification(subscriber.fcmToken!, {
            title: '🚨 CRITICAL ALERT',
            body: alert.description || 'Critical security alert detected',
            data: { alert: JSON.stringify(alert) },
            priority: 'high',
            sound: 'critical',
          });

          if (subscriber.email) {
            await this.sendEmailNotification(subscriber.email, alert);
          }

          if (subscriber.phone) {
            await this.sendSMSNotification(subscriber.phone, alert);
          }
        })
      );

      logger.info(`Critical alert notifications sent for token ${alert.tokenId}`);
    } catch (error) {
      logger.error('Error sending critical alert:', error);
    }
  }

  private async sendNotificationToUser(subscriber: NotificationPreferences, alert: Alert) {
    // Check severity threshold
    const severityLevels = ['Low', 'Medium', 'High', 'Critical'];
    const alertSeverityIndex = severityLevels.indexOf(alert.severity);
    const thresholdIndex = severityLevels.indexOf(subscriber.alertThreshold);

    if (alertSeverityIndex < thresholdIndex) {
      logger.debug(`Alert below threshold for user ${subscriber.userId}`);
      return;
    }

    // Send via enabled channels
    if (subscriber.enablePush && subscriber.fcmToken) {
      await this.sendPushNotification(subscriber.fcmToken, {
        title: `${this.getSeverityEmoji(alert.severity)} ProChain Alert`,
        body: `${alert.alertType}: ${alert.description || 'Security alert detected'}`,
        data: { alert: JSON.stringify(alert) },
        priority: alert.severity === 'Critical' ? 'high' : 'normal',
      });
    }

    if (subscriber.enableEmail && subscriber.email) {
      await this.sendEmailNotification(subscriber.email, alert);
    }

    if (subscriber.enableSMS && subscriber.phone) {
      await this.sendSMSNotification(subscriber.phone, alert);
    }
  }

  async sendPushNotification(fcmToken: string, notification: {
    title: string;
    body: string;
    data?: any;
    priority?: string;
    sound?: string;
  }) {
    if (!this.firebaseApp) {
      logger.warn('Firebase app not initialized');
      return;
    }

    try {
      const message: admin.messaging.Message = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        android: {
          priority: (notification.priority === 'high' ? 'high' : 'normal') as any,
          notification: {
            sound: notification.sound || 'default',
            channelId: 'prochain_alerts',
            priority: notification.priority === 'high' ? 'max' : 'default' as any,
            defaultSound: true,
            defaultVibrateTimings: true,
          },
        },
        apns: {
          payload: {
            aps: {
              sound: notification.sound || 'default',
              badge: 1,
              contentAvailable: true,
            },
          },
        },
        webpush: {
          notification: {
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            vibrate: [200, 100, 200],
            requireInteraction: notification.priority === 'high',
          },
        },
        token: fcmToken,
      };

      const response = await admin.messaging().send(message);
      logger.info(`Push notification sent successfully: ${response}`);
    } catch (error) {
      logger.error('Error sending push notification:', error);
      throw error;
    }
  }

  async sendMulticastNotification(tokens: string[], notification: any) {
    if (!this.firebaseApp || tokens.length === 0) {
      return;
    }

    try {
      const message: admin.messaging.MulticastMessage = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      logger.info(`Multicast notification sent: ${response.successCount} successful, ${response.failureCount} failed`);
      
      return response;
    } catch (error) {
      logger.error('Error sending multicast notification:', error);
      throw error;
    }
  }

  private async sendEmailNotification(email: string, alert: Alert) {
    try {
      // Using SendGrid API
      if (!process.env.SENDGRID_API_KEY) {
        logger.warn('SendGrid API key not configured');
        return;
      }

      const response = await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        {
          personalizations: [
            {
              to: [{ email }],
              subject: `ProChain Alert: ${alert.alertType}`,
            },
          ],
          from: {
            email: process.env.SENDGRID_FROM_EMAIL,
            name: 'ProChain Security',
          },
          content: [
            {
              type: 'text/html',
              value: this.generateEmailHTML(alert),
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info(`Email notification sent to ${email}`);
    } catch (error) {
      logger.error('Error sending email notification:', error);
    }
  }

  private async sendSMSNotification(phone: string, alert: Alert) {
    try {
      // Using Twilio API
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        logger.warn('Twilio credentials not configured');
        return;
      }

      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromPhone = process.env.TWILIO_PHONE_NUMBER;

      const message = `ProChain Alert: ${alert.alertType} - ${alert.severity} severity. Property Token: ${alert.tokenId}. Check your app for details.`;

      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        new URLSearchParams({
          To: phone,
          From: fromPhone!,
          Body: message,
        }),
        {
          auth: {
            username: accountSid,
            password: authToken,
          },
        }
      );

      logger.info(`SMS notification sent to ${phone}`);
    } catch (error) {
      logger.error('Error sending SMS notification:', error);
    }
  }

  private async getPropertySubscribers(tokenId?: string): Promise<NotificationPreferences[]> {
    // TODO: Implement database query to get subscribers
    // For now, return mock data
    return [
      {
        userId: 'user1',
        fcmToken: 'mock_fcm_token',
        email: 'owner@example.com',
        phone: '+1234567890',
        enableEmail: true,
        enableSMS: true,
        enablePush: true,
        alertThreshold: 'Medium',
      },
    ];
  }

  private generateEmailHTML(alert: Alert): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert-box { background: white; border-left: 4px solid #f44336; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .severity-${alert.severity.toLowerCase()} { border-left-color: ${this.getSeverityColor(alert.severity)}; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 ProChain Security Alert</h1>
            </div>
            <div class="content">
              <div class="alert-box severity-${alert.severity.toLowerCase()}">
                <h2>${alert.alertType}</h2>
                <p><strong>Severity:</strong> ${alert.severity}</p>
                <p><strong>Property Token ID:</strong> ${alert.tokenId || 'N/A'}</p>
                <p><strong>Time:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
                <p><strong>Description:</strong> ${alert.description || 'Security alert detected'}</p>
                ${alert.actor ? `<p><strong>Actor:</strong> ${alert.actor}</p>` : ''}
              </div>
              <p>This is an automated alert from your ProChain monitoring system. Please review the activity and take necessary action if required.</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/monitoring" class="button">View Dashboard</a>
            </div>
            <div class="footer">
              <p>ProChain - Secure Property Tokenization Platform</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getSeverityEmoji(severity: string): string {
    switch (severity) {
      case 'Critical': return '🚨';
      case 'High': return '⚠️';
      case 'Medium': return '⚡';
      case 'Low': return 'ℹ️';
      default: return '📢';
    }
  }

  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'Critical': return '#d32f2f';
      case 'High': return '#f57c00';
      case 'Medium': return '#fbc02d';
      case 'Low': return '#388e3c';
      default: return '#757575';
    }
  }

  async subscribeToTopic(fcmToken: string, topic: string) {
    if (!this.firebaseApp) {
      throw new Error('Firebase not initialized');
    }

    try {
      await admin.messaging().subscribeToTopic(fcmToken, topic);
      logger.info(`Subscribed to topic: ${topic}`);
    } catch (error) {
      logger.error('Error subscribing to topic:', error);
      throw error;
    }
  }

  async unsubscribeFromTopic(fcmToken: string, topic: string) {
    if (!this.firebaseApp) {
      throw new Error('Firebase not initialized');
    }

    try {
      await admin.messaging().unsubscribeFromTopic(fcmToken, topic);
      logger.info(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      logger.error('Error unsubscribing from topic:', error);
      throw error;
    }
  }
}
