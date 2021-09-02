import List from './List';
import uuid from '../../utils/id';

class Task {
  constructor({
    title,
    notes,
    dueDate,
    project,
    list,
    position = 0,
    completed = false,
    labels = [],
    subtasks = [],
    id = `task-${uuid(8)}`,
  }) {
    // main
    this.id = id;
    this.title = title || 'Unnamed Task';
    this.notes = notes || '';
    this.dueDate = dueDate || '';
    this.completed = completed;

    // location data
    this.project = project;
    this.list = list;
    this.position = position;

    this.labels = new List({
      id: this.id,
      name: this.id,
      defaultItems: labels,
    });
    this.subtasks = new List({
      id: this.id,
      name: this.id,
      defaultItems: subtasks,
    });
  }

  get data() {
    return {
      ...this,
      labels: this.labels.items,
      subtasks: this.subtasks.items,
    };
  }

  addSubtask(task) {
    this.subtasks.add(task).sort((a, b) => a.position > b.position);
  }

  deleteSubtask(id) {
    this.subtasks.delete(id).sort((a, b) => a.position > b.position);
  }

  clearSubtask() {
    this.subtasks.clear();
  }

  addLabel(label) {
    if (this.labels.has(label.id)) {
      throw new Error(`Label (${label.id}) is already added.`);
    }

    this.labels.add(label);
  }

  removeLabel(id) {
    this.labels.delete(id);
  }

  clearLabel() {
    this.labels.clear();
  }

  toggleComplete() {
    this.completed = !this.completed;

    return this.completed;
  }
}

export default Task;
