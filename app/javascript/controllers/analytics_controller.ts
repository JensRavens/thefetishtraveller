import { Controller } from '@hotwired/stimulus';

interface DataEvent {
  event: string;
}

export default class extends Controller {
  dataLayer!: [DataEvent];

  connect(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).dataLayer = (window as any).dataLayer || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.dataLayer = (window as any).dataLayer;
    this.recordPage();
  }

  recordPage(): void {
    const event = {
      event: 'Pageview',
      path: location.pathname + location.search,
      host: location.host,
    };
    this.dataLayer.push(event);
  }
}
