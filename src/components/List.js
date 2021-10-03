import { createHook, html } from 'poor-man-jsx';
import Core from '../core';
import { PROJECT } from '../core/actions';

// * This is is-list and should update for every new task
const List = (projectID, data) => {
  const [current, revoke] = createHook({ todos: data.items });

  const addTodo = () => {
    const rand = Math.random().toString(36).slice(2);
    current.todos = [...current.todos, { id: rand, title: rand }];
    console.log(current);
  };

  const deleteList = () => {
    Core.event.emit(PROJECT.LISTS.REMOVE, { project: projectID, id: data.id });
  };

  return html`
    <div id="${data.id}" ${{ '@unmount': revoke }}>
      <p>${data.name}</p>
      <button ${{ onClick: deleteList }}>Delete</button>
      <button ${{ onClick: addTodo }}>Add todo</button>
      <ul
        is-list
        keystring="id"
        ${{
          $children: current.$todos((todos) =>
            todos.map((todo) => html`<li id="${todo.id}">${todo.title}</li>`)
          ),
        }}
      ></ul>
    </div>
  `;
};

export default List;
