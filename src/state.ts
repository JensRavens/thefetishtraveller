import { Event } from './models/event';
import { Like } from './models/like';
import { Location } from './models/location';
import EJSON from 'ejson';
import { APISession } from './api';
import { DataTable, reducer, DB, MutableDB } from 'redux-database';

declare var __REDUX_DEVTOOLS_EXTENSION__: () => void;

const localStorageVersion = 'v2';

import { createStore, compose } from 'redux';
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

const enhancers: any[] = [];

if (typeof __REDUX_DEVTOOLS_EXTENSION__ === 'function') {
  enhancers.push(__REDUX_DEVTOOLS_EXTENSION__() as any);
}

const composedEnhancers = compose(...enhancers);

export const store = createStore(
  reducer(initialState),
  initialState,
  composedEnhancers as any
);

export { DB };
export const writeDB = new MutableDB(initialState, { store });

try {
  let storedData = localStorage.getItem(`locations-${localStorageVersion}`);
  if (storedData) {
    const storedLocations = EJSON.parse(storedData) as Location[];
    writeDB.table('locations').insert(storedLocations);
  }
  storedData = localStorage.getItem(`events-${localStorageVersion}`);
  if (storedData) {
    const storedEvents = EJSON.parse(storedData) as Event[];
    writeDB.table('events').insert(storedEvents);
  }
} catch (error) {
  // tslint:disable-next-line
  console.error(error);
}

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
