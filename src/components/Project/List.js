import Sortable from 'sortablejs';
import { createHook, html } from 'poor-man-jsx';
import { FIREBASE, PROJECT, TASK } from '../../core/actions';
import Core from '../../core';
import { useUndo } from '../../utils/undo';
import { isGuest } from '../../utils/auth';
import Task from './Task';

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
  return html`
    <div
      class="tasklist w-72 px-3 py-4 rounded-lg bg-[#dedede] space-y-2"
      id="${data.id}"
      data-id="${data.id}"
      data-position="${pos}"
    >
      <!-- List header -->
      <div class="flex justify-between items-center">
        <h2 class="font-medium text-lg">{% ${data.name} %}</h2>
        <button class="h-full" onClick=${deleteList}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-red-500 hover:stroke-red-700"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#ff2825"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>
        </button>
      </div>

      <!-- New task form -->
      <form class="flex flex-row" onSubmit.prevent=${createTask}>
        <button type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-blue-600 hover:stroke-blue-800"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="#ffffff"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <input
          type="text"
          name="new-task"
          placeholder="Add task"
          class="w-full text-sm rounded-sm px-1 py-1 bg-transparent placeholder:text-slate-600 focus:bg-white focus:placeholder:text-slate-400 focus:ring "
        />
      </form>

      <!-- Current tasks -->
      <div
        is-list
        class="space-y-2"
        data-id="${data.id}"
        data-name="current-tasks"
        onCreate=${init}
      >
        ${data.items
          .filter((task) => !task.completed)
          .map((task, i) => new Task(task).render(i))}
      </div>

      <!-- Completed tasks -->
      <div class="flex justify-between items-center group">
        <p class="text-neutral-500 group-hover:text-neutral-700 text-sm">
          Completed ${data.completedTasks ? `(${data.completedTasks})` : ''}
        </p>
        <button onClick=${toggleCompletedTasks}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="fill-gray-500 stroke-gray-500 group-hover:fill-gray-700 group-hover:stroke-gray-700"
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
                value ? '' : 'rotate(180 12 12)'
              )}
            />
          </svg>
        </button>
      </div>

      <div
        is-list
        ignore="style"
        class="space-y-2 transition-all"
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
