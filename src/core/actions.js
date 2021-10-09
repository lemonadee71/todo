const ADD = 'add';
const REMOVE = 'remove';
const UPDATE = 'update';
const TRANSFER = 'transfer';
const SYNC = 'sync';

const createActions = (prefix) => {
  const actions = [ADD, REMOVE, UPDATE, TRANSFER];
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

export { TASK, PROJECT, SYNC };
