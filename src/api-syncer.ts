import { API, APIEvent, APILocation } from './api';
import { store, State, DB, writeDB } from './state';
import { Event } from './models/event';
import { isLoggedIn } from './models/session';
import { Like } from './models/like';

export class APISyncer {
  public api: API;
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

  public refresh() {
    this.refreshEvents();
    this.refreshLocations();
  }

  public async login(email: string, password: string) {
    let session;
    if (!this.api.sessionID) {
      session = await this.api.createSession();
      writeDB.set('session', session);
    }
    session = await this.api.login(email, password);
    writeDB.set('session', session);
  }

  public async facebookLogin(token: string) {
    if (!this.api.sessionID) {
      await this.api.createSession();
    }
    const session = await this.api.facebookLogin(token);
    writeDB.set('session', session);
  }

  public async resumeSession(sessionId: string) {
    this.api.sessionID = sessionId;
    const session = await this.api.getSession();
    writeDB.set('session', session);
  }

  public async updateLocation(id: string, changes: Partial<APILocation>) {
    const location = await this.api.updateLocation({ ...changes, id });
    writeDB.table('locations').update(id, location);
  }

  public async updateEvent(id: string, changes: Partial<APIEvent>) {
    const changesToSubmit = this.applyFileChanges(changes);
    const event = await this.api.updateEvent(id, changesToSubmit);
    writeDB.table('events').update(id, event);
  }

  private applyFileChanges(changes: Partial<APIEvent>): Partial<APIEvent> {
    const changesToSubmit = { ...changes };
    if (changesToSubmit.hero) {
      (changesToSubmit.hero as any) = changesToSubmit.hero.file;
    }
    if (changesToSubmit.header) {
      (changesToSubmit.header as any) = changesToSubmit.header.file;
    }
    if (changesToSubmit.flyer) {
      (changesToSubmit.flyer as any) = changesToSubmit.flyer.file;
    }
    if (changesToSubmit.galleryImages) {
      (changesToSubmit.galleryImages as any) = changesToSubmit.galleryImages!.map(
        e => e.file
      );
    }
    return changesToSubmit;
  }

  public async createEvent(
    id: string,
    changes: Partial<APIEvent>
  ): Promise<Event> {
    const event = await this.api.createEvent({
      ...this.applyFileChanges(changes),
      id,
    });
    writeDB.table('events').upsert(event);
    return event;
  }

  public async loadTravelPlan(id: string) {
    const travelPlan = await this.api.getTravelPlan(id);
    writeDB.table('travelPlans').insert(travelPlan);
  }

  private subscribe() {
    store.subscribe(() => {
      const state = store.getState() as State;
      const db = new DB(state);
      const session = db.get('session');

      if (!isLoggedIn(session)) {
        return;
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
      // tslint:disable-next-line
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
    const removedEvents = events.ids.filter(id => !syncedIds.includes(id));
    events.insert(this.annotate(apiEvents));
    if (removedEvents.length > 0) {
      events.delete(removedEvents);
    }
  }

  private async refreshLikes() {
    const likes = writeDB.table('likes');
    const apiLikes = await this.api.getLikes();
    const syncedIds = apiLikes.map(e => e.id);
    const removedLikes = likes.ids.filter(id => !syncedIds.includes(id));
    likes.insert(apiLikes);
    likes.delete(removedLikes);
  }

  private async refreshLocations() {
    const locations = writeDB.table('locations');
    const apiLocations = await this.api.getLocations();
    const syncedIds = apiLocations.map(e => e.id);
    const removedLocations = locations.ids.filter(
      id => !syncedIds.includes(id)
    );
    locations.insert(this.annotate(apiLocations));
    if (removedLocations.length > 0) {
      locations.delete(removedLocations);
    }
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
  window.FB.init({
    appId: '323489808193714',
    cookie: true,
    xfbml: true,
    version: 'v3.0',
  });
  window.FB.Event.subscribe('auth.statusChange', (response: any) => {
    if (response.authResponse) {
      syncer.facebookLogin(response.authResponse.accessToken);
    } else {
      writeDB.set('session', undefined);
    }
  });
};
