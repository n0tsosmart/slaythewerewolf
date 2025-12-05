// Service Worker for Slay the Werewolf PWA
const CACHE_NAME = 'slay-werewolf-v1.2.2';
const ASSETS_TO_CACHE = [
    '/slaythewerewolf/',
    '/slaythewerewolf/index.html',
    '/slaythewerewolf/css/styles.css?v=1.2.2',
    '/slaythewerewolf/js/app.js?v=1.2.2',
    '/slaythewerewolf/js/translations/index.js',
    '/slaythewerewolf/js/translations/en.js',
    '/slaythewerewolf/assets/logo.png',
    '/slaythewerewolf/assets/mafia_logo.png',
    '/slaythewerewolf/assets/favicon.ico',
    // Add role card images
    '/slaythewerewolf/assets/cards/lupo.jpg',
    '/slaythewerewolf/assets/cards/villico.jpg',
    '/slaythewerewolf/assets/cards/veggente.jpg',
    '/slaythewerewolf/assets/cards/medium.jpg',
    '/slaythewerewolf/assets/cards/indemoniato.jpg',
    '/slaythewerewolf/assets/cards/guardia.jpg',
    '/slaythewerewolf/assets/cards/gufo.jpg',
    '/slaythewerewolf/assets/cards/massone.jpg',
    '/slaythewerewolf/assets/cards/criceto.jpg',
    '/slaythewerewolf/assets/cards/mitomane.jpg',
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
