import { Event } from './models/event';
import { Like } from './models/like';
import { Location } from './models/location';
import thunk from 'redux-thunk';
import EJSON from 'ejson';
import { keyBy } from 'lodash';
import { APISession } from './api';
import { DataTable, reducer, DB, DBAction, MutableDB } from 'redux-database';

declare var devToolsExtension: () => void;

const localStorageVersion = 'v2';

import {
  createStore,
  applyMiddleware,
  compose,
  GenericStoreEnhancer,
} from 'redux';
import { TravelPlan } from './models/travel_plan';
import { createBrowserHistory } from 'history';

export interface State {
  settings: {
    session?: APISession;
  };
  data: {
    events: DataTable<Event>;
    locations: DataTable<Location>;
    likes: DataTable<Like>;
    travelPlans: DataTable<TravelPlan>;
  };
  types: {
    events: Event;
    locations: Location;
    likes: Like;
    travelPlans: TravelPlan;
  };
}

const emptyTable = { byId: {}, ids: [] };

const defaultState: State = {
  settings: {},
  data: {
    events: emptyTable,
    likes: emptyTable,
    locations: emptyTable,
    travelPlans: emptyTable,
  },
  types: {
    events: {} as Event,
    locations: {} as Location,
    likes: {} as Like,
    travelPlans: {} as TravelPlan,
  },
};

const loadedSettingsString = localStorage.getItem(
  `settings-${localStorageVersion}`
);
const loadedSettings =
  (loadedSettingsString && EJSON.parse(loadedSettingsString)) || undefined;
export const initialState: State = {
  ...defaultState,
  settings: { ...defaultState.settings, ...loadedSettings },
};

try {
  let storedData = localStorage.getItem(`locations-${localStorageVersion}`);
  if (storedData) {
    const storedLocations = EJSON.parse(storedData) as Location[];
    initialState.data.locations.byId = keyBy(storedLocations, 'id');
    initialState.data.locations.ids = storedLocations.map(e => e.id);
  }
  storedData = localStorage.getItem(`events-${localStorageVersion}`);
  if (storedData) {
    const storedEvents = EJSON.parse(storedData) as Event[];
    initialState.data.events.byId = keyBy(storedEvents, 'id');
    initialState.data.events.ids = storedEvents.map(e => e.id);
  }
} catch (error) {
  // tslint:disable-next-line
  console.error(error);
}

const enhancers: GenericStoreEnhancer[] = [];
const middleware = [thunk];

if (typeof devToolsExtension === 'function') {
  enhancers.push(devToolsExtension() as any);
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

export const store = createStore<State>(
  reducer(initialState),
  initialState,
  composedEnhancers as any
);

export { DB, DBAction };
export const writeDB = new MutableDB(initialState, { store });

(window as any).store = store;
(window as any).writeDB = writeDB;

store.subscribe(() => {
  const locations = EJSON.stringify(writeDB.table('locations').all);
  localStorage.setItem(`locations-${localStorageVersion}`, locations);
  const events = EJSON.stringify(writeDB.table('events').all);
  localStorage.setItem(`events-${localStorageVersion}`, events);
  const settings = EJSON.stringify(store.getState().settings);
  localStorage.setItem(`settings-${localStorageVersion}`, settings);
});

export const history = createBrowserHistory();
