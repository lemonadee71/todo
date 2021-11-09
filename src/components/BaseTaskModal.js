import { createHook, html, render } from 'poor-man-jsx';
import Core from '../core';
import { TASK } from '../core/actions';
import { useTask } from '../core/hooks';
import { debounce } from '../utils/delay';
import { dispatchCustomEvent } from '../utils/dispatch';
import { usePopper } from '../utils/popper';
import convertToMarkdown from '../utils/showdown';
import LabelPopover from './LabelPopover';

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
      task: this.data.parent || this.data.id,
      subtask: this.data.parent && this.data.id,
    };

    [this.task, this._revoke] = useTask(...Object.values(this.location));
    [this.state] = createHook({ isEditingTitle: false, isEditingNotes: false });

    this.extraContent = '';
  }

  editTask = (e) => {
    const { name, value } = e.target;
    try {
      Core.event.emit(
        this.action.UPDATE,
        {
          ...this.location,
          data: { [name]: value },
        },
        { rethrow: true }
      );
    } catch (error) {
      if (name === 'title') {
        e.target.value = this.data.title;
      }
    }
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

  initPopover = (evt) => {
    const node = evt.target;

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
      <div ${{ onDestroy: this._revoke }}>
        <input
          class="task-modal__title"
          type="text"
          name="title"
          value="${this.data.title}"
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
            name="dueDate"
            value="${this.data.dueDate}"
            ${{ onChange: this.editTask }}
          />
        </div>

        <div data-name="task__labels">
          <p class="task-modal__section">Labels</p>
          <div
            is-list
            class="task-modal__labels"
            ${{
              $children: this.task.$labels.map(
                (label) => html`
                  <div
                    is-text
                    key="${label.id}"
                    class="task-label"
                    ${{ backgroundColor: label.color }}
                  >
                    {% ${label.name} %}
                  </div>
                `
              ),
            }}
          ></div>
          <button ${{ onMount: this.initPopover }}>Add label</button>
        </div>

        <div data-name="task__notes">
          <p class="task-modal__section">Notes</p>
          <div
            ${{
              $children: this.state.$isEditingNotes((val) =>
                val
                  ? // prettier-ignore
                    html`
                      <textarea
                        class="task-modal__notes"
                        name="notes"
                        ${{
                          onInput: this.editTask,
                          onBlur: this.toggleNotesEdit,
                        }}
                      >${this.data.notes.trim()}</textarea>
                    `
                  : html`
                      <div
                        class="markdown-body task-modal__notes"
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
