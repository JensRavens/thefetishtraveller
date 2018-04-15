console.log('hello world');

function onInstall(event) {
  console.log('installing', event);
}

function onActivate(event) {
  console.log('[Serviceworker]', "Activating!", event);
}