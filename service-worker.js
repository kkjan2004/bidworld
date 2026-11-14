/* BidWorld PWA shell cache. Keep this namespace isolated from other apps on the origin. */
const CACHE_NAME = 'bidworld-shell-v2';
const CACHE_PREFIX = 'bidworld-shell-';
const CORE = [
  './', './index.html', './dashboard.html', './admin.html', './packages.html',
  './payments.html', './products.html', './auctions.html', './bidding.html',
  './winners.html', './wallet.html', './referrals.html', './plans.html',
  './reports.html', './settings.html', './style.css', './shared.js',
  './manifest.webmanifest', './icon-192.png', './icon-512.png'
];
const CORE_PATHS = new Set(CORE.map(path => new URL(path, self.location.href).pathname));
const HOME_URL = new URL('./index.html', self.location.href).href;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Only serve the app shell from cache; never cache API or arbitrary same-origin data.
  if (!CORE_PATHS.has(url.pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
      }
      return response;
    }).catch(async () => (await caches.match(request)) ||
      (await caches.match(HOME_URL)) || Response.error()));
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
    }
    return response;
  })));
});
