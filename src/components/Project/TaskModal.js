import { html, render } from 'poor-man-jsx';
import { TASK } from '../../actions';
import Core from '../../core';
import { useLocationOptions } from '../../core/hooks';
import { SubtasksIcon } from '../../assets/icons';
import BaseTaskModal from './BaseTaskModal';
import Subtask from './Subtask';

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

    e.target.reset();
  };

  render() {
    const {
      projectOptions,
      listOptions,
      onProjectChange,
      onListChange,
      initializeListOptions,
      unsubscribe,
    } = useLocationOptions(this.data);

    this.template.push(
      {
        target: 'title',
        template: html`
          <div onDestroy=${unsubscribe}>
            <p class="inline text-sm text-gray-500 dark:text-gray-200">
              In
              <span class="sr-only">
                project
                ${this.task.$project((id) => Core.main.getProject(id).name)}
              </span>
            </p>
            <label>
              <span class="sr-only">Project</span>
              <select
                class="max-w-[128px] bg-transparent text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                name="project"
                onChange=${onProjectChange(this.transferTask)}
              >
                ${projectOptions}
              </select>
            </label>
            <p class="inline text-sm text-gray-500 dark:text-gray-200">
              ,
              <span class="sr-only">
                and in list
                ${this.task.$list(
                  (id) => Core.main.getList(this.task.project, id).name
                )}
              </span>
            </p>
            <label>
              <span class="sr-only">List</span>
              <select
                class="max-w-[128px] bg-transparent text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                name="list"
                onChange=${onListChange(this.transferTask)}
                onMount=${initializeListOptions}
              >
                ${listOptions}
              </select>
            </label>
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
              ${SubtasksIcon({ cls: 'dark:stroke-white', decorative: true })}
              <h3 class="text-md font-medium">Subtasks</h3>
            </div>

            <form onSubmit.prevent=${this.createSubtask}>
              <button
                class="text-xl text-blue-600 hover:text-blue-800"
                aria-label="Add subtask"
                type="submit"
              >
                +
              </button>
              <input
                class="text-inherit text-sm bg-inherit p-1 ml-2 rounded border-b border-solid border-gray-400 focus:border-gray-600 focus:ring"
                type="text"
                id="new-subtask"
                name="new-subtask"
                placeholder="Create subtask"
                data-validate
                required
              />
            </form>

            <div is-list class="space-y-1 divide-y-1 px-2">
              ${this.task.$subtasks.map(Subtask).map((item) => render(item))}
            </div>
          </div>
        `,
      }
    );

    return super.render();
  }
}
