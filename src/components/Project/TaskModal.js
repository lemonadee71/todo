import { html } from 'poor-man-jsx';
import { TASK } from '../../core/actions';
import Core from '../../core';
import { useSelectLocation } from '../../utils/useSelectLocation';
import BaseTaskModal from './BaseTaskModal';
import Subtask from './Subtask';

export default class TaskModal extends BaseTaskModal {
  constructor(data) {
    super(data, TASK);

    [this.SelectLocation] = useSelectLocation(this.transferTask, this.data);
  }

  transferTask = (e, selected) => {
    const type = e.target.name;
    const list = { to: selected.list, from: this.data.list };
    const project =
      type === 'list'
        ? this.data.project
        : { to: selected.project, from: this.data.project };

    Core.event.emit(TASK.TRANSFER, {
      project,
      list,
      type,
      task: this.id,
      data: { position: 999 },
    });
  };

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
    this.template.push(
      {
        template: this.SelectLocation,
        target: 'title',
        method: 'after',
      },
      {
        template: html`
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
                $children: this.task.$subtasks.map((subtask, i) =>
                  new Subtask(subtask).render(i)
                ),
              }}
            ></ul>
          </div>
        `,
      }
    );

    return super.render();
  }
}
