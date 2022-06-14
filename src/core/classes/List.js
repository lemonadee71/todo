class List {
  constructor(items = []) {
    this._items = [...items];
  }

  get length() {
    return this.items.length;
  }

  get items() {
    return [...this._items];
  }

  toJSON() {
    return this.items.map((item) => item.toJSON());
  }

  /**
   * Get an item from the list.
   * @param {function} predicate
   * @returns {any}
   */
  get(predicate) {
    return this._items.find(predicate);
  }

  /**
   * Get the index based on the predicate
   * @param {function} predicate
   * @returns {number} - the index of the matching item
   */
  getIndex(predicate) {
    return this._items.findIndex(predicate);
  }

  /**
   * Check if an item is in the list.
   * @param {function} predicate
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
      this._items.push(...item);
    } else {
      this._items.push(item);
    }

    return this;
  }

  /**
   * Insert item at a specified index
   * @param {any} item
   * @param {Number} idx
   * @returns {List}
   */
  insert(item, idx) {
    this._items.splice(idx, 0, item);

    return item;
  }

  /**
   * Move item at a specified index
   * @param {function} predicate
   * @param {Number} idx
   * @returns {List}
   */
  move(predicate, idx) {
    return this.insert(this.extract(predicate), idx);
  }

  /**
   * Extracts an item from the list. This will return the item
   * and delete it from the list
   * @param {function} predicate
   * @returns {any}
   */
  extract(predicate) {
    const extracted = this.get(predicate);
    this.delete((item) => item === extracted);

    return extracted;
  }

  /**
   * Deletes an item from the list.
   * @param {function} predicate
   * @returns {List}
   */
  delete(predicate) {
    this._items = this._items.filter((item) => !predicate(item));

    return this;
  }

  /**
   * Replace an item with another one
   * @param {function} predicate
   * @param {*} item
   * @returns {List}
   */
  replace(predicate, item) {
    const idx = this.getIndex(predicate);
    this.delete(predicate);
    this.insert(item, idx);

    return this;
  }

  /**
   * Deletes all items in the list
   * @returns {List}
   */
  clear() {
    this._items = [];

    return this;
  }

  /**
   * Sort the list in place
   * @param {function} predicate
   * @returns {List}
   */
  sort(predicate) {
    this._items.sort((a, b) => {
      if (predicate(a, b)) return 1;
      return -1;
    });

    return this;
  }

  /**
   * Filter list.
   * @param {function} predicate
   * @returns {Array.<any>}
   */
  filter(predicate) {
    return this._items.filter(predicate);
  }
}

export default List;
