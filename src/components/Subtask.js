import { html } from 'poor-man-jsx';
import { TASK } from '../core/actions';
import BaseTask from './BaseTask';

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

  render(isParentComplete = false) {
    this.checkboxComponent = html`
      <input
        class="task__checkbox"
        type="checkbox"
        name="mark-as-done"
        ${{
          // disable checking task if parent is complete
          disabled: isParentComplete,
          checked: this.data.completed,
          onClick: this.toggleComplete.bind(this),
        }}
      />
    `;

    return super.render();
  }
}
