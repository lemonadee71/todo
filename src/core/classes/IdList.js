import List from './List';

class IdList extends List {
  constructor(items, defaultProp = 'id') {
    super(items);
    this.identifier = defaultProp;
    this.__defaultPredicate = (value) => (item) =>
      item[this.identifier] === value;
  }

  _createPredicate(predicate) {
    let fn = predicate;
    if (typeof predicate !== 'function') {
      fn = this.__defaultPredicate(predicate);
    }

    return fn;
  }

  get(predicate) {
    return super.get(this._createPredicate(predicate));
  }

  has(predicate) {
    return super.has(this._createPredicate(predicate));
  }

  extract(predicate) {
    return super.extract(this._createPredicate(predicate));
  }

  delete(predicate) {
    return super.delete(this._createPredicate(predicate));
  }

  move(predicate, idx) {
    return super.move(this._createPredicate(predicate), idx);
  }
}

export default IdList;
