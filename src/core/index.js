import { createHook } from 'poor-man-jsx';
import EventEmitter from './classes/Emitter';
import Task from './classes/Task';
// import History from './history';
import * as main from './main';
import Router from './router';
import Storage from './storage';
import { TASK, PROJECT } from './actions';
import { LOCAL_USER } from './constants';
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
    Storage.init((state.currentUser = user || LOCAL_USER));
    main.init();
    // router.navigate((state.currentPage = Storage.get('lastOpenedPage')));
  };

  // wrappers for core functions
  // just so multiple components can listen to an event
  event.on(PROJECT.SELECT, (id) => {
    // track the current project
    state.currentProject = id;
  });

  /**
   * For uniformity, any payload for callbacks should be in the form of
   * {
   *    project,
   *    ?list,
   *    ?task,
   *    ?type
   *    data: {}
   * }
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
  event.on(TASK.TRANSFER, ({ type, project, list, task: id, data }) => {
    switch (type) {
      case 'project':
        main.transferTaskToProject(id, list, data.from, data.to, data.position);
        break;
      case 'list':
        main.transferTaskToList(id, project, data.from, data.to, data.position);
        break;
      default:
        throw new Error('Type must be either project or list');
    }
  });

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

  const taskSubtasksReducer = ({ type, project, list, task: id, data }) => {
    const task = main.getTask(project, list, id);

    switch (type) {
      case 'add':
        task.addSubtask(new Task(data));
        break;
      case 'remove':
        task.deleteSubtask(data.id);
        break;
      case 'clear':
        task.clearSubtasks();
        break;
      case 'update': {
        main.updateTask(project, list, id, data, 'subtask');
        break;
      }
      default:
        throw new Error('Type must be add, remove, clear, or update.');
    }

    return task;
  };

  event.on(TASK.LABELS.ADD, (payload) =>
    taskLabelsReducer({ ...payload, type: 'add' })
  );
  event.on(TASK.LABELS.REMOVE, taskLabelsReducer);

  event.on(TASK.SUBTASKS.ADD, (payload) =>
    taskSubtasksReducer({ ...payload, type: 'add' })
  );
  event.on(TASK.SUBTASKS.REMOVE, taskSubtasksReducer);
  event.on(TASK.SUBTASKS.UPDATE, (payload) =>
    taskSubtasksReducer({ ...payload, type: 'update' })
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
