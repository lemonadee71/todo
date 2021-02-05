import List from './list';

class Task {
  constructor({ title, desc, dueDate, location }) {
    this.id = `task-${Math.random()}`.replace(/0./, '');
    this.title = title || 'Unnamed Task';
    this.desc = desc || '';
    this.dueDate = dueDate || '';
    this.completed = false;
    this.location = location;
    this.labels = new List(`labels-${this.id}`, 'labels');
    this.subtasks = new List(`subtasks-${this.id}`, 'labels');
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

  get desc() {
    return this._desc;
  }

  set desc(newDesc) {
    if (typeof newDesc !== 'string') {
      throw new Error('Invalid type. Desc must be string.');
    }

    this._desc = newDesc;
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

  removeLabel(labelName) {
    this.labels.removeItems((label) => label.name === labelName);
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
