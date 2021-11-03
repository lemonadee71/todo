import { TASK } from '../core/actions';
import { $ } from '../utils/query';
import BaseTask from './BaseTask';
import SubtaskModal from './SubtaskModal';

export default class Subtask extends BaseTask {
  constructor(data) {
    super('subtask', data, TASK.SUBTASKS);

    this.extraProps = `data-parent="${this.data.parentTask}"`;
  }

  get location() {
    return {
      project: this.data.project,
      list: this.data.list,
      task: this.data.parentTask,
      subtask: this.data.id,
    };
  }

  editTask = () => {
    $('#main-modal').changeContent(
      new SubtaskModal(this.data).render(),
      'task-modal'
    );
  };
}
