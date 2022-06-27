import flatpickr from 'flatpickr';
import { addHooks, createHook, html, render } from 'poor-man-jsx';
import { CalendarIcon, LabelIcon, NotesIcon } from '../../assets/icons';
import { TASK } from '../../actions';
import { POPPER_CONFIG } from '../../constants';
import Core from '../../core';
import { useTask } from '../../core/hooks';
import { debounce } from '../../utils/delay';
import { dispatchCustom } from '../../utils/dispatch';
import { usePopper } from '../../utils/popper';
import { $ } from '../../utils/query';
import convertToMarkdown from '../../utils/showdown';
import { useUndo } from '../../utils/undo';
import LabelPopover from './LabelPopover';
import Badge from '../Badge';

export default class BaseTaskModal {
  constructor(data, action) {
    this.type = data.type;
    this.data = data;
    this.action = action;

    this.id = this.data.id;

    [this.task, this._revoke] = useTask(...Object.values(this.location));
    [this.state] = createHook({ isEditingNotes: false });

    this.template = [];
  }

  get location() {
    return this.data.location;
  }

  editTask = (e) => {
    const { name, value } = e.target;
    Core.event.emit(
      this.action.UPDATE,
      {
        ...this.location,
        data: { [name]: value },
      },
      {
        onError: () => {
          if (name === 'title') {
            e.target.value = this.data.title;
          }
        },
      }
    );
  };

  updateLabels = (id, isSelected) => {
    const action = isSelected ? TASK.LABELS.ADD : TASK.LABELS.REMOVE;
    Core.event.emit(action, { ...this.location, data: { id } });
  };

  toggleNotesEdit = () => {
    this.state.isEditingNotes = !this.state.isEditingNotes;
  };

  deleteTask = () => {
    useUndo({
      type: this.action,
      message: `${this.type[0].toUpperCase() + this.type.slice(1)} removed`,
      data: { ...this.location, id: this.id },
      onSuccess: () => {
        // close modal to prevent errors from further actions
        $('#modal').pop();
      },
    })();
  };

  initDatePicker = (e) => {
    const editDate = debounce((_, date) => {
      this.editTask({ target: { name: 'dueDate', value: date } });
    }, 100);

    const instance = flatpickr(e.target, {
      wrap: true,
      enableTime: true,
      altInput: true,
      altFormat: 'F j, Y',
      onChange: editDate,
      onValueUpdate: editDate,
    });

    e.target.addEventListener('@destroy', () => instance.destroy());
  };

  initPopover = (e) => {
    const [state] = createHook({ expanded: false });
    const node = e.target;
    const popover = $('#label-popover');

    const [, onShow, onHide] = usePopper(node, popover, {
      ...POPPER_CONFIG,
      placement: 'right-start',
    });

    const openPopover = onShow(() => {
      dispatchCustom('popover:toggle', popover);
      state.expanded = !state.expanded;
    });
    const closePopover = onHide(() => {
      state.expanded = false;
    });

    addHooks(node, { 'aria-expanded': state.$expanded });
    node.addEventListener('click', openPopover);
    popover.addEventListener('popover:hide', closePopover);
  };

  init = (e) => {
    this.template.forEach((content) => {
      const { template, target: selector, method } = content;
      const target = selector
        ? $.data('name', `task__${selector}`, e.target)
        : e.target;

      target[method || 'append'](render(template));
    });
  };

  render() {
    return html`
      <div
        class="relative w-5/6 max-w-lg mx-auto my-10 py-4 px-5 space-y-4 rounded-lg bg-white dark:bg-[#353535]"
        onCreate=${this.init}
        onDestroy=${this._revoke}
      >
        <div data-name="task__buttons">
          <button
            class="absolute top-0 right-4 text-2xl text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-300"
            aria-label="Close modal"
            onClick=${() => $('#modal').close()}
          >
            &times;
          </button>
        </div>

        <!-- Title -->
        <div data-name="task__title">
          <h2 class="sr-only">{% ${this.data.title} %}</h2>
          <!-- prettier-ignore -->
          <textarea
            class="font-semibold text-xl w-full p-1 rounded-sm bg-inherit resize-none overflow-hidden placeholder:text-slate-600 focus:ring focus:placeholder:text-slate-400 dark:placeholder:text-slate-200 dark:focus:placeholder:text-slate-400"
            name="title"
            rows="1"
            data-autosize
            data-focus="first"
            onInput=${debounce(this.editTask, 200)}
          >${this.data.title.trim()}</textarea>
        </div>

        <!-- Labels -->
        <div data-name="task__labels">
          <div class="flex flex-row space-x-1 items-center mb-2">
            ${LabelIcon({ cls: 'dark:stroke-white', decorative: true })}
            <h3 class="text-md font-medium">Labels</h3>
          </div>

          <div is-list class="flex flex-row flex-wrap gap-1">
            ${this.task.$labels((labels) => {
              const btn = html`
                <button
                  ignore-all
                  key="add-label"
                  class="text-sm font-medium text-gray-600 px-3 py-1 rounded bg-[#dedede] hover:text-gray-800 dark:text-white dark:hover:text-gray-300 dark:bg-transparent dark:border dark:border-solid dark:border-white"
                  aria-label="Add or edit labels"
                  aria-haspopup="true"
                  data-tooltip="Add label"
                  data-tooltip-position="top"
                  onMount=${this.initPopover}
                >
                  +
                </button>
              `;

              const items = labels.map((label) =>
                Badge({
                  content: label.name,
                  bgColor: label.color,
                  additionalCls: 'text-sm text-white',
                  props: { key: label.id },
                })
              );

              return [btn, ...items].map((item) => render(item));
            })}
          </div>

          ${LabelPopover(this.data, this.updateLabels)}
        </div>

        <!-- Notes -->
        <div data-name="task__notes">
          <div class="flex flex-row space-x-1 items-center mb-2">
            ${NotesIcon({ cls: 'dark:stroke-white', decorative: true })}
            <h3 class="text-md font-medium">Notes</h3>
          </div>

          <div class="max-h-80 p-1 overflow-auto">
            ${this.state.$isEditingNotes((value) =>
              value
                ? render(
                    // prettier-ignore
                    html`
                      <textarea
                        class="resize-none w-full h-72 rounded-sm p-2 text-inherit bg-inherit placeholder:text-base focus:ring"
                        name="notes"
                        placeholder="Edit notes"
                        onInput=${this.editTask}
                        onBlur=${this.toggleNotesEdit}
                        onMount=${(e) => e.target.focus()}
                      >${this.data.notes.trim()}</textarea>
                    `
                  )
                : render(html`
                    <div
                      class="prose prose-slate dark:prose-invert"
                      onClick=${this.toggleNotesEdit}
                    >
                      ${this.data.notes.trim()
                        ? convertToMarkdown(this.data.notes)
                        : `<div class="text-base" tabindex="0">Add notes</div>`}
                    </div>
                  `)
            )}
          </div>
        </div>

        <!-- Date -->
        <div data-name="task__date">
          <div class="flex flex-row space-x-1 items-center mb-2">
            ${CalendarIcon({ cls: 'dark:stroke-white', decorative: true })}
            <h3 class="text-md font-medium">Due Date</h3>
          </div>

          <div
            class="flatpickr w-56 px-2 flex justify-between items-center border border-solid border-gray-400 rounded-md focus-within:ring focus-within:border-gray-600 dark:focus-within:border-gray-200"
            onMount=${this.initDatePicker}
          >
            <input
              class="w-full font-light text-sm text-inherit bg-inherit focus:outline-none"
              type="text"
              name="dueDate"
              value="${this.data.dueDate}"
              placeholder="Select date"
              data-input
            />
            <button
              class="text-3xl font-medium text-center text-red-500 hover:text-red-700 cursor-pointer"
              aria-label="Remove due date"
              data-tooltip="Clear date"
              data-tooltip-position="right"
              data-clear
            >
              &times;
            </button>
          </div>
        </div>

        <!-- Controls -->
        <div
          class="mx-auto flex flex-row justify-center items-center gap-4"
          data-name="task__controls"
        >
          <button
            class="text-sm text-white text-center px-3 py-2 rounded bg-blue-600 hover:bg-blue-700"
            onClick=${() => this.editTask({ target: { name: 'completed' } })}
          >
            Mark
            ${this.task.$completed((value) =>
              value ? 'uncompleted' : 'completed'
            )}
          </button>
          <button
            class="text-sm text-white text-center px-3 py-2 rounded bg-red-600 hover:bg-red-700"
            onClick=${this.deleteTask}
          >
            Delete
          </button>
        </div>
      </div>
    `;
  }
}
