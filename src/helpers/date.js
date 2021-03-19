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

const isDueToday = (date) => isToday(date);
const isDueTomorrow = (date) => isTomorrow(date);
const isDueThisWeek = (date) => isThisWeek(date);
const isUpcoming = (date) => !isThisWeek(date) && isFuture(date);
const isUpcomingInFuture = (date) => !isThisMonth(date) && isFuture(date);

const parse = (date) => parseISO(date);

const formatDate = (dirtyDate) => {
  const date = parse(dirtyDate);
  const opts = { addSuffix: true };

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
    return `Due ${formatDistanceToNow(date, opts)}`;
  }
  if (isDueThisWeek(date)) {
    return `Due ${format(date, 'E, MMM dd')}`;
  }

  return `Due ${format(date, 'MMM dd')}`;
};

export {
  isDueToday,
  isDueTomorrow,
  isDueThisWeek,
  isUpcoming,
  formatDate,
  parse,
};
