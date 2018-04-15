import {guid} from './util';
import {Event} from './models/event';
import {Like} from './models/like';
import thunk from 'redux-thunk';

declare var devToolsExtension: () => void;

import { createStore, applyMiddleware, compose, GenericStoreEnhancer } from 'redux';
import persistState from 'redux-localstorage';

type Diff<T extends string, U extends string> = (
  & { [P in T]: P }
  & { [P in U]: never }
  & { [x: string]: never }
)[T];

type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

interface Record {
  id: string
}

type RecordIdentifying = string | string[] | Record | Record[];

export interface DataTable<T> {
  type: T,
  byId: {[id: string]: T}
  ids: string[]
}

export interface UpdateAction {
  type: 'UPDATE_RECORD',
  payload: {
    ids: string[],
    key: string,
    data: Partial<Record>
  }
}

export interface InsertAction {
  type: 'INSERT_RECORD',
  payload: {
    ids: string[],
    key: string,
    data: Record[]
  }
}

export interface DeleteAction {
  type: 'DELETE_RECORD',
  payload: {
    key: string,
    ids: string[]
  }
}

export interface SettingsUpdateAction {
  type: 'SETTINGS_UPDATE',
  payload: {
    key: string,
    setting: any
  }
}

export class DB {
  private _state?: State;

  constructor(state?: State) {
    this._state = state;
  }

  get<K extends keyof State['settings']>(name: K): State['settings'][K] {
    return this.state.settings[name];
  }

  set<K extends keyof State['settings'], U extends State['settings'][K]>(name: K, value: U): SettingsUpdateAction {
    return {
      type: 'SETTINGS_UPDATE',
      payload: {
        key: name,
        setting: value
      }
    }
  }

  table<K extends keyof State['data']>(type: K): Table<State['data'][K]['type']> {
    return new Table(this.state.data[type], type);
  }

  private get state(): State {
    return this._state ? this._state : initialState;
  }
}

class Table<T extends Record> {
  private data: DataTable<T>;
  private key: string;

  constructor(data: DataTable<T>, key: string) {
    this.data = data;
    this.key = key
  }

  find(id: string): T | null {
    return this.data.byId[id];
  }

  get all(): T[] {
    return this.data.ids.map(id => this.data.byId[id]);
  }

  get first(): T | null {
    return this.data.byId[this.data.ids[0]] || null
  }

  get last(): T | null {
    return this.data.byId[this.data.ids[this.data.ids.length - 1]] || null
  }

  where(query: ((value: T) => boolean) | Partial<T>): T[] {
    if(typeof(query) === 'function') {
      return this.all.filter(query);
    } else {
      return this.all.filter(e => {
        for(const key of Object.keys(query)) {
          if(e[key] != query[key]) {
            return false
          }
        }
        return true;
      });
    }
  }

  insert(records: Omit<T, 'id'> | Omit<T, 'id'>[]): InsertAction {
    const newRecords: Omit<T, 'id'>[] = records instanceof Array ? records : [records];
    const insertedRecords: T[] = newRecords.map(e => this.applyId(e));
    return {
      type: 'INSERT_RECORD',
      payload: {
        key: this.key,
        ids: insertedRecords.map(e => e.id),
        data: insertedRecords
      }
    }
  }

  update(id: RecordIdentifying, values: Partial<T>): UpdateAction {
    return {
      type: 'UPDATE_RECORD',
      payload: {
        key: this.key,
        ids: this.extractIds(id),
        data: values
      }
    }
  }

  delete(id: RecordIdentifying): DeleteAction {
    return {
      type: 'DELETE_RECORD',
      payload: {
        key: this.key,
        ids: this.extractIds(id)
      }
    }
  }

  private extractIds(object: RecordIdentifying): string[] {
    if(object === undefined) { throw('Trying to insert/update record which was not saved before') }
    let test: (string | Record)[];
    if(!(object instanceof Array)) {
      test = [object];
    } else {
      test = object;
    }
    return test.map(e => e['id'] || e);
  }

  private applyId(record: Omit<T, 'id'> & {id?: string}): T {
    const copy = Object.assign({} as T, record);
    if(!copy.id) {
      copy.id = guid()
    }
    return copy;
  }
}

export interface State {
  settings: {
  },
  data: {
    events: DataTable<Event>;
    likes: DataTable<Like>;
  }
}


export const initialState: State = {
  settings: {
  },
  data: {
    events: {
      type: {} as Event,
      byId: {},
      ids: []
    },
    likes: {
      type: {} as Like,
      byId: {},
      ids: []
    }
  }
}

export type DBAction = UpdateAction | DeleteAction | InsertAction | SettingsUpdateAction;

function byId(records: Record[]): {[id: string]: Record}{
  const map = {};
  records.forEach(e => map[e.id] = e);
  return map;
}

function except(object: {[key: string]: any}, keys: string[]) {
  const newObject = {};
  Object.keys(object).forEach(key => {
    if(!keys.includes(key)) {
      newObject[key] = object[key];
    }
  });
  return newObject;
}

export function dbReducer(state: State, action: DBAction): State {
  if(!state) { return initialState };
  switch(action.type) {
    case 'INSERT_RECORD': {
      const key = action.payload.key;
      const newIDs = action.payload.ids.filter(id => !state.data[key].ids.includes(id));
      const dataSet = {...state.data[key], byId: {...state.data[key].byId, ...byId(action.payload.data)}, ids: [...state.data[key].ids, ...newIDs] };
      return {...state, data: {...state.data, [key]: dataSet}};
    }
    case 'DELETE_RECORD': {
      const key = action.payload.key;
      const ids = action.payload.ids;
      const dataSet = {...state.data[key], byId: except(state.data[key].byId, ids), ids: state.data[key].ids.filter((e: string) => !ids.includes(e)) };
      return {...state, data: {...state.data, [key]: dataSet}};
    }
    case 'UPDATE_RECORD': {
      const key = action.payload.key;
      const updates: {[id: string]: Record} = {};
      action.payload.ids.forEach(e => updates[e] = {...state.data[key], ...action.payload.data});
      const dataSet = {...state.data[key], byId: {...state.data[key].byId, updates}};
      return {...state, data: {...state.data, [key]: dataSet}};
    }
    case 'SETTINGS_UPDATE': {
      const key = action.payload.key;
      return {...state, settings: {...state.settings, [key]: action.payload.setting}};
    }
  }
}

const enhancers: GenericStoreEnhancer[] = [];
const middleware = [thunk];

if (typeof devToolsExtension === 'function') {
  enhancers.push(devToolsExtension() as any);
}

enhancers.push(persistState());

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

export const store = createStore(
  dbReducer,
  null,
  composedEnhancers
);
