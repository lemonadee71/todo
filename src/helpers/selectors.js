const taskItemTitle = (id) => `#${id} [data-name="task-card-title"]`;
const taskItemDescription = (id) => `#${id} [data-name="task-card-desc"]`;
const taskItemDueDateIcon = (id) => `#${id} [data-name="task-card-date-icon"]`;
const taskItemDueDateText = (id) => `#${id} [data-name="task-card-date-text"]`;
const taskItemLabels = (id) => `#${id} .label-chips`;

const completedTasks = '#completed-tasks';
const currentTasks = '#current-tasks';

const newTaskForm = '#create-task';
const newTaskFormTitle = '[data-id="new-task-title"]';
const newTaskFormDesc = '[data-id="new-task-desc"]';
const newTaskFormDueDate = '[data-id="new-task-date"]';

const modal = '.modal-backdrop';
const modalContent = '#modal-content';

const tasksList = '#tasks-list';

const hamburger = '.hamburger';
const sidebar = '#sidebar';
const userProjects = '#user-proj';
const newProjectInput = '#new-proj';

const popover = '#popover';

const chips = (name, color) => `.chip[data-label-id="${name}-${color}"]`;
const chipsWithText = (name, color) =>
  `.chip-w-text[data-label-id="${name}-${color}"]`;

export {
  modal,
  modalContent,
  currentTasks,
  completedTasks,
  newTaskForm,
  newTaskFormTitle,
  newTaskFormDesc,
  newTaskFormDueDate,
  tasksList,
  hamburger,
  sidebar,
  newProjectInput,
  userProjects,
  taskItemTitle,
  taskItemLabels,
  taskItemDescription,
  taskItemDueDateIcon,
  taskItemDueDateText,
  chips,
  chipsWithText,
};
