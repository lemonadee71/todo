import { html } from 'poor-man-jsx';
import { TASK } from '../../actions';
import { DEFAULT_COLORS } from '../../constants';
import Core from '../../core';
import { getDateKeyword } from '../../utils/date';
import Badge from '../Project/Badge';
import BaseTask from '../Project/BaseTask';

const Task = (data, i, showLastUpdate = false) => {
  const project = Core.main.getProject(data.project);
  const component = new BaseTask(data, TASK);

  const openOnLocation = () => {
    Core.router.navigate(`app/${project.link}`, { title: project.name });
    component.editTask();
  };

  component.props.checkbox = {
    style: 'display: none;',
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
      target: 'menu',
      method: 'prepend',
      template: html`
        <button class="hover:text-blue-400" onClick=${openOnLocation}>
          Open
        </button>
      `,
    }
  );

  if (data.totalSubtasks) {
    component.badges.push(
      Badge({
        content: `${data.incompleteSubtasks} / ${data.totalSubtasks}`,
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
