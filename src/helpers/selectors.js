const taskCardTitle = (id) => `#task-${id} [data-name="task-card-title"]`;
const taskCardDescription = (id) => `#task-${id} [data-name="task-card-desc"]`;
const taskCardDueDateIcon = (id) =>
  `#task-${id} [data-name="task-card-date-icon"]`;
const taskCardDueDateText = (id) =>
  `#task-${id} [data-name="task-card-date-text"]`;

const completedTasks = '#completed-tasks';
const currentTasks = '#current-tasks';

const newTaskFormTitle = '[data-id="new-task-name"]';
const newTaskFormDesc = '[data-id="new-task-desc"]';
const newTaskFormDueDate = '[data-id="new-task-date"]';

const modal = '.modal-backdrop';

export {
  modal,
  currentTasks,
  completedTasks,
  newTaskFormTitle,
  newTaskFormDesc,
  newTaskFormDueDate,
  taskCardTitle,
  taskCardDescription,
  taskCardDueDateIcon,
  taskCardDueDateText,
};
