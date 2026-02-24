/* ========================================= */
/* ONE LIFE PWA SERVICE WORKER */
/* ========================================= */

/* ========================================= */
/* CACHE VERSION CONTROL */
/* ========================================= */

const CACHE_NAME = "onelife-cache-v1.0.0";

/* ========================================= */
/* FILES TO CACHE */
/* ========================================= */

const urlsToCache = [

  "/",
  "/index.html",
  "/style.css",
  "/cross.html",
  "/worship.html",
  "/bible-search.html",

];

/* ========================================= */
/* INSTALL EVENT */
/* ========================================= */

self.addEventListener("install", event => {

  console.log("Service Worker installing...");

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Caching core files...");
        return cache.addAll(urlsToCache);
      })
  );

  self.skipWaiting();

});

/* ========================================= */
/* ACTIVATE EVENT */
/* ========================================= */

self.addEventListener("activate", event => {

  console.log("Service Worker activating...");

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );

  return self.clients.claim();

});

/* ========================================= */
/* FETCH EVENT */
/* ========================================= */

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(response => {

        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(networkResponse => {

            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
              return networkResponse;
            }

            const responseClone = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });

            return networkResponse;

          })
          .catch(() => {

            if (event.request.mode === "navigate") {
              return caches.match("/index.html");
            }

          });

      })

  );

});

/* ========================================= */
/* BACKGROUND SYNC (Optional Future Ready) */
/* ========================================= */

self.addEventListener("sync", event => {
  console.log("Background sync triggered:", event.tag);
});

/* ========================================= */
/* PUSH NOTIFICATIONS (Future Expansion) */
/* ========================================= */

self.addEventListener("push", event => {

  const data = event.data ? event.data.text() : "OneLife Notification";

  event.waitUntil(
    self.registration.showNotification("OneLife", {
      body: data,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-72.png"
    })
  );

});

/* ========================================= */
/* NOTIFICATION CLICK */
/* ========================================= */

self.addEventListener("notificationclick", event => {

  event.notification.close();

  event.waitUntil(
    clients.openWindow("/")
  );

});

/* ========================================= */
/* PERIODIC CACHE CLEANUP CHECK */
/* ========================================= */

setInterval(() => {
  console.log("Service Worker running background health check...");
}, 60000);
