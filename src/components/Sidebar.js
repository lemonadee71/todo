import Sortable from 'sortablejs';
import { html, render } from 'poor-man-jsx';
import { PROJECT } from '../core/actions';
import { useRoot } from '../core/hooks';
import Core from '../core';
import ProjectLink from './ProjectLink';

const Sidebar = () => {
  const [data, revoke] = useRoot();

  const createNewProject = (e) => {
    const input = e.target.elements['new-project'];

    Core.event.emit(PROJECT.ADD, {
      data: { name: input.value },
    });

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
    <aside id="sidebar" onDestroy=${revoke}>
      <nav class="quick-links">
        <ul>
          <li><a href="#">User</a></li>
          <li><a href="#">Quick Find</a></li>
          <li><a is="navigo-link" href="/app">Overview</a></li>
        </ul>
      </nav>
      <nav class="projects">
        <ul is-list keystring="data-id" onCreate=${init}>
          ${data.$projects.map(ProjectLink).map((item) => render(item))}
        </ul>
      </nav>
      <form class="create-project" onSubmit.prevent=${createNewProject}>
        <input
          type="text"
          name="new-project"
          id="new-project"
          placeholder="Create new project"
          class="form__input"
        />
        <button class="form__btn">+</button>
      </form>
    </aside>
  `;
};

export default Sidebar;
