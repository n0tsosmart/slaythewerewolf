// Service Worker for Slay the Werewolf PWA
const CACHE_NAME = 'slay-werewolf-v1.2.3';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css?v=1.2.2',
    '/js/app.js?v=1.2.2',
    '/js/translations/index.js',
    '/js/translations/en.js',
    '/assets/logo.png',
    '/assets/mafia_logo.png',
    '/assets/favicon.ico',
    // Add role card images
    '/assets/cards/lupo.jpg',
    '/assets/cards/villico.jpg',
    '/assets/cards/veggente.jpg',
    '/assets/cards/medium.jpg',
    '/assets/cards/indemoniato.jpg',
    '/assets/cards/guardia.jpg',
    '/assets/cards/gufo.jpg',
    '/assets/cards/massone.jpg',
    '/assets/cards/criceto.jpg',
    '/assets/cards/mitomane.jpg',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app shell');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches immediately
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - Network-first for ALL requests to ensure updates are always applied
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests (like PeerJS CDN)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Network-first strategy for all requests
    // This ensures the app always gets the latest version when online
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone and cache the response for offline use
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('[SW] Serving from cache (offline):', event.request.url);
                        return cachedResponse;
                    }
                    // No cache available
                    console.log('[SW] No cache available for:', event.request.url);
                    return new Response('Offline - No cached version available', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});
