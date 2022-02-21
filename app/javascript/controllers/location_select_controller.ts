import { Controller } from '@hotwired/stimulus';
import { mapsReady } from '../lib/map';

export default class extends Controller {
  private autocomplete: google.maps.places.Autocomplete;
  static targets = [
    'select',
    'id',
    'name',
    'countryCode',
    'address',
    'zip',
    'city',
    'lat',
    'lon',
    'timezone',
  ];
  declare idTarget: HTMLInputElement;
  declare selectTarget: HTMLInputElement;
  declare nameTarget: HTMLInputElement;
  declare countryCodeTarget: HTMLInputElement;
  declare addressTarget: HTMLInputElement;
  declare zipTarget: HTMLInputElement;
  declare cityTarget: HTMLInputElement;
  declare latTarget: HTMLInputElement;
  declare lonTarget: HTMLInputElement;
  declare timezoneTarget: HTMLInputElement;

  async connect(): Promise<void> {
    await mapsReady;
    const options = {
      fields: [
        'place_id',
        'geometry',
        'name',
        'address_components',
        'utc_offset_minutes',
      ],
    };

    this.autocomplete = new google.maps.places.Autocomplete(
      this.selectTarget,
      options
    );
    this.autocomplete.addListener(
      'place_changed',
      this.placeChanged.bind(this)
    );
  }

  private placeChanged(): void {
    const place = this.autocomplete.getPlace();
    this.idTarget.value = place.place_id;
    this.nameTarget.value = place.name;
    this.countryCodeTarget.value =
      place.address_components
        .find((e) => e.types.includes('country'))
        ?.short_name?.toLowerCase() ?? '';
    this.addressTarget.value = [
      place.address_components.find((e) => e.types.includes('route'))
        ?.long_name,
      place.address_components.find((e) => e.types.includes('street_number'))
        ?.long_name,
    ]
      .filter(Boolean)
      .join(' ');
    this.zipTarget.value =
      place.address_components.find((e) => e.types.includes('postal_code'))
        ?.long_name ?? '';
    this.cityTarget.value =
      place.address_components.find((e) => e.types.includes('locality'))
        ?.long_name ?? '';
    this.latTarget.value = place.geometry?.location?.lat()?.toString();
    this.lonTarget.value = place.geometry?.location?.lng()?.toString();
    this.timezoneTarget.value = place.utc_offset_minutes?.toString() ?? '';
  }
}
