const Storage = (() => {
  const { localStorage: storage } = window;
  const cache = new Map();

  const getItem = (key) => JSON.parse(storage.getItem(key));

  const setItem = (key, data) => storage.setItem(key, JSON.stringify(data));

  const deleteItem = (key) => storage.removeItem(key);

  const sync = (key, newData = null) => {
    Promise.resolve().then(() => {
      const { data, strategy } = cache.get(key);
      const finalData = newData || data;

      if (strategy && typeof strategy === 'function') {
        strategy.call(storage, finalData);
      } else {
        setItem(key, finalData);
      }

      cache.set(key, { data: finalData, strategy });
    });
  };

  const store = (key, data, strategy = null) => {
    cache.set(key, { data, strategy });

    sync(key);
  };

  const recover = (key, strategy) => {
    if (strategy) {
      return strategy.call(storage);
    }

    return getItem(key);
  };

  return {
    deleteItem,
    getItem,
    setItem,
    recover,
    store,
    sync,
    state: storage,
  };
})();

export default Storage;
