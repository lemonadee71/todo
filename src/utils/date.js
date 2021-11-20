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
} from 'date-fns';
import { DATE_TIME_FORMAT, TZ_DATE_FORMAT } from '../core/constants';

const isDueToday = (date) => isToday(date);
const isDueTomorrow = (date) => isTomorrow(date);
const isDueThisWeek = (date) => isThisWeek(date);
const isUpcoming = (date) => !isThisWeek(date) && isFuture(date);
const isUpcomingInFuture = (date) => !isThisMonth(date) && isFuture(date);

const parse = (date) => parseISO(date);

const formatDateToNow = (dirtyDate) =>
  formatDistanceToNow(parse(dirtyDate), { addSuffix: true });

const formatDate = (dirtyDate) => {
  const date = parse(dirtyDate);

  if (isDueToday(date)) {
    return 'Due today';
  }
  if (isDueTomorrow(date)) {
    return 'Due tomorrow';
  }
  if (isYesterday(date)) {
    return 'Due yesterday';
  }
  if (isPast(date) || isUpcomingInFuture(date)) {
    return `Due ${formatDateToNow(dirtyDate)}`;
  }
  if (isDueThisWeek(date)) {
    return `Due ${format(date, 'E, MMM dd')}`;
  }

  return `Due ${format(date, 'MMM dd')}`;
};

const formatToDateTime = (date) => format(date, DATE_TIME_FORMAT);

const formatToTZDate = (date) => format(date, TZ_DATE_FORMAT);

export {
  isDueToday,
  isDueTomorrow,
  isDueThisWeek,
  isUpcoming,
  formatDate,
  formatDateToNow,
  formatToDateTime,
  formatToTZDate,
  parse,
};
