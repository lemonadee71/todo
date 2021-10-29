import Sortable from 'sortablejs';
import { createHook, html } from 'poor-man-jsx';
import { PROJECT, TASK } from '../core/actions';
import Core from '../core';
import logger from '../utils/logger';
import List from '../components/List';

const Project = ({ data: { id } }) => {
  const project = Core.main.getProject(`project-${id}`);
  const [data] = createHook({ lists: project.lists.items });

  const unsubscribe = [
    // I'm not sure if this should be here
    // But if I put this on Sidebar this doesn't trigger
    Core.event.on(PROJECT.ADD + '.error', logger.warning),
    Core.event.on(PROJECT.LISTS.ADD + '.error', logger.warning),
    Core.event.on(
      [
        ...PROJECT.LISTS.ALL,
        ...PROJECT.LABELS.ALL,
        ...TASK.ALL,
        ...TASK.LABELS.ALL,
        ...TASK.SUBTASKS.ALL,
      ],
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

  const init = function () {
    Sortable.create(this, {
      animation: 150,
      draggable: '.task-list',
      filter: '.task,.task--done',
      onUpdate: (e) => {
        Core.event.emit(PROJECT.LISTS.MOVE, {
          project: project.id,
          list: e.item.id,
          data: { position: e.newIndex },
        });
      },
    });
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
        ${{ '@create': init }}
        ${{ $children: data.$lists.map((list) => List(list)) }}
      ></div>
    </div>
  `;
};

export default Project;
