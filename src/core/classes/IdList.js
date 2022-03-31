import List from './List';

class IdList extends List {
  constructor(items) {
    super(items);
    this.__defaultPredicate = (value) => (item) => item.id === value;
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

  getIndex(predicate) {
    return super.getIndex(this._createPredicate(predicate));
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

  replace(predicate) {
    return super.replace(this._createPredicate(predicate));
  }

  move(predicate, idx) {
    return super.move(this._createPredicate(predicate), idx);
  }
}

export default IdList;
