import { html } from '../helpers/component';
import $, { append, remove } from '../helpers/helpers';
import { newProjectInput, userProjects } from '../helpers/selectors';
import { getProjectsDetails } from '../modules/projects';
import { AppEvent } from '../emitters';
import { DELETE_ICON } from './Icons';

const ProjectListItem = ({ proj, deleteHandler }) =>
  html`
    <li id="${proj.id}">
      <a href="${`#/${proj.id.replace('-', '/')}`}">{% ${proj.name} %}</a>
      <span ${{ onClick: deleteHandler }}>${DELETE_ICON}</span>
    </li>
  `;

const Sidebar = () => {
  const createNewProject = (e) => {
    e.preventDefault();
    AppEvent.emit('project.add', { name: $(newProjectInput).value });
    e.target.reset();
  };

  const removeProject = (e) => {
    e.stopPropagation();
    const projListItem = e.currentTarget.parentElement;

    AppEvent.emit('project.delete', { id: projListItem.id });
    remove(projListItem).from($(userProjects));

    const currentPath = window.location.hash
      .replace('#/', '')
      .replace('/', '-');

    if (currentPath === projListItem.id) {
      AppEvent.emit('hashchange', 'all');
    }
  };

  const addProject = (project) => {
    const projectLi = ProjectListItem({
      proj: project,
      deleteHandler: removeProject,
    });

    append(projectLi).to($(userProjects));
  };

  AppEvent.on('project.add.error', (error) => alert(error.toString()));
  AppEvent.on('project.add.success', addProject);

  const projects = getProjectsDetails();

  return html`
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
          ${projects.length
            ? projects.map((proj) =>
                ProjectListItem({ proj, deleteHandler: removeProject })
              )
            : ''}
        </ul>
      </div>
    </aside>
  `;
};

export default Sidebar;
