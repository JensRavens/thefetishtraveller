import {API, APIEvent, APILocation} from './api';
import {store, State, DB, writeDB} from './state';
import {Event} from './models/event';
import {Location} from './models/location';
import {needsSync, calculateChangeset} from './models/syncable';
import {isLoggedIn} from './models/session';

export class APISyncer {
  api: API;
  constructor(){
    const state = store.getState() as State | null;
    const session = state ? new DB(state).get('session') : null;
    const sessionId = session ? session.id : undefined;
    this.api = new API('/api/v1', sessionId);
    if(sessionId) { this.refreshSession() }
    this.subscribe();
  }

  refresh() {
    this.refreshEvents();
    this.refreshLocations();
  }

  async login(email: string, password: string) {
    if(!this.api.sessionID) { await this.api.createSession() }
    const session = await this.api.login(email, password);
    store.dispatch(writeDB.set('session', session));
  }

  private subscribe() {
    store.subscribe(() => {
      const state = store.getState() as State;
      const db = new DB(state);
      const session = db.get('session');

      localStorage && localStorage.setItem('state', JSON.stringify(state));

      if(!isLoggedIn(session)) {
        return;
      }

      const changedEvents = db.table('events').where(needsSync);
      if(changedEvents.length) {
        this.updateEvents(changedEvents);
      };
      const changedLocations = db.table('locations').where(needsSync);
      if(changedLocations.length) {
        this.updateLocations(changedLocations);
      }
    });
  }

  private async refreshSession() {
    const session = await this.api.getSession();
    store.dispatch(writeDB.set('session', session));
  }

  private annotate(list: APIEvent | APIEvent[] | APILocation | APILocation[]): any {
    const events = list instanceof Array ? list : [list];
    return events.map(e => ({...e, serverId: e.id, draft: false, synced: true}));
  }

  private async refreshEvents() {
    const events = writeDB.table('events');
    const apiEvents = await this.api.getEvents();
    store.dispatch(events.insert(this.annotate(apiEvents)));
  }

  private async refreshLocations() {
    const locations = writeDB.table('locations');
    const apiLocations = await this.api.getLocations();
    store.dispatch(locations.insert(this.annotate(apiLocations)))
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
}

export const syncer = new APISyncer();

declare const window: any;
window.api = syncer.api;
