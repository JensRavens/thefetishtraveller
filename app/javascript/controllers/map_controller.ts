import { Controller } from '@hotwired/stimulus';
import { mapsReady } from '../lib/map';

export default class extends Controller {
  static values = { coordinates: Object, title: String };
  declare readonly coordinatesValue: { lat: number; lng: number };
  declare readonly titleValue: string;

  async connect(): Promise<void> {
    await mapsReady;
    const map = new google.maps.Map(this.element as HTMLElement, {
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
