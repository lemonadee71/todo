import { html, render } from 'poor-man-jsx';
import Core from '../../core';
import { EDIT_SUBTASK, EDIT_TASK } from '../../core/actions';
import { formatDate, formatDateToNow } from '../../utils/date';
import { getDateColor } from '../../utils/misc';
import { usePopper } from '../../utils/popper';
import { useUndo } from '../../utils/undo';
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
            'data-tooltip-text': `Due ${formatDateToNow(this.data.dueDate)}`,
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
      text: 'Task removed',
      payload: { ...this.location, id: this.id },
    })();
  }

  initMenu = (e) => {
    let isOpen = false;
    const btn = e.target;
    const menu = e.target.nextElementSibling;

    const [, onShow, onHide] = usePopper(btn, menu, {
      placement: 'right',
      modifiers: [{ name: 'offset', options: [6, 0] }],
    });

    const openMenu = onShow(() => {
      menu.style.display = 'flex';
      menu.dataset.open = 'true';
    });

    const closeMenu = onHide(() => {
      menu.style.display = 'none';
      menu.dataset.open = 'false';
    });

    btn.addEventListener('click', (evt) => {
      isOpen = !isOpen;

      if (isOpen) openMenu();
      else closeMenu();

      evt.stopPropagation();
    });

    // close dropdown when clicked outside
    const cb = (evt) => {
      if (!menu.contains(evt.target)) {
        closeMenu();
        isOpen = false;
      }
    };

    document.body.addEventListener('click', cb);
    this.unsubscribe.push(() => document.body.removeEventListener('click', cb));
  };

  render(position) {
    // prettier-ignore
    return html`
      <div
        key="${this.key}"
        class="${this.type} box-border flex flex-col w-full px-3 py-2 bg-white rounded-md drop-shadow-lg"
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
              class="box-border flex justify-center items-center bg-slate-100 rounded-sm border border-solid border-gray-400"
              style="width: 1.25rem; height: 1.25rem;"
              ${this.props.checkbox}
            >
              <div
                class="rounded-sm bg-cyan-500 hover:opacity-80 ${this.data.completed ? 'visible' : 'invisible'}"
                style="width: 0.75rem; height: 0.75rem;"
                ${this.props.checkmark}
              ></div>
            </div>
          </label>

          <div class="flex flex-1 flex-col space-y-1">
            <div
              is-list
              class="flex flex-wrap space-x-1 space-y-1"
              ${this.props.labels}
            >
              ${this.data.labels.items.map(Chip)}
            </div>

            <h3
              class="text-base font-sans break-words break-all ${this.data.completed ? 'line-through' : ''}"
              ${this.props.title}
            >
              ${this.data.title}
            </h3>

            <div
              is-list
              class="flex flex-wrap gap-1"
              ${this.props.badges}
            >
              ${this.badges.map((item) => render(item))}
            </div>
          </div>

          <div onMount=${this.initMenu} ${this.props.menu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="cursor-pointer stroke-gray-500 hover:stroke-gray-800"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#000000"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
              <circle cx="12" cy="5" r="1" />
            </svg>
          </div>

          <div
            ignore="class"
            style="display: none;"
            class="flex-col py-1 rounded divide-y divide divide-gray-500 space-y-1 text-center text-white text-sm bg-neutral-700 border border-gray-500 border-solid drop-shadow"
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

        ${(this.extraContent)}
      </div>
    `;
  }
}
