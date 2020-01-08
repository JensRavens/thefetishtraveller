import { Syncable } from './syncable';
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
  countryName?: string;
  category: 'city' | 'bar' | 'region' | 'shop' | 'hotel' | 'venue';
  timezone?: string;
}

export function countryName(code: string): string {
  return (t('location.countries') as any)[code];
}

export function locationDescription(location: {
  name: string;
  city?: string | null;
  countryName?: string | null;
  countryCode?: string;
}): string {
  const line = [location.name];
  if (location.city && location.name !== location.city) {
    line.push(location.city);
  }
  line.push(location.countryName || countryName(location.countryCode!));
  return line.join(', ');
}

export function isVenue(location: { category: string | null }): boolean {
  return location.category !== 'venue';
}

export function extractCoordinates(location: {
  lat?: number | null;
  lon?: number | null;
}): { lat: number; lon: number } | undefined {
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
    (location.countryName || '').toLocaleLowerCase() +
    (location.countryCode &&
      (countryName(location.countryCode) || '').toLocaleLowerCase());
  const normalizedTerm = term.toLocaleLowerCase();
  return locationName.includes(normalizedTerm);
}
