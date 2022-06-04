import { html } from 'poor-man-jsx';
import TaskGlobalVariant from './TaskGlobalVariant';

const TaskSearchResult = (data, i) => {
  const component = new TaskGlobalVariant(data);

  component.props.main = {
    // override class to remove drop-shadow and border-radius
    class: `${component.type} box-border flex flex-col px-3 py-2 bg-white dark:bg-[#353535]`,
  };

  component.template.push({
    target: 'controls',
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

  return component.render(i);
};

export default TaskSearchResult;
