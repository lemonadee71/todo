import { compareAsc } from 'date-fns';
import List from './list.js';
import $, {
  clear,
  changeModalContent,
  show,
  closeModal,
} from './helpers/helpers';
import { createTaskCard } from './taskController';
import Component from './helpers/component';
import ProjectListItem from './components/ProjectListItem';
import Task from './Task.js';
import CreateTaskForm from './components/CreateTaskForm.js';

// Work on displaying tasks in a selected project
// Add a function that process drop events
// Add functions for handling labels
/*
Pass the task's labels to LabelList
If label in labels, add class "checked"
For each label element, add click event
If checked, remove label, otherwise add it
*/

const uncategorizedTasks = new List('uncategorized', 'project');
const allProjects = new List('all', 'root', [uncategorizedTasks]);

let currentSelectedProj = uncategorizedTasks.id;

const segregateTasks = (tasks) => {
  return [
    tasks.filter((task) => !task.completed),
    tasks.filter((task) => task.completed),
  ];
};

const getCurrentSelectedProj = () => currentSelectedProj;

const transferTask = (id, target) => {
  let currentProject = currentSelectedProj || uncategorizedTasks.id;

  let prevProject = allProjects.getItem((proj) => proj.id === currentProject);
  let task = prevProject.getItem((task) => task.id === id);

  prevProject.removeItems((task) => task.id === id);

  allProjects.getItem((proj) => proj.id === target).addItem(task);
};

const getProjectTasks = (id) => {
  currentSelectedProj = id;
  return allProjects.getItem((proj) => proj.id === id).items;
};

const getAllTasks = () => {
  currentSelectedProj = '';
  return [...allProjects.items].map((proj) => proj.items).flat();
};

const addProject = (projName) => {
  let newProject = new List(projName, 'project');
  allProjects.addItem(newProject);
  return newProject;
};

const addTask = (task) => {
  let location = currentSelectedProj || uncategorizedTasks.id;
  let project = allProjects.getItem((proj) => proj.id === location);
  project.addItem(task);
};

const deleteTask = (task) => {
  let project = allProjects.getItem((proj) => proj.id === task.location);
  project.removeItems((item) => item.id === task.id);
};

// const getDueToday = () => {
//   return [...allProjects]
//     .map((proj) => proj.items)
//     .flat()
//     .filter((task) => task.dueDate === '');
// };

// const getDueThisWeek = () => {
//   return [...allProjects]
//     .map((proj) => proj.items)
//     .flat()
//     .filter((task) => task.dueDate === '');
// };

// const getUpcoming = () => {
//   return [...allProjects]
//     .map((proj) => proj.items)
//     .flat()
//     .filter((task) => task.dueDate === '');
// };

const getProjectsDetails = () => {
  let projects = allProjects.filterItems(
    (proj) => proj.id !== uncategorizedTasks.id
  );

  return projects
    ? projects.map((proj) => {
        return {
          id: proj.id,
          name: proj.listName,
        };
      })
    : [];
};

const renderTasks = (tasks) => {
  let currentTasks = $('#current-tasks');
  let completedTasks = $('#completed-tasks');

  clear(currentTasks);
  clear(completedTasks);

  let [current, completed] = segregateTasks(tasks);

  currentTasks.append(
    ...current.map((task) => createTaskCard({ task, deleteTask, transferTask }))
  );
  completedTasks.append(
    ...completed.map((task) =>
      createTaskCard({ task, deleteTask, transferTask })
    )
  );
};

const renderNoTasksMessage = () => {
  clear($('#current-tasks'));
  clear($('#completed-tasks'));

  $('#current-tasks').appendChild(
    Component.createElementFromString(`<h3>You don't have any tasks</h3>`)
  );
};

const selectProject = (id) => {
  let tasks = getProjectTasks(id);
  tasks.length ? renderTasks(tasks) : renderNoTasksMessage();
};

const selectAllTasks = () => {
  let tasks = getAllTasks();
  tasks.length ? renderTasks(tasks) : renderNoTasksMessage();
};

const createNewProject = (e) => {
  e.preventDefault();
  let newProject = addProject($('#new-proj').value);

  $('#user-proj').appendChild(ProjectListItem(newProject, selectProject));
  e.target.reset();
};

const destroyForm = () => {
  // Crude implementation for now
  $('#create-task').removeEventListener('submit', createNewTask);
  closeModal();
};

const createNewTask = (e) => {
  e.preventDefault();
  let title = $('--data-id=new-task-name').value;
  let desc = $('--data-id=new-task-desc').value;
  let dueDate = $('--data-id=new-task-date').value;
  let location = currentSelectedProj || uncategorizedTasks.id;

  let task = new Task({ title, desc, dueDate, location });
  addTask(task);
  $('#current-tasks').appendChild(
    createTaskCard({ task, deleteTask, transferTask })
  );

  destroyForm();
};

const showCreateTaskForm = () => {
  changeModalContent(
    Component.render(CreateTaskForm({ onSubmit: createNewTask }))
  );
  show($('.modal-backdrop'));
};

export {
  showCreateTaskForm,
  createNewProject,
  selectProject,
  selectAllTasks,
  getProjectsDetails,
  getCurrentSelectedProj,
};
