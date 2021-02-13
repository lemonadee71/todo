import List from '../classes/List.js';
import { defaultProjects } from '../helpers/defaults';
import { isDueToday, isDueThisWeek, isUpcoming, parse } from '../helpers/date';

const uncategorizedTasks = new List('uncategorized');
const allProjects = new List('all', [uncategorizedTasks, ...defaultProjects]);

let currentSelectedProj = uncategorizedTasks.id;

const getCurrentSelectedProj = () => currentSelectedProj;

const getAllProjects = () => allProjects.items;

const getProjectTasks = (id) => {
  currentSelectedProj = id;
  return allProjects.getItem((proj) => proj.id === id).items;
};

const getAllTasks = () => {
  currentSelectedProj = '';
  return [...allProjects.items].map((proj) => proj.items).flat();
};

const getDueToday = () => {
  currentSelectedProj = 'today';
  return [...allProjects.items]
    .map((proj) => proj.items)
    .flat()
    .filter((task) => isDueToday(parse(task.dueDate)));
};

const getDueThisWeek = () => {
  currentSelectedProj = 'week';
  return [...allProjects.items]
    .map((proj) => proj.items)
    .flat()
    .filter((task) => isDueThisWeek(parse(task.dueDate)));
};

const getUpcoming = () => {
  currentSelectedProj = 'upcoming';
  return [...allProjects.items]
    .map((proj) => proj.items)
    .flat()
    .filter((task) => isUpcoming(parse(task.dueDate)));
};

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

const addProject = (projName) => {
  let newProject = new List(projName);
  allProjects.addItem(newProject);
  return newProject;
};

const deleteProject = (id) => {
  allProjects.removeItems((proj) => proj.id === id);
};

const addTask = (task) => {
  let project = allProjects.getItem((proj) => proj.id === task.location);
  project.addItem(task);
};

const deleteTask = (task) => {
  let project = allProjects.getItem((proj) => proj.id === task.location);
  project.removeItems((item) => item.id === task.id);
};

const transferTask = (id, prevList, newList) => {
  let task = allProjects
    .getItem((proj) => proj.id === prevList)
    .extractItem((task) => task.id === id);

  allProjects.getItem((proj) => proj.id === newList).addItem(task);
};

export {
  uncategorizedTasks,
  addProject,
  deleteProject,
  getAllTasks,
  getProjectTasks,
  getProjectsDetails,
  getCurrentSelectedProj,
  getAllProjects,
  getDueToday,
  getDueThisWeek,
  getUpcoming,
  addTask,
  transferTask,
  deleteTask,
};
