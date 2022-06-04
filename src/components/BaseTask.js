import { html, render } from 'poor-man-jsx';
import { KebabMenuIcon } from '../assets/icons';
import Core from '../core';
import { HIDE_EVENTS, SHOW_EVENTS } from '../constants';
import { EDIT_SUBTASK, EDIT_TASK } from '../actions';
import { createDropdown } from '../utils/dropdown';
import { useUndo } from '../utils/undo';
import { $ } from '../utils/query';
import { useTooltip } from '../utils/useTooltip';
import Chip from './Chip';
import DateBadge from './DateBadge';

// data here points to the Task stored in main
// so we rely on the fact that changes are reflected on data
export default class BaseTask {
  constructor(data, action) {
    this.type = data.type;
    this.data = data;
    this.action = action;

    this.id = this.data.id;
    this.key = `${this.type}-${this.id}`;

    this.unsubscribe = [];
    this.props = { main: '', checkbox: '' };
    this.badges = [];
    this.template = [];

    if (this.data.dueDate) this.badges.push(DateBadge(data));
  }

  get location() {
    return this.data.location;
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
      text: `${this.type[0].toUpperCase() + this.type.slice(1)} removed`,
      payload: { ...this.location, id: this.id },
    })();
  }

  initMenu = (e) => createDropdown(e.target.children[0], e.target.children[1]);

  init = (e) => {
    this.template.forEach((content) => {
      const { template, target: selector, method } = content;
      const target = selector
        ? $.data('name', `task__${selector}`, e.target)
        : e.target;

      target[method || 'append'](render(template));
    });

    // Manually init tooltip due to bug
    const badges = [
      ...($.data('name', 'task__badges', e.target).children ?? []),
    ];
    badges.forEach((badge) => {
      badge.dataset.tooltipManual = 'true';
      badge.addEventListener('@mount', () => {
        const [onShow, onHide] = useTooltip(badge);

        // BUG: Attaches twice on first render if `lastOpenedPage`
        //      but not on consecutive renders. This must be due to the
        //      async nature of MutationObserver
        SHOW_EVENTS.forEach((name) => badge.addEventListener(name, onShow()));
        HIDE_EVENTS.forEach((name) => badge.addEventListener(name, onHide()));
      });
    });
  };

  // prettier-ignore
  render(position) {
    return html`
      <div
        key="${this.key}"
        class="${this.type} box-border flex flex-col px-3 py-2 bg-white dark:bg-[#353535] rounded-md drop-shadow-lg relative z-[2]"
        data-id="${this.id}"
        data-project="${this.data.project}"
        data-list="${this.data.list}"
        data-position="${position}"
        onCreate=${this.init}
        onDestroy=${() => this.unsubscribe.forEach((cb) => cb())}
        ${this.props.main}
      >
        <div class="flex justify-between items-center space-x-2" data-name="task__body">
          <label class="relative cursor-pointer select-none" data-name="task__checkbox">
            <input
              class="absolute cursor-pointer w-0 h-0 opacity-0"
              type="checkbox"
              name="mark-as-done"
              checked="${this.data.completed}"
              onClick=${this.toggleComplete.bind(this)}
            />
            <div
              class="box-border flex justify-center items-center bg-slate-100 rounded-sm border border-solid border-gray-400 dark:bg-transparent dark:border-white"
              style="width: 1.25rem; height: 1.25rem;"
              ${this.props.checkbox}
            >
              <div
                class="rounded-sm bg-cyan-500 hover:opacity-80 dark:bg-[#208DA5] ${this.data.completed ? 'visible' : 'invisible'}"
                style="width: 0.75rem; height: 0.75rem;"
                ${this.props.checkmark}
              ></div>
            </div>
          </label>

          <div class="flex flex-1 flex-col space-y-1" data-name="task__main">
            <div is-list class="flex flex-wrap gap-1" ${this.props.labels} data-name="task__labels">
              ${this.data.labels.items.map(Chip)}
            </div>

            <h3
              class="text-base font-sans break-words line-clamp-3 ${this.data.completed ? 'line-through' : ''}"
              data-name="task__title"
              ${this.props.title}
            >
              ${this.data.title}
            </h3>

            <div is-list class="flex flex-wrap gap-1" data-name="task__badges" ${this.props.badges}>
              ${this.badges.map((item) => render(item))}
            </div>
          </div>

          <div onMount=${this.initMenu} ${this.props.menu} data-name="task__controls">
            <button>
              ${KebabMenuIcon('cursor-pointer stroke-gray-500 hover:stroke-gray-800 dark:hover:stroke-gray-300')}
            </button>

            <div
              ignore="class"
              style="display: none;"
              data-name="task__menu"
              data-dropdown-position="left"
              class="flex flex-col py-1 rounded divide-y divide-gray-500 space-y-1 text-center text-white text-sm bg-neutral-700 border border-gray-500 border-solid drop-shadow z-[99]"
            >
              <button
                class="px-2 hover:text-blue-400"
                onClick=${this.editTask.bind(this)}
              >
                Edit
              </button>
              <button
                class="px-2 hover:text-red-600"
                onClick=${this.deleteTask.bind(this)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
