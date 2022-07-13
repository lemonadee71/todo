import flatpickr from 'flatpickr';
import { createHook, html } from 'poor-man-jsx';
import Core from '../../core';
import { useLocationOptions } from '../../core/hooks';
import { TASK } from '../../actions';
import { debounce } from '../../utils/delay';
import logger from '../../utils/logger';
import { dispatchCustom } from '../../utils/dispatch';

const CreationPopup = (projectId) => {
  const [state, revoke] = createHook({
    dueDate: '',
    isOpen: false,
    initialDate: new Date(),
  });
  const { projectOptions, listOptions, initializeListOptions, unsubscribe } =
    useLocationOptions({ project: projectId });
  let flatpickrInstance;

  const togglePopup = (value) => {
    state.isOpen = value ?? !state.isOpen;
  };

  const changeInitialDate = (e) => {
    state.initialDate = e.detail.date;
    flatpickrInstance.setDate(state.initialDate, true);
  };

  const createTask = (e) => {
    let { title, project, list } = e.target.elements;
    title = title.value || 'Unnamed Task';
    project = project.value;
    list = list.value || 'default';

    Core.event.emit(
      TASK.ADD,
      { project, list, data: { title, dueDate: state.dueDate } },
      {
        onSuccess: () => dispatchCustom('popup:close', e.target.parentElement),
        onError: logger.error,
      }
    );
  };

  const initDatePicker = (e) => {
    // init date
    state.dueDate = e.target.value;

    const editDate = debounce((_, date) => {
      state.dueDate = date;
    }, 100);

    flatpickrInstance = flatpickr(e.target, {
      enableTime: true,
      noCalendar: true,
      altInput: true,
      altFormat: 'F j, Y H:i',
      dateFormat: 'Y-m-d H:i',
      onChange: editDate,
      onValueUpdate: editDate,
    });

    e.target.addEventListener('@destroy', () => flatpickrInstance.destroy());
  };

  return html`
    <div
      id="creation-popup"
      class="relative text-white bg-[#272727] w-56 px-1 pt-5 pb-3 rounded-md text-sm"
      style_visibility=${state.$isOpen((value) =>
        value ? 'visible' : 'hidden'
      )}
      onDateChange=${changeInitialDate}
      onPopup:toggle=${() => togglePopup()}
      onPopup:open=${() => togglePopup(true)}
      onPopup:close=${() => togglePopup(false)}
      onDestroy=${revoke}
    >
      <button
        class="absolute top-0 right-0 mr-3 text-lg"
        onClick=${(e) => dispatchCustom('popup:close', e.target.parentElement)}
        aria-label="Close popup"
      >
        &times;
      </button>

      <form
        class="flex flex-col space-y-2 w-full px-2"
        onSubmit.prevent=${createTask}
      >
        <p class="text-sm font-medium">New Task</p>
        <label>
          <p class="text-xs font-medium text-gray-500 mb-1">Title</p>
          <textarea
            class="text-black w-full p-1 rounded focus:ring resize-none break-words"
            name="title"
            rows="1"
            data-autosize
          ></textarea>
        </label>

        <fieldset onDestroy=${unsubscribe}>
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
              onMount=${initializeListOptions}
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
            value=${state.initialDate}
            readonly
            onMount=${initDatePicker}
          />
        </label>

        <button
          class="rounded px-2 py-1 bg-blue-500 hover:bg-blue-700"
          type="submit"
        >
          Create
        </button>
      </form>
    </div>
  `;
};

export default CreationPopup;
