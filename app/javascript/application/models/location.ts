import {store, DB, State} from '../state';
import {api} from '../api';

export interface Location {
  id: string;
  name: string;
  city?: string;
  address?: string;
  lat?: number;
  lon?: number
  zip?: string;
  countryCode: string;
}

export function refreshLocations() {
  const locations = (new DB()).table('locations');
  api.getLocations().then(e => store.dispatch(locations.insert(e)));
}

export function loadLocation(id: string) {
  const locations = (new DB()).table('locations');
  api.getLocation(id).then(e => store.dispatch(locations.insert(e)));
}
