// SECURA - Service Worker
const CACHE_NAME = 'secura-v1';
const ASSETS = [
  '/',
  '/index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'
];

// Installation - mise en cache
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation - nettoyage ancien cache
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch - cache d'abord, réseau ensuite
self.addEventListener('fetch', function(e){
  // Ne pas intercepter les appels Supabase
  if(e.request.url.includes('supabase.co')) return;
  
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(response){
        if(!response || response.status !== 200) return response;
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache){
          cache.put(e.request, clone);
        });
        return response;
      }).catch(function(){
        return caches.match('/index.html');
      });
    })
  );
});
