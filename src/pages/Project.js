import { createHook, html } from 'poor-man-jsx';
import List from '../components/List';
import { PROJECT, TASK } from '../core/actions';
import Core from '../core';

// * This is is-list and should update for every new list
const Project = ({ data: { id } }) => {
  const project = Core.main.getProject(`project-${id}`);
  const [data] = createHook({ lists: project.lists.items });

  const unsubscribe = [
    // eslint-disable-next-line
    Core.event.on(PROJECT.LISTS.ADD + '.error', (error) =>
      alert(error.toString())
    ),
    Core.event.on(
      [PROJECT.LISTS.ALL, TASK.ALL],
      () => {
        data.lists = Core.main.getProject(project.id).lists.items;
      },
      { order: 'last' }
    ),
  ];

  const createNewList = (e) => {
    e.preventDefault();

    const input = e.target.elements['new-list'];
    Core.event.emit(PROJECT.LISTS.ADD, {
      project: project.id,
      name: input.value,
    });

    input.value = '';
  };

  return html`
    <div ${{ '@unmount': () => unsubscribe.forEach((cb) => cb()) }}>
      <form ${{ onSubmit: createNewList }}>
        <input
          type="text"
          name="new-list"
          id="new-list"
          placeholder="Create new list"
        />
      </form>
      <h3>${project.name}</h3>
      <div
        is-list
        keystring="id"
        ${{
          $children: data.$lists((lists) =>
            lists.map((list) => List(project.id, list))
          ),
        }}
      ></div>
    </div>
  `;
};

export default Project;
