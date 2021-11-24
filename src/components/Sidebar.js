import Sortable from 'sortablejs';
import { html } from 'poor-man-jsx';
import { PROJECT } from '../core/actions';
import { useRoot } from '../core/hooks';
import Core from '../core';
import { wrap } from '../utils/misc';
import logger from '../utils/logger';
import { $ } from '../utils/query';
import TaskModal from './Project/TaskModal';
import SubtaskModal from './Project/SubtaskModal';
import ProjectLink from './ProjectLink';

const Sidebar = () => {
  const [data, revoke] = useRoot();

  const unsubscribe = [
    Core.event.onError(PROJECT.ADD, wrap(logger.warning)),
    // we put this here to avoid dependency cycle
    // idk if this should be here
    Core.event.on('task.modal.open', (task) => {
      $('#main-modal').changeContent(
        new TaskModal(task).render(),
        'task-modal'
      );
    }),
    Core.event.on('subtask.modal.open', (subtask) => {
      $('#main-modal').changeContent(
        new SubtaskModal(subtask).render(),
        'task-modal'
      );
    }),
  ];

  const createNewProject = (e) => {
    e.preventDefault();
    const input = e.target.elements['new-project'];

    Core.event.emit(PROJECT.ADD, { data: { name: input.value } });

    input.value = '';
  };

  const init = function () {
    Sortable.create(this, {
      animation: 150,
      delay: 10,
      draggable: 'li',
      onUpdate: (e) => {
        Core.event.emit(PROJECT.MOVE, {
          project: e.item.dataset.id,
          data: { position: e.newIndex },
        });
      },
    });
  };

  return html`
    <nav
      class="quick-links"
      ${{ onDestroy: () => unsubscribe.forEach((cb) => cb()) }}
    >
      <ul>
        <li><a href="#">User</a></li>
        <li><a href="#">Quick Find</a></li>
        <li>
          <a is="navigo-link" href="/app">Overview</a>
        </li>
        <li>
          <a is="navigo-link" href="/app/calendar" title="Calendar">Calendar</a>
        </li>
      </ul>
    </nav>
    <nav class="projects">
      <ul
        is-list
        keystring="data-id"
        ${{
          onCreate: init,
          onUnmount: revoke,
          $children: data.$projects.map((project) => ProjectLink(project)),
        }}
      ></ul>
    </nav>
    <form class="create-project" ${{ onSubmit: createNewProject }}>
      <input
        type="text"
        name="new-project"
        id="new-project"
        placeholder="Create new project"
        class="form__input"
      />
      <button class="form__btn">+</button>
    </form>
  `;
};

export default Sidebar;
