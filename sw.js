/* ============================================================
   Avanitaxx Stories Service Worker
   Version: 2.0.0
   ============================================================ */

const VERSION = "v2.0.0";

const STATIC_CACHE = `static-${VERSION}`;
const DYNAMIC_CACHE = `dynamic-${VERSION}`;

const STATIC_ASSETS = [
    "./",
    "./index.html",
    "./offline.html",
    "./manifest.json"
];

/* ============================================================
   INSTALL
============================================================ */

self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => cache.addAll(STATIC_ASSETS))
    );

});


/* ============================================================
   ACTIVATE
============================================================ */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (
                        key !== STATIC_CACHE &&
                        key !== DYNAMIC_CACHE
                    ) {
                        return caches.delete(key);
                    }

                })

            );

        })

    );

    self.clients.claim();

});


/* ============================================================
   FETCH
============================================================ */

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    const req = event.request;

    const url = new URL(req.url);

    /* -----------------------------------------
       HTML
    ------------------------------------------ */

    if (req.mode === "navigate") {

        event.respondWith(networkFirst(req));

        return;

    }

    /* -----------------------------------------
       CSS / JS
    ------------------------------------------ */

    if (

        url.pathname.endsWith(".css") ||

        url.pathname.endsWith(".js")

    ) {

        event.respondWith(staleWhileRevalidate(req));

        return;

    }

    /* -----------------------------------------
       Images
    ------------------------------------------ */

    if (

        req.destination === "image"

    ) {

        event.respondWith(cacheFirst(req));

        return;

    }

    /* -----------------------------------------
       Fonts
    ------------------------------------------ */

    if (

        req.destination === "font"

    ) {

        event.respondWith(cacheFirst(req));

        return;

    }

});


/* ============================================================
   NETWORK FIRST
============================================================ */

async function networkFirst(request) {

    try {

        const fresh = await fetch(request);

        const cache = await caches.open(DYNAMIC_CACHE);

        cache.put(request, fresh.clone());

        return fresh;

    }

    catch {

        const cached = await caches.match(request);

        if (cached) {

            return cached;

        }

        return caches.match("./offline.html");

    }

}


/* ============================================================
   CACHE FIRST
============================================================ */

async function cacheFirst(request) {

    const cached = await caches.match(request);

    if (cached) {

        return cached;

    }

    const fresh = await fetch(request);

    const cache = await caches.open(DYNAMIC_CACHE);

    cache.put(request, fresh.clone());

    return fresh;

}


/* ============================================================
   STALE WHILE REVALIDATE
============================================================ */

async function staleWhileRevalidate(request) {

    const cache = await caches.open(DYNAMIC_CACHE);

    const cached = await cache.match(request);

    const network = fetch(request).then(response => {

        cache.put(request, response.clone());

        return response;

    });

    return cached || network;

}
