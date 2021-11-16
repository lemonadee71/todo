import { html } from 'poor-man-jsx';
import { DEPENDENCY_COLORS, DEPENDENCY_PREFIX } from '../../core/constants';
import { TASK } from '../../core/actions';
import Core from '../../core';
import BaseTaskModal from './BaseTaskModal';
import Subtask from './Subtask';

export default class TaskModal extends BaseTaskModal {
  constructor(data) {
    super(data, TASK);
  }

  createSubtask = (e) => {
    e.preventDefault();

    const input = e.target.elements['new-subtask'];
    Core.event.emit(TASK.SUBTASKS.ADD, {
      ...this.location,
      data: { title: input.value },
    });

    input.value = '';
  };

  removeDependency = (e) => {
    Core.event.emit(TASK.UPDATE, {
      ...this.location,
      data: {
        dependency: { action: 'remove', id: e.target.parentElement.dataset.id },
      },
    });
  };

  addDependency = (e) => {
    e.preventDefault();

    const type = e.target.elements['dependency-type'];
    const id = e.target.elements['dependency-id'];

    Core.event.emit(TASK.UPDATE, {
      ...this.location,
      data: { dependency: { action: 'add', type: type.value, id: id.value } },
    });

    id.value = '';
  };

  render() {
    this.extraContent = html`
      <div data-name="task__subtasks">
        <p class="task-modal__section">Subtasks</p>
        <form class="create-list" ${{ onSubmit: this.createSubtask }}>
          <input
            type="text"
            name="new-subtask"
            placeholder="Create new task"
            class="form__input"
          />
          <button class="form__btn">+</button>
        </form>
        <ul
          is-list
          ${{
            $children: this.task.$subtasks.map((subtask) =>
              new Subtask(subtask).render(this.data.completed)
            ),
          }}
        ></ul>
      </div>

      <div data-name="task__dependencies">
        <p class="task-modal__section">Dependencies</p>
        <form ${{ onSubmit: this.addDependency }}>
          <select name="dependency-type">
            ${Object.values(DEPENDENCY_PREFIX).map(
              (prefix) =>
                html`
                  <option value="${prefix.split(' ')[0].toLowerCase()}">
                    ${prefix}
                  </option>
                `
            )}
          </select>
          <input
            type="text"
            name="dependency-id"
            placeholder="Add dependency"
            class="form__input"
          />
          <button class="form__btn">+</button>
        </form>
        <ul
          is-list
          ${{
            $children: this.task.$dependencies.map(
              (item) =>
                html`
                  <div
                    key="${item.uuid}"
                    data-id="${item.uuid}"
                    class="task-label"
                    ${{ backgroundColor: DEPENDENCY_COLORS[item.type] }}
                  >
                    <span>
                      {% ${DEPENDENCY_PREFIX[item.type]} ${item.numId} %}
                    </span>
                    <div ${{ onClick: this.removeDependency }}>&times;</div>
                  </div>
                `
            ),
          }}
        ></ul>
      </div>
    `;

    return super.render();
  }
}
