import {Event} from './models/event';
import {Like} from './models/like';
import {Location} from './models/location';
import thunk from 'redux-thunk';
import {APISession} from './api';
import {DataTable, reducer, DB, DBAction} from 'redux-database';

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

function hydrate(tree: any): any {
  if(tree instanceof Array) {
    return tree.map(hydrate);
  }
  if(tree && typeof tree === 'object') {
    const newObject = {};
    Object.keys(tree).forEach(key => {
      if(key.endsWith('At') && typeof tree[key] === 'string' && tree[key].length > 0){
        newObject[key] = new Date(Date.parse(tree[key]));
      } else {
        newObject[key] = hydrate(tree[key]);
      }
    });
    return newObject;
  }
  return tree;
}

const stateString = localStorage && localStorage.getItem('state')
const persistedState: State | undefined = stateString && hydrate(JSON.parse(stateString))

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
