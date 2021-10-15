import { createHook, html } from 'poor-man-jsx';
import convertToMarkdown from '../utils/showdown';
import { debounce } from '../utils/delay';
import { TASK } from '../core/actions';
import Core from '../core';

const TaskModal = (projectId, listId, taskId) => {
  const [state] = createHook({
    isEditingTitle: false,
    isEditingNotes: false,
    data: Core.main.getTask(projectId, listId, taskId),
  });

  const getLatestData = () => {
    state.data = Core.main.getTask(projectId, listId, taskId);
  };

  const unsubscribe = Core.event.on(TASK.UPDATE + '.success', getLatestData);

  const editTask = debounce((e) => {
    console.log('Updating...', e.target);

    Core.event.emit(TASK.UPDATE, {
      project: projectId,
      list: listId,
      task: taskId,
      data: {
        [e.target.name]: e.target.value,
      },
    });
  }, 200);

  const toggleTitleEdit = () => {
    state.isEditingTitle = !state.isEditingTitle;
  };

  const toggleNotesEdit = () => {
    state.isEditingNotes = !state.isEditingNotes;
  };

  return html`
    <div ${{ '@unmount': unsubscribe }}>
      <input
        type="text"
        value="${state.data.title}"
        name="title"
        required
        ${{
          $disabled: state.$isEditingTitle,
          onInput: editTask,
        }}
      />
      <div
        component="notes"
        ${{
          // prettier-ignore
          $children: state.$isEditingNotes((val) =>
            val
                ? html`
                    <textarea
                      name="notes"
                      cols="30"
                      rows="10"
                      ${{ onInput: editTask, onBlur: toggleNotesEdit }}
                    >
                      ${state.data.notes}
                    </textarea>
                    `
                : html`
                    <div ${{ innerHTML: convertToMarkdown(state.data.notes) }}></div>
                    <button ${{ onClick: toggleNotesEdit }}>Edit</button>
                    `
                ),
        }}
      ></div>
      <input
        type="date"
        value="${state.data.dueDate}"
        name="dueDate"
        ${{ onChange: editTask }}
      />
    </div>
  `;
};

export default TaskModal;
