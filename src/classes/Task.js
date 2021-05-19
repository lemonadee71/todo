import List from './List';

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
    this.id = id || `task-${Math.random()}`.replace(/0./, '');
    this.title = title || 'Unnamed Task';
    this.notes = notes || '';
    this.dueDate = dueDate || '';
    this.completed = completed || false;
    this.location = location;
    this._labels = new List({
      name: `labels-${this.id}`,
      defaultItems: labels,
    });
    this.position = 0;
    this.group = null;
    this._subtasks = new List({
      name: `subtasks-${this.id}`,
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
      labels: this.labels,
      subtask: this.subtasks,
    };
  }

  get subtasks() {
    return [...this._subtasks.items];
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

  get labels() {
    return [...this._labels.items];
  }

  addLabel(newLabel) {
    if (this._labels.has((label) => label.id === newLabel.id)) {
      throw new Error(`Label (${newLabel.id}) is already added.`);
    }

    this._labels.add(newLabel);
  }

  removeLabel(id) {
    this._labels.delete((label) => label.id === id);
  }

  removeLabels() {
    this._labels.clear();
  }

  toggleComplete() {
    this.completed = !this.completed;

    return this.completed;
  }
}

export default Task;
