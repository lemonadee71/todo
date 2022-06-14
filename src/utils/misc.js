import IdList from '../core/classes/IdList';

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

export const intersectById = (source, ids) =>
  source.filter((item) => ids.find((id) => item?.id === id));

export const sortById = (source, ids) => {
  const sorted = [];
  const list = new IdList(source);

  ids.forEach((id) => {
    const item = list.extract(id);
    if (item) sorted.push(item);
  });

  return [...sorted, ...list.items];
};

export const intersectAndSortById = (source, ids) =>
  sortById(intersectById(source, ids), ids);

export const copy = (target, toExclude = []) => {
  const clone = { ...target };
  toExclude.forEach((prop) => delete clone[prop]);

  return clone;
};
