import { html } from 'poor-man-jsx';
import { KebabMenuIcon } from '../../assets/icons';
import Core from '../../core';
import { EDIT_SUBTASK, EDIT_TASK } from '../../actions';
import { createDropdown } from '../../utils/dropdown';
import { useUndo } from '../../utils/undo';
import TaskTemplate from '../../template/Task';
import DateBadge from '../DateBadge';

// data here points to the Task stored in main
// so we rely on the fact that changes are reflected on data
export default class BaseTask extends TaskTemplate {
  constructor(data, action) {
    super(data);
    this.action = action;

    if (this.data.dueDate) this.badges.push(DateBadge(data));

    // populate our template
    this.template.push(
      // add checkbox
      {
        target: 'main',
        method: 'before',
        template: html`
          <label
            class="relative cursor-pointer select-none"
            data-name="task__checkbox"
          >
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
                class="rounded-sm bg-cyan-500 hover:opacity-80 dark:bg-[#208DA5] ${this
                  .data.completed
                  ? 'visible'
                  : 'invisible'}"
                style="width: 0.75rem; height: 0.75rem;"
                ${this.props.checkmark}
              ></div>
            </div>
          </label>
        `,
      },
      // add kebab menu
      {
        target: 'main',
        method: 'after',
        template: html`
          <div
            data-name="task__controls"
            onMount=${this.initMenu}
            ${this.props.menu}
          >
            <button>
              ${KebabMenuIcon(
                'cursor-pointer stroke-gray-500 hover:stroke-gray-800 dark:hover:stroke-gray-300'
              )}
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
        `,
      }
    );
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

  render(position) {
    this.props.main['data-position'] = position;
    return super.render();
  }
}
