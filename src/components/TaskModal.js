import { createHook, html } from 'poor-man-jsx';
import { createPopper } from '@popperjs/core';
import { TASK } from '../core/actions';
import Core from '../core';
import { popperShowWrapper, popperHideWrapper } from '../utils/popper';
import { dispatchCustomEvent } from '../utils/dispatch';
import convertToMarkdown from '../utils/showdown';
import { debounce } from '../utils/delay';
import logger from '../utils/logger';
import { $ } from '../utils/query';
import LabelPopover from './LabelPopover';

const TaskModal = (projectId, listId, taskId) => {
  const [state] = createHook({
    isEditingTitle: false,
    isEditingNotes: false,
    showPopover: false,
    data: Core.main.getTask(projectId, listId, taskId),
  });

  const getLatestData = () => {
    state.data = Core.main.getTask(projectId, listId, taskId);
  };

  const unsubscribe = [
    Core.event.on(TASK.UPDATE + '.error', logger.warning),
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

  const initPopover = function () {
    const popover = $(`#label-popover`);
    const popperInstance = createPopper(this, popover, {
      placement: 'right-end',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    });

    const show = popperShowWrapper(popperInstance, () => {
      dispatchCustomEvent(popover, 'popover:open');
    });
    const hide = popperHideWrapper(popperInstance);

    this.addEventListener('click', show);
    popover.addEventListener('popover:hide', hide);
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
        class="task-modal__title"
        required
        ${{
          $readonly: state.$isEditingTitle,
          onClick: toggleTitleEdit,
          onBlur: toggleTitleEdit,
          onInput: editTask,
        }}
      />
      <p class="task-modal__section">Labels</p>
      <button ${{ '@mount': initPopover }}>Add label</button>
      ${LabelPopover(projectId, (id) => console.log(id))}
      <p class="task-modal__section">Notes</p>
      <div
        component="notes"
        ${{
          // prettier-ignore
          $children: state.$isEditingNotes((val) =>
            val
                ? html`
                    <textarea
                      name="notes"
                      class="task-modal__notes"
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
      <p class="task-modal__section">Due Date</p>
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
