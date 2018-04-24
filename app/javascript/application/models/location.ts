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

export const countries = {
  de: 'Germany'
}

export function canEdit(location: Location, session?: APISession): boolean {
  return session && session.ownedLocationIds && session.ownedLocationIds.includes(location.serverId)
}

export function locationDescription(location: Location): string {
  const line = [location.name];
  if(location.name != location.city) { line.push(location.city); }
  line.push(countries[location.countryCode] || location.countryCode);
  return line.join(', ')
}
