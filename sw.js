const CACHE_NAME = 'next-gb-pro-v1'; //[cite: 3]
const urlsToCache = [
  './index.html', //[cite: 3]
  './manifest.json', //[cite: 3]
  'icon-192.png', 
  'icon-512.png', 
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' //[cite: 3]
];

// Instalación: Guarda los archivos esenciales en el caché[cite: 3]
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME) //[cite: 3]
      .then(cache => {
        return cache.addAll(urlsToCache); //[cite: 3]
      })
  );
});

// Activación: Limpia cachés antiguos si actualizas la versión[cite: 3]
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => { //[cite: 3]
      return Promise.all(
        cacheNames.map(cacheName => { //[cite: 3]
          if (cacheName !== CACHE_NAME) { //[cite: 3]
            return caches.delete(cacheName); //[cite: 3]
          }
        })
      );
    })
  );
});

// Fetch: Sirve la app desde el caché cuando no hay internet[cite: 3]
self.addEventListener('fetch', event => {
  // Excluimos las llamadas a APIs externas (VIN y Tasa del Dólar) para que siempre intenten buscar datos frescos[cite: 3]
  if (event.request.url.includes('api.whatsapp.com') || event.request.url.includes('vpic.nhtsa.dot.gov') || event.request.url.includes('open.er-api.com')) { //[cite: 3]
    return; 
  }

  event.respondWith(
    caches.match(event.request) //[cite: 3]
      .then(response => {
        return response || fetch(event.request); //[cite: 3]
      })
  );
});
