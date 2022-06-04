import { TASK } from '../../actions';
import BaseTask from '../BaseTask';

export default class Subtask extends BaseTask {
  constructor(data) {
    super(data, TASK.SUBTASKS);

    this.props = {
      main: {
        // override class to remove drop-shadow and reduce padding
        class: `${this.type} box-border flex flex-col py-1 bg-white dark:bg-[#353535]`,
        'data-parent': this.data.parent,
      },
    };
  }

  render(i, size = 'small') {
    if (size === 'small') {
      Object.assign(this.props, {
        title: { style: 'font-size: 0.875rem; line-height: 1.25rem;' },
        checkbox: { style: 'width: 1rem; height: 1rem;' },
        checkmark: { style: 'width: 0.5rem; height: 0.5rem;' },
      });
    }

    return super.render(i);
  }
}
