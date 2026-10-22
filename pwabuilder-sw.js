const CACHE_NAME = 'petrol-fraud-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  // Add other CSS, JS, or image paths here as needed
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Offline Support Logic)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Background Sync Event
self.addEventListener('sync', (event) => {
  if (event.tag === 'my-sync-tag') {
    event.waitUntil(
      // Put your background data sync code here
      Promise.resolve()
    );
  }
});

// Periodic Background Sync Event
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(
      // Fetch fresh background updates here
      fetch('/')
    );
  }
});

// Push Notification Event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Petrol Fraud Dashboard';
  const options = {
    body: data.body || 'New update available.',
    icon: 'icons/icon-192x192.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
