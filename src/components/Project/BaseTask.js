import { html } from 'poor-man-jsx';
import Core from '../../core';
import { EDIT_SUBTASK, EDIT_TASK } from '../../core/actions';
import { formatDate, formatDateToNow } from '../../utils/date';
import { getDateColor } from '../../utils/misc';
import { useUndo } from '../../utils/undo';
import Chip from './Chip';

// data here points to the Task stored in main
// so we rely on the fact that changes are reflected on data
export default class BaseTask {
  constructor(data, action) {
    this.type = data.type;
    this.data = data;
    this.action = action;

    this.id = this.data.id;
    // both task and subtask ids start with `task`
    // so to allow for conversion, prefix key with actual type instead
    this.key = `${this.type}-${this.data.id}`;

    this.unsubscribe = [];
    this.props = { main: '', checkbox: '' };
    this.extraContent = '';

    this.badges = [
      this.data.dueDate &&
        html`<div
          is-text
          key="date"
          ignore="data-interval-id"
          class="badge"
          style="background-color: ${getDateColor(this.data.dueDate)};"
          data-tooltip-text="Due ${formatDateToNow(this.data.dueDate)}"
          ${{
            onMount: (e) => {
              // change status of badge every x minute(s)
              const id = setInterval(() => {
                e.target.textContent = formatDate(this.data.dueDate);
                e.target.style.backgroundColor = getDateColor(
                  this.data.dueDate
                );
                e.target.dataset.tooltipText = `Due ${formatDateToNow(
                  this.data.dueDate
                )}`;
              }, 3 * 60 * 1000);

              e.target.dataset.intervalId = id;
            },
            onUnmount: (e) => clearInterval(e.target.dataset.intervalId),
          }}
        >
          ${formatDate(this.data.dueDate)}
        </div>`,
    ];
  }

  get location() {
    return {
      project: this.data.project,
      list: this.data.list,
      task: this.data.id,
    };
  }

  // do not use arrow; use bind instead
  // see https://stackoverflow.com/questions/64498584
  toggleComplete() {
    Core.event.emit(this.action.UPDATE, {
      ...this.location,
      data: { completed: null },
    });
  }

  editTask() {
    Core.event.emit(this.type === 'task' ? EDIT_TASK : EDIT_SUBTASK, this.data);
  }

  deleteTask() {
    useUndo({
      type: this.action,
      text: 'Task removed',
      payload: { ...this.location, id: this.id },
    })();
  }

  render(position) {
    return html`
      <div
        key="${this.key}"
        class="${this.data.completed ? `${this.type}--done` : this.type}"
        data-id="${this.id}"
        data-project="${this.data.project}"
        data-list="${this.data.list}"
        data-position="${position}"
        onDestroy=${() => this.unsubscribe.forEach((cb) => cb())}
        ${this.props.main}
      >
        <div class="task__main">
          <label class="task__checkbox">
            <input
              class="checkbox__input"
              type="checkbox"
              name="mark-as-done"
              onClick=${this.toggleComplete.bind(this)}
              ${this.data.completed ? 'checked' : ''}
              ${this.props.checkbox}
            />
            <div class="checkbox__box">
              <div
                class="checkbox__check"
                style="display: ${this.data.completed ? 'block' : 'none'}"
              ></div>
            </div>
          </label>

          <div class="task__body">
            <div is-list class="task__labels" ${this.props.labels}>
              ${this.data.labels.items.map(Chip)}
            </div>

            <div class="task__title" ${this.props.title}>
              <p class="task__name">${this.data.title}</p>
            </div>

            <div is-list class="task__badges" ${this.props.badges}>
              ${this.badges}
            </div>
          </div>
          <div class="task__menu">
            <button onClick=${this.editTask.bind(this)}>Edit</button>
            <button onClick=${this.deleteTask.bind(this)}>Delete</button>
          </div>
        </div>

        ${this.extraContent}
      </div>
    `;
  }
}
