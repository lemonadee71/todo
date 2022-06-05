import { html } from 'poor-man-jsx';
import GlobalTask from './GlobalTask';

const TaskSearchResult = (data) => {
  const component = new GlobalTask(data);

  component.template.push({
    target: 'main',
    method: 'after',
    template: html`
      <button
        class="px-2 py-1 rounded text-white text-sm bg-sky-500 hover:bg-sky-600"
        onClick=${component.openOnLocation}
      >
        Open
      </button>
    `,
  });

  return component.render();
};

export default TaskSearchResult;
