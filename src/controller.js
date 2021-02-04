import { compareAsc } from 'date-fns';
import List from './list.js';
import $, {
  clear,
  changeModalContent,
  show,
  closeModal,
  append,
  remove,
} from './helpers/helpers';
import { createTaskCard } from './taskController';
import Component from './helpers/component';
import ProjectListItem from './components/ProjectListItem';
import Task from './Task.js';
import CreateTaskForm from './components/CreateTaskForm.js';
import {
  completedTasks,
  currentTasks,
  modal,
  newProjectInput,
  newTaskForm,
  newTaskFormDesc,
  newTaskFormDueDate,
  newTaskFormTitle,
  tasksList,
  userProjects,
} from './helpers/selectors.js';
import NoTasksMessage from './components/NoTasksMessage.js';

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

const getCurrentSelectedProj = () => currentSelectedProj;

const _segregateTasks = (tasks) => {
  return [
    tasks.filter((task) => !task.completed),
    tasks.filter((task) => task.completed),
  ];
};

const _getProjectTasks = (id) => {
  currentSelectedProj = id;
  return allProjects.getItem((proj) => proj.id === id).items;
};

const _getAllTasks = () => {
  currentSelectedProj = '';
  return [...allProjects.items].map((proj) => proj.items).flat();
};

const _addProject = (projName) => {
  let newProject = new List(projName, 'project');
  allProjects.addItem(newProject);
  return newProject;
};

const _deleteProject = (id) => {
  allProjects.removeItems((proj) => proj.id === id);
  console.log(allProjects.items);
};

const _addTask = (task) => {
  let location = currentSelectedProj || uncategorizedTasks.id;
  let project = allProjects.getItem((proj) => proj.id === location);
  project.addItem(task);
};

const deleteTask = (task) => {
  let project = allProjects.getItem((proj) => proj.id === task.location);
  project.removeItems((item) => item.id === task.id);
};

const transferTask = (id, target) => {
  let currentProject = currentSelectedProj || uncategorizedTasks.id;

  let prevProject = allProjects.getItem((proj) => proj.id === currentProject);
  let task = prevProject.getItem((task) => task.id === id);

  prevProject.removeItems((task) => task.id === id);
  allProjects.getItem((proj) => proj.id === target).addItem(task);
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

  return projects.length
    ? projects.map((proj) => {
        return {
          id: proj.id,
          name: proj.name,
        };
      })
    : [];
};

// Sidenav
const _clearTasks = () => {
  clear($(currentTasks));
  clear($(completedTasks));
};

const _renderTasks = (tasks) => {
  _clearTasks();

  let [current, completed] = _segregateTasks(tasks);

  current.map((task) => {
    let taskCard = createTaskCard({ task, deleteTask, transferTask });
    append(taskCard).to($(currentTasks));
  });
  completed.map((task) => {
    let taskCard = createTaskCard({ task, deleteTask, transferTask });
    append(taskCard).to($(completedTasks));
  });
};

const _renderNoTasksMessage = () => {
  _clearTasks();

  if (!$('#no-tasks')) {
    $(tasksList).prepend(NoTasksMessage());
  }
};

const selectAllTasks = () => {
  let tasks = _getAllTasks();
  tasks.length ? _renderTasks(tasks) : _renderNoTasksMessage();
};

const selectProject = (e) => {
  let tasks = _getProjectTasks(e.currentTarget.id);
  tasks.length ? _renderTasks(tasks) : _renderNoTasksMessage();
};

const removeProject = (e) => {
  e.stopPropagation();
  let projListItem = e.currentTarget.parentElement;

  _deleteProject(projListItem.id);
  remove(projListItem).from($(userProjects));
};

const createNewProject = (e) => {
  e.preventDefault();
  let newProject = _addProject($(newProjectInput).value);

  append(
    ProjectListItem(newProject, {
      clickHandler: selectProject,
      deleteHandler: removeProject,
    })
  ).to($(userProjects));
  e.target.reset();
};

// Add Task button
const createNewTask = (e) => {
  e.preventDefault();
  let title = $(newTaskFormTitle).value;
  let desc = $(newTaskFormDesc).value;
  let dueDate = $(newTaskFormDueDate).value;
  let location = currentSelectedProj || uncategorizedTasks.id;

  let task = new Task({ title, desc, dueDate, location });

  _addTask(task);
  append(createTaskCard({ task, deleteTask, transferTask })).to(
    $(currentTasks)
  );
  _destroyForm();
};

const showCreateTaskForm = () => {
  changeModalContent(
    Component.render(CreateTaskForm({ onSubmit: createNewTask }))
  );
  show($(modal));
};

const _destroyForm = () => {
  $(newTaskForm).removeEventListener('submit', createNewTask);
  closeModal();
};

export {
  showCreateTaskForm,
  createNewProject,
  selectProject,
  removeProject,
  selectAllTasks,
  getProjectsDetails,
  getCurrentSelectedProj,
};
