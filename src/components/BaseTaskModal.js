import flatpickr from 'flatpickr';
import { createHook, html, render } from 'poor-man-jsx';
import Core from '../core';
import { TASK } from '../core/actions';
import { POPPER_CONFIG } from '../core/constants';
import { useTask } from '../core/hooks';
import { debounce } from '../utils/delay';
import { dispatchCustomEvent } from '../utils/dispatch';
import { usePopper } from '../utils/popper';
import { $ } from '../utils/query';
import convertToMarkdown from '../utils/showdown';
import LabelPopover from './LabelPopover';

export default class BaseTaskModal {
  constructor(data, action) {
    this.type = data.type;
    this.data = data;
    this.action = action;

    this.id = this.data.id;

    [this.task, this._revoke] = useTask(...Object.values(this.location));
    [this.state] = createHook({ isEditingTitle: false, isEditingNotes: false });

    this.extraContent = '';
  }

  get location() {
    return {
      project: this.data.project,
      list: this.data.list,
      task: this.data.id,
    };
  }

  editTask = (e) => {
    const { name, value } = e.target;
    Core.event.emit(
      this.action.UPDATE,
      {
        ...this.location,
        data: { [name]: value },
      },
      {
        onError: () => {
          if (name === 'title') {
            e.target.value = this.data.title;
          }
        },
      }
    );
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

  initDatePicker = (e) => {
    const editDate = debounce((_, date) => {
      this.editTask({ target: { name: 'dueDate', value: date } });
    }, 100);

    const instance = flatpickr(e.target, {
      wrap: true,
      enableTime: true,
      altInput: true,
      altFormat: 'F j, Y',
      onChange: editDate,
      onValueUpdate: editDate,
    });

    $('input', e.target).addEventListener('@destroy', () => instance.destroy());
  };

  initPopover = (evt) => {
    const node = evt.target;

    // append popover
    const popover = render(
      LabelPopover(this.data, this.updateLabels)
    ).firstElementChild;
    node.after(popover);

    const [, onShow, onHide] = usePopper(node, popover, {
      ...POPPER_CONFIG,
      placement: 'right-start',
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

        <div
          class="flatpickr task-modal__date"
          data-name="task__date"
          ${{ onCreate: this.initDatePicker }}
        >
          <p class="task-modal__section">Due Date</p>
          <input
            type="text"
            name="dueDate"
            value="${this.data.dueDate}"
            placeholder="Select date..."
            data-input
          />
          <span title="clear" data-clear>&times;</span>
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
