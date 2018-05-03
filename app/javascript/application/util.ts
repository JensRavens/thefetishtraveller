import * as moment from 'moment';

export function guid(): string {
  function s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return [s4() + s4(), s4(), s4(), s4(), s4() + s4() + s4()].join('-');
}

function format(date: Date): string {
  if(typeof date == 'string') { return '' }
  const offset = date.getHours() + (date.getTimezoneOffset() / 60);
  if(offset == 0) {
    return moment(date).format('ll');
  }
  return moment(date).format('lll');
}

export function dateRange(date: Date, date2: Date) {
  if(!date2) {
    if(!date) {
      return '';
    }
    return format(date);
  }
  if(moment(date).isSame(date2, 'day')) {
    return format(date);
  } else {
    return `${format(date)} - ${format(date2)}`;
  }
}