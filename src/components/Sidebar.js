import Component from '../helpers/component';
import $, { append, remove } from '../helpers/helpers';
import {
  completedTasks,
  currentTasks,
  newProjectInput,
  userProjects,
} from '../helpers/selectors';
import {
  getProjectsDetails,
  getProjectTasks,
  addProject,
  deleteProject,
} from '../modules/projects';
import ProjectListItem from './ProjectListItem';

const Sidebar = () => {
  const _addProject = (name) => addProject(name);

  const _deleteProject = (id) => deleteProject(id);

  // Form element
  const createNewProject = (e) => {
    e.preventDefault();

    try {
      const newProject = _addProject($(newProjectInput).value);

      append(
        Component.render(
          ProjectListItem({ proj: newProject, deleteHandler: removeProject })
        )
      ).to($(userProjects));
    } catch (error) {
      alert(error.toString());
    }

    e.target.reset();
  };

  const removeProject = (e) => {
    e.stopPropagation();
    let projListItem = e.currentTarget.parentElement;

    // Crude implementation for now
    let tasks = getProjectTasks(projListItem.id);
    tasks.map((task) => {
      let taskItem = $(`#${task.id}`);
      if (taskItem) {
        let list = task.completed ? completedTasks : currentTasks;
        remove(taskItem).from($(list));
      }
    });

    _deleteProject(projListItem.id);
    remove(projListItem).from($(userProjects));
  };

  const projects = getProjectsDetails();

  return Component.html`
    <aside id="sidebar">
      <div>
        <ul id="default-proj">
          <li id="all"><a href="#/all">All Tasks</a></li>
          <li id="today"><a href="#/today">Today</a></li>
          <li id="week"><a href="#/week">This Week</a></li>
          <li id="upcoming"><a href="#/upcoming">Upcoming</a></li>
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
