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
TASK.ALL = Object.values(TASK);
TASK.LABELS = createActions('task.labels');
TASK.LABELS.ALL = Object.values(TASK.LABELS);
TASK.SUBTASKS = createActions('task.subtasks');
TASK.SUBTASKS.ALL = Object.values(TASK.SUBTASKS);

const PROJECT = createActions('project');
PROJECT.ALL = Object.values(PROJECT);
PROJECT.LABELS = createActions('project.labels');
PROJECT.LABELS.ALL = Object.values(PROJECT.LABELS);
PROJECT.LISTS = createActions('project.lists');
PROJECT.LISTS.ALL = Object.values(PROJECT.LISTS);

PROJECT.SELECT = 'app.project.select';

export { TASK, PROJECT, SYNC };
