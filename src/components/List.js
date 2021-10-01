import { createHook, html } from 'poor-man-jsx';

// * This is is-list and should update for every new task
const List = (data) => {
  const [current] = createHook({ todos: data.items });

  const addTodo = () => {
    const rand = Math.random().toString(36).slice(2);
    current.todos = [...current.todos, { id: rand, title: rand }];
  };

  return html`
    <div>
      <p>${data.name}</p>
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
