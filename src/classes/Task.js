import List from './List';
import uuid from '../helpers/id';

class Task {
  constructor({
    title,
    notes,
    dueDate,
    location,
    completed,
    labels = [],
    subtasks = [],
    id = null,
  }) {
    this.id = id || `task-${uuid(10)}`;
    this.title = title || 'Unnamed Task';
    this.notes = notes || '';
    this.dueDate = dueDate || '';
    this.completed = completed || false;
    this.location = location;
    this.position = 0;
    this.group = null;
    this.labels = new List({
      name: `labels-${this.id}`,
      defaultItems: labels,
    });
    this.subtasks = new List({
      name: `sub${this.id}`,
      defaultItems: subtasks,
    });
  }

  get data() {
    return {
      id: this.id,
      title: this.title,
      notes: this.notes,
      dueDate: this.dueDate,
      completed: this.completed,
      location: this.location,
      labels: this.labels.items,
      subtask: this.subtasks,
    };
  }

  addSubtask(task) {
    this._subtasks.add(task);
  }

  removeSubtask(id) {
    this._subtasks.delete((subtask) => subtask.id === id);
  }

  removeAllSubtasks() {
    this._subtasks.clear();
  }

  addLabel(newLabel) {
    if (this.labels.has((label) => label.id === newLabel.id)) {
      throw new Error(`Label (${newLabel.id}) is already added.`);
    }

    this.labels.add(newLabel);
  }

  removeLabel(id) {
    this.labels.delete((label) => label.id === id);
  }

  removeLabels() {
    this.labels.clear();
  }

  toggleComplete() {
    this.completed = !this.completed;

    return this.completed;
  }
}

export default Task;
