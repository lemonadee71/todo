import { v4 as uuidv4 } from 'uuid';

class Task {
  constructor({ title, desc, dueDate }) {
    this.title = title || 'Unnamed Task';
    this.desc = desc || '';
    this.dueDate = dueDate || '';
    this.completed = false;
    this.labels = [];
    this.subtasks = [];
    this.id = uuidv4();
  }

  /**
   * @param {string} newTitle
   */
  set title(newTitle) {
    if (typeof newTitle !== 'string') {
      throw new Error('Invalid type. Title must be string.');
    }

    this.title = newTitle;
  }

  /**
   * @param {string} newDesc
   */
  set desc(newDesc) {
    if (typeof newDesc !== 'string') {
      throw new Error('Invalid type. Desc must be string.');
    }

    this.desc = newDesc;
  }

  get dueDate() {
    let [year, month, day] = this.dueDate.split('-');
    month = +month - 1;

    return new Date(year, month, day);
  }

  set dueDate(newDueDate) {
    if (typeof newDueDate !== 'string') {
      throw new Error('Invalid type. dueDate must be string.');
    }

    this.dueDate = newDueDate;
  }

  get labels() {
    return [...this.labels];
  }

  set labels(label) {
    throw new Error('Invalid. Use addLabel to add a label.');
  }

  get subtasks() {
    return [...this.subtasks];
  }

  set subtasks(subtask) {
    throw new Error('Invalid. Use addSubtask to add a subtask.');
  }

  getData() {
    return {
      ...this,
    };
  }

  addSubtask(task) {
    this.subtasks.push(task);
  }

  removeSubtask(id) {
    this.subtasks = this.subtasks.filter(
      (subtask) => subtask.id !== id
    );
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
