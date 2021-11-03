import { TASK } from '../core/actions';
import BaseTask from './BaseTask';

export default class Subtask extends BaseTask {
  constructor(data) {
    super('subtask', data, TASK.SUBTASKS);

    // override location
    this.location = {
      project: this.data.project,
      list: this.data.list,
      task: this.data.parentTask,
      subtask: this.data.id,
    };

    this.extraProps = `data-parent="${this.data.parentTask}"`;
  }
}
