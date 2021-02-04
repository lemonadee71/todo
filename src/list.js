class List {
  constructor(name, type, defaultItems = []) {
    this.items = [...defaultItems];
    this.length = this.items.length || 0;
    this.type = type;
    this.name = name;
    this.id = `list-${Math.random()}`.replace(/0./, '');
  }

  getItem(condition) {
    return this.items.find(condition);
  }

  addItem(item) {
    if (Array.isArray(item)) {
      this.items.push(...item);
    } else {
      this.items.push(item);
    }
    this.length = this.items.length;
  }

  extractItem(condition) {
    let item = this.getItem(condition);
    this.removeItems(condition);

    return item;
  }

  removeItems(condition) {
    this.items = this.items.filter((item) => !condition(item));
    this.length = this.items.length;
  }

  removeAll() {
    this.items = [];
    this.length = 0;
  }

  sortItems(condition) {
    this.items.sort((a, b) => {
      if (condition(a, b)) return 1;
      return -1;
    });
  }

  filterItems(condition) {
    return this.items.filter(condition);
  }
}

export default List;
