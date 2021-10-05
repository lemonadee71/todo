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

  event.on(PROJECT.ADD, (name) => main.addProject(name));
  event.on(PROJECT.REMOVE, (id) => main.deleteProject(id));
  event.on(PROJECT.UPDATE, ({ id, newName }) => {
    const project = main.getProject(id);
    project.name = newName; // since only name is editable

    return project;
  });

  event.on(PROJECT.LISTS.ADD, ({ project, name }) =>
    main.addList(project, name)
  );
  event.on(PROJECT.LISTS.REMOVE, ({ project, id }) =>
    main.deleteList(project, id)
  );
  event.on(PROJECT.LISTS.UPDATE, ({ project, id, newName }) => {
    const list = main.getList(project, id);
    list.name = newName; // since only name is editable

    return list;
  });

  event.on(PROJECT.LABELS.ADD, ({ project, data }) =>
    main.addLabel(project, data.name, data.color)
  );
  event.on(PROJECT.LABELS.REMOVE, ({ project, id }) =>
    main.deleteLabel(project, id)
  );
  event.on(PROJECT.LABELS.UPDATE, ({ project, id, data }) =>
    main.editLabel(project, id, data.prop, data.value)
  );

  event.on(TASK.ADD, (data) => main.addTask(data));
  event.on(TASK.REMOVE, (data) => main.deleteTask(data));
  event.on(TASK.UPDATE, (data) => {
    const task = main.getTask(data.project, data.list, data.id);

    Object.entries(data).forEach(([prop, value]) => {
      task[prop] = value;
    });

    return task;
  });
  event.on(TASK.TRANSFER, ({ type, to, from, data }) => {
    switch (type) {
      case 'project':
        main.transferTaskToProject(data.id, data.list, from, to);
        break;
      case 'list':
        main.transferTaskToList(data.id, data.project, from, to);
        break;
      default:
        throw new Error('Invalid transfer type');
    }
  });

  const taskLabelsReducer = (action, { labelID, taskData }) => {
    const task = main.getTask(taskData.project, taskData.list, taskData.id);

    switch (action) {
      case 'add':
        task.addLabel(main.getLabel(taskData.project, labelID));
        break;
      case 'remove':
        task.removeLabel(labelID);
        break;
      case 'clear':
        task.clearLabels();
        break;
      default:
        throw new Error('Invalid action');
    }

    return task;
  };

  const taskSubtasksReducer = (action, { subtaskData, taskData }) => {
    const task = main.getTask(taskData.project, taskData.list, taskData.id);

    switch (action) {
      case 'add':
        task.addSubtask(new Task(subtaskData));
        break;
      case 'remove':
        task.deleteSubtask(subtaskData.id);
        break;
      case 'clear':
        task.clearSubtasks();
        break;
      case 'update': {
        const subtask = task.getSubtask(subtaskData.id);

        Object.entries(subtaskData).forEach(([prop, value]) => {
          subtask[prop] = value;
        });

        break;
      }
      default:
        throw new Error('Invalid action');
    }

    return task;
  };

  event.on(TASK.LABELS.ADD, (payload) => taskLabelsReducer('add', payload));
  event.on(TASK.LABELS.REMOVE, (type, payload) =>
    taskLabelsReducer(type, payload)
  );

  event.on(TASK.SUBTASKS.ADD, (payload) => taskSubtasksReducer('add', payload));
  event.on(TASK.SUBTASKS.REMOVE, (type, payload) =>
    taskSubtasksReducer(type, payload)
  );
  event.on(TASK.SUBTASKS.UPDATE, (payload) =>
    taskSubtasksReducer('update', payload)
  );

  // only update local storage half a second after all updates
  event.on(/(task|project)/i, debounce(main.syncLocalStorage, 500));

  return {
    main: getters,
    event,
    router,
    state,
    init,
  };
})();

export default Core;
