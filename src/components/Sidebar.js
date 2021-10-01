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

  // const createDeleteHandler = (id) => () => {
  //   Core.event.emit(PROJECT.REMOVE, id);
  // };

  return html`
    <ul data-name="">
      <li>User</li>
      <li>Quick Find</li>
      <li><a is="navigo-link" href="/app">Overview</a></li>
      <li><a is="navigo-link" href="/app/calendar">Calendar</a></li>
    </ul>
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
                  <a is="navigo-link" href="${`/app/${p.link}`}">
                    {% ${p.name} %}
                  </a>
                </li>
              `
          )
        ),
      }}
    ></ul>
  `;
};

export default Sidebar;
