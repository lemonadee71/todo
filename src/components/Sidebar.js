import Component from '../helpers/component';
import $, { append, remove } from '../helpers/helpers';
import { newProjectInput, userProjects } from '../helpers/selectors';
import { currentLocation } from '../modules/globalState';
import {
  getProjectsDetails,
  addProject,
  deleteProject,
} from '../modules/projects';
import { DELETE_ICON } from './Icons';

const ProjectListItem = ({ proj, deleteHandler }) =>
  Component.html`
    <li id="${proj.id}">
      ${{
        type: 'a',
        text: proj.name,
        attr: {
          href: `#/${proj.id.replace('-', '/')}`,
        },
      }}
      <span ${{ onClick: deleteHandler }}>${DELETE_ICON}</span>
    </li>
  `;

const Sidebar = () => {
  const _addProject = (name) => addProject(name);

  const _deleteProject = (id) => deleteProject(id);

  // Form element
  const removeProject = (e) => {
    e.stopPropagation();
    const projListItem = e.currentTarget.parentElement;

    _deleteProject(projListItem.id);
    remove(projListItem).from($(userProjects));

    const currentPath = currentLocation.value.replace('/', '-');

    if (currentPath === projListItem.id) {
      currentLocation.value = 'all';
    }
  };

  const createNewProject = (e) => {
    e.preventDefault();

    try {
      const newProject = _addProject($(newProjectInput).value);
      const projLi = ProjectListItem({
        proj: newProject,
        deleteHandler: removeProject,
      });

      append(Component.render(projLi)).to($(userProjects));
    } catch (error) {
      alert(error.toString());
    }

    e.target.reset();
  };

  const projects = getProjectsDetails();

  return Component.html`
    <aside id="sidebar">
      <div>
        <ul id="default-proj">
          <li><a href="#/all">All Tasks</a></li>
          <li><a href="#/today">Today</a></li>
          <li><a href="#/week">This Week</a></li>
          <li><a href="#/upcoming">Upcoming</a></li>
        </ul>
        <br />
      </div>
      <div>
        <form ${{ onSubmit: createNewProject }}>
          <input
            type="text"
            name="new-project"
            class="dark"
            id="new-proj"
            placeholder="Create New Project"
            required
          />
          <button type="submit">+</button>
        </form>
        <br />
        <ul id="user-proj">
          ${
            projects.length
              ? projects.map((proj) =>
                  ProjectListItem({ proj, deleteHandler: removeProject })
                )
              : ''
          }
        </ul>
      </div>
    </aside>
  `;
};

export default Sidebar;
