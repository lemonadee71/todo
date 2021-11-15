import Sortable from 'sortablejs';
import { html } from 'poor-man-jsx';
import { PROJECT, TASK } from '../core/actions';
import Core from '../core';
import Task from './Task';
import { useUndo } from '../utils/undo';

const List = (data) => {
  const deleteList = useUndo({
    selector: `#${data.id}`,
    text: 'List removed',
    callback: () =>
      Core.event.emit(PROJECT.LISTS.REMOVE, {
        project: data.project,
        list: data.id,
      }),
  });

  const createTask = (e) => {
    e.preventDefault();

    const input = e.target.elements['new-task'];
    Core.event.emit(TASK.ADD, {
      project: data.project,
      list: data.id,
      data: {
        title: input.value,
      },
    });

    input.value = '';
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
    <div class="task-list" id="${data.id}">
      <p class="task-list__title">{% ${data.name} %}</p>
      <div class="task-list__body">
        <div
          is-list
          data-id="${data.id}"
          data-name="current-tasks"
          ${{ onCreate: init }}
        >
          ${data.items
            .filter((task) => !task.completed)
            .map((task) => new Task(task).render())}
        </div>
        <div is-list data-name="completed-tasks">
          ${data.items
            .filter((task) => task.completed)
            .map((task) => new Task(task).render())}
        </div>
      </div>
      <button ${{ onClick: deleteList }}>Delete</button>
      <form class="create-list" ${{ onSubmit: createTask }}>
        <input
          type="text"
          name="new-task"
          placeholder="Create new task"
          class="form__input"
        />
        <button class="form__btn">+</button>
      </form>
    </div>
  `;
};

export default List;
