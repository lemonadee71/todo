import { html } from 'poor-man-jsx';
import { PROJECT, TASK } from '../core/actions';
import Core from '../core';

// * This is is-list and should update for every new task
const List = (projectID, data) => {
  const addTask = () => {
    const randomTitle = Math.random().toString(36).slice(2);
    Core.event.emit(TASK.ADD, {
      project: projectID,
      list: data.id,
      title: randomTitle,
    });
  };

  const deleteTask = (task) => {
    Core.event.emit(TASK.REMOVE, task);
  };

  const deleteList = () => {
    Core.event.emit(PROJECT.LISTS.REMOVE, { project: projectID, id: data.id });
  };

  return html`
    <div id="${data.id}">
      <p>${data.name}</p>
      <button ${{ onClick: deleteList }}>Delete</button>
      <button ${{ onClick: addTask }}>Add todo</button>
      <ul is-list keystring="id">
        ${data.items.map(
          (todo) =>
            html`
              <li id="${todo.id}">
                <span>${todo.title}</span>
                <button ${{ onClick: () => deleteTask(todo) }}>Delete</button>
              </li>
            `
        )}
      </ul>
    </div>
  `;
};

export default List;
