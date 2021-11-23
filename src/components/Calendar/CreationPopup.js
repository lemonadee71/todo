import flatpickr from 'flatpickr';
import { createHook, html } from 'poor-man-jsx';
import Core from '../../core';
import { TASK } from '../../core/actions';
import { useRoot } from '../../core/hooks';
import { debounce } from '../../utils/delay';
import { $ } from '../../utils/query';
import logger from '../../utils/logger';
import { formatToDateTime } from '../../utils/date';

const CreationPopup = (evt) => {
  const [root, unsubscribe] = useRoot();
  const [state, revoke] = createHook({ selectedProject: '', dueDate: '' });

  const renderOptions = (item) =>
    html`<option value="${item.id}">${item.name}</option>`;

  const closePopup = () => {
    evt.guide.clearGuideElement();
    unsubscribe();
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

  const selectProject = (e) => {
    state.selectedProject = e.target.value;
  };

  const showLists = (projectId) => {
    if (!projectId) return [];

    return Core.main.getLists(projectId).map(renderOptions);
  };

  const initListOptions = (e) => {
    selectProject({ target: e.target.elements.project });
  };

  const initDatePicker = (e) => {
    // init date
    state.dueDate = e.target.value;

    const editDate = debounce(() => {
      state.dueDate = e.target.value;
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
    <div id="creation-popup" ${{ onPopupClose: closePopup }}>
      <span ${{ onClick: closePopup }}>&times;</span>
      <form
        ${{ onSubmit: createTask, onMount: initListOptions }}
        style="display: flex; flex-direction: column;"
      >
        <input type="text" name="title" placeholder="Unnamed Task" />
        <select
          name="project"
          ${{
            onChange: selectProject,
            $children: root.$projects.map(renderOptions),
          }}
        ></select>
        <select
          name="list"
          ${{ $children: state.$selectedProject(showLists) }}
        ></select>
        <input
          type="text"
          name="dueDate"
          value="${formatToDateTime(evt.start.toDate())}"
          ${{ onMount: initDatePicker }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  `;
};

export default CreationPopup;
