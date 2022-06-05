import { html } from 'poor-man-jsx';
import { KebabMenuIcon } from '../../assets/icons';
import { getDateKeyword } from '../../utils/date';
import { createDropdown } from '../../utils/dropdown';
import Badge from '../Badge';
import GlobalTask from '../GlobalTask';

const Task = (data, showLastUpdate = false) => {
  const component = new GlobalTask(data);

  component.props.main = {
    class: `${component._className} rounded-md drop-shadow-md`,
  };

  component.template.push({
    // create own menu; copy pasted from BaseTask
    target: 'main',
    method: 'after',
    template: html`
      <div
        onMount=${(e) =>
          createDropdown(e.target.children[0], e.target.children[1])}
      >
        <button>
          ${KebabMenuIcon(
            'cursor-pointer stroke-gray-500 hover:stroke-gray-800 dark:hover:stroke-gray-300'
          )}
        </button>

        <div
          ignore="class"
          style="display: none;"
          data-dropdown-position="left"
          class="flex flex-col py-1 rounded divide-y divide-gray-500 space-y-1 text-center text-white text-sm bg-neutral-700 border border-gray-500 border-solid drop-shadow z-[99]"
        >
          <button
            class="px-2 hover:text-blue-400"
            onClick=${component.openOnLocation}
          >
            Open
          </button>
          <button
            class="px-2 hover:text-red-600"
            onClick=${() => component.deleteTask()}
          >
            Delete
          </button>
        </div>
      </div>
    `,
  });

  if (showLastUpdate) {
    component.badges.unshift(
      Badge({
        content: `Last update: ${getDateKeyword(data.lastUpdate)}`,
        bgColor: 'transparent',
        additionalCls: 'px-0 text-xs text-gray-400 dark:text-gray-300',
        props: { key: 'last-update' },
      })
    );
  }

  return component.render();
};

export default Task;
