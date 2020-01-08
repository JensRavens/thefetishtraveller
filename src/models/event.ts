import moment from 'moment';
import { uniqBy } from 'lodash';

import { DB, State } from '../state';
import { Location } from './location';
import { Syncable } from './syncable';
import { Image } from './image';
import { dateRange, parseDate } from '../util';

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
  header?: Image;
  logo?: Image;
  flyer?: Image;
  galleryImages: Image[];
  categories?: string[];
  events?: Event[];
  fullDay: boolean;
  editable?: boolean;
  unsubmitted?: boolean;
}

export const eventCategories = [
  'fetish',
  'csd',
  'election',
  'festival',
  'party',
  'culture',
  'bluf',
  'social',
  'dinner',
  'brunch',
];

export interface EventWithLocation extends Event {
  location?: Location;
  locationSlug?: string;
}

export function formatEventDate(event: {
  startAt: Date | string;
  endAt: Date | string;
  fullDay?: boolean;
  location?: { timezone?: string | null } | null;
}): string {
  return dateRange(
    event.startAt,
    event.endAt,
    event.location ? event.location.timezone : undefined,
    event.fullDay
  );
}

export function joinLocation(
  rawEvents: string[] | Event[],
  state: State
): EventWithLocation[] {
  const db = new DB(state);
  if (rawEvents[0] && typeof rawEvents[0] === 'string') {
    rawEvents = db
      .table('events')
      .where(e => (rawEvents as string[]).includes(e.id));
  }
  const locations = db.table('locations');
  const events: EventWithLocation[] = [];
  (rawEvents as Event[]).forEach(event => {
    const location = locations.find(event.locationId);
    events.push({ ...event, location });
  });
  return events;
}

export function joinSubevents(
  rawEvents: string[] | Event[],
  state: State
): Event[] {
  if (rawEvents[0] && typeof rawEvents[0] === 'string') {
    rawEvents = (rawEvents as string[]).map(e => state.data.events.byId[e]);
  }
  const events: Event[] = [];
  (rawEvents as Event[]).forEach(event => {
    events.push({
      ...event,
      events: events.filter(e => e.eventId === event.id),
    });
  });
  return events;
}

export function isCurrent(event: { endAt: string | Date }): boolean {
  return parseDate(event.endAt) > new Date();
}

export function isRoot(event: { eventId?: string }): boolean {
  return !event.eventId;
}

export function chronological(a: Event, b: Event): number {
  return (a.startAt as any) - (b.startAt as any);
}

export interface Month {
  year: number;
  month: number;
  name: string;
}

export function months(
  events: Array<{ startAt: Date | string }>
): Array<Month> {
  return uniqBy(
    events.map(e => {
      const time = moment(e.startAt);
      return {
        year: time.year(),
        month: time.month(),
        name: time.format('MMM YYYY'),
      };
    }),
    'name'
  );
}

export function inMonth(
  event: { startAt: Date | string },
  month: { year: number; month: number }
) {
  const time = moment(event.startAt);
  return time.month() === month.month && time.year() === month.year;
}

export function byMonth<T extends { startAt: Date | string }>(
  events: T[]
): Array<{ date: Date; events: T[] }> {
  const buckets: { [date: string]: T[] } = {};
  events.forEach(event => {
    const date = moment(event.startAt);
    const dateString = [date.year(), date.month() + 1].join('-');
    buckets[dateString] = buckets[dateString] || [];
    buckets[dateString].push(event);
  });
  const result: Array<{ date: Date; events: T[] }> = [];
  Object.keys(buckets).forEach(key => {
    result.push({
      date: moment(key + '-01').toDate(),
      events: buckets[key],
    });
  });
  return result;
}

export function byMainEvent<T extends { eventId?: string | null; id: string }>(
  events: T[]
): Array<{ event: T; events: T[] }> {
  const buckets: { [eventId: string]: T[] } = {};
  events.forEach(event => {
    const id = event.eventId || event.id;
    buckets[id] = buckets[id] || [];
    buckets[id].push(event);
  });
  const result: Array<{ event: T; events: T[] }> = [];
  Object.keys(buckets).forEach(key => {
    result.push({
      event: buckets[key].filter(e => !e.eventId)[0],
      events: buckets[key].filter(e => e.eventId),
    });
  });
  return result;
}

export function matchesTerm(
  event: {
    name: string;
    categories?: string[] | null;
    location?: {
      name: string;
      city?: string | null;
      countryName?: string | null;
    } | null;
  },
  term: string
): boolean {
  let normalizedEvent = (event.name || '').toLocaleLowerCase();
  if (event.location) {
    normalizedEvent += (
      event.location.name +
      (event.location.city || '') +
      (event.location.countryName || '') +
      (event.categories || []).join()
    ).toLocaleLowerCase();
  }
  const normalizedTerm = term.toLocaleLowerCase();
  return normalizedEvent.includes(normalizedTerm);
}
