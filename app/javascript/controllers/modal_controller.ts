import { Controller } from 'stimulus';

declare global {
  interface Window {
    ui: {
      modal: {
        load(url: string, size: string): Promise<void>;
        close(): void;
      };
    };
  }
}

export default class extends Controller {
  static targets = ['content'];
  declare contentTarget: HTMLIFrameElement;

  connect(): void {
    const modal = { load: this.load, close: this.close };
    if (!window.ui) {
      window.ui = { modal };
    } else {
      window.ui.modal = modal;
    }
    this.modal.classList.add('modal--enabled');
  }

  load = async (url: string, size: string): Promise<void> => {
    document.body.classList.add('modal-open');
    this.modal.classList.add('modal--open');
    this.modal.classList.toggle('modal--small', size === 'small');
    console.log('loading', url, size);
    this.contentTarget.src = url;
  };

  close = (): void => {
    this.modal.classList.remove('modal--open');
    document.body.classList.remove('modal-open');
  };

  private get modal(): HTMLDivElement {
    return this.element as unknown as HTMLDivElement;
  }
}
