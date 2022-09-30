import { html } from 'poor-man-jsx';
import { getDateKeyword } from '../../utils/date';

const Task = (data, showLastUpdate = false) => {
  const template = {
    main: { 'class:[rounded-md,drop-shadow-md,group]': true },
  };

  const badges = [
    showLastUpdate &&
      html`
        <common-badge
          class="px-0 text-xs text-gray-400 dark:text-gray-300"
          background="transparent"
          props=${{ _key: 'last-update' }}
        >
          Last update: ${getDateKeyword(data.lastUpdate)}
        </common-badge>
      `,
  ];

  return html`
    <global-task data=${data} badges=${badges} template=${template} />
  `;
};

export default Task;
