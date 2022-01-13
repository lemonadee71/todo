const ADD = 'add';
const REMOVE = 'remove';
const UPDATE = 'update';
const MOVE = 'move';
const INSERT = 'insert';
const TRANSFER = 'transfer';
const SYNC = 'sync';
const NAVIGATE_TO_PAGE = 'navigate.to.page';
const EDIT_TASK = 'task.modal.open';
const EDIT_SUBTASK = 'subtask.modal.open';

const createActions = (prefix) => {
  const actions = [ADD, REMOVE, UPDATE, TRANSFER, MOVE, INSERT];
  const final = actions.reduce((obj, action) => {
    obj[action.toUpperCase()] = `${prefix}.${action}`;

    return obj;
  }, {});
  final.ALL = Object.values(final);

  return final;
};

const TASK = createActions('task');
TASK.LABELS = createActions('task.labels');
TASK.SUBTASKS = createActions('task.subtasks');

const PROJECT = createActions('project');
PROJECT.LABELS = createActions('project.labels');
PROJECT.LISTS = createActions('project.lists');

PROJECT.SELECT = 'app.project.select';

const FIREBASE = {
  PROJECT: createActions('firebase.project'),
  TASKS: { FETCH_COMPLETED: 'firebase.tasks.completed' },
};

export {
  TASK,
  PROJECT,
  FIREBASE,
  SYNC,
  NAVIGATE_TO_PAGE,
  EDIT_TASK,
  EDIT_SUBTASK,
};
