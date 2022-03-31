import { formatToDateTime, toTimestamp } from '../../utils/date';
import { converter } from '../../utils/firestore';
import { copy, filterById, orderById } from '../../utils/misc';
import BaseTask from './BaseTask';
import IdList from './IdList';

export default class Task extends BaseTask {
  constructor(props) {
    super(props);

    this.subtasks = new IdList(props.subtasks);
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
    }));
  }

  toFirestore() {
    return {
      ...copy(this, ['subtasks']),
      dueDate: this.dueDate && toTimestamp(this.dueDate),
      labels: this.labels.items.map((label) => label.id),
      subtasks: this.subtasks.items.map((item) => item.id),
    };
  }

  get data() {
    return {
      ...this,
      labels: this.labels.items,
      subtasks: this.subtasks.items,
    };
  }

  getSubtask(id) {
    return this.subtasks.get(id);
  }

  updateSubtasks() {
    this.subtasks.items.forEach((subtask) => {
      subtask.project = this.project;
      subtask.list = this.list;
      subtask.parent = this.id;
    });

    return this;
  }

  addSubtask(task) {
    task.project = this.project;
    task.list = this.list;
    task.parent = this.id;
    task.required = true;

    return this.subtasks.add(task);
  }

  insertSubtask(task, idx) {
    task.project = this.project;
    task.list = this.list;
    task.parent = this.id;
    task.required = true;

    return this.subtasks.insert(task, idx);
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
