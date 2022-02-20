import { Application } from '@hotwired/stimulus';

declare global {
  interface Window {
    app: Application;
  }
}

const application = Application.start();

application.debug = false;
window.app = application;

export { application };
