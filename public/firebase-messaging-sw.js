// firebase-messaging-sw.js
// Service worker for handling Firebase Cloud Messaging background notifications.
// Place this file in your project's `public/` folder so it's served at /firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// TODO: Replace with your app's Firebase config. For security, only include the
// fields required for messaging (messagingSenderId is essential). The rest are
// optional for background notifications to display properly.

firebase.initializeApp({
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Handle background messages. The payload will typically contain `notification` with `title` and `body`.
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = (payload.notification && payload.notification.title) || 'New notification';
  const notificationOptions = {
    body: (payload.notification && payload.notification.body) || '',
    icon: '/icons/icon-192.png', // replace with your app icon path
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: handle notification click to focus/open app window
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const clickAction = event.notification.data && event.notification.data.click_action;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === clickAction && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(clickAction || '/');
    })
  );
});