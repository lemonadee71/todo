import { toTimestamp } from '../../utils/date';
import uuid from '../../utils/id';
import { sieve } from '../../utils/misc';
import IdList from './IdList';

class BaseTask {
  constructor({
    title,
    notes,
    dueDate,
    completed,
    id,
    createdDate,
    lastUpdate,
    completionDate,
    list,
    project,
    labels = [],
  }) {
    // meta
    this.type = 'task';
    this.id = id || uuid();
    // all integers
    this.createdDate = createdDate ?? Date.now();
    this.lastUpdate = lastUpdate || 0;
    this.completionDate = completionDate || 0;

    // props
    this.title = title || 'Unnamed Task';
    this.notes = notes || '';
    this.dueDate = dueDate || '';
    this.completed = completed ?? false;

    // location data
    this.project = project;
    this.list = list;

    this.labels = new IdList(labels);
  }

  get data() {
    return {
      ...this,
      labels: this.labels.items,
    };
  }

  get location() {
    return {
      project: this.project,
      list: this.list,
      task: this.id,
    };
  }

  set location(data) {
    this.update('project', data.project);
    this.update('list', data.list);
  }

  toFirestore() {
    return sieve({
      ...this,
      dueDate: this.dueDate && toTimestamp(this.dueDate),
      labels: this.labels.ids,
    });
  }

  toJSON() {
    return {
      ...this,
      labels: this.labels.ids,
    };
  }

  update(prop, value) {
    if (prop === 'completed') this.toggleComplete();
    else this[prop] = value;

    this.lastUpdate = Date.now();

    return this;
  }

  toggleComplete() {
    this.completed = !this.completed;
    this.completionDate = this.completed ? Date.now() : null;

    return this.completed;
  }

  getLabels() {
    return this.labels.ids;
  }

  addLabel(label) {
    if (this.labels.has(label.id)) return this;
    this.lastUpdate = Date.now();

    return this.labels.add(label);
  }

  removeLabel(id) {
    this.lastUpdate = Date.now();
    return this.labels.delete(id);
  }

  clearLabels() {
    this.lastUpdate = Date.now();
    return this.labels.clear();
  }
}

export default BaseTask;
