const moment = require('moment');
require('moment/locale/de');

type TranslationEntry = { [key: string]: TranslationEntry } | string;
type TranslationFunction = (
  key: string,
  args?: { [name: string]: string }
) => string;

export type Locale = string;

/**
 * This class helps translating your content with json files. Just import the `t`
 * function. Locales get loaded asynchronously when set via `I18n.locale`.
 */
export class Translator {
  private _locale: Locale;
  private updateListeners: ((locale: Locale) => void)[] = [];
  private translations: TranslationEntry = {
    de: require('./locales/de.yml'),
    en: require('./locales/en.yml'),
  };

  constructor() {
    this.localize = this.localize.bind(this);
    this.translate = this.translate.bind(this);
    this.scoped = this.scoped.bind(this);
    this.localizeNumber = this.localizeNumber.bind(this);
    this.setLocale(this.locale);
  }

  /**
   * This method is just to keep track of all 'unlocalized' messages inside the App.
   * @param text string you want to display to the User
   */
  todo(text: string) {
    return text;
  }

  /**
   * Access the currently set locale. This might be a bit ahead
   * of time in case the locale data is not loaded yet.
   */
  get locale(): Locale {
    return (
      this._locale ||
      localStorage.getItem('locale') ||
      ['en', 'de'].filter(e => !!e && navigator.language.startsWith(e))[0] ||
      'en'
    );
  }

  /**
   * Set a new locale. This will notify all observers of the changed
   * locale as soon as the locale data has been downloaded.
   */
  set locale(locale: Locale) {
    this.setLocale(locale);
    localStorage.setItem('locale', locale);
  }

  /**
   * Set a new locale and get notified about the download progress. Try to use
   * `I18n.locale=` whenever possible instead.
   */
  async setLocale(locale: Locale) {
    this._locale = locale;
    moment.locale(locale);
    this.updateListeners.forEach(e => e(locale));
  }

  /**
   * Translates a key and interpolates with the supplied arguments.
   * @param key A string to look up the translation, may be dot separated
   * @param args Additional arguments to interpolate the string
   *
   * @returns The translated string. IF there is no translation defined, returns the key.
   *
   * @example
   * translate('hello.world') // looks up {hello: {world: "hello world"}} and returns 'hello world'
   * @example
   * translate('hello', name: 'Marc') // looks up {hello: 'hello :name:'} and returns 'hello Marc'
   */
  translate(key: string, args: { [key: string]: string } = {}): string {
    let value = this.translations[this.locale];
    if (!value) {
      // this locale is not yet loaded
      return key;
    }
    for (const query of key.split('.')) {
      // unpack the locale data, returning the key if no translation is present.
      value = value[query];
      if (!value) {
        return key;
      }
    }
    for (const k of Object.keys(args)) {
      // interpolate :arguments: into the translation
      const v = args[k];
      value = value.replace(new RegExp(`\:${k}\:`, 'g'), v);
    }
    return value;
  }

  /**
   * To make typing of namespaces less repetitive, you can create a bound context
   * using `I18n.scoped`. After this all calls to the
   * returned translate function will be prefixed with this scope if the key
   * starts with a dot:
   * ```js
   * const t = I18n.scoped('my_component');
   * t('.header') // returns the value for 'my_component.header'
   * t('global.header') // returns the value for 'global.header'
   * ```
   */
  scoped(scope: string): TranslationFunction {
    return (key, args) => {
      if (key.startsWith('.')) {
        key = scope + key;
      }
      return this.translate(key, args);
    };
  }

  /**
   * Formats and localizes a date for the current locale.
   * @param value A date or parseable string for a date
   * @param options An object containing formatting options
   *
   * **Formatting Options**:
   * - `relative`: display a relative date like '5 minutes ago'
   * - `prefix`: set this to false to skip relative prefixes as in '5 minutes'
   * - `format`: use a format from the translation tables like `short` (default), `long` or `time`
   */
  localize(
    value: Date | string,
    options: { relative?: boolean; prefix?: boolean; format?: string } = {
      prefix: true,
      format: 'short',
    }
  ): string {
    const time = moment(value);
    if (options.relative) {
      if (time.isBefore()) {
        return time.toNow(!options.prefix);
      }
      return time.fromNow(!options.prefix);
    }
    return time.format(this.translate(`date_format.${options.format}`));
  }

  localizeNumber(value: number) {
    return new Intl.NumberFormat(this.locale).format(value);
  }

  /**
   * Register to get notified once the locale changes. This
   * can be used to e.g. rerender a react component.
   */
  onUpdate(callback: (locale: string) => void) {
    this.updateListeners.push(callback);
  }
}

export const I18n = new Translator();
export const t: TranslationFunction = I18n.translate;
export const l = I18n.localize;
export const localizeNumber = I18n.localizeNumber;
export const scoped = I18n.scoped;

declare const window: any;
window.I18n = I18n;
window.moment = moment;
