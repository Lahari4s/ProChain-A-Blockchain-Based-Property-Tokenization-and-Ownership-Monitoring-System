import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { initialNotifications } from '@/data/initialNotifications';

export type NotificationType = 
  | 'transfer_complete' 
  | 'transfer_requested' 
  | 'fraud_detected' 
  | 'suspicious_activity' 
  | 'property_frozen'
  | 'property_registered'
  | 'verification_complete'
  | 'document_uploaded'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  propertyId?: string;
  propertyName?: string;
  actionUrl?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  icon?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
  getNotificationsByProperty: (propertyId: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Convert initial notifications to full notifications with IDs
const convertedInitialNotifications: Notification[] = initialNotifications.map((notif, index) => ({
  ...notif,
  id: `initial_${Date.now()}_${index}`,
}));

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(convertedInitialNotifications);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Add new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotif = new window.Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: newNotification.id,
      });

      // Close notification after 5 seconds
      setTimeout(() => browserNotif.close(), 5000);
    }

    // Play notification sound for critical/high severity
    if (notification.severity === 'critical' || notification.severity === 'high') {
      playNotificationSound();
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Delete notification
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Get notifications by property
  const getNotificationsByProperty = (propertyId: string) => {
    return notifications.filter(notif => notif.propertyId === propertyId);
  };

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification-sound.mp3'); // You can add a sound file
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Silently fail if audio can't play
      });
    } catch (error) {
      // Silently fail
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        getNotificationsByProperty,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
