import { compareAsc } from 'date-fns';
import List from './list.js';
import $ from './helpers/getElement';
import { createNewTask, createTaskCard } from './TaskController';
import ProjectLi from './components/ProjectLi';
import Component from './component';

// Work on displaying tasks in a selected project
// Add a function that process drop events
// Add functions for handling labels
/*
Pass the task's labels to LabelList
If label in labels, add class "checked"
For each label element, add click event
If checked, remove label, otherwise add it
*/
const allProjects = List('all', 'root', [
  List('uncategorized', 'project'),
]);

let currentSelectedProj = allProjects.getItem(
  (proj) => proj.listName === 'uncategorized'
).id;

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
  currentSelectedProj = allProjects.getItem(
    (proj) => proj.listName === 'uncategorized'
  ).id;
  return [...allProjects].map((proj) => proj.items).flat();
};

const getDueToday = () => {
  return [...allProjects]
    .map((proj) => proj.items)
    .flat()
    .filter((task) => task.dueDate === '');
};

const getDueThisWeek = () => {
  return [...allProjects]
    .map((proj) => proj.items)
    .flat()
    .filter((task) => task.dueDate === '');
};

const getUpcoming = () => {
  return [...allProjects]
    .map((proj) => proj.items)
    .flat()
    .filter((task) => task.dueDate === '');
};

const getProjectsDetails = () => {
  let projects = allProjects.items;

  return projects
    ? projects.map((proj) => {
        return {
          id: proj.id,
          name: proj.listName,
        };
      })
    : null;
};

const renderTasks = (tasks) => {
  let currentTasks = $('#current-tasks');
  let completedTasks = $('#completed-tasks');

  currentTasks.innerHTML = '';
  completedTasks.innerHTML = '';

  let [current, completed] = segregateTasks(tasks);

  currentTasks.append(...current.map((task) => createTaskCard(task)));
  currentTasks.append(
    ...completed.map((task) => createTaskCard(task))
  );
};

const selectProject = (id) => {
  let tasks = getProjectTasks(id);
  renderTasks(tasks);
};

const selectAllTasks = () => {
  // let tasks = getAllTasks();
  // renderTasks(tasks);
  console.log('Fetching all tasks...');
};

const createNewProject = (e) => {
  e.preventDefault();
  let input = $('#new-proj');
  let newProject = addProject(input.value);
  let { id, listName: name } = newProject;

  let userProjects = $('#user-proj');
  userProjects.appendChild(
    Component.createFromString(
      ...Array.from(ProjectLi({ id, name }, { selectProject }))
    )
  );
  e.target.reset();
};

export {
  createNewProject,
  selectProject,
  selectAllTasks,
  getProjectsDetails,
};
