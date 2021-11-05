import { createHook, html, render } from 'poor-man-jsx';
import Core from '../core';
import { TASK } from '../core/actions';
import { useTask } from '../core/hooks';
import { debounce } from '../utils/delay';
import { dispatchCustomEvent } from '../utils/dispatch';
import { usePopper } from '../utils/popper';
import convertToMarkdown from '../utils/showdown';
import LabelPopover from './LabelPopover';
import TaskLabel from './TaskLabel';

export default class BaseTaskModal {
  constructor(type, data, action) {
    this.type = type;
    this.data = data;
    this.action = action;

    this.id = this.data.id;

    this.location = {
      project: this.data.project,
      list: this.data.list,
      // this should be implemented by inheriting children
      // but this is a quick fix for now
      task: this.data.parentTask || this.data.id,
      subtask: this.data.parentTask && this.data.id,
    };

    [this.task, this._revoke] = useTask(...Object.values(this.location));
    [this.state] = createHook({ isEditingTitle: false, isEditingNotes: false });

    this.extraContent = '';
  }

  editTask = (e) => {
    const { name, value } = e.target;

    Core.event.emit(this.action.UPDATE, {
      ...this.location,
      data: { [name]: value },
    });
  };

  updateLabels = (id, isSelected) => {
    const action = isSelected ? TASK.LABELS.ADD : TASK.LABELS.REMOVE;
    Core.event.emit(action, { ...this.location, data: { id } });
  };

  toggleTitleEdit = () => {
    this.state.isEditingTitle = !this.state.isEditingTitle;
  };

  toggleNotesEdit = () => {
    this.state.isEditingNotes = !this.state.isEditingNotes;
  };

  initPopover = (node) => {
    // append popover
    const popover = render(
      LabelPopover(this.data, this.updateLabels)
    ).firstElementChild;
    node.after(popover);

    const [, onShow, onHide] = usePopper(node, popover, {
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

    node.addEventListener(
      'click',
      onShow(() => {
        dispatchCustomEvent(popover, 'popover:open');
      })
    );
    popover.addEventListener('popover:hide', onHide());
  };

  render() {
    // TODO: Fix issue with title input where keyboard inputs are not going in even if focused
    // TODO: Fix data attr and classes here
    return html`
      <div ${{ '@destroy': this._revoke }}>
        <input
          type="text"
          value="${this.data.title}"
          name="title"
          class="task-modal__title"
          required
          ${{
            $readonly: this.state.$isEditingTitle,
            onClick: this.toggleTitleEdit,
            onBlur: this.toggleTitleEdit,
            onInput: debounce(this.editTask, 200),
          }}
        />

        <!-- Change this to a better date picker -->
        <div data-name="task__date">
          <p class="task-modal__section">Due Date</p>
          <input
            type="date"
            value="${this.data.dueDate}"
            name="dueDate"
            ${{ onChange: this.editTask }}
          />
        </div>

        <div data-name="task__labels">
          <p class="task-modal__section">Labels</p>
          <div
            class="task-modal__labels"
            is-list
            ${{ $children: this.task.$labels.map((label) => TaskLabel(label)) }}
          ></div>
          <button ${{ '@mount': this.initPopover }}>Add label</button>
        </div>

        <div data-name="task__notes">
          <p class="task-modal__section">Notes</p>
          <div
            component="notes"
            ${{
              $children: this.state.$isEditingNotes((val) =>
                val
                  ? // prettier-ignore
                    html`
                      <textarea
                      name="notes"
                      class="task-modal__notes"
                      ${{
                        onInput: this.editTask,
                        onBlur: this.toggleNotesEdit,
                      }}
                      >${this.data.notes.trim()}</textarea>`
                  : html`
                      <div
                        class="task-modal__notes markdown-body"
                        ${{ onClick: this.toggleNotesEdit }}
                      >
                        ${convertToMarkdown(this.data.notes)}
                      </div>
                    `
              ),
            }}
          ></div>
        </div>

        ${this.extraContent}
      </div>
    `;
  }
}
