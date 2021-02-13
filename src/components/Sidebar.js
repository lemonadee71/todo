import Component from '../helpers/component';
import $, { append, remove, clearTasks } from '../helpers/helpers';
import {
  completedTasks,
  currentTasks,
  newProjectInput,
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
  /*
   * Render functions
   */
  const _renderTasks = (tasks) => {
    clearTasks();

    tasks.forEach((task) => {
      if (task.completed) {
        append(TaskItem({ task })).to($(completedTasks));
      } else {
        append(TaskItem({ task })).to($(currentTasks));
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
      let id = isListItem ? e.target.id : e.target.parentElement.id;

      let tasks = null;
      if (id === 'all') {
        tasks = getAllTasks();
      } else if (id === 'today') {
        tasks = getDueToday();
      } else if (id === 'week') {
        tasks = getDueThisWeek();
      } else if (id === 'upcoming') {
        tasks = getUpcoming();
      } else {
        tasks = getProjectTasks(id);
      }

      tasks.length ? _renderTasks(tasks) : _renderNoTasksMessage();
    }
  };

  // Form element
  const createNewProject = (e) => {
    e.preventDefault();
    let newProject = addProject($(newProjectInput).value);

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

    deleteProject(projListItem.id);
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
