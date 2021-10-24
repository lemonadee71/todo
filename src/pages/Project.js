import { createHook, html } from 'poor-man-jsx';
import List from '../components/List';
import { PROJECT, TASK } from '../core/actions';
import Core from '../core';

const Project = ({ data: { id } }) => {
  const project = Core.main.getProject(`project-${id}`);
  const [data] = createHook({ lists: project.lists.items });

  const unsubscribe = [
    Core.event.on(PROJECT.LISTS.ADD + '.error', (error) =>
      alert(error.message)
    ),
    Core.event.on(
      [...PROJECT.LISTS.ALL, ...TASK.ALL],
      () => {
        data.lists = Core.main.getLists(project.id);
      },
      { order: 'last' }
    ),
  ];

  const createNewList = (e) => {
    e.preventDefault();

    const input = e.target.elements['new-list'];
    Core.event.emit(PROJECT.LISTS.ADD, {
      project: project.id,
      data: {
        name: input.value,
      },
    });

    input.value = '';
  };

  return html`
    <div
      class="project"
      ${{ '@unmount': () => unsubscribe.forEach((cb) => cb()) }}
    >
      <form ${{ onSubmit: createNewList }}>
        <input
          type="text"
          name="new-list"
          id="new-list"
          placeholder="Create new list"
        />
      </form>
      <h1 class="project__title">${project.name}</h1>
      <div
        class="project__body"
        is-list
        keystring="id"
        ${{ $children: data.$lists.map((list) => List(list)) }}
      ></div>
    </div>
  `;
};

export default Project;
