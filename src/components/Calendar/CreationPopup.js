import flatpickr from 'flatpickr';
import { createHook, html } from 'poor-man-jsx';
import Core from '../../core';
import { TASK } from '../../core/actions';
import { debounce } from '../../utils/delay';
import { $ } from '../../utils/query';
import logger from '../../utils/logger';
import { formatToDateTime } from '../../utils/date';
import { useSelectLocation } from '../../utils/useSelectLocation';

const CreationPopup = (projectId, evt) => {
  const [state, revoke] = createHook({ dueDate: '' });
  const [SelectLocation] = useSelectLocation(
    null,
    { project: projectId },
    {
      project: {
        class: 'text-black w-full p-1 rounded mb-2',
        disabled: true,
      },
      list: { class: 'text-black w-full p-1 rounded' },
    }
  );

  const closePopup = () => {
    evt.guide.clearGuideElement();
    revoke();
    $('#creation-popup').remove();
  };

  const createTask = (e) => {
    let { title, project, list } = e.target.elements;
    title = title.value;
    project = project.value;
    list = list.value || 'default';

    Core.event.emit(
      TASK.ADD,
      { project, list, data: { title, dueDate: state.dueDate } },
      {
        onSuccess: closePopup,
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

    const instance = flatpickr(e.target, {
      enableTime: true,
      noCalendar: true,
      altInput: true,
      altFormat: 'F j, Y H:i',
      dateFormat: 'Y-m-d H:i',
      onChange: editDate,
      onValueUpdate: editDate,
    });

    e.target.addEventListener('@destroy', () => instance.destroy());
  };

  return html`
    <div
      class="relative text-white bg-[#272727] w-56 px-1 pt-5 pb-3 rounded-md text-sm"
      id="creation-popup"
      onPopupClose=${closePopup}
    >
      <button class="absolute top-0 right-0 mr-3 text-lg" onClick=${closePopup}>
        &times;
      </button>

      <form
        class="flex flex-col space-y-2 w-full px-2 tex-"
        onSubmit.prevent=${createTask}
      >
        <p class="text-sm font-medium">Create new task</p>
        <label>
          <p class="text-xs font-medium text-gray-500 mb-1">Title</p>
          <textarea
            class="text-black w-full p-1 rounded focus:ring resize-none break-words"
            name="title"
            placeholder="Task name"
            rows="1"
            data-autosize
          ></textarea>
        </label>

        <div>
          <p class="text-xs font-medium text-gray-500 mb-1">Location</p>
          ${SelectLocation}
        </div>

        <label>
          <p class="text-xs font-medium text-gray-500 mb-1">Date</p>
          <input
            class="text-black w-full p-1 rounded"
            type="text"
            name="dueDate"
            value="${formatToDateTime(evt.start.toDate())}"
            readonly
            onMount=${initDatePicker}
          />
        </label>
        <button
          class="rounded px-2 py-1 bg-blue-500 hover:bg-blue-700"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  `;
};

export default CreationPopup;
