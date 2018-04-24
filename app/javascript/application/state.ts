import {Event} from './models/event';
import {Like} from './models/like';
import {Location} from './models/location';
import thunk from 'redux-thunk';
import {APISession} from './api';
import {DataTable, reducer, DB, DBAction} from './db';

declare var devToolsExtension: () => void;

import { createStore, applyMiddleware, compose, GenericStoreEnhancer } from 'redux';
import persistState from 'redux-localstorage';

export interface State {
  settings: {
    session: APISession,
    testSetting: string
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


export const initialState: State = {
  settings: {
    session: {} as APISession,
    testSetting: 'test'
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

const enhancers: GenericStoreEnhancer[] = [];
const middleware = [thunk];

if (typeof devToolsExtension === 'function') {
  enhancers.push(devToolsExtension() as any);
}

// enhancers.push(persistState());

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

export const store = createStore(
  reducer(initialState),
  null,
  composedEnhancers
);

export {DB, DBAction}
export const writeDB = new DB(initialState);
