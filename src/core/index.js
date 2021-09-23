import { createHook } from 'poor-man-jsx';
import EventEmitter from './classes/Emitter';
import Task from './classes/Task';
import History from './history';
import * as core from './main';
import { TASK, PROJECT } from './actions';
import { debounce } from '../utils/delay';

const App = (() => {
  const state = createHook({
    darkTheme: false,
    currentProject: null,
    expandLabels: false,
  });
  const event = new EventEmitter();
  const history = History;
  const getters = Object.entries(core).reduce((obj, [key, fn]) => {
    if (key.startsWith('get')) {
      obj[key] = fn;
    }

    return obj;
  }, {});

  // wrappers for core functions
  // just so multiple components can listen to an event
  // and to remove direct dependencies
  event.on(PROJECT.SELECT, (id) => {
    // track the current project
    state.currentProject = id;
  });

  event.on(PROJECT.ADD, (name) => core.addProject(name));
  event.on(PROJECT.REMOVE, (id) => core.deleteProject(id));
  event.on(PROJECT.UPDATE, ({ id, newName }) => {
    const project = core.getProject(id);
    project.name = newName; // since only name is editable

    return project;
  });

  event.on(PROJECT.LISTS.ADD, ({ project, name }) =>
    core.addList(project, name)
  );
  event.on(PROJECT.LISTS.REMOVE, ({ project, id }) =>
    core.deleteList(project, id)
  );
  event.on(PROJECT.LISTS.UPDATE, ({ project, id, newName }) => {
    const list = core.getList(project, id);
    list.name = newName; // since only name is editable

    return list;
  });

  event.on(PROJECT.LABELS.ADD, ({ project, data }) =>
    core.addLabel(project, data.name, data.color)
  );
  event.on(PROJECT.LABELS.REMOVE, ({ project, id }) =>
    core.deleteLabel(project, id)
  );
  event.on(PROJECT.LABELS.UPDATE, ({ project, id, data }) =>
    core.editLabel(project, id, data.prop, data.value)
  );

  event.on(TASK.ADD, (data) => core.addTask(data));
  event.on(TASK.REMOVE, (data) => core.deleteTask(data));
  event.on(TASK.UPDATE, ({ location, data }) => {
    const task = core.getTask(location.project, location.list, data.id);

    Object.entries(data).forEach(([prop, value]) => {
      task[prop] = value;
    });

    return task;
  });
  event.on(TASK.TRANSFER, ({ type, to, from, data }) => {
    switch (type) {
      case 'project':
        core.transferTaskToProject(data.id, data.list, from, to);
        break;
      case 'list':
        core.transferTaskToList(data.id, data.project, from, to);
        break;
      default:
        throw new Error('Invalid transfer type');
    }
  });

  const taskLabelsReducer = (action, { labelID, taskData }) => {
    const task = core.getTask(taskData.project, taskData.list, taskData.id);

    switch (action) {
      case 'add':
        task.addLabel(core.getLabel(taskData.project, labelID));
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
    const task = core.getTask(taskData.project, taskData.list, taskData.id);

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
  event.on(/(task|project)/i, debounce(core.syncLocalStorage, 500));

  return {
    core: getters,
    event,
    history,
    state,
  };
})();

export default App;
