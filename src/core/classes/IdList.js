import List from './List';

class IdList extends List {
  /**
   * Provide a fallback predicate fn
   * @param {Function|string} predicate
   * @returns {Function}
   */
  $(predicate) {
    let fn = predicate;
    if (typeof predicate !== 'function') {
      fn = (item) => item.id === predicate;
    }

    return fn;
  }

  /**
   * Return the list items' ids
   */
  get ids() {
    return this.items.map((item) => item.id);
  }

  get(predicate) {
    return super.get(this.$(predicate));
  }

  getIndex(predicate) {
    return super.getIndex(this.$(predicate));
  }

  has(predicate) {
    return super.has(this.$(predicate));
  }

  extract(predicate) {
    return super.extract(this.$(predicate));
  }

  delete(predicate) {
    return super.delete(this.$(predicate));
  }

  replace(predicate) {
    return super.replace(this.$(predicate));
  }

  move(predicate, idx) {
    return super.move(this.$(predicate), idx);
  }
}

export default IdList;
