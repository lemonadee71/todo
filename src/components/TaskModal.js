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
    const { name, value } = e.target;

    if (name === 'title' && !value.trim()) {
      alert('Task must have a title');
      e.target.value = state.data.title;
      return;
    }

    Core.event.emit(TASK.UPDATE, {
      project: projectId,
      list: listId,
      task: taskId,
      data: {
        [name]: value,
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
          $readonly: state.$isEditingTitle,
          onDblclick: toggleTitleEdit,
          onBlur: toggleTitleEdit,
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
