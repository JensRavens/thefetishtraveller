import {store, DB, State} from '../state';
import {Event} from './event';
import {api} from '../api';

export interface Like {
  id: string;
  eventId: string;
}

const likes = (new DB()).table('likes');

export function refreshLikes() {
  api.getLikes().then(e => store.dispatch(likes.insert(e)));
}

export function isLiked(event: Event, likes: Like[]): boolean {
  return likes.map(e => e.eventId).includes(event.id);
}

export function like(event: Event) {
  store.dispatch(likes.insert({eventId: event.id}))
  api.like(event.id);
}

export function unlike(event: Event) {
  const likeIds = new DB(store.getState() as State).table('likes').where({eventId: event.id}).map(e => e.id);
  store.dispatch(likes.delete(likeIds))
  api.unlike(event.id);
}