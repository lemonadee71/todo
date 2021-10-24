import Sortable from 'sortablejs';
import { html } from 'poor-man-jsx';
import { PROJECT, TASK } from '../core/actions';
import Core from '../core';
import Task from './Task';
import { createUndoFn } from '../utils/undo';

const List = (data) => {
  const deleteList = createUndoFn(
    `#${data.id}`,
    () =>
      Core.event.emit(PROJECT.LISTS.REMOVE, {
        project: data.project,
        list: data.id,
      }),
    'List removed'
  );

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
      list: data.id,
      task: id,
      type: 'list',
      data: { to, from, position },
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

  return html`
    <div class="task-list" id="${data.id}">
      <p class="task-list__title">${data.name}</p>
      <ul
        id="${data.id}"  
        class="task-list__body"
        is-list
        keystring="id"
        ${{ '@create': init }}
      >
        ${data.items.map((task) => Task(task))}
      </ul>
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
