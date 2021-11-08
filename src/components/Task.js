import Sortable from 'sortablejs';
import { html, render } from 'poor-man-jsx';
import { DEFAULT_COLORS } from '../core/constants';
import { TASK } from '../core/actions';
import Core from '../core';
import BaseTask from './BaseTask';
import Subtask from './Subtask';
import { $ } from '../utils/query';
import uuid from '../utils/id';

export default class Task extends BaseTask {
  constructor(data) {
    super('task', data, TASK);

    this._subtasksId = uuid();
  }

  transferSubtask = (action, fromTask, fromList, subtaskId, position) => {
    Core.event.emit(action, {
      project: this.data.project,
      list: { to: this.data.list, from: fromList },
      task: { to: this.data.id, from: fromTask },
      subtask: subtaskId,
      type: 'task',
      data: { position },
    });
  };

  moveSubtask = (id, position) => {
    Core.event.emit(TASK.SUBTASKS.MOVE, {
      ...this.location,
      subtask: id,
      data: { position },
    });
  };

  initSubtasks = (evt) => {
    Sortable.create(evt.target, {
      group: 'tasks',
      animation: 150,
      delay: 10,
      draggable: '.subtask',
      filter: 'input,button',
      onUpdate: (e) => this.moveSubtask(e.item.dataset.id, e.newIndex),
      onAdd: (e) => {
        const isSubtask = !!e.item.dataset.parent;
        const fromTask = e.item.dataset.parent || e.item.dataset.id;
        const fromList = e.item.dataset.list;
        const action = isSubtask ? TASK.SUBTASKS.TRANSFER : TASK.TRANSFER;

        this.transferSubtask(
          action,
          fromTask,
          fromList,
          e.item.dataset.id,
          e.newIndex
        );
      },
    });
  };

  initBadges(e) {
    // create subtasks badge
    const totalSubtasks = this.data.subtasks.items.length;
    const completedSubtasks = this.data.subtasks.items.reduce(
      (count, subtask) => (subtask.completed ? ++count : count),
      0
    );
    const subtasksBadge = html`<div
      is-text
      key="subtasks"
      class="badge"
      style="background-color: ${DEFAULT_COLORS[9]};"
      data-tooltip-text="This task has subtasks"
    >
      ${completedSubtasks} / ${totalSubtasks}
    </div>`;

    // initialize badges; add toggling of subtasks
    const badges = e.target;

    badges.setAttribute('ignore', 'data-state');
    badges.dataset.state = JSON.stringify({ showSubtasks: false });

    badges.addEventListener('click', () => {
      const state = JSON.parse(badges.dataset.state);
      state.showSubtasks = !state.showSubtasks;

      $.data('id', this._subtasksId).style.display = state.showSubtasks
        ? 'block'
        : 'none';
      badges.dataset.state = JSON.stringify(state);
    });

    if (totalSubtasks) render(subtasksBadge, badges);
    // initialize to enable tooltips
    super.initBadges(e);
  }

  render() {
    this.extraContent = html`
      <div
        is-list
        ignore="data-id,style"
        data-id="${this._subtasksId}"
        class="task__subtasks"
        style="display: none;"
        ${{ onCreate: this.initSubtasks }}
      >
        ${this.data.subtasks.items.map((subtask) =>
          new Subtask(subtask).render(this.data.completed)
        )}
      </div>
    `;

    return super.render();
  }
}
