console.log('hello world from service worker');
function addToCache(paths) {
  return caches.open('fetishtraveller').then(function(cache) {
    return cache.addAll(paths);
  })
}

function onInstall(event) {
  console.log('installing', event);
  event.waitUntil(addToCache(['/']));
}

function onActivate(event) {
  console.log('[Serviceworker]', "Activating!", event);
}

function onFetch(event) {
  const url = event.request.url;
  if(url.includes('packs/') || url.includes('manifest.json')) {
    event.waitUntil(addToCache([event.request.url]));
  }
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
}

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);