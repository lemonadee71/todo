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

const NoTasksMessage = () =>
  Component.html`<h3 id="no-tasks">You don't have any tasks</h3>`;

const MainContent = () => {
  const defaultIds = ['all', 'today', 'week', 'upcoming'];

  const isDefault = (id) => defaultIds.includes(id);
  const isProject = (location) => location === 'list';
  const isProjectName = (id) => id.match(/\D+/g);

  const getCurrentTasks = (tasks) => tasks.filter((task) => !task.completed);

  const getCompletedTasks = (tasks) => tasks.filter((task) => task.completed);

  const getId = (path) => {
    const [location, id] = path.split('/');

    if (isDefault(location)) {
      return location;
    }

    if (isProject(location)) {
      if (isProjectName(id)) {
        const project = getProject(
          (proj) => proj.name.toLowerCase() === id.replace(/-/g, ' ')
        );

        return project.id;
      }

      return `list-${id}`;
    }

    throw new Error('Invalid path.');
  };

  const getTitle = (id) => {
    if (id === 'all') return 'All Tasks';
    if (id === 'today') return 'Today';
    if (id === 'week') return 'This Week';
    if (id === 'upcoming') return 'Upcoming';

    return getProject((proj) => proj.id === id).name;
  };

  const getTasks = (id) => {
    if (id === 'all') return getAllTasks();
    if (id === 'today') return getDueToday();
    if (id === 'week') return getDueThisWeek();
    if (id === 'upcoming') return getUpcoming();

    return getProject((proj) => proj.id === id);
  };

  /*
   *  Event listeners
   */
  const showCreateTaskForm = () => {
    $(modal).changeContent(CreateTaskForm()).show();
  };

  const showCompleted = (e) => {
    if (e.target.checked) {
      show($(completedTasks));
    } else {
      hide($(completedTasks));
    }
  };

  const checkNoOfTasks = () => {
    const hasActiveTasks = $(currentTasks).children.length;
    const noTasks = $('#no-tasks');

    if (hasActiveTasks && noTasks) {
      noTasks.remove();
    } else if (!hasActiveTasks && !noTasks) {
      $(tasksList).prepend(Component.render(NoTasksMessage()));
    }
  };

  const renderTitle = (path) => {
    try {
      return getTitle(getId(path));
    } catch (error) {
      return error.toString();
    }
  };

  const renderTasks = (path, current = true) => {
    try {
      const allTasks = getTasks(getId(path));
      const tasks = current
        ? getCurrentTasks(allTasks)
        : getCompletedTasks(allTasks);

      // hacky way to bypass no nested ternary lol
      return tasks.length
        ? Component.html`${tasks.map((task) => TaskItem({ task }))}`
        : Component.html`${current ? NoTasksMessage() : ''}`;
    } catch (error) {
      console.log(error);
      return current
        ? Component.html`<h3><a href="#/all">See all tasks</a></h3>`
        : Component.html``;
    }
  };

  return Component.html`
    <main>
      <h2 ${{
        $textContent: currentLocation.bind('value', (val) => renderTitle(val)),
      }}></h2>
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
