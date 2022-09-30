import { html } from 'poor-man-jsx';
import { useTask } from '../../core/hooks';
import { TASK } from '../../actions';
import { $ } from '../../utils/query';

const SubtaskModal = (data) => {
  const [subtask, unsubscribe] = useTask(...Object.values(data.location));

  return html`
    <task-modal-template
      action=${TASK.SUBTASK}
      data=${data}
      hook=${subtask}
      cleanup=${unsubscribe}
    >
      <button
        :slot="buttons"
        class="absolute top-0 left-4 text-2xl text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-300"
        aria-label="Go back"
        onClick=${() => $('#modal').pop()}
      >
        &#8249;
      </button>
    </task-modal-template>
  `;
};

export default SubtaskModal;
