const Storage = (() => {
  const { localStorage: state } = window;
  const cache = new Map();

  const getItem = (key) => JSON.parse(state.getItem(key));

  const setItem = (key, data) => state.setItem(key, JSON.stringify(data));

  const deleteItem = (key) => state.removeItem(key);

  const sync = (key, newData = null) => {
    Promise.resolve().then(() => {
      const { data, strategy } = cache.get(key);
      const finalData = newData || data;

      if (strategy && typeof strategy === 'function') {
        strategy.call(state, setItem, finalData);
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
      return strategy.call(state, getItem);
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
    state,
  };
})();

export default Storage;
