import Sortable from 'sortablejs';
import { html, render, createState } from '../helpers/component';
import { isDueToday, isDueThisWeek, isUpcoming, parse } from '../helpers/date';
import $, { prepend, append, remove, hide, show } from '../helpers/helpers';
import {
  completedTasks,
  currentTasks,
  tasksList,
  modal,
} from '../helpers/selectors';
import {
  getAllTasks,
  getProject,
  getDueToday,
  getDueThisWeek,
  getUpcoming,
  // getTask,
} from '../modules/projects';
import { AppEvent } from '../emitters';
import CreateTaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';

const currentLocation = createState(
  window.location.hash.replace('#/', '') || 'all'
);

const NoTasksMessage = () =>
  html`<h3 id="no-tasks">You don't have any tasks</h3>`;

const MainContent = () => {
  const defaultIds = ['all', 'today', 'week', 'upcoming'];

  const isDefault = (id) => defaultIds.includes(id);
  const isProject = (location) => location === 'list';
  const isProjectName = (id) => id.match(/\D+/g);

  const shouldRenderTask = (task) => {
    const renderConditions = [
      currentLocation.value === 'all',
      currentLocation.value === 'list/uncategorized' &&
        task.location === 'uncategorized',
      currentLocation.value === task.location.replace('-', '/'),
      currentLocation.value === 'today' && isDueToday(parse(task.dueDate)),
      currentLocation.value === 'week' && isDueThisWeek(parse(task.dueDate)),
      currentLocation.value === 'upcoming' && isUpcoming(parse(task.dueDate)),
    ];

    return renderConditions.some((condition) => condition);
  };

  const addTask = (task) => {
    if (shouldRenderTask(task)) {
      prepend(TaskItem({ taskData: task })).to($(currentTasks));
    }
  };

  const moveTask = ({ id, prop, data }) => {
    const taskItem = $(`#${id}`);

    if (prop === 'completed') {
      const list = data.completed ? completedTasks : currentTasks;

      append(taskItem).to($(list));
    } else if (prop === 'location') {
      const location = data.location.replace('-', '/');

      if (
        currentLocation.value !== location &&
        !isDefault(currentLocation.value)
      ) {
        remove(taskItem).from(taskItem.parentElement);
      }
    }
  };

  AppEvent.on('task.add.success', addTask);
  AppEvent.on('task.update.success', moveTask);
  AppEvent.on('hashchange', (path) => {
    currentLocation.value = path;
  });

  // Make items sortable
  AppEvent.on('content.rendered', () => {
    Sortable.create($(currentTasks), {
      group: 'tasks',
      animation: 150,
    });
    Sortable.create($(completedTasks), {
      animation: 150,
    });
  });

  const getCurrentTasks = (tasks) => tasks.filter((task) => !task.completed);

  const getCompletedTasks = (tasks) => tasks.filter((task) => task.completed);

  const getId = (path) => {
    const [location, id] = path.split('/');

    if (isDefault(location)) {
      return location;
    }

    if (isProject(location)) {
      const project = getProject(
        (proj) => proj.id.toLowerCase() === path.replace(/\//g, '-')
      );

      return project.id;
      // if (isProjectName(id)) {
      // }

      // return `list-${id}`;
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
      show(completedTasks);
    } else {
      hide(completedTasks);
    }
  };

  const checkNoOfTasks = () => {
    const hasActiveTasks = $(currentTasks).children.length;
    const noTasks = $('#no-tasks');

    if (hasActiveTasks && noTasks) {
      noTasks.remove();
    } else if (!hasActiveTasks && !noTasks) {
      $(tasksList).prepend(render(NoTasksMessage()));
    }
  };

  const renderTitle = (path) => {
    try {
      return getTitle(getId(path));
    } catch (e) {
      return e.toString();
    }
  };

  const renderTasks = (path, current = true) => {
    try {
      const allTasks = getTasks(getId(path));
      let tasks = current
        ? getCurrentTasks(allTasks)
        : getCompletedTasks(allTasks);

      tasks = tasks.sort((a, b) => a - b);

      // hacky way to bypass no nested ternary lol
      return tasks.length
        ? html`${tasks.map((task) => TaskItem({ taskData: task.data }))}`
        : html`${current ? NoTasksMessage() : ''}`;
    } catch (e) {
      console.error(e, path);
      return current
        ? html`<h3><a href="#/all">See all tasks</a></h3>`
        : html``;
    }
  };

  return html`
    <main>
      <h2 ${{ $textContent: currentLocation.bind('value', renderTitle) }}></h2>
      <hr />
      <div id="taskbar">
        <button id="add-task" ${{ onClick: showCreateTaskForm }}>+</button>
        <label for="show">Show Completed</label>
        <input
          id="show-completed"
          type="checkbox"
          name="show"
          value="show"
          ${{ onChange: showCompleted }}
        />
      </div>
      <div
        id="tasks-list"
        ${{
          onChildRemoved: checkNoOfTasks,
          onChildAdded: checkNoOfTasks,
        }}
      >
        <div
          id="current-tasks"
          ${{
            $content: currentLocation.bind('value', renderTasks),
          }}
        ></div>
        <div
          id="completed-tasks"
          style="display: none;"
          ${{
            $content: currentLocation.bind('value', (path) =>
              renderTasks(path, false)
            ),
          }}
        ></div>
      </div>
      <modal-el></modal-el>
    </main>
  `;
};

export default MainContent;
