const CACHE_NAME = "gmb-booster-v1.0.0";
const STATIC_CACHE = "gmb-booster-static-v1";
const DYNAMIC_CACHE = "gmb-booster-dynamic-v1";
const IMAGE_CACHE = "gmb-booster-images-v1";

// Files to cache immediately
const STATIC_ASSETS = [
  "/",
  "/admin/projects",
  "/admin/gallery",
  "/admin/settings",
  "/manifest.json",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Static assets cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Error caching static assets:", error);
      }),
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== IMAGE_CACHE
            ) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== "GET" || url.protocol === "chrome-extension:") {
    return;
  }

  // Handle different types of requests
  if (event.request.destination === "image") {
    event.respondWith(handleImageRequest(event.request));
  } else if (isStaticAsset(event.request.url)) {
    event.respondWith(handleStaticAsset(event.request));
  } else {
    event.respondWith(handleDynamicRequest(event.request));
  }
});

// Handle image requests with dedicated cache
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log("Serving image from cache:", request.url);
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      console.log("Caching new image:", request.url);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error("Error handling image request:", error);
    return new Response("Image not available", { status: 404 });
  }
}

// Handle static assets
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log("Serving static asset from cache:", request.url);
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      console.log("Caching new static asset:", request.url);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error("Error handling static asset:", error);
    const cache = await caches.open(STATIC_CACHE);
    return cache.match("/") || new Response("Offline", { status: 503 });
  }
}

// Handle dynamic requests
async function handleDynamicRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);

    // Try network first for dynamic content
    try {
      const networkResponse = await fetch(request);

      if (networkResponse.ok) {
        console.log("Caching dynamic response:", request.url);
        cache.put(request, networkResponse.clone());
      }

      return networkResponse;
    } catch (networkError) {
      // Network failed, try cache
      const cachedResponse = await cache.match(request);

      if (cachedResponse) {
        console.log("Serving dynamic content from cache:", request.url);
        return cachedResponse;
      }

      // If it's a navigation request, serve the app shell
      if (request.mode === "navigate") {
        const appShell =
          (await cache.match("/")) ||
          (await caches.open(STATIC_CACHE).then((c) => c.match("/")));
        if (appShell) {
          return appShell;
        }
      }

      throw networkError;
    }
  } catch (error) {
    console.error("Error handling dynamic request:", error);
    return new Response("Offline", { status: 503 });
  }
}

// Check if request is for a static asset
function isStaticAsset(url) {
  return (
    url.includes("/assets/") ||
    url.includes(".js") ||
    url.includes(".css") ||
    url.includes(".woff") ||
    url.includes(".woff2") ||
    url.includes("manifest.json")
  );
}

// Background sync for file uploads
self.addEventListener("sync", (event) => {
  console.log("Background sync triggered:", event.tag);

  if (event.tag === "upload-files") {
    event.waitUntil(syncUploadFiles());
  }
});

// Handle background file uploads
async function syncUploadFiles() {
  try {
    const pendingUploads = await getPendingUploads();

    for (const upload of pendingUploads) {
      try {
        await processFileUpload(upload);
        await removePendingUpload(upload.id);
        console.log("Successfully synced upload:", upload.id);
      } catch (error) {
        console.error("Failed to sync upload:", upload.id, error);
      }
    }
  } catch (error) {
    console.error("Error during background sync:", error);
  }
}

// Helper functions for background sync
async function getPendingUploads() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function processFileUpload(upload) {
  // In a real implementation, this would upload the file
  console.log("Processing upload:", upload);
}

async function removePendingUpload(uploadId) {
  // In a real implementation, this would remove from IndexedDB
  console.log("Removing pending upload:", uploadId);
}

// Handle push notifications
self.addEventListener("push", (event) => {
  console.log("Push notification received:", event);

  const options = {
    body: event.data ? event.data.text() : "New update available",
    icon: "/icon-192x192.png",
    badge: "/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View",
        icon: "/icon-192x192.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-192x192.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("GMB Booster", options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/admin/projects"));
  }
});
