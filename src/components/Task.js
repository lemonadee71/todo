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
      deletedSubtasks: 0,
      completedSubtasks: 0,
      showSubtasks: false,
      showSubtasksBadge: true,
      subtasksCount: '',
    });

    this._unsubscribe = Core.event.on(
      [
        TASK.SUBTASKS.UPDATE,
        TASK.TRANSFER,
        TASK.SUBTASKS.ADD,
        TASK.SUBTASKS.TRANSFER,
      ],
      () => {
        this._updateSubtaskBadge();
      }
    );
  }

  _totalSubtasks = () =>
    this.data.subtasks.items.length - this.state.deletedSubtasks;

  _completedSubtasks = () => {
    const completed = this.data.subtasks.items.reduce(
      (count, subtask) => (subtask.completed ? ++count : count),
      0
    );

    return completed - this.state.completedSubtasks;
  };

  // we update the subtask badge manually
  // to be compatible with undoing deletes
  _updateSubtaskBadge = () => {
    const total = this._totalSubtasks();
    const completed = this._completedSubtasks();

    this.state.subtasksCount = `${completed} / ${total}`;
    this.state.showSubtasksBadge = !!total;
  };

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
        this._updateSubtaskBadge();
      },
      onRemove: this._updateSubtaskBadge,
    });
  };

  render() {
    this.badges = [
      ...this.badges,
      html`<div
        key="subtasks"
        ignore-all
        class="badge"
        data-tooltip-text="This task has subtasks"
        ${{
          backgroundColor: DEFAULT_COLORS[9],
          $display: this.state.$showSubtasksBadge((val) =>
            val && this._totalSubtasks ? 'block' : 'none'
          ),
          $textContent: this.state.$subtasksCount,
        }}
      ></div>`,
    ];

    this.extraProps = {
      main: {
        ignore: 'style',
        onDestroy: () => {
          this._revoke();
          this._unsubscribe();
        },
        onSubtaskDelete: (e) => {
          const { cancelled, success, completed } = e.detail;

          if (cancelled || success) {
            this.state.deletedSubtasks -= 1;
            if (completed) {
              this.state.completedSubtasks -= 1;
            }

            this.state.showSubtasksBadge = true;
          } else {
            this.state.deletedSubtasks += 1;

            if (completed) {
              this.state.completedSubtasks += 1;
            }
          }

          this._updateSubtaskBadge();
        },
      },
      badges: {
        onMount: this._updateSubtaskBadge,
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
