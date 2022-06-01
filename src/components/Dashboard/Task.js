import { html } from 'poor-man-jsx';
import { TASK } from '../../actions';
import { KebabMenuIcon, SubtasksIcon } from '../../assets/icons';
import { DEFAULT_COLORS } from '../../constants';
import Core from '../../core';
import { isGuest } from '../../utils/auth';
import { getDateKeyword } from '../../utils/date';
import Badge from '../Project/Badge';
import BaseTask from '../Project/BaseTask';

const Task = (data, i, showLastUpdate = false) => {
  const project = Core.data.root.get(data.project);
  const component = new BaseTask(data, TASK);

  const openOnLocation = () => {
    Core.data.queue.push(component.location);
    Core.router.navigate(`app/${project.link}`, { title: project.name });
  };

  component.props = {
    checkbox: {
      style: 'display: none;',
    },
    // to avoid clutter and additional reads for online mode
    labels: {
      style: 'display: none;',
    },
    menu: {
      style: 'display: none;',
    },
  };

  component.template.push(
    {
      target: 'checkbox',
      method: 'before',
      template: html`<div
        class="self-stretch w-1"
        style="background-color: ${project.color};"
      ></div>`,
    },
    {
      // create own menu; copy-pasted from BaseTask
      // to avoid errors created by manually deleting the elements
      target: 'controls',
      method: 'after',
      template: html`
        <div onMount=${component.initMenu}>
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
            <button class="px-2 hover:text-blue-400" onClick=${openOnLocation}>
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
    }
  );

  // to avoid fetching just to show how many subtasks there are
  const hasSubtasks = isGuest()
    ? data.totalSubtasks
    : data.__initialSubtasksOrder.length;

  if (data.totalSubtasks && hasSubtasks) {
    component.badges.push(
      Badge({
        content: SubtasksIcon('stroke-white', 16, 1.75),
        bgColor: DEFAULT_COLORS[9],
        props: {
          key: 'subtasks',
          'data-tooltip': 'This task has subtasks',
        },
      })
    );
  }

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

  return component.render(i);
};

export default Task;
