import { html } from 'poor-man-jsx';
import Core from '../core';
import { DEFAULT_COLORS, HIDE_EVENTS, SHOW_EVENTS } from '../core/constants';
import { formatDate, formatDateToNow, isDueToday, parse } from '../utils/date';
import { useUndo } from '../utils/undo';
import { useTooltip } from '../utils/useTooltip';
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
    this.key = `${this.type}-${this.data.id.split('-')[1]}`;

    this.extraProps = { main: '', checkbox: '' };
    this.extraContent = '';

    this.badges = [
      this.data.dueDate &&
        html`<div
          is-text
          key="date"
          class="badge"
          style="background-color: ${isDueToday(parse(this.data.dueDate))
            ? DEFAULT_COLORS[3]
            : DEFAULT_COLORS[0]};"
          data-tooltip-text="Due in ${formatDateToNow(this.data.dueDate)}"
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
    Core.event.emit(`${this.type}.modal.open`, this.data);
  }

  deleteTask() {
    useUndo({
      element: `[data-id="${this.id}"]`,
      multiple: true,
      text: 'Task removed',
      callback: () => Core.event.emit(this.action.REMOVE, this.location),
    })();
  }

  // enable tooltips for badges
  initBadges(e) {
    const badges = [...e.target.children];
    badges.forEach((badge) => {
      const [showTooltip, hideTooltip] = useTooltip(badge);

      SHOW_EVENTS.forEach((event) =>
        badge.addEventListener(event, showTooltip)
      );
      HIDE_EVENTS.forEach((event) =>
        badge.addEventListener(event, hideTooltip)
      );
    });
  }

  render() {
    return html`
      <div
        class="${this.data.completed ? `${this.type}--done` : this.type}"
        key="${this.key}"
        data-id="${this.id}"
        data-project="${this.data.project}"
        data-list="${this.data.list}"
        ${this.extraProps.main}
      >
        <div class="task__main">
          <label class="task__checkbox">
            <input
              class="checkbox__input"
              type="checkbox"
              name="mark-as-done"
              ${{
                checked: this.data.completed,
                onClick: this.toggleComplete.bind(this),
              }}
              ${this.extraProps.checkbox}
            />
            <div class="checkbox__box">
              <div
                class="checkbox__check"
                style="display: ${this.data.completed ? 'block' : 'none'}"
              ></div>
            </div>
          </label>

          <div class="task__body">
            <div is-list class="task__labels" ${this.extraProps.labels}>
              ${this.data.labels.items.map((label) => Chip(label))}
            </div>

            <div class="task__title" ${this.extraProps.title}>
              <p class="task__name">${this.data.title}</p>
              <span class="task__number">#${this.data.numId}</span>
            </div>

            <div
              is-list
              class="task__badges"
              ${{ onCreate: this.initBadges.bind(this) }}
              ${this.extraProps.badges}
            >
              ${this.badges}
            </div>
          </div>
          <div class="task__menu">
            <button ${{ onClick: this.editTask.bind(this) }}>Edit</button>
            <button ${{ onClick: this.deleteTask.bind(this) }}>Delete</button>
          </div>
        </div>

        ${this.extraContent}
      </div>
    `;
  }
}
