/* Avanitaxx Stories PWA service worker
   Network-first navigation with offline fallback.
   Third-party requests (including Supabase/auth/API traffic)
   are not intercepted.
*/

'use strict';

const CACHE_PREFIX = 'avx-pwa-';
const CACHE_VERSION = 'v3';
const SHELL_CACHE = CACHE_PREFIX + CACHE_VERSION;

const OFFLINE_URL = '/offline.html';

const APP_ICON_PATHS = [
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png',
  '/apple-touch-icon.png',
  '/favicon-32.png'
];

const SHELL_FILES = [
  OFFLINE_URL,
  '/manifest.json',
  ...APP_ICON_PATHS
];

// INSTALL
// Cache the offline shell and app identity icons.
// Missing optional files will not cancel installation.

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);

    const results = await Promise.allSettled(
      SHELL_FILES.map(file => cache.add(file))
    );

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(
          '[Avanitaxx PWA] Could not precache:',
          SHELL_FILES[index],
          result.reason
        );
      }
    });

    await self.skipWaiting();
  })());
});


// ACTIVATE
// Remove older Avanitaxx PWA shell caches only.

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key =>
            key.startsWith(CACHE_PREFIX) &&
            key !== SHELL_CACHE
          )
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});


// FETCH
// Keep website navigation network-first.
// Use cached offline page if network is unavailable.
// Intercept only the app's own identity icons.
// Do not intercept third-party or Supabase requests.

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ignore third-party requests.
  if (url.origin !== self.location.origin) return;

  // Navigation: network first, offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(SHELL_CACHE);

        return (
          await cache.match(OFFLINE_URL)
        ) || Response.error();
      })
    );

    return;
  }

  // App identity icons: cache first, network fallback.
  if (APP_ICON_PATHS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => {
        return cached || fetch(request);
      })
    );
  }
});
