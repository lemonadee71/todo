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

  const unsubscribe = [
    Core.event.on(TASK.UPDATE + '.error', (error) => alert(error.message)),
    Core.event.on(TASK.UPDATE + '.success', getLatestData),
  ];

  const editTask = debounce((e) => {
    const { name, value } = e.target;

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

  const toggleEdit = (e) => {
    if (e.target.matches('.task-modal')) {
      state.isEditingTitle = false;
      state.isEditingNotes = false;
    }
  };

  // TODO: Fix issue with title input
  // where keyboard inputs are not going in even if focused
  return html`
    <div
      ${{
        '@unmount': () => unsubscribe.forEach((cb) => cb()),
        onClick: toggleEdit,
      }}
    >
      <input
        type="text"
        value="${state.data.title}"
        name="title"
        class="text-input task-modal__title"
        required
        ${{
          $readonly: state.$isEditingTitle,
          onClick: toggleTitleEdit,
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
                      class="text-input task-modal__notes"
                      ${{ onInput: editTask, onBlur: toggleNotesEdit }}
                    >${state.data.notes.trim()}</textarea>
                    `
                : html`
                    <div 
                      class="task-modal__notes markdown-body"
                    ${{ 
                      innerHTML: convertToMarkdown(state.data.notes),
                      onClick: toggleNotesEdit 
                    }}></div>
                   
                    `
                ),
        }}
      ></div>
      <!-- Change this to a better date picker -->
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
