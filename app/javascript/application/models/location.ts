import {store, DB, State} from '../state';
import {Syncable} from './syncable';
import {APISession} from '../api';
import {t} from '../i18n';

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

export function countryName(code: string): string {
  return (t('location.countries') as any)[code];
}

export function canEdit(location: Location, session?: APISession): boolean {
  return !!session && !!session.ownedLocationIds && !!location.serverId && session.ownedLocationIds.includes(location.serverId)
}

export function locationDescription(location: Location): string {
  const line = [location.name];
  if(location.city && location.name != location.city) { line.push(location.city); }
  line.push(countryName(location.countryCode));
  return line.join(', ')
}

export function extractCoordinates(location: Location): {lat: number, lon: number} | undefined {
  if(!location.lat || !location.lon) { return; }
  return { lat: location.lat, lon: location.lon };
}
