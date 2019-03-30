import { Syncable } from './syncable';
import { APISession } from '../api';
import { t } from '@nerdgeschoss/i18n';

export interface Location extends Syncable {
  id: string;
  slug: string;
  name: string;
  abstract?: string;
  description?: string;
  city?: string;
  address?: string;
  lat?: number;
  lon?: number;
  zip?: string;
  countryCode: string;
  category: 'city' | 'bar' | 'region' | 'shop' | 'hotel' | 'venue';
  timezone?: string;
}

export function countryName(code: string): string {
  return (t('location.countries') as any)[code];
}

export function canEdit(location: Location, session?: APISession): boolean {
  return (
    !!session &&
    !!session.ownedLocationIds &&
    !!location.serverId &&
    session.ownedLocationIds.includes(location.serverId)
  );
}

export function locationDescription(location: Location): string {
  const line = [location.name];
  if (location.city && location.name !== location.city) {
    line.push(location.city);
  }
  line.push(countryName(location.countryCode));
  return line.join(', ');
}

export function isVenue(location: Location): boolean {
  return location.name !== location.city;
}

export function extractCoordinates(
  location: Location
): { lat: number; lon: number } | undefined {
  if (!location.lat || !location.lon) {
    return;
  }
  return { lat: location.lat, lon: location.lon };
}

export function matchesTerm(
  location: Partial<Location>,
  term: string
): boolean {
  const locationName =
    (location.name || '').toLocaleLowerCase() +
    (location.address || '').toLocaleLowerCase() +
    (location.countryCode &&
      countryName(location.countryCode).toLocaleLowerCase());
  const normalizedTerm = term.toLocaleLowerCase();
  return locationName.includes(normalizedTerm);
}
