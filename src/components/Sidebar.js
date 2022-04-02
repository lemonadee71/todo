import Sortable from 'sortablejs';
import { html, render } from 'poor-man-jsx';
import { FIREBASE, PROJECT } from '../core/actions';
import { useRoot } from '../core/hooks';
import Core from '../core';
import ProjectLink from './ProjectLink';
import { isGuest } from '../utils/auth';

const Sidebar = () => {
  let sortable;
  const [data, revoke] = useRoot();
  const base = isGuest() ? PROJECT : FIREBASE.PROJECT;

  const createNewProject = (e) => {
    const input = e.target.elements['new-project'];

    Core.event.emit(base.ADD, {
      data: { name: input.value, order: sortable.toArray() },
    });

    input.value = '';
  };

  const init = function () {
    sortable = Sortable.create(this, {
      animation: 150,
      delay: 10,
      draggable: 'li',
      onUpdate: (e) => {
        if (base === PROJECT) {
          Core.event.emit(base.MOVE, {
            project: e.item.dataset.id,
            data: { position: e.newIndex },
          });
        } else {
          Core.event.emit(base.MOVE, { order: sortable.toArray() });
        }
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
