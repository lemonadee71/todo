import {
  isPast,
  isToday,
  isTomorrow,
  isYesterday,
  isThisWeek,
  format,
  formatDistanceToNow,
  parseISO,
  isThisMonth,
  isFuture,
  subMinutes,
} from 'date-fns';
import { DATE_TIME_FORMAT, TZ_DATE_FORMAT } from '../constants';

const isDueToday = (date) => isToday(date);
const isDueTomorrow = (date) => isTomorrow(date);
const isDueThisWeek = (date) => isThisWeek(date);
const isUpcoming = (date) => !isThisWeek(date) && isFuture(date);
const isUpcomingInFuture = (date) => !isThisMonth(date) && isFuture(date);

const parse = (date) => parseISO(date);

const formatDateToNow = (date) =>
  formatDistanceToNow(date, { addSuffix: true });

const getDateKeyword = (dirtyDate) => {
  const date = typeof dirtyDate === 'string' ? parse(dirtyDate) : dirtyDate;

  if (isDueToday(date)) {
    return 'today';
  }
  if (isDueTomorrow(date)) {
    return 'tomorrow';
  }
  if (isYesterday(date)) {
    return 'yesterday';
  }
  if (isPast(date) || isUpcomingInFuture(date)) {
    return formatDateToNow(date);
  }
  if (isDueThisWeek(date)) {
    return format(date, 'E, MMM dd');
  }

  return format(date, 'MMM dd');
};

const formatDate = (dirtyDate) => `Due ${getDateKeyword(dirtyDate)}`;

const formatToDateTime = (date) => format(date, DATE_TIME_FORMAT);

const formatToTZDate = (date) => format(date, TZ_DATE_FORMAT);

const getDateRange = (dirtyDate, range = '5', formatter = formatToTZDate) => {
  const date = typeof dirtyDate === 'string' ? parse(dirtyDate) : dirtyDate;
  const start = formatter(subMinutes(date, range));
  const end = formatter(date);

  return [start, end];
};

const toTimestamp = (date) => parse(date).getTime();

export {
  isDueToday,
  isDueTomorrow,
  isDueThisWeek,
  isUpcoming,
  formatDate,
  formatDateToNow,
  formatToDateTime,
  formatToTZDate,
  getDateKeyword,
  getDateRange,
  parse,
  toTimestamp,
};
