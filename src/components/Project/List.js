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
    text: 'List removed',
    payload: {
      id: data.id,
      project: data.project,
      list: data.id,
    },
  });

  const createTask = (e) => {
    const input = e.target.elements['new-task'];
    Core.event.emit(
      TASK.ADD,
      {
        project: data.project,
        list: data.id,
        data: { title: input.value },
      },
      {
        onSuccess: () => {
          input.value = '';
        },
      }
    );
  };

  const transferTask = (action, taskId, subtaskId, to, from, position) => {
    Core.event.emit(action, {
      project: data.project,
      list: { to, from },
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
      delay: 10,
      draggable: '.task',
      filter: 'input,button',
      onUpdate: (e) => moveTask(e.item.dataset.id, e.newIndex),
      onAdd: (e) => {
        const { parent, id } = e.item.dataset;
        const to = data.id;
        const from = parent ? e.item.dataset.list : e.from.dataset.id;
        const action = parent ? TASK.SUBTASKS.TRANSFER : TASK.TRANSFER;

        transferTask(action, parent || id, id, to, from, e.newIndex);
      },
    });
  };

  // ?TODO: Add animation when task is moved to completed
  // BUG: There are z-index issues here
  return html`
    <div
      class="tasklist w-72 pt-3 pb-4 space-y-2 rounded-lg bg-[#dedede] dark:bg-[#272727] sm:relative z-0"
      id="${data.id}"
      data-id="${data.id}"
      data-position="${pos}"
    >
      <!-- List header -->
      <div
        class="sm:sticky sm:top-0 px-3 py-2 space-y-1 bg-[#dedede] dark:bg-[#272727] z-[2]"
      >
        <div class="flex justify-between items-center ">
          <h2 class="font-medium text-lg">{% ${data.name} %}</h2>
          <button class="h-full" onClick=${deleteList}>
            ${DeleteIcon('stroke-red-500 hover:stroke-red-700')}
          </button>
        </div>

        <!-- New task form -->
        <form class="flex flex-row" onSubmit.prevent=${createTask}>
          <button type="submit">
            ${AddIcon(
              'stroke-blue-600 hover:stroke-blue-800 dark:stroke-blue-400 dark:hover:stroke-blue-600'
            )}
          </button>
          <input
            type="text"
            name="new-task"
            placeholder="Add task"
            class="w-full text-sm rounded-sm px-1 py-1 bg-inherit placeholder:text-slate-600 focus:bg-white focus:placeholder:text-slate-400 focus:ring dark:focus:bg-inherit dark:placeholder:text-gray-400 dark:focus:placeholder:text-gray-200"
          />
        </form>
      </div>

      <!-- Current tasks -->
      <div
        is-list
        class="space-y-2 px-3"
        data-id="${data.id}"
        data-name="current-tasks"
        onCreate=${init}
      >
        ${data.items
          .filter((task) => !task.completed)
          .map((task, i) => new Task(task).render(i))}
      </div>

      <!-- Completed tasks -->
      <div class="flex justify-between items-center group px-3">
        <p
          class="text-sm text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
        >
          Completed ${data.completedTasks ? `(${data.completedTasks})` : ''}
        </p>
        <button onClick=${toggleCompletedTasks}>
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
        data-name="completed-tasks"
        style_display=${state.$showCompleted((value) =>
          value ? 'block' : 'none'
        )}
      >
        ${data.items
          .filter((task) => task.completed)
          .sort((a, b) => b.completionDate - a.completionDate)
          .map((task, i) => new Task(task).render(i))}
      </div>
    </div>
  `;
};

export default List;
