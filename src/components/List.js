import Sortable from 'sortablejs';
import { html } from 'poor-man-jsx';
import { PROJECT, TASK } from '../core/actions';
import Core from '../core';
import Task from './Task';

const List = (projectId, data) => {
  const listId = data.id;

  const deleteList = () => {
    Core.event.emit(PROJECT.LISTS.REMOVE, {
      project: projectId,
      list: listId,
    });
  };

  const createTask = (e) => {
    e.preventDefault();

    const input = e.target.elements['new-task'];
    Core.event.emit(TASK.ADD, {
      project: projectId,
      list: listId,
      data: {
        title: input.value,
      },
    });

    input.value = '';
  };

  const transferTask = (id, to, from, position) => {
    Core.event.emit(TASK.TRANSFER, {
      project: projectId,
      list: listId,
      task: id,
      type: 'list',
      data: { to, from, position },
    });
  };

  const moveTask = (id, position) => {
    Core.event.emit(TASK.MOVE, {
      project: projectId,
      list: listId,
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
    <div class="task-list" id="${listId}">
      <p class="task-list__title">${data.name}</p>
      <ul
        id="${listId}"  
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
