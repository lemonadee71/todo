import { toTimestamp } from '../../utils/date';
import uuid from '../../utils/id';
import IdList from './IdList';

class BaseTask {
  constructor({
    title,
    notes,
    dueDate,
    completed,
    id,
    createdDate,
    completionDate,
    list,
    project,
    labels = [],
  }) {
    // meta
    this.type = 'task';
    this.id = id || uuid();
    this.createdDate = createdDate ?? Date.now();
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

  toFirestore() {
    return {
      ...this,
      dueDate: this.dueDate && toTimestamp(this.dueDate),
      labels: this.labels.items.map((label) => label.id),
    };
  }

  toggleComplete() {
    this.completed = !this.completed;
    this.completionDate = this.completed ? Date.now() : 0;

    return this.completed;
  }

  getLabels() {
    return this.labels.items.map((label) => label.id);
  }

  addLabel(label) {
    if (this.labels.has(label.id)) {
      throw new Error(`Label (${label.id}) is already added.`);
    }

    return this.labels.add(label);
  }

  removeLabel(id) {
    return this.labels.delete(id);
  }

  clearLabels() {
    return this.labels.clear();
  }
}

export default BaseTask;
