import {store, DB, State} from '../state';
import {Syncable} from './syncable';
import {APISession} from '../api';

export interface Location extends Syncable {
  id: string;
  name: string;
  city?: string;
  address?: string;
  lat?: number;
  lon?: number
  zip?: string;
  countryCode: string;
}

export function canEdit(location: Location, session?: APISession): boolean {
  return session && session.ownedLocationIds && session.ownedLocationIds.includes(location.serverId)
}
