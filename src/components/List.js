import { html } from 'poor-man-jsx';
import { PROJECT, TASK } from '../core/actions';
import Core from '../core';
import Task from './Task';

const List = (projectId, data) => {
  const createTask = (e) => {
    e.preventDefault();

    const input = e.target.elements['new-task'];
    Core.event.emit(TASK.ADD, {
      project: projectId,
      list: data.id,
      data: {
        title: input.value,
      },
    });

    input.value = '';
  };

  const deleteList = () => {
    Core.event.emit(PROJECT.LISTS.REMOVE, {
      project: projectId,
      list: data.id,
    });
  };

  return html`
    <div id="${data.id}">
      <p>${data.name}</p>
      <button ${{ onClick: deleteList }}>Delete</button>
      <form ${{ onSubmit: createTask }}>
        <input
          type="text"
          name="new-task"
          id="new-task"
          placeholder="Create new task"
        />
      </form>
      <ul is-list keystring="id">
        ${data.items.map((todo) => Task(todo))}
      </ul>
    </div>
  `;
};

export default List;
