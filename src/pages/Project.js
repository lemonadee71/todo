import Sortable from 'sortablejs';
import { html } from 'poor-man-jsx';
import { PROJECT, TASK } from '../core/actions';
import { useProject } from '../core/hooks';
import Core from '../core';
import logger from '../utils/logger';
import List from '../components/List';
import { $ } from '../utils/query';
import TaskModal from '../components/TaskModal';
import SubtaskModal from '../components/SubtaskModal';

const Project = ({ data: { id } }) => {
  const [project, revoke] = useProject(`project-${id}`);

  // this is like the root of app
  // so catch errors here for now
  const unsubscribe = [
    Core.event.on(PROJECT.ADD + '.error', logger.warning),
    Core.event.on(PROJECT.LISTS.ADD + '.error', logger.warning),
    Core.event.on(TASK.UPDATE + '.error', logger.error),
    // we put this here to avoid dependency cycle
    Core.event.on('task.modal.open', (data) => {
      $('#main-modal').changeContent(
        new TaskModal(data).render(),
        'task-modal'
      );
    }),
    Core.event.on('subtask.modal.open', (data) => {
      $('#main-modal').changeContent(
        new SubtaskModal(data).render(),
        'task-modal'
      );
    }),
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
      ${{
        '@unmount': () => {
          revoke();
          unsubscribe.forEach((cb) => cb());
        },
      }}
    >
      <form ${{ onSubmit: createNewList }}>
        <input
          type="text"
          name="new-list"
          id="new-list"
          placeholder="Create new list"
        />
      </form>
      <h1 class="project__title" ${{ $textContent: project.$name }}></h1>
      <div
        class="project__body"
        is-list
        keystring="id"
        ${{ '@create': init }}
        ${{ $children: project.$lists.map((list) => List(list)) }}
      ></div>
    </div>
  `;
};

export default Project;
