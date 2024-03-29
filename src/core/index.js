import { createHook } from 'poor-man-jsx';
import EventEmitter from './classes/Emitter';
import IdList from './classes/IdList';
import * as main from './main';
import router from './router';
import { TASK, PROJECT } from '../actions';
import { debounce } from '../utils/delay';
import { copy } from '../utils/misc';

const Core = (() => {
  const [state] = createHook({
    darkTheme: false,
    currentUser: null,
    currentPage: '',
    expandLabels: false,
  });
  const globalData = {
    root: new IdList(),
    toasts: [],
    // temp queue of task ids to open after project rendered
    // either 0 or 1 in length
    queue: [],
    fetched: { projects: [], lists: [] },
  };
  const event = new EventEmitter();

  const trackPage = (match) => {
    state.currentPage = match.url;
  };

  /**
   * Clear global data and state
   */
  const clearData = () => {
    state.currentUser = null;
    state.expandLabels = false;

    globalData.root.clear();
    globalData.fetched = { projects: [], lists: [] };

    router.off('*', trackPage);
  };

  const setupListeners = () => {
    // track current opened page
    router.on('*', trackPage);

    /**
     * wrappers for core functions
     * just so multiple components can listen to an event
     */
    event.on(PROJECT.ADD, ({ data: { name } }) => main.addProject(name));
    event.on(PROJECT.REMOVE, ({ project }) => main.deleteProject(project));
    event.on(PROJECT.UPDATE, ({ project: id, data }) =>
      main.updateProject(id, data)
    );
    event.on(PROJECT.MOVE, ({ project: id, data: { position } }) =>
      main.moveProject(id, position)
    );
    event.on(PROJECT.INSERT, ({ data: { item, position } }) =>
      main.insertProject(item, position)
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
    event.on(PROJECT.LISTS.INSERT, ({ project, data: { item, position } }) =>
      main.insertList(project, item, position)
    );

    event.on(PROJECT.LABELS.ADD, ({ project, data }) =>
      main.addLabel(project, data.name, data.color)
    );
    event.on(PROJECT.LABELS.REMOVE, ({ project, label: id }) =>
      main.deleteLabel(project, id)
    );
    event.on(PROJECT.LABELS.UPDATE, ({ project, label: id, data }) =>
      main.editLabel(project, id, data)
    );

    event.on(TASK.ADD, ({ project, list, data }) =>
      main.addTask(project, list, data)
    );
    event.on(TASK.REMOVE, ({ project, list, task: id }) =>
      main.deleteTask(project, list, id)
    );
    event.on(TASK.MOVE, ({ project, list, task: id, data: { position } }) =>
      main.moveTask(project, list, id, position)
    );
    event.on(TASK.INSERT, ({ project, list, data: { item, position } }) =>
      main.insertTask(project, list, item, position)
    );
    event.on(TASK.UPDATE, ({ project, list, task: id, data }) =>
      main.updateTask(project, list, id, data)
    );
    event.on(TASK.TRANSFER, (args) => {
      const {
        type,
        project,
        list,
        task,
        data: { position },
      } = args;
      let result;

      switch (type) {
        case 'project':
          result = main.transferTaskToProject(project, list, task, position);
          break;
        case 'list':
          result = main.transferTaskToList(project, list, task, position);
          break;
        // transfer from list to task
        case 'task': {
          const item = main.getTask(project, list.from, task.from);
          // transfer subtasks too; flatten it
          item.subtasks.items.forEach((subtask) => {
            event.emit(TASK.SUBTASKS.TRANSFER, {
              ...args,
              subtask: subtask.id,
            });
          });

          result = main.convertTaskToSubtask(project, list, task, position);
          break;
        }
        default:
          throw new Error('Type must be either project, list, or task');
      }

      return { type, result, changes: copy(args, ['type']) };
    });

    // Task and subtask share the same label callback
    // So subtasks should emit TASK.LABELS instead
    const taskLabelsReducer = ({
      type,
      project,
      list,
      task: taskId,
      subtask: subtaskId,
      data,
    }) => {
      const task = subtaskId
        ? main.getSubtask(project, list, taskId, subtaskId)
        : main.getTask(project, list, taskId);

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
    event.on(TASK.SUBTASKS.UPDATE, ({ project, list, task, subtask, data }) =>
      main.updateSubtask(project, list, task, subtask, data)
    );
    event.on(
      TASK.SUBTASKS.MOVE,
      ({ project, list, task, subtask, data: { position } }) =>
        main.moveSubtask(project, list, task, subtask, position)
    );
    event.on(
      TASK.SUBTASKS.INSERT,
      ({ project, list, task, data: { item, position } }) =>
        main.insertSubtask(project, list, task, item, position)
    );
    event.on(TASK.SUBTASKS.TRANSFER, (args) => {
      const {
        type,
        project,
        list,
        task,
        subtask,
        data: { position },
      } = args;
      let result;

      switch (type) {
        // transfer from task to list
        // list should be in the form of { to, from }
        case 'list':
          result = main.convertSubtaskToTask(
            project,
            list,
            task,
            subtask,
            position
          );
          break;
        // transfer from task to task
        // list and task should be { to, from }
        case 'task':
          result = main.transferSubtask(project, list, task, subtask, position);
          break;
        default:
          throw new Error('Type must either be "list" or "task"');
      }

      return { type, result, changes: copy(args, ['type']) };
    });

    // only update local storage half a second after all updates
    event.onSuccess(
      [
        ...TASK.ALL,
        ...TASK.LABELS.ALL,
        ...TASK.SUBTASKS.ALL,
        ...PROJECT.ALL,
        ...PROJECT.LABELS.ALL,
        ...PROJECT.LISTS.ALL,
      ],
      debounce(main.syncLocalStorage, 500)
    );
  };

  return {
    main,
    event,
    router,
    state,
    data: globalData,
    clearData,
    setupListeners,
  };
})();

export default Core;
