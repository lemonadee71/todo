import { formatToDateTime, toTimestamp } from '../../utils/date';
import { converter } from '../../utils/firestore';
import { copy, intersectAndSortById } from '../../utils/misc';
import BaseTask from './BaseTask';
import IdList from './IdList';

export default class Task extends BaseTask {
  constructor(props) {
    super(props);

    this.subtasks = new IdList(props.subtasks);

    this.$$order = props.$$order ?? [];
  }

  get data() {
    return {
      ...this,
      labels: this.labels.items,
      subtasks: this.subtasks.items,
    };
  }

  get totalSubtasks() {
    return this.subtasks.length;
  }

  get incompleteSubtasks() {
    return this.subtasks.items.filter((subtask) => subtask.completed).length;
  }

  static converter(source = {}) {
    return converter(Task, (data) => ({
      ...data,
      dueDate: data.dueDate && formatToDateTime(new Date(data.dueDate)),
      labels: intersectAndSortById(source.labels || [], data.labels || []),
      subtasks: intersectAndSortById(
        source.subtasks || [],
        data.subtasks || []
      ),
      $$order: data.subtasks,
    }));
  }

  toFirestore() {
    return {
      ...copy(this, ['subtasks', '$$order']),
      dueDate: this.dueDate && toTimestamp(this.dueDate),
      labels: this.labels.ids,
      subtasks: this.subtasks.ids,
    };
  }

  toJSON() {
    return {
      ...copy(this, ['subtasks', '$$order']),
      labels: this.labels.ids,
      subtasks: this.subtasks.ids,
    };
  }

  _adopt(subtask) {
    subtask.location = {
      project: this.project,
      list: this.list,
      task: this.id,
    };
  }

  getSubtask(id) {
    return this.subtasks.get(id);
  }

  updateSubtasks() {
    this.subtasks.items.forEach(this._adopt.bind(this));
    this.lastUpdate = Date.now();

    return this;
  }

  addSubtask(subtask) {
    this._adopt(subtask);
    this.lastUpdate = Date.now();

    return this.subtasks.add(subtask);
  }

  insertSubtask(subtask, idx) {
    this._adopt(subtask);
    this.lastUpdate = Date.now();

    return this.subtasks.insert(subtask, idx);
  }

  moveSubtask(id, idx) {
    this.lastUpdate = Date.now();

    return this.subtasks.move(id, idx);
  }

  extractSubtask(id) {
    this.lastUpdate = Date.now();

    return this.subtasks.extract(id);
  }

  deleteSubtask(id) {
    this.lastUpdate = Date.now();

    return this.subtasks.delete(id);
  }

  clearSubtasks() {
    this.lastUpdate = Date.now();

    return this.subtasks.clear();
  }
}
