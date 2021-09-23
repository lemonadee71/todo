const Storage = (() => {
  const storage = window.localStorage;
  const cache = new Map();

  const get = (key) => JSON.parse(storage.getItem(key));

  const set = (key, data) => storage.setItem(key, JSON.stringify(data));

  const remove = (key) => storage.removeItem(key);

  const clear = () => storage.clear();

  const keys = () => Object.keys(storage);

  const filter = (condition) =>
    keys().reduce((data, key) => {
      if (condition(key)) {
        data[key] = get(key);
      }

      return data;
    }, {});

  const sync = (key, newData = null) => {
    Promise.resolve().then(() => {
      const { resolver, data: cached } = cache.get(key);
      const data = newData || cached;

      if (resolver && typeof resolver === 'function') {
        set(key, resolver.call(storage, data));
      } else {
        set(key, data);
      }
    });
  };

  const store = (key, data, resolver = null) => {
    cache.set(key, { data, resolver });

    sync(key, data);
  };

  const recover = (key, resolver) => {
    if (resolver) return resolver.call(storage);

    return get(key);
  };

  return {
    clear,
    filter,
    get,
    keys,
    recover,
    remove,
    set,
    store,
    sync,
  };
})();

export default Storage;
