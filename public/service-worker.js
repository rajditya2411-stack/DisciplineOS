// Service Worker for background notifications
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  const { type, note } = event.data;
  
  if (type === 'SEND_NOTIFICATION') {
    self.registration.showNotification('Discipline Reminder', {
      body: note.text,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `reminder-${note.id}`,
      requireInteraction: true,
      actions: [
        { action: 'open', title: 'Open App' },
        { action: 'close', title: 'Dismiss' }
      ]
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
