import { html, render } from 'poor-man-jsx';
import { KebabMenuIcon } from '../../assets/icons';
import Core from '../../core';
import { EDIT_SUBTASK, EDIT_TASK } from '../../actions';
import { formatDate, formatDateToNow } from '../../utils/date';
import { getDateColor } from '../../utils/misc';
import { useUndo } from '../../utils/undo';
import { createDropdown } from '../../utils/dropdown';
import Badge from './Badge';
import Chip from './Chip';

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
    this.extraContent = '';

    if (this.data.dueDate) {
      this.badges.push(
        // date badge
        Badge({
          content: formatDate(this.data.dueDate),
          bgColor: getDateColor(this.data.dueDate),
          props: {
            key: 'date',
            ignore: 'data-interval-id',
            'data-tooltip': `Due ${formatDateToNow(this.data.dueDate)}`,
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
          },
        })
      );
    }
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

  // prettier-ignore
  render(position) {
    return html`
      <div
        key="${this.key}"
        class="${this.type} box-border flex flex-col w-full px-3 py-2 bg-white dark:bg-[#353535] rounded-md drop-shadow-lg relative z-[3]"
        data-id="${this.id}"
        data-project="${this.data.project}"
        data-list="${this.data.list}"
        data-position="${position}"
        onDestroy=${() => this.unsubscribe.forEach((cb) => cb())}
        ${this.props.main}
      >
        <div class="w-full flex justify-between items-center space-x-2">
          <label class="relative cursor-pointer select-none">
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

          <div class="flex flex-1 flex-col space-y-1">
            <div is-list class="flex flex-wrap gap-1" ${this.props.labels}>
              ${this.data.labels.items.map(Chip)}
            </div>

            <h3
              class="text-base font-sans break-words break-all ${this.data.completed ? 'line-through' : ''}"
              ${this.props.title}
            >
              ${this.data.title}
            </h3>

            <div is-list class="flex flex-wrap gap-1" ${this.props.badges}>
              ${this.badges.map((item) => render(item))}
            </div>
          </div>

          <div onMount=${this.initMenu} ${this.props.menu}>
            <button>
              ${KebabMenuIcon('cursor-pointer stroke-gray-500 hover:stroke-gray-800 dark:hover:stroke-gray-300')}
            </button>

            <div
              ignore="class"
              style="display: none;"
              data-dropdown-position="left"
              class="flex flex-col py-1 rounded divide-y divide divide-gray-500 space-y-1 text-center text-white text-sm bg-neutral-700 border border-gray-500 border-solid drop-shadow z-[99]"
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

        ${this.extraContent}
      </div>
    `;
  }
}
