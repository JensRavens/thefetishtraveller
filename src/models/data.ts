import { DB } from 'redux-database';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { State } from '../state';

export function useData<T>(query: (db: DB<State>) => T): T {
  const { storeState } = useContext(ReactReduxContext);
  return query(new DB(storeState));
}
