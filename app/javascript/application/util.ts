import * as moment from 'moment';

export function guid(): string {
  function s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return [s4() + s4(), s4(), s4(), s4(), s4() + s4() + s4()].join('-');
}

export function dateRange(date: Date, date2: Date) {
  if(!date2) {
    if(!date) {
      return '';
    }
    return moment(date).calendar();
  }
  if(moment(date).isSame(date2, 'day')) {
    return moment(date).calendar();
  } else {
    return `${moment(date).calendar()} - ${moment(date2).calendar()}`;
  }
}