const CACHE = 'kotoba-v1';
const MODEL_CACHE = 'kotoba-model-v1';
const ASSETS = ['./', './app/', './manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && k !== MODEL_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  // The on-device AI library and model weights are large, versioned, and
  // immutable once published — cache-first keeps them reusable offline
  // after the one-time download instead of re-fetching every visit.
  const isModelAsset = new URL(e.request.url).origin !== self.location.origin;
  if (isModelAsset) {
    e.respondWith(
      caches.open(MODEL_CACHE).then((c) =>
        c.match(e.request).then((cached) => cached || fetch(e.request).then((res) => {
          c.put(e.request, res.clone());
          return res;
        }))
      )
    );
    return;
  }

  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
