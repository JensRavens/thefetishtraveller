import { ModalPresenter } from '../lib/modal';

const ui = {
  modal: new ModalPresenter(),
};

declare global {
  interface Window {
    ui: typeof ui;
  }
}

window.ui = ui;
