const Storage = (() => {
  const storage = window.localStorage;
  const cache = new Map();
  let root = '';

  const _resolveKey = (key, useRoot) => (useRoot ? root + key : key);

  const init = (str, separator = '__') => {
    root = str + separator;
  };

  const keys = (useRoot = true) =>
    Object.keys(storage)
      .filter((key) => (useRoot ? key.startsWith(root) : true))
      .map((key) => (useRoot ? key.replace(root, '') : key));

  const get = (key, useRoot = true) =>
    JSON.parse(storage.getItem(_resolveKey(key, useRoot)));

  const set = (key, data, useRoot = true) =>
    storage.setItem(_resolveKey(key, useRoot), JSON.stringify(data));

  const remove = (key, useRoot = true) =>
    storage.removeItem(_resolveKey(key, useRoot));

  const clear = (useRoot = true) => {
    if (useRoot) keys().forEach((key) => remove(key));
    else storage.clear();
  };

  const filter = (condition, useRoot = true) =>
    keys(useRoot).reduce((data, key) => {
      if (condition(key)) {
        data[key] = get(key);
      }

      return data;
    }, {});

  const items = (useRoot = true) => filter(() => true, useRoot);

  const sync = (key, newData = null, useRoot = true) => {
    Promise.resolve().then(() => {
      const { resolver, data: cached } = cache.get(key);
      const data = newData || cached;

      if (resolver && typeof resolver === 'function') {
        set(key, resolver.call(null, data), useRoot);
      } else {
        set(key, data, useRoot);
      }
    });
  };

  const store = (key, data, resolver = null, useRoot = true) => {
    cache.set(key, { data, resolver });

    sync(key, data, useRoot);
  };

  const onChange = (callback) => window.addEventListener('storage', callback);

  return {
    init,
    clear,
    filter,
    get,
    items,
    keys,
    remove,
    set,
    store,
    sync,
    onChange,
  };
})();

export default Storage;
