import { createHook, html } from 'poor-man-jsx';
import Core from '../core';
import { PROJECT } from '../core/actions';

const Sidebar = () => {
  console.log(Core.main.getProjectDetails());
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
    <aside id="sidebar">
      <ul data-name="">
        <li>User</li>
        <li>Quick Find</li>
        <li>Overview</li>
        <li>Notifications</li>
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
    </aside>
  `;
};

export default Sidebar;
