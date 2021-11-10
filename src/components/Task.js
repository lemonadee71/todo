import Sortable from 'sortablejs';
import { createHook, html } from 'poor-man-jsx';
import { DEFAULT_COLORS } from '../core/constants';
import { TASK } from '../core/actions';
import Core from '../core';
import BaseTask from './BaseTask';
import Subtask from './Subtask';

export default class Task extends BaseTask {
  constructor(data) {
    super(data, TASK);

    [this.state, this._revoke] = createHook({
      showSubtasks: false,
      showSubtasksBadge: true,
      subtasksCount: `${this.completedSubtasks} / ${this.totalSubtasks}`,
    });

    this._unsubscribe = Core.event.on(
      // show subtasks badge when new ones are added
      [TASK.TRANSFER, TASK.SUBTASKS.ADD, TASK.SUBTASKS.TRANSFER],
      () => {
        this.state.showSubtasksBadge = true;
      }
    );
  }

  get totalSubtasks() {
    return this.data.subtasks.items.length;
  }

  get completedSubtasks() {
    return this.data.subtasks.items.reduce(
      (count, subtask) => (subtask.completed ? ++count : count),
      0
    );
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

  render() {
    this.badges = [
      ...this.badges,
      html`<div
        is-text
        ignore="style"
        key="subtasks"
        class="badge"
        data-tooltip-text="This task has subtasks"
        ${{
          backgroundColor: DEFAULT_COLORS[9],
          $display: this.state.$showSubtasksBadge((val) =>
            val && this.totalSubtasks ? 'block' : 'none'
          ),
          $textContent: this.state.$subtasksCount,
        }}
      ></div>`,
    ];

    let deletedSubtasks = 0;

    this.extraProps = {
      main: {
        onDestroy: () => {
          this._revoke();
          this._unsubscribe();
        },
        onSubtaskDelete: (e) => {
          if (e.detail.cancelled || e.detail.success) {
            deletedSubtasks -= 1;
            this.state.showSubtasksBadge = true;
          } else {
            deletedSubtasks += 1;
          }

          const total = this.totalSubtasks - deletedSubtasks;
          const completed = Math.max(
            e.detail.completed
              ? this.completedSubtasks - deletedSubtasks
              : this.completedSubtasks,
            0
          );

          this.state.subtasksCount = `${completed} / ${total}`;
          if (!total) this.state.showSubtasksBadge = false;
        },
      },
      badges: {
        onClick: () => {
          this.state.showSubtasks = !this.state.showSubtasks;
        },
      },
    };

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
        ${this.data.subtasks.items.map((subtask) =>
          new Subtask(subtask).render(this.data.completed)
        )}
      </div>
    `;

    return super.render();
  }
}
