// Service Worker for Slay the Werewolf PWA
const CACHE_NAME = 'slay-werewolf-v1.0.44';
const ASSETS_TO_CACHE = [
    '/slaythewerewolf/',
    '/slaythewerewolf/index.html',
    '/slaythewerewolf/css/styles.css',
    '/slaythewerewolf/js/app.js',
    '/slaythewerewolf/js/translations.js',
    '/slaythewerewolf/assets/logo.png',
    '/slaythewerewolf/assets/mafia_logo.png',
    '/slaythewerewolf/assets/backgrounds/background.jpg',
    '/slaythewerewolf/assets/backgrounds/mafia_background.jpg',
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

// Fetch event - network-first for HTML, cache-first for others
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests (like PeerJS CDN)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    const url = new URL(event.request.url);
    const isHTMLRequest = event.request.destination === 'document' ||
        url.pathname.endsWith('.html') ||
        url.pathname.endsWith('/');

    if (isHTMLRequest) {
        // Network-first strategy for HTML
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Clone and cache the response
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
                            console.log('[SW] Serving HTML from cache (offline)');
                            return cachedResponse;
                        }
                        // No cache available
                        return new Response('Offline - No cached version available', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
                })
        );
    } else {
        // Cache-first strategy for CSS, JS, images, etc.
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
                    // If both cache and network fail
                    console.log('[SW] Fetch failed for:', event.request.url);
                })
        );
    }
});
