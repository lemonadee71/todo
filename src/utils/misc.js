import IdList from '../core/classes/IdList';

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

export const fetchFromIds = (ids, source) => {
  const arr = [];

  ids.forEach((id) => {
    const item = source.find((i) => i.id === id);
    if (item) arr.push(item);
  });

  return arr;
};

export const orderByIds = (ids, source) => {
  const sorted = [];
  const list = new IdList(source);

  ids.forEach((id) => {
    const item = list.extract(id);
    if (item) sorted.push(item);
  });

  return [...sorted, ...list.items];
};

export const copyObject = (target, toExclude = []) => {
  const copy = { ...target };
  toExclude.forEach((prop) => delete copy[prop]);

  return copy;
};
