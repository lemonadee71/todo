import Component from '../helpers/component';
import $, { hide, show } from '../helpers/helpers';
import {
  completedTasks,
  currentTasks,
  tasksList,
  modal,
} from '../helpers/selectors';
import { currentLocation } from '../modules/globalState';
import {
  getAllTasks,
  getProject,
  getDueToday,
  getDueThisWeek,
  getUpcoming,
} from '../modules/projects';
import CreateTaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';

const MainContent = () => {
  const defaultIds = ['all', 'today', 'week', 'upcoming'];

  const isDefault = (id) => defaultIds.includes(id);
  const isProject = (location) => location === 'list';
  const isProjectName = (id) => isNaN(id);

  const getCurrentTasks = (tasks) => tasks.filter((task) => !task.completed);

  const getCompletedTasks = (tasks) => tasks.filter((task) => task.completed);

  const changeTitle = (id) => {
    let title = '';
    if (id === 'today') {
      title = 'Today';
    } else if (id === 'week') {
      title = 'This Week';
    } else if (id === 'upcoming') {
      title = 'Upcoming';
    } else if (id === 'all') {
      title = 'All Tasks';
    } else {
      title = id;
    }

    if ($('#current-proj-title')) {
      $('#current-proj-title').textContent = title;
    }

    return title;
  };

  const getTasks = (path) => {
    const [location, id] = path.split('/');

    if (isDefault(location)) {
      changeTitle(location);

      if (location === 'today') {
        return getDueToday();
      } else if (location === 'week') {
        return getDueThisWeek();
      } else if (location === 'upcoming') {
        return getUpcoming();
      } else if (location === 'all') {
        return getAllTasks();
      }
    } else if (isProject(location)) {
      let project;

      if (isProjectName(id)) {
        project = getProject(
          (proj) => proj.name.toLowerCase() === id.replace(/-/g, ' ')
        );
      } else {
        project = getProject((proj) => proj.id === `list-${id}`);
      }

      changeTitle(project.name);

      return project.items;
    } else {
      changeTitle('Invalid path');
      throw new Error('Invalid path.');
    }
  };

  /*
   *  Event listeners
   */
  const showCompleted = (e) => {
    if (e.target.checked) {
      show($(completedTasks));
    } else {
      hide($(completedTasks));
    }
  };

  const checkNoOfTasks = () => {
    let hasActiveTasks = $(currentTasks).children.length;
    let noTasks = $('#no-tasks');

    if (hasActiveTasks) {
      if (noTasks) {
        $(tasksList).removeChild(noTasks);
      }
    } else {
      if (!noTasks) {
        $(tasksList).prepend(
          Component.render(
            Component.html`<h3 id="no-tasks">You don't have any tasks</h3>`
          )
        );
      }
    }
  };

  const showCreateTaskForm = () => {
    $(modal).changeContent(CreateTaskForm()).show();
  };

  const renderTasks = (path, current = true) => {
    try {
      const allTasks = getTasks(path);
      const tasks = current
        ? getCurrentTasks(allTasks)
        : getCompletedTasks(allTasks);

      return Component.html`${
        tasks.length
          ? tasks.map((task) => TaskItem({ task }))
          : current
          ? Component.html`<h3 id="no-tasks">You don't have any tasks</h3>`
          : ''
      }`;
    } catch (error) {
      console.log(error);
      return current
        ? Component.html`<h3><a href="#/all">See all tasks</a></h3>`
        : Component.html``;
    }
  };

  return Component.html`
    <main>
      <!-- Title doesn't have an initial value -->
      <h2 id="current-proj-title"></h2>
      <hr>
      <div id="taskbar">
        <button id="add-task" ${{ onClick: showCreateTaskForm }}>+</button>
        <label for="show">Show Completed</label>
        <input id="show-completed" type="checkbox" name="show" value="show" 
        ${{ onChange: showCompleted }}
        />
      </div>
      <div id="tasks-list" ${{
        onChildRemoved: checkNoOfTasks,
        onChildAdded: checkNoOfTasks,
      }}>
        <div id="current-tasks" ${{
          $content: currentLocation.bind('value', (path) => renderTasks(path)),
        }}>
          ${renderTasks(currentLocation.value)}
        </div>
        <div id="completed-tasks" style="display: none;" ${{
          $content: currentLocation.bind('value', (path) =>
            renderTasks(path, false)
          ),
        }}>
          ${renderTasks(currentLocation.value, false)}
        </div>
      </div>
      <modal-el></modal-el>
    </main>
  `;
};

export default MainContent;
