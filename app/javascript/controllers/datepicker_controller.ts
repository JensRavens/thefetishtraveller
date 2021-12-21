import { Controller } from 'stimulus';
import flatpickr from 'flatpickr';
import { German } from 'flatpickr/dist/l10n/de';
import { currentLocale } from '@nerdgeschoss/shimmer';

export default class extends Controller {
  connect(): void {
    const input = this.element as HTMLInputElement;
    const locale = { firstDayOfWeek: 1 };
    if (currentLocale() === 'de') {
      Object.assign(locale, German);
    }
    flatpickr(input, {
      altInput: true,
      minDate: input.min,
      maxDate: input.max,
      enableTime: true,
      locale,
      altFormat: currentLocale() === 'de' ? 'd.m.Y H:i' : 'd/m/Y H:i',
    });
  }
}
