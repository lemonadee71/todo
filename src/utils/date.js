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
  subHours,
  isWithinInterval,
  isValid,
} from 'date-fns';
import { DATE_TIME_FORMAT, DEFAULT_COLORS, TZ_DATE_FORMAT } from '../constants';

export const parseDate = (input) => {
  if (typeof input === 'string') return parseISO(input);
  if (isValid(input)) return input;
  throw new TypeError('Invalid date input');
};

export const isUpcoming = (date) => !isThisWeek(date) && isFuture(date);
export const isUpcomingInFuture = (date) =>
  !isThisMonth(date) && isFuture(date);

export const getDateKeyword = (dirtyDate) => {
  const date = parseDate(dirtyDate);

  if (isToday(date)) {
    return 'today';
  }
  if (isTomorrow(date)) {
    return 'tomorrow';
  }
  if (isYesterday(date)) {
    return 'yesterday';
  }
  if (isPast(date) || isUpcomingInFuture(date)) {
    return formatDateToNow(date);
  }
  if (isThisWeek(date)) {
    return format(date, 'E, MMM dd');
  }

  return format(date, 'MMM dd');
};

export const getDateRange = (
  dirtyDate,
  range = '5',
  formatter = formatToTZDate
) => {
  const date = parseDate(dirtyDate);
  const start = formatter(subMinutes(date, range));
  const end = formatter(date);

  return [start, end];
};

export const getDateColor = (dueDate) => {
  const date = parseDate(dueDate);
  const upperLimit = subHours(date, 3);

  if (
    isWithinInterval(new Date(), { start: upperLimit, end: date }) ||
    isPast(date)
  )
    // show red for urgency
    return DEFAULT_COLORS.red;

  // show orange for warning
  if (isToday(date)) return DEFAULT_COLORS.orange;

  // show green
  return DEFAULT_COLORS.green;
};

export const formatDate = (dirtyDate) => `Due ${getDateKeyword(dirtyDate)}`;

export const formatDateToNow = (date) =>
  formatDistanceToNow(date, { addSuffix: true });

export const formatToDateTime = (date) => format(date, DATE_TIME_FORMAT);

export const formatToTZDate = (date) => format(date, TZ_DATE_FORMAT);

export const toTimestamp = (date) => parseDate(date).getTime();
