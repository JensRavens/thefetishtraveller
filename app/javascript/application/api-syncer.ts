import { API, APIEvent, APILocation } from './api';
import { store, State, DB, writeDB } from './state';
import { Event } from './models/event';
import { Location } from './models/location';
import { needsSync, calculateChangeset } from './models/syncable';
import { isLoggedIn } from './models/session';
import { Like } from './models/like';

export class APISyncer {
  api: API;
  constructor() {
    const state = store.getState() as State | null;
    const session = state ? new DB(state).get('session') : null;
    const sessionId = session ? session.id : undefined;
    this.api = new API(
      location.protocol + '//' + location.host + '/api/v1',
      sessionId
    );
    if (sessionId) {
      this.refreshSession();
    }
    this.subscribe();
  }

  refresh() {
    this.refreshEvents();
    this.refreshLocations();
  }

  async login(email: string, password: string) {
    if (!this.api.sessionID) {
      const session = await this.api.createSession();
      writeDB.set('session', session);
    }
    const session = await this.api.login(email, password);
    writeDB.set('session', session);
  }

  async facebookLogin(token: string) {
    if (!this.api.sessionID) {
      await this.api.createSession();
    }
    const session = await this.api.facebookLogin(token);
    writeDB.set('session', session);
  }

  async updateLocation(id: string, changes: Partial<APILocation>) {
    const location = await this.api.updateLocation({ ...changes, id });
    writeDB.table('locations').update(id, location);
  }

  async updateEvent(id: string, changes: Partial<APIEvent>) {
    const event = await this.api.updateEvent({ ...changes, id });
    writeDB.table('events').update(id, event);
  }

  async createEvent(id: string, changes: Partial<APIEvent>): Promise<Event> {
    const event = await this.api.createEvent({ ...changes, id });
    writeDB.table('events').insert(event);
    return event;
  }

  async loadTravelPlan(id: string) {
    const travelPlan = await this.api.getTravelPlan(id);
    writeDB.table('travelPlans').insert(travelPlan);
  }

  private subscribe() {
    store.subscribe(() => {
      const state = store.getState() as State;
      const db = new DB(state);
      const session = db.get('session');

      localStorage && localStorage.setItem('state', JSON.stringify(state));

      if (!isLoggedIn(session)) {
        return;
      }

      const changedEvents = db.table('events').where(needsSync);
      if (changedEvents.length) {
        this.updateEvents(changedEvents);
      }
      const changedLocations = db.table('locations').where(needsSync);
      if (changedLocations.length) {
        this.updateLocations(changedLocations);
      }
      const addedLikes = db.table('likes').where({ state: 'pending' });
      if (addedLikes.length) {
        this.addLikes(addedLikes);
      }

      const removedLikes = db.table('likes').where({ state: 'deleted' });
      if (removedLikes.length) {
        this.removeLikes(removedLikes);
      }
    });
  }

  private async refreshSession() {
    try {
      const session = await this.api.getSession();
      writeDB.set('session', session);
      this.refreshLikes();
    } catch (error) {
      console.warn('session was deleted on server. logging out now.');
      writeDB.set('session', undefined);
      this.api.sessionID = undefined;
    }
  }

  private annotate(
    list: APIEvent | APIEvent[] | APILocation | APILocation[]
  ): any {
    const events = list instanceof Array ? list : [list];
    return events.map(e => ({
      ...e,
      serverId: e.id,
      draft: false,
      synced: true,
    }));
  }

  private async refreshEvents() {
    const events = writeDB.table('events');
    const apiEvents = await this.api.getEvents();
    const syncedIds = apiEvents.map(e => e.id);
    const removedEvents = store
      .getState()
      .data.events.ids.filter(id => !syncedIds.includes(id));
    events.insert(this.annotate(apiEvents));
    events.delete(removedEvents);
  }

  private async refreshLikes() {
    const likes = writeDB.table('likes');
    const apiLikes = await this.api.getLikes();
    const syncedIds = apiLikes.map(e => e.id);
    const removedLikes = store
      .getState()
      .data.likes.ids.filter(id => !syncedIds.includes(id));
    likes.insert(apiLikes);
    likes.delete(removedLikes);
  }

  private async refreshLocations() {
    const locations = writeDB.table('locations');
    const apiLocations = await this.api.getLocations();
    const syncedIds = apiLocations.map(e => e.id);
    const removedLocations = store
      .getState()
      .data.locations.ids.filter(id => !syncedIds.includes(id));
    locations.insert(this.annotate(apiLocations));
    locations.delete(removedLocations);
  }

  private updateEvents(events: Event[]) {
    events.forEach(event => {
      this.api.updateEvent(calculateChangeset(event) as any);
    });
  }

  private updateLocations(locations: Location[]) {
    locations.forEach(location => {
      this.api.updateEvent(calculateChangeset(location) as any);
    });
  }

  private async removeLikes(likes: Like[]) {
    await Promise.all(likes.map(e => this.api.unlike(e.eventId)));
    writeDB.table('likes').delete(likes);
  }

  private async addLikes(likes: Like[]) {
    await Promise.all(likes.map(e => this.api.like(e.eventId)));
    writeDB.table('likes').update(likes, { state: undefined });
  }
}

export const syncer = new APISyncer();

declare const window: any;
window.api = syncer.api;
window.syncer = syncer;
window.db = writeDB;

window.fbAsyncInit = () => {
  console.log('init!');
  window.FB.init({
    appId: '323489808193714',
    cookie: true,
    xfbml: true,
    version: 'v3.0',
  });

  window.FB.Event.subscribe('auth.statusChange', response => {
    if (response.authResponse) {
      syncer.facebookLogin(response.authResponse.accessToken);
    } else {
      writeDB.set('session', undefined);
    }
  });
};
