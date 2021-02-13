const taskItemTitle = (id) => `#${id} [data-id="task-card-title"]`;
const taskItemNotes = (id) => `#${id} [data-id="task-card-notes"]`;
const taskItemDueDateIcon = (id) => `#${id} [data-id="task-card-date-icon"]`;
const taskItemDueDateText = (id) => `#${id} [data-id="task-card-date-text"]`;
const taskItemLabels = (id) => `#${id} .label-chips`;

const completedTasks = '#completed-tasks';
const currentTasks = '#current-tasks';

const newTaskForm = '#create-task';
const newTaskFormTitle = '[data-id="new-task-title"]';
const newTaskFormNotes = '[data-id="new-task-notes"]';
const newTaskFormDueDate = '[data-id="new-task-date"]';

const modal = '.modal-backdrop';
const modalContent = '#modal-content';
const labelsArea = '#labels [data-id="labels-area"]';
const taskNotesArea = '[data-id="notes-area"]';

const tasksList = '#tasks-list';

const hamburger = '.hamburger';
const sidebar = '#sidebar';
const userProjects = '#user-proj';
const newProjectInput = '#new-proj';

const popover = '#popover';

const chips = (id) => `.chip[data-label-id="${id}"]`;
const chipsWithText = (id) => `.chip-w-text[data-label-id="${id}"]`;
const labelElement = (id) => `.label[data-label-id="${id}"]`;

export {
   modal,
   modalContent,
   labelsArea,
   taskNotesArea,
   currentTasks,
   completedTasks,
   newTaskForm,
   newTaskFormTitle,
   newTaskFormNotes,
   newTaskFormDueDate,
   tasksList,
   hamburger,
   sidebar,
   newProjectInput,
   userProjects,
   taskItemTitle,
   taskItemLabels,
   taskItemNotes,
   taskItemDueDateIcon,
   taskItemDueDateText,
   chips,
   chipsWithText,
   labelElement,
};
