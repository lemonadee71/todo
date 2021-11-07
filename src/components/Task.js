import Sortable from 'sortablejs';
import { html } from 'poor-man-jsx';
import { DEFAULT_COLORS } from '../core/constants';
import { TASK } from '../core/actions';
import Core from '../core';
import BaseTask from './BaseTask';
import Subtask from './Subtask';

export default class Task extends BaseTask {
  constructor(data) {
    super('task', data, TASK);
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

  render() {
    this.extraContent = html`
      <div is-list class="task__subtasks" ${{ onCreate: this.initSubtasks }}>
        ${this.data.subtasks.items.map((subtask) =>
          new Subtask(subtask).render(this.data.completed)
        )}
      </div>
    `;

    const totalSubtasks = this.data.subtasks.items.length;
    const completedSubtasks = this.data.subtasks.items.reduce(
      (count, subtask) => (subtask.completed ? ++count : count),
      0
    );
    const subtasksBadge = totalSubtasks
      ? html`<div
          is-text
          key="subtasks"
          class="badge"
          style="background-color: ${DEFAULT_COLORS[9]};"
        >
          ${completedSubtasks} / ${totalSubtasks}
        </div>`
      : '';

    this.badges = [...this.badges, subtasksBadge];

    return super.render();
  }
}
