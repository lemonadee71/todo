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
    this.labels = new List({ name: `labels-${this.id}`, defaultItems: labels });
    // this.subtasks = new List(`subtasks-${this.id}`);
  }

  getData() {
    return {
      ...this,
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

  getLabels() {
    return [...this.labels.items];
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
