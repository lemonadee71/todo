import BaseTask from './BaseTask';
import OrderedIdList from './OrderedIdList';

export default class Task extends BaseTask {
  constructor(props) {
    super(props);

    this.subtasks = new OrderedIdList(props.subtasks);
  }

  get data() {
    return {
      ...this,
      labels: this.labels.items,
      subtasks: this.subtasks.items,
    };
  }

  get hasIncompleteRequiredSubtask() {
    return this.data.subtasks.some(
      (subtask) => subtask.required && !subtask.completed
    );
  }

  _inherit(subtask) {
    Object.assign(subtask, {
      project: this.project,
      list: this.list,
      parent: this.id,
    });
  }

  toggleComplete() {
    if (this.hasIncompleteRequiredSubtask) {
      throw new Error('Complete all required subtasks');
    }

    return super.toggleComplete();
  }

  getSubtask(id) {
    return this.subtasks.get(id);
  }

  updateSubtasks() {
    this.subtasks.items.forEach(this._inherit);

    return this;
  }

  addSubtask(task) {
    this._inherit(task);
    task.required = true;

    return this.subtasks.add(task);
  }

  insertSubtask(task, idx) {
    this._inherit(task);
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
