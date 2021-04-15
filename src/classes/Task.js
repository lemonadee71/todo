import List from './List';

class Task {
  constructor({
    title,
    notes,
    dueDate,
    location,
    completed,
    labels = [],
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
    // this.subtasks = new List(`subtasks-${this.id}`);
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
    };
  }

  // addSubtask(task) {
  //   this.subtasks.push(task);
  // }

  // removeSubtask(id) {
  //   this.subtasks = this.subtasks.filter((subtask) => subtask.id !== id);
  // }

  // removeAllSubtasks() {
  //   this.subtasks = [];
  // }

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
