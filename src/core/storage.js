import { LOCAL_USER } from './constants';

class Storage {
  constructor(prefix = '') {
    this.prefix = prefix;
    this._cache = new Map();
    this._localStorage = window.localStorage;
  }

  get items() {
    return this.filter(() => true);
  }

  get keys() {
    return Object.keys(this._localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .map((key) => key.replace(this.prefix, ''));
  }

  get values() {
    return Object.values(this.items);
  }

  get(key) {
    return JSON.parse(this._localStorage.getItem(this.prefix + key));
  }

  set(key, data, resolver = JSON.stringify) {
    this._localStorage.setItem(this.prefix + key, resolver(data));

    return this;
  }

  remove(key) {
    this._localStorage.removeItem(this.prefix + key);

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
    this._cache.set(key, { data, resolver });

    return this.sync(key, data);
  }

  sync(key, newData) {
    Promise.resolve().then(() => {
      const { resolver, data: cached } = this._cache.get(key);
      const data = newData || cached;

      if (resolver && typeof resolver === 'function') {
        this.set(key, resolver(data));
      } else {
        this.set(key, data);
      }
    });

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
