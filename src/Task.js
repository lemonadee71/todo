import { v4 as uuidv4 } from 'uuid';

class Task {
  constructor({ title, desc, dueDate, location }) {
    this.title = title || 'Unnamed Task';
    this.desc = desc || '';
    this.dueDate = dueDate || '';
    this.completed = false;
    this.location = location;
    this.labels = [];
    this.subtasks = [];
    this.id = uuidv4();
  }

  /**
   * @param {string} newTitle
   */
  get title() {
    return this._title;
  }

  set title(newTitle) {
    if (typeof newTitle !== 'string') {
      throw new Error('Invalid type. Title must be string.');
    }

    this._title = newTitle;
  }

  /**
   * @param {string} newDesc
   */
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
  //   return [...this.labels];
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

  addSubtask(task) {
    this.subtasks.push(task);
  }

  removeSubtask(id) {
    this.subtasks = this.subtasks.filter((subtask) => subtask.id !== id);
  }

  removeAllSubtasks() {
    this.subtasks = [];
  }

  addLabel(label) {
    this.label.push(label);
  }

  removeLabels() {
    this.labels = [];
  }

  toggleComplete() {
    this.completed = !this.completed;

    return this.completed;
  }
}

export default Task;
