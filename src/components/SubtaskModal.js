import { TASK } from '../core/actions';
import BaseTaskModal from './BaseTaskModal';

export default class SubtaskModal extends BaseTaskModal {
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
}
