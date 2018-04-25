import {Event} from './models/event';
import {Like} from './models/like';
import {Location} from './models/location';
import thunk from 'redux-thunk';
import {APISession} from './api';
import {DataTable, reducer, DB, DBAction} from './db';

declare var devToolsExtension: () => void;

import { createStore, applyMiddleware, compose, GenericStoreEnhancer } from 'redux';

export interface State {
  settings: {
    session?: APISession,
  },
  data: {
    events: DataTable<Event>;
    locations: DataTable<Location>;
    likes: DataTable<Like>;
  },
  types: {
    events: Event,
    locations: Location,
    likes: Like
  }
}


const defaultState: State = {
  settings: {
  },
  data: {
    events: {
      byId: {},
      ids: []
    },
    likes: {
      byId: {},
      ids: []
    },
    locations: {
      byId: {},
      ids: []
    }
  },
  types: {
    events: {} as Event,
    locations: {} as Location,
    likes: {} as Like
  }
}

const stateString = localStorage && localStorage.getItem('state')
const persistedState: State | undefined = stateString && JSON.parse(stateString)

export const initialState: State = persistedState || defaultState;

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
  reducer(initialState)
);

export {DB, DBAction}
export const writeDB = new DB(initialState);

declare const window: any;
window.store = store;