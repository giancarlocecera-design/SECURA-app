// SECURA - Service Worker v2 - Network First
const CACHE_NAME = 'secura-v' + Date.now();
const CACHE_STATIC = 'secura-static-v2';

// Ressources statiques CDN à mettre en cache
const STATIC_ASSETS = [
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
];

// Installation
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_STATIC).then(function(cache){
      return cache.addAll(STATIC_ASSETS).catch(function(){});
    })
  );
  self.skipWaiting();
});

// Activation - supprime tous les anciens caches
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_STATIC; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', function(e){
  var url = e.request.url;

  // Ne jamais intercepter Supabase ni unpkg
  if(url.includes('supabase.co') || url.includes('fonts.googleapis') || url.includes('fonts.gstatic')) return;

  // index.html → TOUJOURS réseau d'abord, jamais de cache
  if(url.includes('index.html') || url.endsWith('/') || (!url.includes('.') && !url.includes('unpkg'))){
    e.respondWith(
      fetch(e.request).catch(function(){
        return caches.match('/index.html');
      })
    );
    return;
  }

  // Ressources CDN statiques → cache d'abord (elles ne changent pas)
  if(url.includes('unpkg.com')){
    e.respondWith(
      caches.open(CACHE_STATIC).then(function(cache){
        return cache.match(e.request).then(function(cached){
          if(cached) return cached;
          return fetch(e.request).then(function(response){
            cache.put(e.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // Tout le reste → réseau d'abord
  e.respondWith(
    fetch(e.request).catch(function(){
      return caches.match(e.request);
    })
  );
});
