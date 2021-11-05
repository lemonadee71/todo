import { TASK } from '../core/actions';
import BaseTask from './BaseTask';

export default class Subtask extends BaseTask {
  constructor(data) {
    super('subtask', data, TASK.SUBTASKS);
  }

  get location() {
    return {
      project: this.data.project,
      list: this.data.list,
      task: this.data.parentTask,
      subtask: this.data.id,
    };
  }

  render(isParentComplete = false) {
    this.extraProps = {
      main: `data-parent="${this.data.parentTask}"`,
      checkbox: { disabled: isParentComplete },
    };

    return super.render();
  }
}
