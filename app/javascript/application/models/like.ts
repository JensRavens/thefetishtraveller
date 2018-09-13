import { store, DB, State } from '../state';
import { Event } from './event';

export interface Like {
  id: string;
  eventId: string;
  state?: 'pending' | 'deleted';
}

export function isLiked(event: Event, likes: Like[]): boolean {
  return likes
    .filter(e => e.state !== 'deleted')
    .map(e => e.eventId)
    .includes(event.id);
}
