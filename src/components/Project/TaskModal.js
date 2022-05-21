import { html, render } from 'poor-man-jsx';
import { TASK } from '../../actions';
import Core from '../../core';
import { useSelectLocation } from '../../utils/useSelectLocation';
import BaseTaskModal from './BaseTaskModal';
import Subtask from './Subtask';
import { SubtasksIcon } from '../../assets/icons';

export default class TaskModal extends BaseTaskModal {
  constructor(data) {
    super(data, TASK);
  }

  transferTask = (e, selected) => {
    const type = e.target.name;
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
    const {
      projectOptions,
      listOptions,
      onProjectChange,
      onListChange,
      initializeListOptions,
      unsubscribe,
    } = useSelectLocation(this.data);

    this.template.push(
      {
        target: 'title',
        template: html`
          <div onDestroy=${unsubscribe}>
            <span class="text-sm text-gray-500 dark:text-gray-200">In</span>
            <select
              class="w-16 max-w-32 bg-transparent text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
              name="project"
              onChange=${onProjectChange(this.transferTask)}
            >
              ${projectOptions}
            </select>
            <span class="text-sm text-gray-500 dark:text-gray-200">, </span>
            <select
              class="w-fit max-w-32 bg-transparent text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
              name="list"
              onChange=${onListChange(this.transferTask)}
              onMount=${initializeListOptions}
            >
              ${listOptions}
            </select>
          </div>
        `,
        // too lazy to specify margin manually so use default (append) instead
        // to avoid the sibling selector
        // method: 'after',
      },
      {
        target: 'date',
        method: 'after',
        template: html`
          <div class="space-y-2" data-name="task__subtasks">
            <div class="flex flex-row space-x-1 items-center">
              ${SubtasksIcon('dark:stroke-white')}
              <h3 class="text-md font-medium">Subtasks</h3>
            </div>

            <form onSubmit.prevent=${this.createSubtask}>
              <button
                class="text-xl text-blue-600 hover:text-blue-800"
                type="submit"
              >
                +
              </button>
              <input
                class="text-inherit text-sm bg-inherit p-1 rounded focus:ring ml-2"
                type="text"
                id="new-subtask"
                name="new-subtask"
                placeholder="New subtask"
              />
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
