/**
 * service-worker.js - Service worker for Progressive Web App (PWA)
 * 
 * This script manages the caching of assets and handling of fetch requests for offline support. It:
 * 1. Caches essential assets during the installation phase.
 * 2. Responds to fetch events by serving cached assets or fetching from the network.
 * 3. Cleans up old caches during activation.
 * 
 * Author: Muhammad Ahmed (https://github.com/callmeahmedr/)
 * Open source project: https://github.com/callmeahmedr/pwa-converter
 */

const CACHE_NAME = 'pwa-cache-v1'; // Name of the cache storage
const CACHE_EXPIRY_DAYS = 7; // Define cache expiry period in days

// List of assets to pre-cache during service worker installation
const PRE_CACHED_ASSETS = [
    '/',
    '/pwa/manifest.json',
    '/pwa/pwa.js',
    '/pwa/icons/icon-192x192.png',
    '/pwa/icons/icon-512x512.png'
    // Add other essential URLs that need to be cached initially
];

// Install event - Cache essential assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.all(
                PRE_CACHED_ASSETS.map(url => {
                    return fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Failed to fetch ${url}`);
                            }
                            return cache.put(url, response.clone());
                        })
                        .catch(error => {
                            console.warn(`Skipping ${url}: ${error.message}`);
                        });
                })
            );
        })
    );
    self.skipWaiting(); // Activate the worker immediately
});

// Fetch event - Serve cached assets and handle network requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse; // Return cached response if available
            }
            return fetch(event.request)
                .then(networkResponse => {
                    if (!networkResponse || networkResponse.status !== 200) {
                        return networkResponse; // Return network response if not OK
                    }
                    return caches.open(CACHE_NAME)
                        .then(cache => {
                            // Cache the new response for future requests
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse; // Return network response
                        });
                })
                .catch(error => {
                    console.error(`Fetch failed for ${event.request.url}: ${error}`);
                    // Optionally, return a fallback response or a generic error page
                    return new Response('Network error occurred. Please try again later.', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
        })
    );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (!cacheWhitelist.includes(key)) {
                    return caches.delete(key); // Delete old caches
                }
            }));
        })
    );
    return self.clients.claim(); // Take control of clients immediately
});

// Update cache periodically
const CACHE_UPDATE_INTERVAL = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // Cache expiry in milliseconds
self.addEventListener('message', event => {
    if (event.data.action === 'updateCache') {
        updateCache();
    }
});

function updateCache() {
    caches.open(CACHE_NAME)
        .then(cache => {
            return Promise.all(
                PRE_CACHED_ASSETS.map(url => {
                    return fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Failed to fetch ${url}`);
                            }
                            return cache.put(url, response.clone());
                        })
                        .catch(error => {
                            console.warn(`Skipping ${url}: ${error.message}`);
                        });
                })
            );
        })
        .catch(err => console.error('Cache update failed:', err));
}

// Trigger cache update periodically
self.setInterval(() => {
    self.clients.matchAll({
        type: 'window'
    }).then(clients => {
        clients.forEach(client => {
            client.postMessage({
                action: 'updateCache'
            });
        });
    });
}, CACHE_UPDATE_INTERVAL); // Update every week
