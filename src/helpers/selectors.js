const taskItemTitle = (id) => `#${id} [data-name="task-card-title"]`;
const taskItemDescription = (id) => `#${id} [data-name="task-card-desc"]`;
const taskItemDueDateIcon = (id) => `#${id} [data-name="task-card-date-icon"]`;
const taskItemDueDateText = (id) => `#${id} [data-name="task-card-date-text"]`;

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
  taskItemDescription,
  taskItemDueDateIcon,
  taskItemDueDateText,
};
