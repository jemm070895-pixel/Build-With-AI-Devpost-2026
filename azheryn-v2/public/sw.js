/* AZHERYN V2 G1/O1 — offline shell. Cache app resources after first online load. */
const CACHE = 'azheryn-v2-g1-o1-shell-v2';
const ROOT = new URL(self.registration.scope);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.add(ROOT.href)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('azheryn-v2-') && k !== CACHE).map(k => caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== ROOT.origin || !url.pathname.startsWith(ROOT.pathname)) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(async response => {
      if (response.ok) { try { const cache = await caches.open(CACHE); await cache.put(ROOT.href, response.clone()); } catch (_) { /* La red sigue disponible aunque falle la caché. */ } }
      return response;
    }).catch(() => caches.match(ROOT.href)));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(async response => {
    if (response.ok && response.type === 'basic') {
      try { const cache = await caches.open(CACHE);
        await cache.put(req, response.clone()); } catch (_) { /* No interrumpir la respuesta de red. */ }
    }
    return response;
  })));
});
