import { I18n } from '@nerdgeschoss/i18n';

export function loadLocales() {
  const requireLocales = require['context']('../locales', true, /\.ya?ml$/);
  I18n.translations = requireLocales
    .keys()
    .reduce((carry: object, filename: string) => {
      const translations = requireLocales(filename);
      // every translation file has exactly one key (the locale)
      const [locale] = Object.keys(translations);
      if (locale in carry) {
        Object.assign(carry[locale], translations[locale]);
        return carry;
      }
      return Object.assign(carry, translations);
    }, {});
  if (!I18n.availableLocales.includes(I18n.locale)) {
    I18n.locale = I18n.availableLocales[0];
  }
}
