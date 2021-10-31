import Sortable from 'sortablejs';
import { html } from 'poor-man-jsx';
import { PROJECT, TASK } from '../core/actions';
import Core from '../core';
import Task from './Task';
import { useUndo } from '../utils/undo';

const List = (data) => {
  const deleteList = useUndo({
    element: `#${data.id}`,
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

  const transferTask = (id, to, from, position) => {
    Core.event.emit(TASK.TRANSFER, {
      project: data.project,
      list: { to, from },
      task: id,
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
      draggable: '.task,.task--done',
      onUpdate: (e) => {
        const id = e.item.getAttribute('key');
        moveTask(id, e.newIndex);
      },
      onAdd: (e) => {
        const id = e.item.getAttribute('key');
        const to = e.to.id;
        const from = e.from.id;
        const idx = e.newIndex;

        transferTask(id, to, from, idx);
      },
    });
  };

  // ?TODO: Add animation when task is moved to completed
  return html`
    <div class="task-list" id="${data.id}">
      <p class="task-list__title">{% ${data.name} %}</p>
      <div class="task-list__body">
        <ul
          id="${data.id}"
          data-name="current-tasks"
          is-list
          keystring="id"
          ${{ '@create': init }}
        >
          ${data.items
            .filter((task) => !task.completed)
            .map((task) => Task(task))}
        </ul>
        <ul data-name="completed-tasks" is-list keystring="id">
          ${data.items
            .filter((task) => task.completed)
            .map((task) => Task(task))}
        </ul>
      </div>
      <button ${{ onClick: deleteList }}>Delete</button>
      <form class="create-list" ${{ onSubmit: createTask }}>
        <input
        type="text"
        name="new-task"
        id="new-task"
        placeholder="Create new task"
        class="form__input"
        />
        <button class="form__btn">+</button>
    </div>
  `;
};

export default List;
