import { html } from 'poor-man-jsx';
import { KebabMenuIcon } from '../../assets/icons';
import Core from '../../core';
import { EDIT_SUBTASK, EDIT_TASK } from '../../actions';
import { runOnlyIfClick } from '../../utils/misc';
import { useUndo } from '../../utils/undo';
import TaskTemplate from '../../template/Task';
import DateBadge from '../DateBadge';

// data here points to the Task stored in main
// so we rely on the fact that changes are reflected on data
export default class BaseTask extends TaskTemplate {
  constructor(data, action) {
    super(data);
    this.action = action;

    this.props = {
      ...this.props,
      main: {
        ...this.props.main,
        onKeydown: runOnlyIfClick(this.editTask.bind(this)),
      },
      checkbox: {
        class:
          'box-border w-5 h-5 flex justify-center items-center bg-slate-100 rounded-sm border border-solid border-gray-400 dark:bg-transparent dark:border-white',
      },
      checkmark: {
        class: `w-3 h-3 rounded-sm bg-cyan-500 hover:opacity-80 dark:bg-[#208DA5] ${
          this.data.completed ? 'visible' : 'invisible'
        }`,
      },
    };

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
      message: `${this.type[0].toUpperCase() + this.type.slice(1)} removed`,
      data: { ...this.location, id: this.id },
    })();
  }

  render(position) {
    this.props.main['data-position'] = position;

    // populate our template
    this.template.push(
      // add checkbox
      {
        target: 'main',
        method: 'before',
        template: html`
          <label
            class="relative cursor-pointer select-none focus-within:ring"
            data-name="task__checkbox"
          >
            <input
              class="absolute w-0 h-0 opacity-0 peer"
              type="checkbox"
              name="mark-as-done"
              checked="${this.data.completed}"
              onClick=${this.toggleComplete.bind(this)}
            />
            <div class="peer-focus:ring" ${this.props.checkbox}>
              <div ${this.props.checkmark}></div>
            </div>
          </label>
        `,
      },
      // add kebab menu
      {
        target: 'main',
        method: 'after',
        template: html`
          <div data-name="task__controls" ${this.props.menu}>
            <button aria-label="Open ${this.type} menu" data-dropdown>
              ${KebabMenuIcon({
                cls: 'stroke-gray-500 hover:stroke-gray-800 dark:hover:stroke-gray-300',
                decorative: true,
              })}
            </button>

            <div
              ignore="class"
              class="flex flex-col py-1 rounded divide-y divide-gray-500 space-y-1 text-center text-white text-sm bg-neutral-700 border border-solid border-gray-500 drop-shadow z-20"
              style="display: none;"
              data-name="task__menu"
              data-dropdown-name="${this.type}"
              data-dropdown-position="left"
            >
              <button
                class="px-2 hover:text-blue-400"
                aria-haspopup="dialog"
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

    return super.render();
  }
}
