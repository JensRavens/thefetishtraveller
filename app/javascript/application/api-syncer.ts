import {API, APIEvent, APILocation} from './api';
import {store, State, DB, writeDB} from './state';
import {Event} from './models/event';
import {Location} from './models/location';
import {needsSync, calculateChangeset} from './models/syncable';
import {isLoggedIn} from './models/session';

export class APISyncer {
  api: API;
  constructor(){
    const sessionId = new DB(store.getState() as State).get('session').id;
    this.api = new API('/api/v1', sessionId);
    if(sessionId) { this.refreshSession() }

    store.subscribe(() => {
      const state = store.getState() as State;
      const db = new DB(state);
      const session = db.get('session');

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

  refresh() {
    this.refreshEvents();
    this.refreshLocations();
  }

  async login(email: string, password: string) {
    if(!this.api.sessionID) { await this.api.createSession() }
    const session = await this.api.login(email, password);
    store.dispatch(writeDB.set('session', session));
  }

  private async refreshSession() {
    const session = await this.api.getSession();
    store.dispatch(writeDB.set('session', session));
  }

  private annotate(list: APIEvent | APIEvent[] | APILocation | APILocation[]): any {
    const events = list instanceof Array ? list : [list];
    return events.map(e => ({...e, serverId: e.id, draft: false, synced: true}));
  }

  private refreshEvents() {
    const events = writeDB.table('events');
    this.api.getEvents().then(e => store.dispatch(events.insert(this.annotate(e))));
  }

  private refreshLocations() {
    const locations = writeDB.table('locations');
    this.api.getLocations().then(e => store.dispatch(locations.insert(this.annotate(e))));
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
