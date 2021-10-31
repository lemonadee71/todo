import uuid from '../../utils/id';
import IdList from './IdList';
import OrderedIdList from './OrderedIdList';

class Task {
  constructor({
    title,
    notes,
    dueDate,
    project,
    list,
    position = null,
    completed = false,
    labels = [],
    subtasks = [],
    id = `task-${uuid(8)}`,
    numId,
  }) {
    // main
    this.numId = numId;
    this.id = id;
    this.title = title || 'Unnamed Task';
    this.notes = notes || '';
    this.dueDate = dueDate || '';
    this.completed = completed;

    // location data
    this.project = project;
    this.list = list;
    this.position = position;

    this.labels = new IdList(labels);
    this.subtasks = new OrderedIdList(subtasks);
  }

  get data() {
    return {
      ...this,
      labels: this.labels.items,
      subtasks: this.subtasks.items,
    };
  }

  get link() {
    return `t/${this.id.split('-')[1]}`;
  }

  getSubtask(id) {
    return this.subtasks.get(id);
  }

  addSubtask(task) {
    task.project = this.project;
    task.list = this.list;
    return this.subtasks.add(task);
  }

  moveSubtask(id, idx) {
    return this.subtasks.move(id, idx);
  }

  insertSubtask(task, idx) {
    task.project = this.project;
    task.list = this.list;
    return this.subtasks.insert(task, idx);
  }

  extractSubtask(id) {
    return this.subtasks.extract(id);
  }

  deleteSubtask(id) {
    return this.subtasks.delete(id);
  }

  clearSubtasks() {
    return this.subtasks.clear();
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

  toggleComplete() {
    this.completed = !this.completed;

    return this.completed;
  }
}

export default Task;
