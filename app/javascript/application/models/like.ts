import {store, DB, State} from '../state';
import {Event} from './event';

export interface Like {
  id: string;
  eventId: string;
}

export function isLiked(event: Event, likes: Like[]): boolean {
  return likes.map(e => e.eventId).includes(event.id);
}
