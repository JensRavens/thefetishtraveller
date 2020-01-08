import moment from 'moment';
import { I18n } from '@nerdgeschoss/i18n';

export function guid(): string {
  function s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return [s4() + s4(), s4(), s4(), s4(), s4() + s4() + s4()].join('-');
}

function parseDate(date: string): Date {
  return new Date(Date.parse(date));
}

function format(date: Date, timeZone?: string, fullDay?: boolean): string {
  if (typeof date === 'string') {
    date = parseDate(date as any);
  }
  try {
    if (!fullDay) {
      return new Intl.DateTimeFormat(I18n.locale, {
        timeZone: timeZone || undefined,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
    }
    return new Intl.DateTimeFormat(I18n.locale, {
      timeZone: timeZone || undefined,
    }).format(date);
  } catch (error) {
    console.error(error);
    return '';
  }
}

export function dateRange(
  date: Date,
  date2: Date,
  timezone?: string,
  fullDay?: boolean
): string {
  if (!date2) {
    if (!date) {
      return '';
    }
    return format(date, timezone, fullDay);
  }
  if (moment(date).isSame(date2, 'day')) {
    return format(date, timezone, fullDay);
  } else {
    return `${format(date, timezone, fullDay)} - ${format(
      date2,
      timezone,
      fullDay
    )}`;
  }
}
