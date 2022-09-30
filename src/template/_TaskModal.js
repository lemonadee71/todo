import flatpickr from 'flatpickr';
import PoorManJSX, { apply, createHook, html } from 'poor-man-jsx';
import { TASK } from '../actions';
import Core from '../core';
import { debounce } from '../utils/delay';
import { $ } from '../utils/query';
import convertToMarkdown from '../utils/showdown';
import { useUndo } from '../utils/undo';
import { runOnlyIfClick } from '../utils/keyboard';

const BaseTaskModal = ({ children, props }) => {
  const { action, data, hook, cleanup } = props;
  const { type, id } = data;

  const state = createHook({ isEditingNotes: false, isPopoverOpen: false });
  const popoverBtn = {};

  const toggleNotesEdit = () => {
    state.isEditingNotes = !state.isEditingNotes;
  };

  const togglePopover = () => {
    state.isPopoverOpen = !state.isPopoverOpen;
  };

  const updateLabel = (labelId, isSelected) => {
    Core.event.emit(isSelected ? TASK.LABELS.ADD : TASK.LABELS.REMOVE, {
      ...data.location,
      data: { id: labelId },
    });
  };

  const editTask = (e) => {
    if (e.detail && !e.detail.isValid) return;

    const { name, value } = e.target;

    Core.event.emit(action.UPDATE, {
      ...data.location,
      data: { [name]: value },
    });
  };

  const deleteTask = useUndo({
    type: action,
    message: `${type[0].toUpperCase() + type.slice(1)} removed`,
    data: { ...data.location, id },
    // close modal to prevent errors from further actions
    onSuccess: () => $('#modal').pop(),
  });

  const initDatePicker = (e) => {
    const editDate = (_, date) =>
      editTask({ target: { name: 'dueDate', value: date } });

    const instance = flatpickr(e.target, {
      wrap: true,
      enableTime: true,
      altInput: true,
      altFormat: 'F j, Y',
      onChange: debounce(editDate, 100),
      onValueUpdate: debounce(editDate, 100),
    });

    apply(e.target, { onDestroy: () => instance.destroy() });
  };

  return html`
    <div
      class="relative w-5/6 max-w-lg mx-auto my-10 py-4 px-5 rounded-lg bg-white dark:bg-[#353535]"
      onDestroy=${cleanup}
    >
      <div class="mb-4" data-name="task__buttons">
        <button
          class="absolute top-0 right-4 text-2xl text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-300"
          aria-label="Close modal"
          onClick=${() => $('#modal').close()}
        >
          &times;
        </button>

        ${children.buttons}
      </div>

      <!-- Title -->
      <div class="mb-4" data-name="task__title">
        <h2 class="sr-only">${data.title}</h2>
        <auto-textarea
          :validate=${{ type: 'aggressive', delay: 200 }}
          class="font-semibold text-xl w-full bg-inherit placeholder:text-base placeholder:text-slate-600 placeholder:font-normal dark:placeholder:text-slate-300"
          placeholder="Task title (required)"
          value=${data.title}
          onValidate=${editTask}
        />
      </div>

      ${children.after_title}

      <!-- Labels -->
      <div class="mb-4" data-name="task__labels">
        <div class="flex flex-row space-x-1 items-center mb-2">
          <my-icon name="label" class="dark:stroke-white" decorative="true" />
          <h3 class="text-md font-medium">Labels</h3>
        </div>

        <div class="flex flex-row flex-wrap gap-1">
          ${hook.$labels.map(
            (label) =>
              html`
                <common-badge
                  class="text-sm text-white"
                  background=${label.color}
                  props=${{ _key: label.id }}
                >
                  ${label.name}
                </common-badge>
              `
          ).unshift(html`
            <button
              :skip
              :key="add-label"
              :ref=${popoverBtn}
              class="text-sm font-medium text-gray-600 px-3 py-1 rounded bg-[#dedede] hover:text-gray-800 dark:text-white dark:hover:text-gray-300 dark:bg-transparent dark:border dark:border-solid dark:border-white"
              aria-label="Add or edit labels"
              aria-haspopup="dialog"
              aria-expanded=${state.$isPopoverOpen}
              data-tooltip=${{ text: 'Add label', placement: 'top' }}
              onClick=${togglePopover}
            >
              +
            </button>
          `)}
        </div>

        <label-popover
          data=${data}
          state=${state}
          anchor=${popoverBtn}
          onLabelClick=${updateLabel}
        />
      </div>

      ${children.after_labels}

      <!-- Notes -->
      <div class="mb-4" data-name="task__notes">
        <div class="flex flex-row space-x-1 items-center mb-2">
          <my-icon name="notes" class="dark:stroke-white" decorative="true" />
          <h3 class="text-md font-medium">Notes</h3>
        </div>

        <div class="max-h-80 p-1 overflow-auto">
          ${state.$isEditingNotes((value) =>
            value
              ? html`
                  <auto-textarea
                    class="w-full h-72 p-2 text-inherit bg-inherit placeholder:text-base"
                    name="notes"
                    placeholder="Edit notes"
                    value=${data.notes}
                    onInput=${editTask}
                    onBlur=${toggleNotesEdit}
                    onMount=${(e) => e.target.focus()}
                  />
                `
              : html`
                  <div
                    class="m-0.5 p-1 prose prose-slate dark:prose-invert"
                    tabindex="0"
                    onClick=${toggleNotesEdit}
                    onKeydown=${runOnlyIfClick(toggleNotesEdit)}
                  >
                    ${data.notes.trim()
                      ? convertToMarkdown(data.notes)
                      : html`<div class="text-base">Add notes</div>`}
                  </div>
                `
          )}
        </div>
      </div>

      ${children.after_notes}

      <!-- Date -->
      <div class="mb-4" data-name="task__date">
        <div class="flex flex-row space-x-1 items-center mb-2">
          <my-icon
            name="calendar"
            class="dark:stroke-white"
            decorative="true"
          />
          <h3 class="text-md font-medium">Due Date</h3>
        </div>

        <div
          class="flatpickr w-56 px-2 flex justify-between items-center border border-solid border-gray-400 rounded-md focus-within:ring focus-within:border-gray-600 dark:focus-within:border-gray-200"
          onLoad=${initDatePicker}
        >
          <input
            class="w-full font-light text-sm text-inherit bg-inherit focus:outline-none"
            type="text"
            name="dueDate"
            value="${data.dueDate}"
            placeholder="Select date"
            data-input
          />
          <button
            class="text-3xl font-medium text-center text-red-500 hover:text-red-700 cursor-pointer"
            aria-label="Remove due date"
            data-tooltip=${{ text: 'Clear date', placement: 'right' }}
            data-clear
          >
            &times;
          </button>
        </div>
      </div>

      ${children.after_date}

      <!-- Controls -->
      <div
        class="mx-auto flex flex-row justify-center items-center gap-4"
        data-name="task__controls"
      >
        <button
          class="text-sm text-white text-center px-3 py-2 rounded bg-blue-600 hover:bg-blue-700"
          onClick=${() => editTask({ target: { name: 'completed' } })}
        >
          Mark
          ${hook.$completed((value) => (value ? 'uncompleted' : 'completed'))}
        </button>
        <button
          class="text-sm text-white text-center px-3 py-2 rounded bg-red-600 hover:bg-red-700"
          onClick=${deleteTask}
        >
          Delete
        </button>

        ${children.controls}
      </div>

      ${children.unnamed}
    </div>
  `;
};

PoorManJSX.customComponents.define('task-modal-template', BaseTaskModal);

export default BaseTaskModal;
