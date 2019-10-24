function addToCache(paths) {
  return caches.open('fetishtraveller').then(function(cache) {
    return cache.addAll(paths);
  })
}

function onInstall(event) {
  console.log('[Serviceworker]', 'installing');
  event.waitUntil(addToCache(['/', '/events']));
}

function onFetch(event) {
  const url = event.request.url;
  event.respondWith(
    fetch(event.request).then(function(response){
      if(url.split('/')[3] == 'packs') {
        return addToCache([url]).then(function() { 
          return response; 
        });
      } else {
        return response;
      }
    }).catch(function() {
      return caches.match(event.request);
    })
  );
}

self.addEventListener('install', onInstall);
self.addEventListener('fetch', onFetch);
