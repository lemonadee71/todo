import uuid from '../../utils/id';

class List {
  constructor({ name, defaultItems = [], id = `list-${uuid(8)}` }) {
    this.name = name;
    this.id = id;
    this.items = [...defaultItems];
    this.length = this.items.length;
  }

  _reduceCondition(condition) {
    const defaultFilter = (id) => (item) => item.id === id;

    let fn = condition;
    if (typeof condition === 'string') {
      fn = defaultFilter(condition);
    }

    return fn;
  }

  /**
   * Get an item from the list.
   * If string is passed, condition will fall back to default 'id'
   * @param {function|string} condition
   * @returns
   */
  get(condition) {
    return this.items.find(this._reduceCondition(condition));
  }

  /**
   * Check if an item is in the list.
   * If string is passed, condition will fall back to default 'id'
   * @param {function|string} condition
   * @returns
   */
  has(condition) {
    return !!this.get(condition);
  }

  /**
   * Add item to the list
   * @param {any|Array.<any>} item
   * @returns
   */
  add(item) {
    if (Array.isArray(item)) {
      this.items.push(...item);
    } else {
      this.items.push(item);
    }
    this.length = this.items.length;

    return this;
  }

  /**
   * Extracts an item from the list. This will return the item
   * and delete it from the list
   * @param {function|string} condition - the condition
   * @returns {any}
   */
  extract(condition) {
    // This can cause bugs
    // get only gets the first item that matches the condition
    // but delete will remove all that matches the condition
    // only use this when extracting a single item
    // use filter to get multiple items
    const item = this.get(condition);
    this.delete(condition);

    return item;
  }

  /**
   * Deletes an item from the list.
   * If string is passed, condition will fall back to default 'id'
   * @param {function|string} condition - the condition
   * @returns
   */
  delete(condition) {
    this.items = this.items.filter(
      (item) => !this._reduceCondition(condition).call(null, item)
    );
    this.length = this.items.length;

    return this;
  }

  /**
   * Deletes all item in the list
   * @returns
   */
  clear() {
    this.items = [];
    this.length = 0;

    return this;
  }

  /**
   * Sort the list
   * @param {function} condition
   * @returns
   */
  sort(condition) {
    this.items.sort((a, b) => {
      if (condition(a, b)) return 1;
      return -1;
    });

    return this;
  }

  /**
   * Filter list.
   * If string is passed, condition will fall back to default 'id'
   * @param {function|string} condition
   * @returns
   */
  filter(condition) {
    return this.items.filter(this._reduceCondition(condition));
  }
}

export default List;
