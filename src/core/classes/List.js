import uuid from '../../utils/id';

class List {
  constructor({ name, defaultItems = [], id = `list-${uuid(8)}` }) {
    this.name = name;
    this.id = id;
    this.items = [...defaultItems];
    this._defaultProperty = 'id';
  }

  get length() {
    return this.items.length;
  }

  /**
   * @param {string} prop
   */
  set defaultPropForPredicate(prop) {
    this._defaultProperty = prop;
  }

  _createPredicate(predicate) {
    const defaultPredicate = (value) => (item) =>
      item[this._defaultProperty] === value;

    let fn = predicate;
    if (typeof predicate !== 'function') {
      fn = defaultPredicate(predicate);
    }

    return fn;
  }

  /**
   * Get an item from the list.
   * If string is passed, predicate will fall back to default 'id'
   * @param {function|string} predicate
   * @returns {any}
   */
  get(predicate) {
    return this.items.find(this._createPredicate(predicate));
  }

  /**
   * Check if an item is in the list.
   * If string is passed, predicate will fall back to default 'id'
   * @param {function|string} predicate
   * @returns {boolean}
   */
  has(predicate) {
    return !!this.get(predicate);
  }

  /**
   * Add item to the list
   * @param {any|Array.<any>} item
   * @returns {List}
   */
  add(item) {
    if (Array.isArray(item)) {
      this.items.push(...item);
    } else {
      this.items.push(item);
    }

    return this;
  }

  /**
   * Extracts an item from the list. This will return the item
   * and delete it from the list
   * @param {function|string} predicate
   * @returns {any}
   */
  extract(predicate) {
    const item = this.get(predicate);
    this.delete((i) => i === item);

    return item;
  }

  /**
   * Deletes an item from the list.
   * If string is passed, predicate will fall back to default 'id'
   * @param {function|string} predicate
   * @returns {List}
   */
  delete(predicate) {
    this.items = this.items.filter(
      (item) => !this._createPredicate(predicate).call(null, item)
    );

    return this;
  }

  /**
   * Deletes all items in the list
   * @returns {List}
   */
  clear() {
    this.items = [];

    return this;
  }

  /**
   * Sort the list in place
   * @param {function} predicate
   * @returns {List}
   */
  sort(predicate) {
    this.items.sort((a, b) => {
      if (predicate(a, b)) return 1;
      return -1;
    });

    return this;
  }

  /**
   * Filter list.
   * If string is passed, predicate will fall back to default 'id'
   * @param {function|string} predicate
   * @returns {Array.<any>}
   */
  filter(predicate) {
    return this.items.filter(this._createPredicate(predicate));
  }
}

export default List;
