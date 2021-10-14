import { createHook, html } from 'poor-man-jsx';
import { PROJECT } from '../core/actions';
import Core from '../core';
import ProjectLink from './ProjectLink';

const Sidebar = () => {
  const [data, revoke] = createHook({
    projects: Core.main.getProjectDetails(),
  });

  const unsubscribe = Core.event.on(
    PROJECT.ALL,
    () => {
      data.projects = Core.main.getProjectDetails();
    },
    { order: 'last' }
  );

  const createNewProject = (e) => {
    e.preventDefault();

    const input = e.target.elements['new-project'];
    Core.event.emit(PROJECT.ADD, {
      data: {
        name: input.value,
      },
    });

    input.value = '';
  };

  return html`
    <nav class="quick-links">
      <ul>
        <li>User</li>
        <li>Quick Find</li>
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
        keystring="id"
        ${{
          '@unmount': () => {
            unsubscribe();
            revoke();
          },
          $children: data.$projects.map((project) => ProjectLink(project)),
        }}
      ></ul>
    </nav>
    <form ${{ onSubmit: createNewProject }}>
      <input
        type="text"
        name="new-project"
        id="new-project"
        placeholder="Create new project"
      />
    </form>
  `;
};

export default Sidebar;
