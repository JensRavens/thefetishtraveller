import * as moment from 'moment';
import {uniqBy} from 'lodash';

import {store, DB, State} from '../state';
import {Location, countryName} from './location';
import {Syncable} from './syncable';
import {APISession} from '../api';
import {Image} from './image';

export interface Event extends Syncable {
  id: string;
  slug: string;
  name: string;
  endAt: Date;
  startAt: Date;
  locationId: string;
  abstract?: string;
  description?: string;
  website?: string;
  ticketLink?: string;
  organizerName?: string;
  hero?: Image;
  logo?: Image;
  categories?: string[];
}

export interface EventWithLocation extends Event {
  location: Location;
}

export function canEdit(event: Event, session?: APISession): boolean {
  return !!session && !!session.ownedEventIds && !!event.serverId && session.ownedEventIds.includes(event.serverId)
}

export function joinLocation(rawEvents: string[] | Event[], state: State): EventWithLocation[] {
  const db = new DB(state);
  if(rawEvents[0] && typeof(rawEvents[0]) == 'string') {
    rawEvents =  db.table('events').where(e => (rawEvents as string[]).includes(e.id));
  }
  const locations = db.table('locations');
  const events: EventWithLocation[] = [];
  (rawEvents as Event[]).forEach(event => {
    const location = locations.find(event.locationId);
    if (location) {
      events.push({...event, location});
    }
  });
  return events;
}

export function isCurrent(event: Event): boolean {
  return event.endAt > new Date();
}

export function chronological(a: Event, b: Event): number {
  return (a.startAt as any) - (b.startAt as any);
}

export function months(events: Event[]): {year: number, month: number, name: string}[] {
  return uniqBy(events.map(e => {
    const time = moment(e.startAt);
    return {year: time.year(), month: time.month(), name: time.format('MMM YYYY')};
  }), 'name');
}

export function inMonth(event: Event, month: {year: number, month: number}) {
  const time = moment(event.startAt);
  return time.month() == month.month && time.year() == month.year;
}

export function matchesTerm(event: Partial<EventWithLocation>, term: string): boolean {
  let normalizedEvent = (event.name || '').toLocaleLowerCase();
  if(event.location) {
    normalizedEvent += (event.location.name + (event.location.city || '') + countryName(event.location.countryCode) + (event.categories || []).join()).toLocaleLowerCase();
  }
  const normalizedTerm = term.toLocaleLowerCase();
  return normalizedEvent.includes(normalizedTerm);
}
