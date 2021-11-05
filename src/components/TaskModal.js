import { html } from 'poor-man-jsx';
import { TASK } from '../core/actions';
import Core from '../core';
import BaseTaskModal from './BaseTaskModal';
import Subtask from './Subtask';

export default class TaskModal extends BaseTaskModal {
  constructor(data) {
    super('task', data, TASK);
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

  render() {
    this.extraContent = html`
      <div data-name="task__subtasks">
        <p class="task-modal__section">Subtasks</p>
        <form class="create-list" ${{ onSubmit: this.createSubtask }}>
          <input
            type="text"
            name="new-subtask"
            id="new-subtask"
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
    `;

    return super.render();
  }
}
