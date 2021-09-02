import uuid from '../../utils/id';
import List from './List';

export default class Project {
  constructor({ name, id, labels = [], lists = [] }) {
    this.name = name;
    this.id = id || `project-${uuid(8)}`;
    this.labels = new List({ name, id: this.id, defaultItems: labels });
    this.lists = new List({ name, id: this.id, defaultItems: lists });
  }

  getLabel(labelFilter) {
    return this.labels.get(labelFilter);
  }

  getList(listFilter) {
    return this.lists.get(listFilter);
  }
}
