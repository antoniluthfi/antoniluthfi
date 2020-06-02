importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
  console.log('Workbox berhasil dimuat');
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: 1 },
    { url: '/manifest.json', revision: 1 },
    { url: '/index.html', revision: 1 },
    { url: '/team.html', revision: 1 },
    { url: '/pages/about.html', revision: 1 },
    { url: '/pages/home.html', revision: 1 },
    { url: '/pages/liga.html', revision: 1 },
    { url: '/pages/saved.html', revision: 1 },
    { url: '/pages/team.html', revision: 1 },
    { url: '/shell/nav.html', revision: 1 },
    { url: '/css/materialize.min.css', revision: 1 },
    { url: '/css/style.css', revision: 1 },
    { url: '/js/materialize.min.js', revision: 1 },
    { url: '/js/api.js', revision: 1 },
    { url: '/js/db.js', revision: 1 },
    { url: '/js/idb.js', revision: 1 },
    { url: '/js/main.js', revision: 1 },
    { url: '/js/nav.js', revision: 1 },
    { url: '/push.js', revision: 1 },
    { url: '/images/1.jpg', revision: 1 },
    { url: '/images/2.jpg', revision: 1 },
    { url: '/images/3.jpg', revision: 1 },
    { url: '/images/4.jpg', revision: 1 },
    { url: '/images/5.jpg', revision: 1 },
    { url: '/images/6.jpg', revision: 1 },
    { url: '/images/people-watching.jpg', revision: 1 },
    { url: '/images/default.png', revision: 1 },
    { url: '/images/soccer-ball-grass-icon96x96.png', revision: 1 },
    { url: '/images/soccer-ball-grass-icon128x128.png', revision: 1 },
    { url: '/images/soccer-ball-grass-icon256x256.png', revision: 1 },
    { url: '/images/soccer-ball-grass-icon512x512.png', revision: 1 }
  ]);

  workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60
        })
      ]
    })
  );
  
  workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'football-api',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60
        })
      ]
    })
  );  
} else {
  console.log('Workbox gagal dimuat');
}

self.addEventListener('push', (event) => {
  let title = "Update Bola - Update Informasi Tentang Bola";
  let body;

  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  let options = {
    body: body,
    badge: '/images/soccer-ball-grass-icon256x256.png', 
    icon: '/images/soccer-ball-grass-icon256x256.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});