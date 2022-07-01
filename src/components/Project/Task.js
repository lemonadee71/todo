import Sortable from 'sortablejs';
import { createHook, html } from 'poor-man-jsx';
import { DEFAULT_COLORS } from '../../constants';
import { TASK } from '../../actions';
import Core from '../../core';
import Subtask from './Subtask';
import Badge from '../Badge';
import BaseTask from './BaseTask';

const Task = (data, idx) => {
  const [state, revoke] = createHook({ showSubtasks: !data.totalSubtasks });
  const component = new BaseTask(data, TASK);
  component.ondestroy.push(revoke);

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
        const [, fromList, taskId, subtaskId] = location.split(',');
        // if there's subtaskId, it's a subtask
        const fromTask = subtaskId ? taskId : id;
        const action = subtaskId ? TASK.SUBTASKS.TRANSFER : TASK.TRANSFER;

        transferSubtask(action, fromTask, fromList, id, e.newIndex);
      },
    });
  };

  component.props = {
    ...component.props,
    main: {
      ...component.props.main,
      class: `${component.props.main.class} rounded-md drop-shadow-lg`,
      'data-sortable-style': 'transform: rotate(1deg);',
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

  if (data.totalSubtasks) {
    // TODO: Make this more accessible; should be read as toggle button
    component.badges.push(
      Badge({
        content: `${data.incompleteSubtasks} / ${data.totalSubtasks}`,
        bgColor: DEFAULT_COLORS.gray,
        props: {
          key: 'subtasks',
          'aria-label': `Completed ${data.incompleteSubtasks} out of ${data.totalSubtasks} subtasks`,
          'data-tooltip': 'This task has subtasks',
        },
      })
    );
  }

  component.template.push({
    target: 'body',
    method: 'after',
    template: html`
      <div
        ignore="style"
        data-name="task__subtasks"
        style_display=${state.$showSubtasks((value) =>
          value ? 'block' : 'none'
        )}
      >
        <div is-list class="space-y-1" onMount=${initSubtasks}>
          ${data.subtasks.items
            .filter((subtask) => !subtask.completed)
            .map((item, i) => Subtask(item, i, 'small'))}
        </div>
        <div is-list class="space-y-1">
          ${data.subtasks.items
            .filter((subtask) => subtask.completed)
            .sort((a, b) => b.completionDate - a.completionDate)
            .map((item, i) => Subtask(item, i, 'small'))}
        </div>
      </div>
    `,
  });

  return component.render(idx);
};

export default Task;
