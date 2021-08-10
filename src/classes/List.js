class List {
  constructor({ name, defaultItems = [], id = null }) {
    this._items = [...defaultItems];
    this.length = this._items.length || 0;
    this.name = name;
    this.id = id || `list-${Math.random()}`.replace(/0./, '');
  }

  get items() {
    return [...this._items];
  }

  get(condition) {
    return this._items.find(condition);
  }

  has(condition) {
    return !!this.get(condition);
  }

  add(item) {
    if (Array.isArray(item)) {
      this._items.push(...item);
    } else {
      this._items.push(item);
    }
    this.length = this._items.length;

    return this;
  }

  // This can cause bugs
  // get only gets the first item that matches the condition
  // but delete will remove all that matches the condition
  // only use this when extracting a single item
  // use filter to get multiple items
  extract(condition) {
    const item = this.get(condition);
    this.delete(condition);

    return item;
  }

  delete(condition) {
    this._items = this._items.filter((item) => !condition(item));
    this.length = this._items.length;

    return this;
  }

  clear() {
    this._items = [];
    this.length = 0;

    return this;
  }

  sort(condition) {
    this._items.sort((a, b) => {
      if (condition(a, b)) return 1;
      return -1;
    });

    return this.items;
  }

  filter(condition) {
    return this._items.filter(condition);
  }
}

export default List;
