const Storage = (() => {
  const data = window.localStorage;
  const storedData = {};

  const sync = (key) => {
    data.setItem(key, JSON.stringify(storedData[key]));
  };

  const store = (key, dataObj) => {
    storedData[key] = dataObj;
    sync(key);
  };

  const recover = (key) => JSON.parse(data.getItem(key));

  const register = (key, dataObj) => {
    storedData[key] = dataObj;

    return new Proxy(dataObj, {
      set: function (target, prop, value, receiver) {
        sync(key);
        return Reflect.set(target, prop, value, receiver);
      },
    });
  };

  return {
    register,
    store,
    sync,
    recover,
  };
})();

export default Storage;
