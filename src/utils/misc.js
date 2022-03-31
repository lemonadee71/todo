import { isPast, isWithinInterval, subHours } from 'date-fns';
import IdList from '../core/classes/IdList';
import { DEFAULT_COLORS } from '../core/constants';
import { isDueToday, parse } from './date';

// we get a bug when we don't wrap some functions
// in an anonymous callback so we create this util
export const wrap =
  (fn) =>
  (...args) =>
    fn(...args);

export const memoize = (fn) => {
  const cache = new Map();

  const memoized = (...args) => {
    const key = JSON.stringify(args);
    const result = cache.get(key) ?? fn(...args);
    cache.set(key, result);

    return result;
  };

  memoized.__cache__ = cache;

  return memoized;
};

export const curry = (fn) =>
  function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }

    return (...rest) => curried(...args.concat(rest));
  };

export const filterById = (source, ids) =>
  source.filter((item) => ids.find((id) => item?.id === id));

export const orderById = (source, ids) => {
  const sorted = [];
  const list = new IdList(source);

  ids.forEach((id) => {
    const item = list.extract(id);
    if (item) sorted.push(item);
  });

  return [...sorted, ...list.items];
};

export const copy = (target, toExclude = []) => {
  const clone = { ...target };
  toExclude.forEach((prop) => delete clone[prop]);

  return clone;
};

export const getDateColor = (dueDate) => {
  const date = parse(dueDate);
  const upperLimit = subHours(date, 3);

  if (
    isWithinInterval(new Date(), { start: upperLimit, end: date }) ||
    isPast(date)
  )
    // show red for urgency
    return DEFAULT_COLORS[3];

  // show orange for warning
  if (isDueToday(date)) return DEFAULT_COLORS[2];

  // show green
  return DEFAULT_COLORS[0];
};
