import Sortable from 'sortablejs';
import { createHook, html } from 'poor-man-jsx';
import { DEFAULT_COLORS } from '../../core/constants';
import { TASK } from '../../core/actions';
import Core from '../../core';
import BaseTask from './BaseTask';
import Subtask from './Subtask';

export default class Task extends BaseTask {
  constructor(data) {
    super(data, TASK);

    [this.state, this._revoke] = createHook({ showSubtasks: false });
    this.unsubscribe.push(this._revoke.bind(this));
  }

  get totalSubtasks() {
    return this.data.subtasks.items.length;
  }

  get currentSubtasks() {
    return this.data.subtasks.items.filter((subtask) => subtask.completed)
      .length;
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
        const { id, parent, list } = e.item.dataset;
        const fromTask = parent || id;
        const fromList = list;
        const action = parent ? TASK.SUBTASKS.TRANSFER : TASK.TRANSFER;

        this.transferSubtask(action, fromTask, fromList, id, e.newIndex);
      },
    });
  };

  render(position) {
    this.badges = [
      ...this.badges,
      this.totalSubtasks
        ? html`<div
            is-text
            key="subtasks"
            class="badge"
            data-show-tooltip
            data-tooltip-text="This task has subtasks"
            ${{
              backgroundColor: DEFAULT_COLORS[9],
              onClick: () => {
                this.state.showSubtasks = !this.state.showSubtasks;
              },
            }}
          >
            ${this.currentSubtasks} / ${this.totalSubtasks}
          </div>`
        : '',
    ];

    this.extraContent = html`
      <div
        is-list
        ignore="style"
        class="task__subtasks"
        ${{
          $display: this.state.$showSubtasks((val) => (val ? 'block' : 'none')),
          onCreate: this.initSubtasks,
        }}
      >
        ${this.data.subtasks.items.map((subtask, i) =>
          new Subtask(subtask).render(i)
        )}
      </div>
    `;

    return super.render(position);
  }
}
