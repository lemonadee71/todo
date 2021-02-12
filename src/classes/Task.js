import List from './List';

class Task {
  constructor({ title, notes, dueDate, location }) {
    this.id = `task-${Math.random()}`.replace(/0./, '');
    this.title = title || 'Unnamed Task';
    this.notes = notes || '';
    this.dueDate = dueDate || '';
    this.completed = false;
    this.location = location;
    this.labels = new List(`labels-${this.id}`, 'labels');
    // this.subtasks = new List(`subtasks-${this.id}`, 'labels');
  }

  get title() {
    return this._title;
  }

  set title(newTitle) {
    if (typeof newTitle !== 'string') {
      throw new Error('Invalid type. Title must be string.');
    }

    this._title = newTitle;
  }

  get notes() {
    return this._notes;
  }

  set notes(str) {
    if (typeof str !== 'string') {
      throw new Error('Invalid type. Notes must be string.');
    }

    this._notes = str;
  }

  get dueDate() {
    if (this._dueDate) {
      let [year, month, day] = this._dueDate.split('-');
      month = +month - 1;

      return new Date(year, month, day);
    }

    return null;
  }

  set dueDate(newDueDate) {
    if (typeof newDueDate !== 'string') {
      throw new Error('Invalid type. dueDate must be string.');
    }

    this._dueDate = newDueDate;
  }

  // get labels() {
  //   return [...this._labels.items];
  // }

  // set labels(label) {
  //   throw new Error('Invalid. Use addLabel to add a label.');
  // }

  // get subtasks() {
  //   return [...this.subtasks];
  // }

  // set subtasks(subtask) {
  //   throw new Error('Invalid. Use addSubtask to add a subtask.');
  // }

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
    console.log('Removing label from task...');
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
