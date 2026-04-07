import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

class FirebaseService {
  private app: any;
  private messaging: Messaging | null = null;
  private isSupported: boolean = false;

  async initialize() {
    try {
      // Check if Firebase is configured
      if (!firebaseConfig.apiKey) {
        console.warn('Firebase not configured');
        return false;
      }

      this.app = initializeApp(firebaseConfig);

      // Check if messaging is supported
      if ('Notification' in window && 'serviceWorker' in navigator) {
        this.isSupported = true;
        this.messaging = getMessaging(this.app);
        console.log('Firebase initialized successfully');
        return true;
      } else {
        console.warn('Push notifications not supported in this browser');
        return false;
      }
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      return false;
    }
  }

  async requestPermission(): Promise<string | null> {
    if (!this.isSupported || !this.messaging) {
      console.warn('Firebase messaging not initialized');
      return null;
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('Notification permission granted');

        // Get FCM token
        const token = await getToken(this.messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        console.log('FCM Token:', token);
        return token;
      } else {
        console.log('Notification permission denied');
        return null;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return null;
    }
  }

  onMessage(callback: (payload: any) => void) {
    if (!this.messaging) {
      return;
    }

    onMessage(this.messaging, (payload) => {
      console.log('Message received:', payload);
      callback(payload);
    });
  }

  async subscribeToNotifications(userId: string): Promise<string | null> {
    const token = await this.requestPermission();

    if (token) {
      // Send token to backend
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fcmToken: token,
            userId,
            preferences: {
              enableEmail: true,
              enableSMS: true,
              enablePush: true,
              alertThreshold: 'Medium',
            },
          }),
        });

        if (response.ok) {
          console.log('Subscribed to notifications successfully');
          return token;
        }
      } catch (error) {
        console.error('Error subscribing to notifications:', error);
      }
    }

    return null;
  }

  async sendTestNotification(token: string) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fcmToken: token }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }

  getPermissionStatus(): NotificationPermission {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  }

  isNotificationSupported(): boolean {
    return this.isSupported;
  }
}

export const firebaseService = new FirebaseService();
