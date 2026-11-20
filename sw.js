/* Avanitaxx Stories PWA service worker
   Network-first navigation with offline fallback.
   Third-party requests (including Supabase/auth/API traffic) are not intercepted.
*/
'use strict';

const CACHE_PREFIX = 'avx-pwa-';
const CACHE_VERSION = 'v2';
const SHELL_CACHE = CACHE_PREFIX + CACHE_VERSION;
const OFFLINE_URL = '/offline.html';

const SHELL_FILES = [
  OFFLINE_URL,
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32.png'
];

// Cache shell files independently. A missing optional icon must not cancel
// the entire service-worker installation.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    const results = await Promise.allSettled(
      SHELL_FILES.map(file => cache.add(file))
    );

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn('[Avanitaxx PWA] Could not precache:', SHELL_FILES[index], result.reason);
      }
    });

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== SHELL_CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never intercept third-party scripts, Supabase, authentication, storage,
  // realtime, or API traffic. These requests stay network-controlled.
  if (url.origin !== self.location.origin) return;

  // Navigation stays network-first; show the cached offline page on failure.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(SHELL_CACHE);
        return (await cache.match(OFFLINE_URL)) || Response.error();
      })
    );
    return;
  }

  // Cache only app identity icons. All other same-origin content stays live.
  if (url.pathname.startsWith('/icons/')) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request))
    );
  }
});
