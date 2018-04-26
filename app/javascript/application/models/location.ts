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
  de: 'Germany',
  at: 'Austria',
  nl: 'Netherlands',
  fi: 'Finland',
  il: 'Israel',
  it: 'Italy',
  be: 'Belgium',
  us: 'USA'
}

export function canEdit(location: Location, session?: APISession): boolean {
  return !!session && !!session.ownedLocationIds && !!location.serverId && session.ownedLocationIds.includes(location.serverId)
}

export function locationDescription(location: Location): string {
  const line = [location.name];
  if(location.city && location.name != location.city) { line.push(location.city); }
  line.push(countries[location.countryCode] || location.countryCode);
  return line.join(', ')
}

export function extractCoordinates(location: Location): {lat: number, lon: number} | undefined {
  if(!location.lat || !location.lon) { return; }
  return { lat: location.lat, lon: location.lon };
}
