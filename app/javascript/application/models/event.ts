import * as moment from 'moment';
import {uniqBy} from 'lodash';

import {store, DB, State} from '../state';
import {Location, countryName} from './location';
import {Syncable} from './syncable';
import {APISession} from '../api';
import {Image} from './image';
import {dateRange} from '../util';
import { format } from 'util';

export interface Event extends Syncable {
  id: string;
  slug: string;
  eventId?: string;
  series?: string;
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
  flyer?: Image;
  categories?: string[];
  events?:Event[];
}

export interface EventWithLocation extends Event {
  location: Location;
  locationSlug?: string;
}

export function canEdit(event: Event, session?: APISession): boolean {
  return !!session && (session.level == "admin" || !!session.ownedEventIds && !!event.serverId && session.ownedEventIds.includes(event.serverId))
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

export function joinSubevents(rawEvents: string[] | Event[], state: State): Event[] {
  if(rawEvents[0] && typeof(rawEvents[0]) == 'string'){
    rawEvents = (rawEvents as string[]).map(e => state.data.events.byId[e])
  }
  const allEvents = new DB(state).table('events').all;
  const events: Event[] = [];
  (rawEvents as Event[]).forEach(event => {
    events.push({...event, events: events.filter(e => e.eventId == event.id)});
  });
  return events;
}

export function isCurrent(event: Event): boolean {
  return event.endAt > new Date();
}

export function isRoot(event: Event): boolean {
  return !event.eventId;
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

export function formatDate(event: Event): string {
  return dateRange(event.startAt, event.endAt);
}

export function byMonth<T extends Event>(events: T[]): {date: Date, events: T[]}[] {
  const buckets: {[date: string]: T[]} = {};
  events.forEach(event => {
    const date = moment(event.startAt);
    const dateString = [date.year(), date.month() + 1].join('-');
    buckets[dateString] = buckets[dateString] || [];
    buckets[dateString].push(event);
  });
  const result: {date: Date, events: T[]}[] = [];
  Object.keys(buckets).forEach(key => {
    result.push({
      date: moment(key + '-01').toDate(),
      events: buckets[key]
    })
  });
  return result;
}

export function byMainEvent<T extends Event>(events: T[]): {event: T, events: T[]}[] {
  const buckets: {[eventId: string]: T[]} = {};
  events.forEach(event => {
    const id = event.eventId || event.id;
    buckets[id] = buckets[id] || [];
    buckets[id].push(event);
  });
  const result: {event: T, events: T[]}[] = [];
  Object.keys(buckets).forEach(key => {
    result.push({
      event: buckets[key].filter(e => !e.eventId)[0],
      events: buckets[key].filter(e => e.eventId)
    })
  });
  return result;
}

export function matchesTerm(event: Partial<EventWithLocation>, term: string): boolean {
  let normalizedEvent = (event.name || '').toLocaleLowerCase();
  if(event.location) {
    normalizedEvent += (event.location.name + (event.location.city || '') + countryName(event.location.countryCode) + (event.categories || []).join()).toLocaleLowerCase();
  }
  const normalizedTerm = term.toLocaleLowerCase();
  return normalizedEvent.includes(normalizedTerm);
}
