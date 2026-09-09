// Bump this version string any time you change index.html / manifest.json /
// icons so the browser knows to fetch fresh copies and drop the old cache.
const CACHE_NAME = 'mylist-v3';

// Core files needed for the app to open with zero network at all.
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((err) => console.warn('[sw] precache gagal sebagian:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Cache-first: kalau ada di cache, langsung pakai (offline aman). Kalau
// belum ada, ambil dari jaringan lalu simpan ke cache buat dipakai lagi
// nanti — ini juga yang menangkap file font (.woff2) dari Google Fonts
// tanpa perlu di-hardcode satu-satu di PRECACHE_URLS.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline dan belum pernah ke-cache — untuk navigasi halaman,
          // fallback ke index.html supaya app tetap kebuka.
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
