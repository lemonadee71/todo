import { html } from 'poor-man-jsx';
import { TASK } from '../../actions';
import { $ } from '../../utils/query';
import BaseTaskModal from './BaseTaskModal';

export default class SubtaskModal extends BaseTaskModal {
  constructor(data) {
    super(data, TASK.SUBTASKS);

    this.template.push({
      target: 'buttons',
      method: 'prepend',
      template: html`
        <button
          class="absolute top-0 left-4 text-2xl text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-300"
          aria-label="Go back"
          onClick=${() => $('#modal').pop()}
        >
          &#8249;
        </button>
      `,
    });
  }
}
