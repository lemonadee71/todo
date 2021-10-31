import { createHook, html } from 'poor-man-jsx';
import { TASK } from '../core/actions';
import { useTask } from '../core/hooks';
import Core from '../core';
import { usePopper } from '../utils/popper';
import { dispatchCustomEvent } from '../utils/dispatch';
import convertToMarkdown from '../utils/showdown';
import { debounce } from '../utils/delay';
import logger from '../utils/logger';
import { $ } from '../utils/query';
import LabelPopover from './LabelPopover';
import TaskLabel from './TaskLabel';

// data here points to the Task stored in main
// so we rely on the fact that changes are reflected on data
const TaskModal = (data) => {
  const [task, revoke] = useTask(data.project, data.list, data.id);
  const [state] = createHook({
    isEditingTitle: false,
    isEditingNotes: false,
  });

  const unsubscribe = Core.event.on(TASK.UPDATE + '.error', logger.warning);

  const editTask = debounce((e) => {
    const { name, value } = e.target;

    Core.event.emit(TASK.UPDATE, {
      project: data.project,
      list: data.list,
      task: data.id,
      data: {
        [name]: value,
      },
    });
  }, 200);

  const updateLabels = debounce((id, isSelected) => {
    const action = isSelected ? TASK.LABELS.ADD : TASK.LABELS.REMOVE;

    Core.event.emit(action, {
      project: data.project,
      list: data.list,
      task: data.id,
      data: { id },
    });
  }, 100);

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
    const [, onShow, onHide] = usePopper(this, popover, {
      placement: 'right-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    });

    this.addEventListener(
      'click',
      onShow(() => {
        dispatchCustomEvent(popover, 'popover:open');
      })
    );
    popover.addEventListener('popover:hide', onHide());
  };

  // TODO: Fix issue with title input
  // where keyboard inputs are not going in even if focused
  return html`
    <div
      ${{
        '@unmount': () => {
          unsubscribe();
          revoke();
        },
        onClick: toggleEdit,
      }}
    >
      <input
        type="text"
        value="${data.title}"
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
      <div
        class="task-modal__labels"
        is-list
        ${{ $children: task.$labels.map((label) => TaskLabel(label)) }}
      ></div>
      <button ${{ '@mount': initPopover }}>Add label</button>
      ${LabelPopover(data, updateLabels)}
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
                    >${data.notes.trim()}</textarea>
                    `
                : html`
                    <div 
                      class="task-modal__notes markdown-body"
                      ${{ onClick: toggleNotesEdit }}
                    >
                      ${convertToMarkdown(data.notes)}
                    </div>
                   
                    `
                ),
        }}
      ></div>
      <!-- Change this to a better date picker -->
      <p class="task-modal__section">Due Date</p>
      <input
        type="date"
        value="${data.dueDate}"
        name="dueDate"
        ${{ onChange: editTask }}
      />
    </div>
  `;
};

export default TaskModal;
