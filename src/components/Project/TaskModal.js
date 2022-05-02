import { html, render } from 'poor-man-jsx';
import { TASK } from '../../core/actions';
import Core from '../../core';
import { useSelectLocation } from '../../utils/useSelectLocation';
import BaseTaskModal from './BaseTaskModal';
import Subtask from './Subtask';
import { SubtasksIcon } from '../../assets/icons';

export default class TaskModal extends BaseTaskModal {
  constructor(data) {
    super(data, TASK);

    [this.SelectLocation] = useSelectLocation(this.transferTask, this.data, {
      project: {
        class:
          'bg-transparent text-sm font-medium text-gray-600 hover:text-gray-800',
        onMount: (e) => {
          e.target.before(
            render(html`<span class="text-sm text-gray-500">In</span>`)
          );
          e.target.after(
            render(html`<span class="text-sm text-gray-500">, </span>`)
          );
        },
      },
      list: {
        class:
          'bg-transparent text-sm font-medium text-gray-600 hover:text-gray-800',
      },
    });
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
        // too lazy to specify margin manually so use default (append) instead
        // to avoid the sibling selector
        // method: 'after',
      },
      {
        // ISSUE: Divider not showing
        template: html`
          <div class="space-y-2" data-name="task__subtasks">
            <div class="flex flex-row space-x-1 items-center">
              ${SubtasksIcon()}
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
