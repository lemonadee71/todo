import Component from '../helpers/component';
import $, { append, remove, clearTasks } from '../helpers/helpers';
import {
  completedTasks,
  currentTasks,
  newProjectInput,
  projectTitle,
  tasksList,
  userProjects,
} from '../helpers/selectors';
import {
  getAllTasks,
  getProjectsDetails,
  getProjectTasks,
  getDueToday,
  getDueThisWeek,
  getUpcoming,
  addProject,
  deleteProject,
} from '../modules/projects';
import NoTasksMessage from './NoTasksMessage';
import ProjectListItem from './ProjectListItem';
import TaskItem from './TaskItem';

const Sidebar = () => {
  const projects = getProjectsDetails();

  const _addProject = (name) => addProject(name);

  const _deleteProject = (id) => deleteProject(id);

  const _getProject = (id) => {
    if (id === 'today') {
      return getDueToday();
    } else if (id === 'week') {
      return getDueThisWeek();
    } else if (id === 'upcoming') {
      return getUpcoming();
    } else if (id === 'all') {
      return getAllTasks();
    }

    return getProjectTasks(id);
  };

  /*
   * Render functions
   */
  const _renderTasks = (tasks) => {
    clearTasks();

    tasks.forEach((task) => {
      if (task.completed) {
        append(Component.render(TaskItem({ task }))).to($(completedTasks));
      } else {
        append(Component.render(TaskItem({ task }))).to($(currentTasks));
      }
    });
  };

  const _renderNoTasksMessage = () => {
    clearTasks();

    if (!$('#no-tasks')) {
      $(tasksList).prepend(NoTasksMessage());
    }
  };

  /*
   * Event listeners
   */
  // Ul element
  const selectProject = (e) => {
    let isListItem = e.target.matches('li');
    let isSpan = e.target.matches('li span');

    if (isListItem || isSpan) {
      let target = isListItem ? e.target : e.target.parentElement;
      let { id } = target;
      let title = '';
      let tasks = _getProject(id);

      if (id === 'all') {
        title = 'All Tasks';
      } else if (id === 'today') {
        title = 'Today';
      } else if (id === 'week') {
        title = 'This Week';
      } else if (id === 'upcoming') {
        title = 'Upcoming';
      } else {
        title = target.firstElementChild.textContent;
      }

      $(projectTitle).textContent = title;
      tasks.length ? _renderTasks(tasks) : _renderNoTasksMessage();
    }
  };

  // Form element
  const createNewProject = (e) => {
    e.preventDefault();
    let newProject = _addProject($(newProjectInput).value);

    append(
      Component.render(
        ProjectListItem(newProject, {
          deleteHandler: removeProject,
        })
      )
    ).to($(userProjects));
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

  return Component.parseString`
  <aside id="sidebar">
    <div>
      <ul id="default-proj" ${{ onClick: selectProject }}>
        <li id="all">All Tasks</li>
        <li id="today">Today</li>
        <li id="week">This Week</li>
        <li id="upcoming">Upcoming</li>
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
      <ul id="user-proj" ${{ onClick: selectProject }}>
        ${
          projects.length
            ? projects.map((proj) =>
                ProjectListItem(proj, { deleteHandler: removeProject })
              )
            : ''
        }
      </ul>
    </div>
  </aside>
  `;
};

export default Sidebar;
