const CACHE_NAME = 'bidworld-shell-v1';
const CORE = [
  './','./index.html','./dashboard.html','./admin.html','./packages.html',
  './payments.html','./products.html','./auctions.html','./bidding.html',
  './winners.html','./wallet.html','./referrals.html','./reports.html',
  './settings.html','./style.css','./shared.js','./manifest.webmanifest',
  './icon-192.png','./icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const u = new URL(event.request.url);
  if (event.request.method !== 'GET' || u.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
