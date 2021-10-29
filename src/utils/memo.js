export const memoize = (fn) => {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);
    const result = cache.get(key) ?? fn(...args);
    cache.set(key, result);

    return result;
  };
};
