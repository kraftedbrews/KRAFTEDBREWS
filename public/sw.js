const CACHE_NAME = "krafted-brews-v1";
const STATIC_URLS = [
  "/manifest.webmanifest",
  "/pwa-install.css",
  "/pwa-install.js",
  "/favicon.ico",
  "/favicon-32.png",
  "/apple-touch-icon.png",
  "/icons/krafted-brews-192.png",
  "/icons/krafted-brews-512.png",
  "/icons/krafted-brews-512-maskable.png",
  "/images/krafted-brews-header-logo.png",
  "/images/krafted-cup-label.png",
  "/images/menu-affogato.jpg",
  "/images/menu-cake.jpg",
  "/images/menu-coffee.jpg",
  "/images/menu-lemonade.jpg",
  "/images/menu-pastry.jpg",
  "/images/menu-tea.jpg",
  "/images/products/affogato.jpg",
  "/images/products/ensaymada-cheesecake.jpg",
  "/images/products/iced-spanish-latte.jpg",
  "/images/products/lemangonade.jpg",
  "/images/products/matcha-milkshake.jpg",
];
const ASSET_PATTERN = /(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g;
const IMPORT_PATTERN = /(?:import\(\s*|from\s*)["']([^"']+\.js)["']/g;

async function cacheAsset(cache, url, seen) {
  if (seen.has(url)) return;
  seen.add(url);

  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to precache " + url);
  const body = await response.clone().text();
  await cache.put(url, response);

  if (url.endsWith(".js")) {
    const imports = Array.from(body.matchAll(IMPORT_PATTERN), function (match) {
      return new URL(match[1], url).href;
    }).filter(function (importUrl) {
      return new URL(importUrl).origin === self.location.origin;
    });
    await Promise.all(
      imports.map(function (importUrl) {
        return cacheAsset(cache, importUrl, seen);
      }),
    );
  }
}

async function cacheDocument(cache, path, seen) {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Unable to precache " + path);
  const html = await response.clone().text();
  await cache.put(path, response.clone());
  if (path === "/") await cache.put("/index.html", response.clone());

  const assets = Array.from(html.matchAll(ASSET_PATTERN), function (match) {
    return new URL(match[1], self.location.origin).href;
  }).filter(function (assetUrl) {
    return new URL(assetUrl).origin === self.location.origin;
  });
  await Promise.all(
    assets.map(function (assetUrl) {
      return cacheAsset(cache, assetUrl, seen);
    }),
  );
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    (async function () {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(STATIC_URLS);
      const seen = new Set();
      await Promise.all([
        cacheDocument(cache, "/", seen),
        cacheDocument(cache, "/our-story.html", seen),
      ]);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    (async function () {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(function (cacheName) {
            return (
              cacheName.startsWith("krafted-brews-") &&
              cacheName !== CACHE_NAME
            );
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          }),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", function (event) {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async function () {
        try {
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }
          return response;
        } catch {
          return (
            (await caches.match(request, { ignoreVary: true })) ||
            (await caches.match("/index.html", { ignoreVary: true })) ||
            Response.error()
          );
        }
      })(),
    );
    return;
  }

  if (!["script", "style", "image", "font"].includes(request.destination))
    return;
  event.respondWith(
    (async function () {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request, { ignoreVary: true });
      if (
        cachedResponse &&
        ["script", "style"].includes(request.destination)
      ) {
        return cachedResponse;
      }

      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        if (cachedResponse) return cachedResponse;
        throw new Error("No cached response for " + url.pathname);
      }
    })(),
  );
});
