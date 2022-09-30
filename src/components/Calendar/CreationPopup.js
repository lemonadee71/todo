import flatpickr from 'flatpickr';
import PoorManJSX, { apply, html, watch } from 'poor-man-jsx';
import Core from '../../core';
import { useLocationOptions } from '../../core/hooks';
import { TASK } from '../../actions';
import { debounce } from '../../utils/delay';
import logger from '../../utils/logger';

const CreationPopup = ({ props: { id, ref, state: parentState } }) => {
  let datePicker;
  let dueDate;

  const { projectOptions, listOptions, initializeListOptions, unsubscribe } =
    useLocationOptions({ project: id });

  const cleanup = [
    unsubscribe,
    watch(parentState.$clickedDate, (date) => {
      datePicker.setDate(date, true);
    }),
    watch(parentState.$isPopupOpen, (value) => {
      if (!value) ref.guide?.clearGuideElement?.();
    }),
  ];

  const createTask = (e) => {
    let { title, project, list } = e.target.elements;
    title = title.value || 'Unnamed Task';
    project = project.value;
    list = list.value || 'default';

    Core.event.emit(
      TASK.ADD,
      { project, list, data: { title, dueDate } },
      {
        onSuccess: () => {
          parentState.isPopupOpen = false;
        },
        onError: logger.error,
      }
    );
  };

  const initDatePicker = (e) => {
    const editDate = (_, date) => {
      dueDate = date;
    };

    datePicker = flatpickr(e.target, {
      enableTime: true,
      noCalendar: true,
      altInput: true,
      altFormat: 'F j, Y H:i',
      dateFormat: 'Y-m-d H:i',
      onChange: debounce(editDate, 100),
      onValueUpdate: debounce(editDate, 100),
    });

    apply(e.target, { onDestroy: datePicker.destroy });
  };

  return html`
    <div
      :ref=${['popup', ref]}
      :show.visibility=${parentState.$isPopupOpen}
      class="relative text-white bg-[#272727] w-56 px-1 pt-5 pb-3 rounded-md text-sm"
      onDestroy=${cleanup}
    >
      <button
        class="absolute top-0 right-0 mr-3 text-lg"
        aria-label="Close popup"
        onClick=${() => {
          parentState.isPopupOpen = false;
        }}
      >
        &times;
      </button>

      <form
        class="flex flex-col space-y-2 w-full px-2"
        onSubmit.prevent=${createTask}
      >
        <fieldset>
          <legend class="text-sm font-medium">New Task</legend>

          <label>
            <p class="text-xs font-medium text-gray-500 mb-1">Title</p>
            <auto-textarea class="text-black w-full" name="title" />
          </label>

          <fieldset>
            <legend class="text-xs font-medium text-gray-500 mb-1">
              Location
            </legend>

            <label>
              <span class="sr-only">Project</span>
              <select
                class="text-black w-full p-1 rounded mb-2"
                name="project"
                disabled
              >
                ${projectOptions}
              </select>
            </label>

            <label>
              <span class="sr-only">List</span>
              <select
                class="text-black w-full p-1 rounded"
                name="list"
                onLoad=${initializeListOptions}
              >
                ${listOptions}
              </select>
            </label>
          </fieldset>

          <label>
            <p class="text-xs font-medium text-gray-500 mb-1">Date</p>
            <input
              class="text-black w-full p-1 rounded"
              type="text"
              name="dueDate"
              readonly
              onLoad=${initDatePicker}
            />
          </label>

          <button
            class="rounded px-2 py-1 bg-blue-500 hover:bg-blue-700"
            type="submit"
          >
            Create
          </button>
        </fieldset>
      </form>
    </div>
  `;
};

PoorManJSX.customComponents.define('create-event-popup', CreationPopup);

export default CreationPopup;
