import Sortable from 'sortablejs';
import { html } from 'poor-man-jsx';
import { TASK } from '../core/actions';
import Core from '../core';
import BaseTask from './BaseTask';
import Subtask from './Subtask';

export default class Task extends BaseTask {
  constructor(data) {
    super('task', data, TASK);

    this.extraContent = html`
      <div class="task__subtasks" is-list ${{ '@create': this.initSubtasks }}>
        ${this.data.subtasks.items.map((subtask) =>
          new Subtask(subtask).render()
        )}
      </div>
    `;
  }

  // ?TODO: Try setting the checkbox as indeterminate
  toggleComplete(e) {
    super.toggleComplete();

    const unchecked = this.data.subtasks.items.reduce(
      (acc, curr) => (!curr.completed ? ++acc : acc),
      0
    );

    if (unchecked > 0) {
      e.preventDefault();
    }
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

  initSubtasks = (node) => {
    Sortable.create(node, {
      group: 'tasks',
      animation: 150,
      delay: 10,
      draggable: '.subtask',
      filter: 'input,button',
      onUpdate: (e) => this.moveSubtask(e.item.id, e.newIndex),
      onAdd: (e) => {
        const isSubtask = !!e.item.dataset.parent;
        const fromTask = e.item.dataset.parent || e.item.id;
        const fromList = e.item.dataset.list;
        const action = isSubtask ? TASK.SUBTASKS.TRANSFER : TASK.TRANSFER;

        this.transferSubtask(action, fromTask, fromList, e.item.id, e.newIndex);
      },
    });
  };
}
