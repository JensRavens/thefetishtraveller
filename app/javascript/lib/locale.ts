export type Locale = 'en' | 'de';

export function currentLocale(): Locale {
  return (document.documentElement.lang || 'en') as Locale;
}
