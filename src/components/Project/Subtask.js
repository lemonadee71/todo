import { TASK } from '../../core/actions';
import BaseTask from './BaseTask';

export default class Subtask extends BaseTask {
  constructor(data) {
    super(data, TASK.SUBTASKS);

    this.props = { main: { 'data-parent': this.data.parent } };
  }
}
