// Firebase Cloud Messaging Service Worker

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_FIREBASE_AUTH_DOMAIN',
  projectId: 'YOUR_FIREBASE_PROJECT_ID',
  storageBucket: 'YOUR_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'YOUR_FIREBASE_APP_ID',
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'ProChain Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'New security alert',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: payload.data?.alertId || 'prochain-alert',
    data: payload.data,
    requireInteraction: payload.data?.severity === 'Critical',
    vibrate: [200, 100, 200, 100, 200],
    actions: [
      {
        action: 'view',
        title: 'View Details',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'view') {
    // Open the monitoring dashboard
    event.waitUntil(
      clients.openWindow('/monitoring')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle push event
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New notification from ProChain',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: data.data,
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'ProChain', options)
    );
  }
});
