const CACHE_NAME = 'physio-maint-v4';
const STATIC_PAGES = [
  '/',
  '/short-wave-diathermy',
  '/muscle-stimulator',
  '/infrared-therapy',
  '/ultrasound-therapy',
  '/hydro-collator',
  '/massage-therapy',
  '/orthopaedic-oscillator',
  '/hot-air-oven',
  '/traction-therapy',
  '/electrosurgical-unit',
  '/microwave-diathermy',
  '/orthopaedic-saw',
  '/implants',
];

// Install event - cache static pages only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(STATIC_PAGES);
      })
      .catch((err) => {
        console.log('Cache error:', err);
      })
  );
  self.skipWaiting();
});

// Fetch event - network first for JS/CSS, cache first for pages
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip caching for Next.js static chunks and dynamic routes
  const isStaticChunk = url.pathname.startsWith('/_next/static/');
  const isApiRoute = url.pathname.startsWith('/api/');
  
  // For static chunks and API routes, always fetch from network
  if (isStaticChunk || isApiRoute) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }
  
  // For navigation requests (pages), try cache first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((networkResponse) => {
            // Cache successful page responses
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          });
        })
        .catch(() => caches.match('/'))
    );
    return;
  }
  
  // For other requests, network first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
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
  self.clients.claim();
});
