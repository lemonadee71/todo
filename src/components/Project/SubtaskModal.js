import { TASK } from '../../core/actions';
import BaseTaskModal from './BaseTaskModal';

export default class SubtaskModal extends BaseTaskModal {
  constructor(data) {
    super(data, TASK.SUBTASKS);
  }
}
