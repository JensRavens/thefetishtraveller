import { Controller } from 'stimulus';

interface ModalOptions {
  url: string;
  size: string;
  title: string | null;
  close: boolean | null;
}

declare global {
  interface Window {
    ui: {
      modal: {
        load(options: ModalOptions): Promise<void>;
        close(): void;
      };
    };
  }
}

export default class extends Controller {
  static targets = ['content', 'title', 'close'];
  declare contentTarget: HTMLDivElement;
  declare titleTarget: HTMLDivElement;
  declare closeTarget: HTMLDivElement;
  private frame?: HTMLIFrameElement;

  connect(): void {
    const modal = { load: this.load, close: this.close };
    if (!window.ui) {
      window.ui = { modal };
    } else {
      window.ui.modal = modal;
    }
    this.modal.classList.add('modal--enabled');
  }

  load = async ({ size, url, title, close }: ModalOptions): Promise<void> => {
    document.body.classList.add('modal-open');
    this.modal.classList.add('modal--open');
    this.modal.classList.toggle('modal--small', size === 'small');
    this.frame?.remove();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const frame = document.createElement('turbo-frame') as any;
    frame.id = 'modal_frame';
    frame.target = '_top';
    frame.src = url;
    this.frame = frame;
    this.contentTarget.appendChild(frame);
    this.titleTarget.innerHTML = title;
    this.closeTarget.hidden = !close;
  };

  close = (): void => {
    this.modal.classList.remove('modal--open');
    document.body.classList.remove('modal-open');
  };

  private get modal(): HTMLDivElement {
    return this.element as unknown as HTMLDivElement;
  }
}
