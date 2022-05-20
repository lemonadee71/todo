import { formatToDateTime, toTimestamp } from '../../utils/date';
import { converter } from '../../utils/firestore';
import { copy, filterById, orderById } from '../../utils/misc';
import BaseTask from './BaseTask';
import IdList from './IdList';

export default class Task extends BaseTask {
  constructor(props) {
    super(props);

    this.subtasks = new IdList(props.subtasks);

    this.__initialSubtasksOrder = props.__initialSubtasksOrder ?? [];
  }

  static converter(source = {}) {
    return converter(Task, (data) => ({
      ...data,
      dueDate: data.dueDate && formatToDateTime(new Date(data.dueDate)),
      labels: filterById(source.labels || [], data.labels || []),
      subtasks: orderById(
        (source.subtasks || []).filter((subtask) => subtask.parent === data.id),
        data.subtasks || []
      ),
      __initialSubtasksOrder: data.subtasks,
    }));
  }

  toFirestore() {
    return {
      ...copy(this, ['subtasks', '__initialSubtasksOrder']),
      dueDate: this.dueDate && toTimestamp(this.dueDate),
      labels: this.labels.ids,
      subtasks: this.subtasks.ids,
    };
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

  _adopt(subtask) {
    subtask.project = this.project;
    subtask.list = this.list;
    subtask.parent = this.id;
  }

  getSubtask(id) {
    return this.subtasks.get(id);
  }

  updateSubtasks() {
    this.subtasks.items.forEach(this._adopt.bind(this));

    return this;
  }

  addSubtask(subtask) {
    this._adopt(subtask);
    subtask.required = true;

    return this.subtasks.add(subtask);
  }

  insertSubtask(subtask, idx) {
    this._adopt(subtask);
    subtask.required = true;

    return this.subtasks.insert(subtask, idx);
  }

  moveSubtask(id, idx) {
    return this.subtasks.move(id, idx);
  }

  extractSubtask(id) {
    return this.subtasks.extract(id);
  }

  deleteSubtask(id) {
    return this.subtasks.delete(id);
  }

  clearSubtasks() {
    return this.subtasks.clear();
  }
}
