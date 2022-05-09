import flatpickr from 'flatpickr';
import { createHook, html, render } from 'poor-man-jsx';
import { CalendarIcon, LabelIcon } from '../../assets/icons';
import Core from '../../core';
import { TASK } from '../../core/actions';
import { POPPER_CONFIG } from '../../core/constants';
import { useTask } from '../../core/hooks';
import { debounce } from '../../utils/delay';
import { dispatchCustomEvent } from '../../utils/dispatch';
import { usePopper } from '../../utils/popper';
import { $ } from '../../utils/query';
import convertToMarkdown from '../../utils/showdown';
import { useUndo } from '../../utils/undo';
import Badge from './Badge';
import LabelPopover from './LabelPopover';

export default class BaseTaskModal {
  constructor(data, action) {
    this.type = data.type;
    this.data = data;
    this.action = action;

    this.id = this.data.id;

    [this.task, this._revoke] = useTask(...Object.values(this.location));
    [this.state] = createHook({
      isEditingNotes: false,
      isCompleted: data.completed,
    });

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

  toggleComplete = () => {
    this.state.isCompleted = !this.state.isCompleted;
    this.editTask({ target: { name: 'completed' } });
  };

  deleteTask = () => {
    useUndo({
      type: this.action,
      text: `${this.type[0].toUpperCase() + this.type.slice(1)} removed`,
      payload: { ...this.location, id: this.id },
    })();
    // close modal to prevent errors from further actions
    $('#modal').pop();
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
    const node = e.target;
    const popover = $.by.id('label-popover');

    const [, onShow, onHide] = usePopper(node, popover, {
      ...POPPER_CONFIG,
      placement: 'right-start',
    });

    node.addEventListener(
      'click',
      onShow(() => dispatchCustomEvent(popover, 'popover:toggle'))
    );
    popover.addEventListener('popover:hide', onHide());
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
        class="relative w-5/6 max-w-lg my-[10%] sm:my-[5%] mx-auto rounded-lg bg-white py-4 px-5 space-y-4"
        onCreate=${this.init}
        onDestroy=${this._revoke}
      >
        <button
          class="absolute top-0 right-0 mr-3 text-2xl text-gray-600 hover:text-gray-800"
          onClick=${() => $('#modal').pop()}
        >
          &times;
        </button>

        <!-- Title -->
        <div data-name="task__title">
          <h2 class="sr-only">{% ${this.data.title} %}</h2>
          <!-- prettier-ignore -->
          <textarea
            class="text-lg font-semibold w-full h-fit rounded-sm px-1 py-1 bg-transparent placeholder:text-slate-600 focus:placeholder:text-slate-400 focus:bg-white focus:ring resize-none break-words overflow-hidden"
            name="task-title"
            rows="1"
            data-autosize
            onInput=${debounce(this.editTask, 200)}
          >${this.data.title.trim()}</textarea>
        </div>

        <!-- Labels -->
        <div data-name="task__labels">
          <div class="flex flex-row space-x-1 items-center mb-2">
            ${LabelIcon()}
            <h3 class="text-md font-medium">Labels</h3>
          </div>

          <div is-list class="flex flex-row flex-wrap gap-1">
            ${this.task.$labels((labels) => {
              const button = Badge({
                content: '+',
                bgColor: '#dedede',
                additionalCls: 'px-3 text-sm text-gray-600 hover:text-gray-800',
                props: {
                  onMount: this.initPopover,
                  key: 'add-label',
                  'ignore-all': '',
                  'data-tooltip': 'Add label',
                  'data-tooltip-position': 'top',
                },
              });
              const items = labels.map((label) =>
                Badge({
                  content: label.name,
                  bgColor: label.color,
                  additionalCls: 'text-sm text-white',
                  props: { key: label.id },
                })
              );

              return [button, ...items].map((item) => render(item));
            })}
          </div>

          ${LabelPopover(this.data, this.updateLabels)}
        </div>

        <!-- Notes -->
        <div data-name="task__notes">
          <div class="flex flex-row space-x-1 items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
              <rect x="5" y="3" width="14" height="18" rx="2" />
              <line x1="9" y1="7" x2="15" y2="7" />
              <line x1="9" y1="11" x2="15" y2="11" />
              <line x1="9" y1="15" x2="13" y2="15" />
            </svg>
            <h3 class="text-md font-medium">Notes</h3>
          </div>

          <div class="font-sans w-full max-h-56 overflow-auto">
            ${this.state.$isEditingNotes((value) =>
              value
                ? render(
                    // prettier-ignore
                    html`
                      <textarea
                        class="resize-none w-full h-52 rounded-sm px-1 py-1 placeholder:text-base focus:ring"
                        name="notes"
                        placeholder="Add notes"
                        onInput=${this.editTask}
                        onBlur=${this.toggleNotesEdit}
                        onMount=${(e) => e.target.focus()}
                      >${this.data.notes.trim()}</textarea>
                    `
                  )
                : render(html`
                    <div class="markdown-body" onClick=${this.toggleNotesEdit}>
                      ${this.data.notes.trim()
                        ? convertToMarkdown(this.data.notes)
                        : `<p class="text-base text-gray-500">Add notes</p>`}
                    </div>
                  `)
            )}
          </div>
        </div>

        <!-- Date -->
        <div data-name="task__date">
          <div class="flex flex-row space-x-1 items-center mb-2">
            ${CalendarIcon()}
            <h3 class="text-md font-medium">Due Date</h3>
          </div>

          <div class="flatpickr" onMount=${this.initDatePicker}>
            <input
              class="w-32 px-2 py-1 border border-solid border-gray-400 rounded-md placeholder:text-sm"
              type="text"
              name="dueDate"
              value="${this.data.dueDate}"
              placeholder="Select date..."
              data-input
            />
            <a
              class="inline-block text-3xl font-bold text-center align-middle text-red-500 hover:text-red-700 cursor-pointer"
              title="clear"
              data-clear
            >
              &times;
            </a>
          </div>
        </div>

        <div
          class="mx-auto w-full flex flex-row justify-center items-center gap-4"
          data-name="task__controls"
        >
          <button
            class="text-sm text-white text-center px-3 py-2 rounded bg-blue-600 hover:bg-blue-700"
            onClick=${this.toggleComplete}
          >
            Mark
            ${this.state.$isCompleted((value) =>
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
