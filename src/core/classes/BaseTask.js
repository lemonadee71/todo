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
    numId,
    createdDate,
    list,
    project,
    position = null,
    labels = [],
  }) {
    // meta
    this.type = 'task';
    this.numId = numId;
    this.id = id || uuid();
    this.createdDate = createdDate ?? Date.now();

    // props
    this.title = title || 'Unnamed Task';
    this.notes = notes || '';
    this.dueDate = dueDate || '';
    this.completed = completed ?? false;

    // location data
    this.project = project;
    this.list = list;
    this.position = position;

    this.labels = new IdList(labels);
  }

  get data() {
    return {
      ...this,
      labels: this.labels.items,
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
