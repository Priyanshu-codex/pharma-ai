// PharmaAI Service Worker
// Provides offline support, caching, and PWA functionality

const CACHE_NAME = "pharmaai-v1";
const STATIC_CACHE = "pharmaai-static-v1";
const API_CACHE = "pharmaai-api-v1";

// Assets to cache immediately on install
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.json",
];

// ── Install ───────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ──────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (name) =>
                name !== CACHE_NAME &&
                name !== STATIC_CACHE &&
                name !== API_CACHE
            )
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// ── Fetch Strategy ─────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin requests
  if (request.method !== "GET" || url.origin !== location.origin) {
    return;
  }

  // Skip Next.js internal routes
  if (url.pathname.startsWith("/_next/")) {
    // Network first for JS/CSS, with cache fallback
    event.respondWith(networkFirst(request));
    return;
  }

  // API routes — network first, short-lived cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkOnly(request));
    return;
  }

  // Static assets — cache first
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico")
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Pages — network first, fallback to offline page
  event.respondWith(networkFirstWithOfflineFallback(request));
});

// ── Cache Strategies ──────────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response("Offline", { status: 503 });
  }
}

async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch {
    return new Response(
      JSON.stringify({ error: "You are offline. Please check your connection." }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Return offline page
    const offlinePage = await caches.match("/offline.html");
    return offlinePage || new Response("You are offline.", { status: 503 });
  }
}

// ── Push Notifications (FCM) ──────────────────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "PharmaAI", body: event.data.text() };
  }

  const options = {
    body: data.body || "You have a new notification from PharmaAI",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: data.tag || "pharmaai-notification",
    data: data.url ? { url: data.url } : {},
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "PharmaAI", options)
  );
});

// ── Notification Click ────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
