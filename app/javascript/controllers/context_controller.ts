import { Instance, createPopper } from '@popperjs/core';
import { Controller } from 'stimulus';

export default class extends Controller {
  static values = { path: String };
  declare readonly pathValue: string;
  private contextElement?: HTMLDivElement;
  private popper?: Instance;

  show(): void {
    this.close();
    const path = this.pathValue;

    const context = document.createElement('div');
    context.className = 'context-menu__popover';
    this.contextElement = context;
    const arrow = document.createElement('div');
    arrow.setAttribute('data-popper-arrow', 'true');
    arrow.className = 'async-popover__arrow';
    context.appendChild(arrow);
    document.body.appendChild(context);
    const frame = document.createElement('turbo-frame') as HTMLIFrameElement;
    frame.src = path;
    frame.id = 'context';
    context.appendChild(frame);

    this.popper = createPopper(this.element, context, { placement: 'left' });
    document.addEventListener('click', this.clickOutside);
  }

  close(): void {
    this.popper?.destroy();
    this.contextElement?.remove();
    this.contextElement = undefined;
    this.popper = undefined;
    document.removeEventListener('click', this.clickOutside);
  }

  private clickOutside = (event: MouseEvent) => {
    if (event.target === this.element) {
      event.preventDefault();
      return;
    }
    if (this.contextElement?.contains(event.target as HTMLElement)) {
      return;
    }
    event.preventDefault();
    this.close();
  };

  disconnect(): void {
    this.close();
  }
}
