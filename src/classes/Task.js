import List from './List';

class Task {
  constructor({ title, notes, dueDate, location, labels = [] }) {
    this.id = `task-${Math.random()}`.replace(/0./, '');
    this.title = title || 'Unnamed Task';
    this.notes = notes || '';
    this.dueDate = dueDate || '';
    this.completed = false;
    this.location = location;
    this.labels = new List(`labels-${this.id}`, labels);
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

  addLabel(label) {
    this.labels.addItem(label);
  }

  removeLabel(id) {
    this.labels.removeItems((label) => label.id === id);
  }

  removeLabels() {
    this.labels.removeAll();
  }

  toggleComplete() {
    this.completed = !this.completed;

    return this.completed;
  }
}

export default Task;
