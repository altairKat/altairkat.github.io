const CACHE_MAIN = 'cache-v1';

const staticAssets = [
    './',
    './favicon.svg',
    'index.html',
    'index.html?homescreen=1',
    '?homescreen=1',
    // CSS
    './css/styles.css',
    './css/index.css',
    'https://js.arcgis.com/4.15/esri/themes/light/main.css',
    // JS
    './js/index.js',
    './js/app.js',
    'https://js.arcgis.com/4.15/',
    './js/fontawesome.js',
    // KML 
    './kml/1.kml',
    './kml/2.kml',
    './kml/3.kml',
    //IMG
    './assets/512x512.svg',
    './assets/favicon.svg',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_MAIN).then(cache => {
            return cache.addAll(staticAssets);
        })
    );
});

self.addEventListener('fetch', event => {
    console.log('Network request for ', event.request.url);
    event.respondWith(
        caches.open(CACHE_MAIN).then(cache => {
            return cache.match(event.request).then(response => {
                return response || fetch(event.request).then(response => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});