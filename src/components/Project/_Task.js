import Sortable from 'sortablejs';
import { createHook, html } from 'poor-man-jsx';
import { DEFAULT_COLORS } from '../../constants';
import { TASK } from '../../actions';
import Core from '../../core';
import Subtask from './Subtask';

const Task = (data, idx) => {
  const state = createHook({ showSubtasks: !data.totalSubtasks });
  const badges = [];

  const transferSubtask = (action, fromTask, fromList, subtaskId, position) => {
    Core.event.emit(action, {
      project: data.project,
      list: { to: data.list, from: fromList },
      task: { to: data.id, from: fromTask },
      subtask: subtaskId,
      type: 'task',
      data: { position },
    });
  };

  const moveSubtask = (id, position) => {
    Core.event.emit(TASK.SUBTASKS.MOVE, {
      ...data.location,
      subtask: id,
      data: { position },
    });
  };

  const initSubtasks = (evt) => {
    Sortable.create(evt.target, {
      group: 'tasks',
      animation: 150,
      // delay: 10,
      draggable: '.subtask',
      filter: 'input,button',
      emptyInsertThreshold: 10,
      onUpdate: (e) => moveSubtask(e.item.dataset.id, e.newIndex),
      onAdd: (e) => {
        const { id, location } = e.item.dataset;
        const [, fromList, taskId, subtaskId] = location.split('-');
        // if there's subtaskId, it's a subtask
        const fromTask = subtaskId ? taskId : id;
        const action = subtaskId ? TASK.SUBTASKS.TRANSFER : TASK.TRANSFER;

        transferSubtask(action, fromTask, fromList, id, e.newIndex);
      },
    });
  };

  if (data.totalSubtasks) {
    badges.push(
      html`
        <common-badge
          background=${DEFAULT_COLORS.gray}
          props=${{
            _key: 'subtasks',
            'aria-pressed': state.$showSubtasks,
            'aria-label': 'Show subtasks',
            'data-tooltip': '$aria-label',
          }}
        >
          ${data.incompleteSubtasks} / ${data.totalSubtasks}
        </common-badge>
      `
    );
  }

  const template = {
    main: {
      'class:[px-3,py-2]': true,
      'class:[rounded-md,drop-shadow-lg]': true,
      sortable: {
        action: TASK.MOVE,
        style: { transform: 'rotate(1deg)' },
        getData: () => data.location,
      },
    },
    title: {
      'class:text-base': true,
    },
    checkbox: {
      'class:[w-5,h-5]': true,
    },
    checkmark: {
      'class:[w-3,h-3]': true,
    },
    badges: {
      onClick: (e) => {
        // use event delegation
        if (e.target.getAttribute('key') === 'subtasks') {
          state.showSubtasks = !state.showSubtasks;
        }
      },
    },
  };

  return html`
    <base-task
      data=${data}
      action=${TASK}
      badges=${badges}
      position=${idx}
      template=${template}
    >
      <div :skip="style" :show=${state.$showSubtasks} class="mt-0.5">
        <div class="space-y-1" onMount=${initSubtasks}>
          ${data.subtasks.items
            .filter((subtask) => !subtask.completed)
            .map((item, i) => Subtask(item, i, 'small'))}
        </div>
        <div class="space-y-1">
          ${data.subtasks.items
            .filter((subtask) => subtask.completed)
            .sort((a, b) => b.completionDate - a.completionDate)
            .map((item, i) => Subtask(item, i, 'small'))}
        </div>
      </div>
    </base-task>
  `;
};

export default Task;
