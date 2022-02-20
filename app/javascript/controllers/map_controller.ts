import { Controller } from '@hotwired/stimulus';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const google: any;

export default class extends Controller {
  static values = { coordinates: Object, title: String };
  declare readonly coordinatesValue: { lat: number; lng: number };
  declare readonly titleValue: string;

  async connect(): Promise<void> {
    const map = new google.maps.Map(this.element, {
      center: this.coordinatesValue,
      zoom: 12,
    });
    new google.maps.Marker({
      map: map,
      position: this.coordinatesValue,
      title: this.titleValue,
    });
  }
}
