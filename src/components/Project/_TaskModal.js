import { html } from 'poor-man-jsx';
import { TASK } from '../../actions';
import Core from '../../core';
import { useLocationOptions, useTask } from '../../core/hooks';
import Subtask from './Subtask';

const TaskModal = (data) => {
  const [task, cleanup] = useTask(...Object.values(data.location));
  const {
    projectOptions,
    listOptions,
    onProjectChange,
    onListChange,
    initializeListOptions,
    unsubscribe,
  } = useLocationOptions(data);

  const transferTask = (e, selected) => {
    const type = e.target.name;
    const list = { to: selected.list, from: data.list };
    const project =
      type === 'list'
        ? selected.project
        : { to: selected.project, from: data.project };

    Core.event.emit(TASK.TRANSFER, {
      project,
      list,
      type,
      task: data.id,
      data: { position: 999 },
    });
  };

  const createSubtask = (e) => {
    const input = e.target.elements['new-subtask'];
    Core.event.emit(TASK.SUBTASKS.ADD, {
      ...data.location,
      data: { title: input.value },
    });

    e.target.reset();
  };

  return html`
    <task-modal-template
      action=${TASK}
      data=${data}
      hook=${task}
      cleanup=${[cleanup, unsubscribe]}
    >
      <div :slot="after_title">
        <p class="inline text-sm text-gray-500 dark:text-gray-200">
          In
          <span class="sr-only">
            project ${task.$project((id) => Core.main.getProject(id).name)}
          </span>
        </p>

        <label>
          <span class="sr-only">Project</span>
          <select
            class="max-w-[128px] bg-transparent text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            name="project"
            onChange=${onProjectChange(transferTask)}
          >
            ${projectOptions}
          </select>
        </label>

        <p class="inline text-sm text-gray-500 dark:text-gray-200">
          ,
          <span class="sr-only">
            and in list
            ${task.$list((id) => Core.main.getList(task.project, id).name)}
          </span>
        </p>

        <label>
          <span class="sr-only">List</span>
          <select
            class="max-w-[128px] bg-transparent text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            name="list"
            onChange=${onListChange(transferTask)}
            onMount=${initializeListOptions}
          >
            ${listOptions}
          </select>
        </label>
      </div>

      <div :slot="after_date" class="space-y-2" data-name="task__subtasks">
        <div class="flex flex-row space-x-1 items-center">
          <my-icon name="subtask" class="dark:stroke-white" decorative="true" />
          <h3 class="text-md font-medium">Subtasks</h3>
        </div>

        <form onSubmit.prevent=${createSubtask}>
          <button
            class="text-xl text-blue-600 hover:text-blue-800"
            aria-label="Add subtask"
            type="submit"
          >
            +
          </button>
          <input
            :validate
            class="text-inherit text-sm bg-inherit p-1 ml-2 rounded border-b border-solid border-gray-400 focus:border-gray-600 focus:ring"
            type="text"
            id="new-subtask"
            name="new-subtask"
            placeholder="Create subtask"
            required
          />
        </form>

        <div class="space-y-1 divide-y-1 px-2">
          ${task.$subtasks.map(Subtask)}
        </div>
      </div>
    </task-modal-template>
  `;
};

export default TaskModal;
