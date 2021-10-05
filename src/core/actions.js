const ADD = 'add';
const REMOVE = 'remove';
const UPDATE = 'update';
const TRANSFER = 'transfer';
const ALL = `(${ADD}|${REMOVE}|${UPDATE}|${TRANSFER})`;
const SYNC = 'sync';

const createActions = (prefix) =>
  [ADD, REMOVE, UPDATE, TRANSFER, 'all'].reduce((obj, action) => {
    obj[action.toUpperCase()] =
      action === 'all' ? new RegExp(`${prefix}.${ALL}`) : `${prefix}.${action}`;

    return obj;
  }, {});

const TASK = createActions('task');
TASK.LABELS = createActions('task.labels');
TASK.SUBTASKS = createActions('task.subtasks');

const PROJECT = createActions('project');
PROJECT.LABELS = createActions('project.labels');
PROJECT.LISTS = createActions('project.lists');
PROJECT.SELECT = 'app.project.select';

export { TASK, PROJECT, SYNC };
