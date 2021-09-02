const ADD = 'add';
const REMOVE = 'remove';
const UPDATE = 'update';
const TRANSFER = 'transfer';
const SYNC = 'sync';

const createActions = (prefix) =>
  [ADD, REMOVE, UPDATE, TRANSFER].reduce((obj, action) => {
    obj[action.toUpperCase()] = `${prefix}.${action}`;

    return obj;
  }, {});

const TASK = createActions('task');
TASK.LABELS = createActions('task.labels');
TASK.SUBTASKS = createActions('task.subtasks');

const PROJECT = createActions('project');
PROJECT.LABELS = createActions('project.labels');
PROJECT.LISTS = createActions('project.lists');

export { TASK, PROJECT, SYNC };
