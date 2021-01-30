import { compareAsc } from 'date-fns';
import List from './list.js';
import $, {
  clear,
  changeModalContent,
  show,
} from './helpers/helpers';
import { createTaskCard } from './TaskController';
import Component from './component';
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

const uncategorizedTasks = List('uncategorized', 'project');
const allProjects = List('all', 'root', [uncategorizedTasks]);

let currentSelectedProj = uncategorizedTasks.id;

const segregateTasks = (tasks) => {
  return [
    tasks.filter((task) => !task.completed),
    tasks.filter((task) => task.completed),
  ];
};

const transferTask = (id, target) => {
  task = allProjects
    .getItem((proj) => proj.id === currentSelectedProj)
    .getItem((task) => task.id === id);

  allProjects.getItem((proj) => proj.id === target).addItem(task);
};

const getProjectTasks = (id) => {
  currentSelectedProj = id;
  return allProjects.getItem((proj) => proj.id === id).items;
};

const addProject = (projName) => {
  let newProject = List(projName, 'project');
  allProjects.addItem(newProject);

  return newProject;
};

const addTask = (task) => {
  allProjects
    .getItem((proj) => proj.id === currentSelectedProj)
    .addItem(task);
};

const deleteTask = (task) => {
  allProjects
    .getItem((proj) => proj.id === task.location)
    .removeItems((item) => item.id === task.id);
};

const getAllTasks = () => {
  currentSelectedProj = uncategorizedTasks.id;
  return [...allProjects.items].map((proj) => proj.items).flat();
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
    ...current.map((task) => createTaskCard(task, { deleteTask }))
  );
  completedTasks.append(
    ...completed.map((task) => createTaskCard(task, { deleteTask }))
  );
};

const renderNoTasksMessage = () => {
  $('#current-tasks').appendChild(
    Component.createElementFromString(
      `<h3>You don't have any tasks</h3>`
    )
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
  let { id, listName: name } = newProject;

  $('#user-proj').appendChild(
    ProjectListItem({ id, name }, selectProject)
  );
  e.target.reset();
};

const createNewTask = (e) => {
  e.preventDefault();
  let title = $('--d id=new-task-name').value;
  let desc = $('--d id=new-task-desc').value;
  let dueDate = $('--d id=new-task-date').value;

  let task = new Task({ title, desc, dueDate });
  addTask(task);
  $('#current-tasks').appendChild(
    createTaskCard(task, { deleteTask })
  );
};

const showForm = () => {
  changeModalContent(
    Component.render(CreateTaskForm({ onSubmit: createNewTask }))
  );
  show($('.modal-backdrop'));
};

export {
  showForm,
  createNewProject,
  selectProject,
  selectAllTasks,
  getProjectsDetails,
};
