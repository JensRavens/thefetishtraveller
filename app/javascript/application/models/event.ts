import {store, DB, State} from '../state';
import {api} from '../api';

export interface Event {
  id: string;
  name: string;
  endAt: Date;
  startAt: Date;
  countryCode: string;
  city: string;
}

export function refreshEvents() {
  const events = (new DB()).table('events');
  api.getEvents().then(e => store.dispatch(events.insert(e)));
}

export function loadEvent(id: string) {
  const events = (new DB()).table('events');
  api.getEvent(id).then(e => store.dispatch(events.insert(e)));
}
