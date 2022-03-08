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
  const [SelectLocation] = useSelectLocation(null, { project: projectId });
  const [state, revoke] = createHook({ dueDate: '' });

  const closePopup = () => {
    evt.guide.clearGuideElement();
    revoke();
    $('#creation-popup').remove();
  };

  const createTask = (e) => {
    e.preventDefault();
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

  const init = function () {
    this.querySelector('[name="project"]').setAttribute('disabled', '');
  };

  return html`
    <div id="creation-popup" onMount=${init} onPopupClose=${closePopup}>
      <span ${{ onClick: closePopup }}>&times;</span>
      <form
        onSubmit=${createTask}
        style="display: flex; flex-direction: column;"
      >
        <input type="text" name="title" placeholder="Unnamed Task" />
        ${SelectLocation}
        <input
          type="text"
          name="dueDate"
          value="${formatToDateTime(evt.start.toDate())}"
          readonly
          onMount=${initDatePicker}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  `;
};

export default CreationPopup;
