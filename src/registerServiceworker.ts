import { Workbox } from 'workbox-window';

if (navigator.serviceWorker) {
  const wb = new Workbox('/serviceworker.js');
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/serviceworker.js');
  });
  wb.addEventListener('waiting', () => {
    console.info(
      'There is a new version of the service worker. Triggering Reload.'
    );
    wb.addEventListener('controlling', () => {
      console.info(
        'There is a new version of the service worker. Reloading now.'
      );
      window.location.reload();
    });
    wb.messageSW({ type: 'SKIP_WAITING' });
  });
  wb.register();
}
