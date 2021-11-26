import { TASK } from '../../core/actions';
import BaseTask from './BaseTask';

export default class Subtask extends BaseTask {
  constructor(data) {
    super(data, TASK.SUBTASKS);
  }

  get location() {
    return {
      project: this.data.project,
      list: this.data.list,
      task: this.data.parent,
      subtask: this.data.id,
    };
  }

  render(isParentComplete = false) {
    this.props = {
      main: { 'data-parent': this.data.parent },
      checkbox: { disabled: isParentComplete },
    };

    return super.render();
  }
}
