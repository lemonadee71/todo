import IdList from './IdList';

class OrderedIdList extends IdList {
  constructor(items) {
    super(items);

    // we only need to sort on init
    // since we already have an insert method
    this._items.sort((a, b) => a.position - b.position);
    this.updatePosition();
  }

  updatePosition() {
    // update items position based on their index
    this._items.forEach((item, i) => {
      item.position = i;
    });

    return this;
  }

  add(item) {
    const result = super.add(item);
    this.updatePosition();
    return result;
  }

  insert(item, idx) {
    const result = super.insert(item, idx);
    this.updatePosition();
    return result;
  }

  extract(predicate) {
    const result = super.extract(predicate);
    this.updatePosition();
    return result;
  }

  delete(predicate) {
    const result = super.delete(predicate);
    this.updatePosition();
    return result;
  }

  move(predicate, idx) {
    const result = super.move(predicate, idx);
    this.updatePosition();
    return result;
  }
}

export default OrderedIdList;
