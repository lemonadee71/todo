import { html, render } from 'poor-man-jsx';
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

  transferTask = (_, selected, type) => {
    const list = { to: selected.list, from: this.data.list };
    const project =
      type === 'list'
        ? selected.project
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
        // ISSUE: Divider not showing
        template: html`
          <div class="space-y-2" data-name="task__subtasks">
            <div class="flex flex-row space-x-1 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-list-check"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#000000"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3.5 5.5l1.5 1.5l2.5 -2.5" />
                <path d="M3.5 11.5l1.5 1.5l2.5 -2.5" />
                <path d="M3.5 17.5l1.5 1.5l2.5 -2.5" />
                <line x1="11" y1="6" x2="20" y2="6" />
                <line x1="11" y1="12" x2="20" y2="12" />
                <line x1="11" y1="18" x2="20" y2="18" />
              </svg>
              <h3 class="text-md font-medium">Subtasks</h3>
            </div>

            <form class="create-list" onSubmit.prevent=${this.createSubtask}>
              <input
                class="text-black text-sm p-1 rounded focus:ring mr-2"
                type="text"
                id="new-subtask"
                name="new-subtask"
                placeholder="New subtask"
              />
              <button
                class="text-xl text-blue-600 hover:text-blue-800"
                type="submit"
              >
                +
              </button>
            </form>

            <div is-list class="space-y-1 divide-y-1">
              ${this.task.$subtasks
                .map((subtask, i) => new Subtask(subtask).render(i, 'normal'))
                .map((item) => render(item))}
            </div>
          </div>
        `,
      }
    );

    return super.render();
  }
}
