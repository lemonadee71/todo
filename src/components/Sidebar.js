import { createHook, html } from 'poor-man-jsx';
import Core from '../core';
import { PROJECT } from '../core/actions';

const Sidebar = () => {
  const [data, revoke] = createHook({
    projects: Core.main.getProjectDetails(),
  });

  const unsubscribe = Core.event.on(PROJECT.ALL, () => {
    data.projects = Core.main.getProjectDetails();
  });

  const createNewProject = (e) => {
    e.preventDefault();

    const input = e.target.elements['new-project'];
    Core.event.emit(PROJECT.ADD, input.value);

    input.value = '';
  };

  return html`
    <ul data-name="">
      <li>User</li>
      <li>Quick Find</li>
      <li>
        <a is="navigo-link" href="/app">Overview</a>
      </li>
      <li>
        <a is="navigo-link" href="/app/calendar" title="Calendar">Calendar</a>
      </li>
    </ul>
    <form ${{ onSubmit: createNewProject }}>
      <input
        type="text"
        name="new-project"
        id="new-project"
        placeholder="Create new project"
      />
    </form>
    <ul
      is-list
      keystring="id"
      ${{
        '@unmount': () => {
          unsubscribe();
          revoke();
        },
        $children: data.$projects((projects) =>
          projects.map(
            (p) =>
              html`
                <li id="${p.id}">
                  <a
                    is="navigo-link"
                    href="${`/app/${p.link}`}"
                    title="Project | ${p.name}"
                  >
                    {% ${p.name} %}
                  </a>
                  <button
                    ${{ onClick: () => Core.event.emit(PROJECT.REMOVE, p.id) }}
                  >
                    Delete
                  </button>
                </li>
              `
          )
        ),
      }}
    ></ul>
  `;
};

export default Sidebar;
