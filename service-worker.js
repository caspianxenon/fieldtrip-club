// ============================================
// Service Worker for FieldTrip Club PWA
// Provides offline support and caching
// ============================================

const CACHE_NAME = 'fieldtrip-club-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/register.html',
  '/login.html',
  '/dashboard.html',
  '/trips.html',
  '/trip.html',
  '/profile.html',
  '/contact.html',
  '/style.css',
  '/app.js',
  '/script.js',
  '/manifest.json',
  '/favicon.svg'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache error:', error);
      })
  );
  // Force service worker to activate immediately
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim all clients immediately
  self.clients.claim();
});

// Fetch Event - Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request for network call
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            // Cache the new response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Offline - return cached version or offline page
            return caches.match(event.request)
              .then((response) => {
                return response || new Response(
                  '<h1>Offline</h1><p>You are offline. Some features may not be available.</p>',
                  { headers: { 'Content-Type': 'text/html' } }
                );
              });
          });
      })
  );
});

// Background Sync (Optional - for trip updates)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-trips') {
    event.waitUntil(
      fetch('/api/trips')
        .then((response) => response.json())
        .then((data) => {
          // Update local storage with latest trips
          localStorage.setItem('cachedTrips', JSON.stringify(data));
        })
        .catch((error) => {
          console.error('Sync error:', error);
        })
    );
  }
});

// Push Notifications (Optional)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from FieldTrip Club',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('FieldTrip Club', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if window is already open
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

console.log('Service Worker loaded');
