declare global {
  interface Window {
    _mapsReady(): void;
  }
}

let mapsReadyCalled = false;
let notify: (() => void) | undefined;
window._mapsReady = function () {
  mapsReadyCalled = true;
  notify?.();
};
export const mapsReady = new Promise<void>((res) => {
  notify = res;
  if (mapsReadyCalled) res();
});
