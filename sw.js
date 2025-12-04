// Service Worker for Slay the Werewolf PWA
const CACHE_NAME = 'slay-werewolf-v1.0.42';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/translations.js',
    '/assets/logo.png',
    '/assets/mafia_logo.png',
    '/assets/backgrounds/background.jpg',
    '/assets/backgrounds/mafia_background.jpg',
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

// Activate event - clean up old caches
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

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests (like PeerJS CDN)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(() => {
                // If both cache and network fail, return offline page
                // For now, just fail gracefully
                console.log('[SW] Fetch failed for:', event.request.url);
            })
    );
});
