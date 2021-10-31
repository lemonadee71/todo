import { createHook } from 'poor-man-jsx';
import EventEmitter from './classes/Emitter';
import * as main from './main';
import Router from './router';
import { Storage, LocalStorage } from './storage';
import { TASK, PROJECT, NAVIGATE_TO_PAGE } from './actions';
import { LAST_OPENED_PAGE, LOCAL_USER } from './constants';
import { debounce } from '../utils/delay';

const Core = (() => {
  const [state] = createHook({
    darkTheme: false,
    currentUser: null,
    currentPage: '/app',
    currentOpenedTask: null,
    expandLabels: false,
    toasts: [],
  });
  const event = new EventEmitter();
  const router = Router;
  const getters = Object.entries(main).reduce((obj, [key, fn]) => {
    if (key.startsWith('get')) {
      obj[key] = fn;
    }

    return obj;
  }, {});

  // * This should be evoked when user navigated to /app
  // * Run before any renders
  const init = (user) => {
    state.currentUser = user || LOCAL_USER;
    LocalStorage.prefix = state.currentUser + '__';

    main.init();

    state.currentPage =
      Storage.global.get(LAST_OPENED_PAGE) || state.currentPage;
    router.navigate(state.currentPage);
  };

  event.on(NAVIGATE_TO_PAGE, (path) => {
    state.currentPage = path;
    Storage.global.store(LAST_OPENED_PAGE, path);
  });

  /**
   * wrappers for core functions
   * just so multiple components can listen to an event
   */

  event.on(PROJECT.ADD, ({ data: { name } }) => main.addProject(name));
  event.on(PROJECT.REMOVE, ({ project }) => main.deleteProject(project));
  event.on(PROJECT.UPDATE, ({ project: id, data: { name } }) =>
    main.updateProjectName(id, name)
  );
  event.on(PROJECT.MOVE, ({ project: id, data: { position } }) =>
    main.moveProject(id, position)
  );

  event.on(PROJECT.LISTS.ADD, ({ project, data: { name } }) =>
    main.addList(project, name)
  );
  event.on(PROJECT.LISTS.REMOVE, ({ project, list }) =>
    main.deleteList(project, list)
  );
  event.on(PROJECT.LISTS.UPDATE, ({ project, list: id, data: { name } }) =>
    main.updateListName(project, id, name)
  );
  event.on(PROJECT.LISTS.MOVE, ({ project, list: id, data: { position } }) =>
    main.moveList(project, id, position)
  );

  event.on(PROJECT.LABELS.ADD, ({ project, data }) =>
    main.addLabel(project, data.name, data.color)
  );
  event.on(PROJECT.LABELS.REMOVE, ({ project, label: id }) =>
    main.deleteLabel(project, id)
  );
  event.on(PROJECT.LABELS.UPDATE, ({ project, label: id, data }) =>
    main.editLabel(project, id, data.prop, data.value)
  );

  event.on(TASK.ADD, ({ project, list, data }) =>
    main.addTask(project, list, data)
  );
  event.on(TASK.REMOVE, ({ data }) => main.deleteTask(data));
  event.on(TASK.MOVE, ({ project, list, task: id, data: { position } }) =>
    main.moveTask(project, list, id, position)
  );
  event.on(TASK.UPDATE, ({ project, list, task: id, data }) =>
    main.updateTask(project, list, id, data)
  );
  event.on(
    TASK.TRANSFER,
    ({ type, project, list, task, data: { position } }) => {
      switch (type) {
        case 'project':
          return main.transferTaskToProject(project, list, task, position);
        case 'list':
          return main.transferTaskToList(project, list, task, position);
        // transfer from list to task
        case 'task':
          return main.convertTaskToSubtask(project, list, task, position);
        default:
          throw new Error('Type must be either project, list, or task');
      }
    }
  );

  const taskLabelsReducer = ({ type, project, list, task: id, data }) => {
    const task = main.getTask(project, list, id);

    switch (type) {
      case 'add':
        task.addLabel(main.getLabel(project, data.id));
        break;
      case 'remove':
        task.removeLabel(data.id);
        break;
      case 'clear':
        task.clearLabels();
        break;
      default:
        throw new Error('Type must be add, remove or clear.');
    }

    return task;
  };

  event.on(TASK.LABELS.ADD, (payload) =>
    taskLabelsReducer({ ...payload, type: 'add' })
  );
  event.on(TASK.LABELS.REMOVE, (payload) =>
    taskLabelsReducer({ ...payload, type: 'remove' })
  );

  event.on(TASK.SUBTASKS.ADD, ({ project, list, task, data }) =>
    main.addSubtask(project, list, task, data)
  );
  event.on(TASK.SUBTASKS.REMOVE, ({ project, list, task, subtask }) =>
    main.deleteSubtask(project, list, task, subtask)
  );
  event.on(TASK.SUBTASKS.UPDATE, ({ project, list, task, data }) =>
    main.updateSubtask(project, list, task, data)
  );
  event.on(
    TASK.SUBTASKS.MOVE,
    ({ project, list, task, subtask, data: { position } }) =>
      main.moveSubtask(project, list, task, subtask, position)
  );
  event.on(
    TASK.SUBTASKS.TRANSFER,
    ({ type, project, list, task, subtask, data: { position } }) => {
      switch (type) {
        // transfer from task to list
        // list should be in the form of { to, from }
        case 'list':
          return main.convertSubtaskToTask(
            project,
            list,
            task,
            subtask,
            position
          );
        // transfer from task to task
        // list and task should be { to, from }
        case 'task':
          return main.transferSubtask(project, list, task, subtask, position);
        default:
          throw new Error('Type must either be "list" or "task"');
      }
    }
  );

  // only update local storage half a second after all updates
  event.on(
    [
      ...TASK.ALL,
      ...TASK.LABELS.ALL,
      ...TASK.SUBTASKS.ALL,
      ...PROJECT.ALL,
      ...PROJECT.LABELS.ALL,
      ...PROJECT.LISTS.ALL,
    ],
    debounce(main.syncLocalStorage, 500),
    {
      order: 'last',
    }
  );

  return {
    main: getters,
    event,
    router,
    state,
    init,
  };
})();

export default Core;
