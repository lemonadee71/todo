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
  let date = parse(dirtyDate);
  let opts = { addSuffix: true };

  if (isDueToday(date)) {
    return 'Due today';
  } else if (isDueTomorrow(date)) {
    return 'Due tomorrow';
  } else if (isYesterday(date)) {
    return 'Due yesterday';
  } else if (isPast(date) || isUpcomingInFuture(date)) {
    return `Due ${formatDistanceToNow(date, opts)}`;
  } else if (isDueThisWeek(date)) {
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
