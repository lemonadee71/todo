import Sortable from 'sortablejs';
import { createHook, html } from 'poor-man-jsx';
import { DEFAULT_COLORS } from '../../constants';
import { TASK } from '../../actions';
import Core from '../../core';
import BaseTask from './BaseTask';
import Subtask from './Subtask';
import Badge from './Badge';

export default class Task extends BaseTask {
  constructor(data) {
    super(data, TASK);

    [this.state, this._revoke] = createHook({
      showSubtasks: !this.data.totalSubtasks,
    });
    this.unsubscribe.push(this._revoke.bind(this));
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
      // delay: 10,
      draggable: '.subtask',
      filter: 'input,button',
      emptyInsertThreshold: 10,
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
    this.props.badges = {
      onClick: (e) => {
        // use event delegation
        if (e.target.dataset.id === 'subtask-badge') {
          this.state.showSubtasks = !this.state.showSubtasks;
        }
      },
    };

    if (this.data.totalSubtasks) {
      this.badges.push(
        Badge({
          content: `${this.data.incompleteSubtasks} / ${this.data.totalSubtasks}`,
          bgColor: DEFAULT_COLORS[9],
          props: {
            key: 'subtasks',
            'data-id': 'subtask-badge',
            'data-tooltip': 'This task has subtasks',
          },
        })
      );
    }

    this.template.push({
      target: 'body',
      method: 'after',
      template: html`
        <div
          ignore="style"
          data-name="task__subtasks"
          style_display=${this.state.$showSubtasks((value) =>
            value ? 'block' : 'none'
          )}
        >
          <div is-list class="space-y-1" onMount=${this.initSubtasks}>
            ${this.data.subtasks.items
              .filter((subtask) => !subtask.completed)
              .map((subtask, i) => new Subtask(subtask).render(i))}
          </div>
          <div is-list class="space-y-1">
            ${this.data.subtasks.items
              .filter((subtask) => subtask.completed)
              .sort((a, b) => b.completionDate - a.completionDate)
              .map((subtask, i) => new Subtask(subtask).render(i))}
          </div>
        </div>
      `,
    });

    return super.render(position);
  }
}
