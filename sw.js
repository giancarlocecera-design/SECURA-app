// Self-destruct service worker - clears all caches and unregisters
self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.map(function(name) { return caches.delete(name); }));
    }).then(function() {
      return self.registration.unregister();
    })
  );
});

// Don't intercept any requests - let everything go to network
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
