import uuid from '../../utils/id';
import List from './List';

export default class Project {
  constructor({
    name,
    id,
    totalTasks,
    labels = [],
    lists = [new List({ name: 'default', id: 'default' })],
  }) {
    this.name = name;
    this.id = id || `project-${uuid(8)}`;
    this.labels = new List({ name, id: this.id, defaultItems: labels });
    this.lists = new List({ name, id: this.id, defaultItems: lists });
    this.totalTasks = totalTasks || 0;
  }

  get link() {
    return `p/${this.id.split('-')[1]}`;
  }

  getLabel(labelFilter) {
    return this.labels.get(labelFilter);
  }

  getList(listFilter) {
    return this.lists.get(listFilter);
  }
}
