import { LOCAL_USER } from '../constants';

class Storage {
  constructor(prefix = '') {
    this.prefix = prefix;
    this.cache = new Map();
    this._self = window.localStorage;
  }

  get items() {
    return this.filter(() => true);
  }

  get keys() {
    return Object.keys(this._self)
      .filter((key) => key.startsWith(this.prefix))
      .map((key) => key.replace(this.prefix, ''));
  }

  get values() {
    return Object.values(this.items);
  }

  get(key) {
    return JSON.parse(this._self.getItem(this.prefix + key));
  }

  set(key, data, resolver = JSON.stringify) {
    this._self.setItem(this.prefix + key, resolver(data));

    return this;
  }

  remove(key) {
    this._self.removeItem(this.prefix + key);

    return this;
  }

  clear() {
    this.keys.forEach((key) => this.remove(key));

    return this;
  }

  filter(predicate) {
    return this.keys.reduce((data, key) => {
      if (predicate(key)) {
        data[key] = this.get(key);
      }

      return data;
    }, {});
  }

  store(key, data, resolver = null) {
    this.cache.set(key, { data, resolver });

    return this.sync(key, data);
  }

  sync(key, data) {
    Promise.resolve().then(() => {
      const cached = this.cache.get(key);
      const newData = data || cached?.data;

      if (cached?.resolver && typeof cached.resolver === 'function') {
        this.set(key, cached.resolver(newData));
      } else {
        this.set(key, newData);
      }
    });

    return this;
  }

  reset() {
    this.clear();
    this.prefix = '';
    this.cache = new Map();

    return this;
  }

  onChange(callback) {
    window.addEventListener('storage', callback);

    return this;
  }
}

Storage.root = Object.freeze(new Storage());

const LocalStorage = new Storage(`${LOCAL_USER}__`);

export { LocalStorage, Storage };
