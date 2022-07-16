import Sortable from 'sortablejs';
import { createHook, html } from 'poor-man-jsx';
import { FIREBASE, PROJECT, TASK } from '../../actions';
import Core from '../../core';
import { useUndo } from '../../utils/undo';
import { isGuest } from '../../utils/auth';
import Task from './Task';
import { AddIcon, DeleteIcon } from '../../assets/icons';

const List = (data, pos) => {
  const [state] = createHook({ showCompleted: false });

  const toggleCompletedTasks = () => {
    if (!isGuest()) {
      Core.event.emit(FIREBASE.TASK.FETCH_COMPLETED, {
        project: data.project,
        list: data.id,
      });
    }

    state.showCompleted = !state.showCompleted;
  };

  const deleteList = useUndo({
    type: PROJECT.LISTS,
    message: 'List removed',
    data: {
      id: data.id,
      project: data.project,
      list: data.id,
    },
  });

  const createTask = (e) => {
    const input = e.target.elements['new-task'];

    Core.event.emit(TASK.ADD, {
      project: data.project,
      list: data.id,
      data: { title: input.value },
    });

    e.target.reset();
  };

  const transferTask = (action, taskId, subtaskId, fromList, position) => {
    Core.event.emit(action, {
      project: data.project,
      list: { to: data.id, from: fromList },
      task: taskId,
      subtask: subtaskId,
      type: 'list',
      data: { position },
    });
  };

  const moveTask = (id, position) => {
    Core.event.emit(TASK.MOVE, {
      project: data.project,
      list: data.id,
      task: id,
      data: { position },
    });
  };

  const init = function () {
    Sortable.create(this, {
      group: 'tasks',
      animation: 150,
      ghostClass: 'rotate-1',
      // prevents sorting on touch
      // delay: 10,
      draggable: '.task',
      filter: 'input,button',
      onUpdate: (e) => moveTask(e.item.dataset.id, e.newIndex),
      onAdd: (e) => {
        const { id, location } = e.item.dataset;
        const [, fromList, taskId, subtaskId] = location.split(',');
        const action = subtaskId ? TASK.SUBTASKS.TRANSFER : TASK.TRANSFER;

        transferTask(action, taskId, subtaskId ?? id, fromList, e.newIndex);
      },
    });
  };

  // ?TODO: Add animation when task is moved to completed
  // BUG: There are z-index issues here
  return html`
    <div
      ignore="class"
      class="tasklist w-72 pt-3 pb-4 space-y-2 rounded-lg bg-[#dedede] dark:bg-[#272727] sm:relative z-0"
      id="${data.id}"
      tabindex="0"
      data-id="${data.id}"
      data-location="${data.project},${data.id}"
      data-position="${pos}"
      data-sortable
      data-sortable-action="${PROJECT.LISTS.MOVE}"
      data-sortable-style=".ring-4"
    >
      <!-- List header -->
      <div
        class="sm:sticky sm:top-0 mx-0.5 my-2 px-2 space-y-1 bg-[#dedede] dark:bg-[#272727] z-[3]"
      >
        <div class="flex justify-between items-center">
          <h2 class="font-medium text-lg line-clamp-3">{% ${data.name} %}</h2>
          <button onClick=${deleteList}>
            ${DeleteIcon({
              cls: 'stroke-red-500 hover:stroke-red-700',
              id: `delete-${data.id}`,
              title: 'Delete list',
            })}
          </button>
        </div>

        <!-- New task form -->
        <form class="flex flex-row" onSubmit.prevent=${createTask}>
          <label>
            <span class="sr-only">Create new task</span>
            <input
              class="w-full text-sm rounded-sm p-1 bg-inherit border-b border-solid border-blue-500 placeholder:text-slate-600 focus:bg-white focus:ring dark:focus:bg-inherit dark:placeholder:text-gray-400"
              type="text"
              name="new-task"
              placeholder="Add task"
            />
          </label>
          <button type="submit">
            ${AddIcon({
              cls: 'stroke-blue-600 hover:stroke-blue-800 dark:stroke-blue-400 dark:hover:stroke-blue-600',
              id: `add_item-${data.id}`,
              title: 'Create task',
            })}
          </button>
        </form>
      </div>

      <!-- Current tasks -->
      <div
        is-list
        class="space-y-2 px-3"
        data-id="${data.id}"
        data-name="current-tasks"
        onMount=${init}
      >
        ${data.items.filter((task) => !task.completed).map(Task)}
      </div>

      <!-- Completed tasks -->
      <div class="flex justify-between items-center group px-3">
        <p
          class="text-sm text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
        >
          Completed ${data.completedTasks ? `(${data.completedTasks})` : ''}
        </p>
        <button
          onClick=${toggleCompletedTasks}
          aria-pressed=${state.$showCompleted}
          aria-controls="${data.id}_completed-tasks"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="fill-gray-500 stroke-gray-500 group-hover:fill-gray-700 group-hover:stroke-gray-700 dark:group-hover:stroke-gray-300"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <title>Show completed tasks</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              ignore="transform"
              d="M18 15l-6 -6l-6 6h12"
              transform=${state.$showCompleted((value) =>
                value ? 'rotate(0 0 0)' : 'rotate(180 12 12)'
              )}
            />
          </svg>
        </button>
      </div>

      <div
        is-list
        ignore="style"
        class="space-y-2 px-3 transition-all"
        id="${data.id}_completed-tasks"
        data-name="completed-tasks"
        style_display=${state.$showCompleted((value) =>
          value ? 'block' : 'none'
        )}
      >
        ${data.items
          .filter((task) => task.completed)
          .sort((a, b) => b.completionDate - a.completionDate)
          .map(Task)}
      </div>
    </div>
  `;
};

export default List;
