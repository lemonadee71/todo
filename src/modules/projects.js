import List from '../classes/List';
import Task from '../classes/Task';
import { isDueToday, isDueThisWeek, isUpcoming, parse } from '../helpers/date';
import { defaultProjects } from './defaults';
import { getLabel } from './labels';
import Storage from './storage';

const allProjects = new List({ name: 'all' });

/*
 *  Initialize
 */
let storedData = Storage.recover('data');
let uncategorizedTasks;

if (storedData) {
  allProjects.addItem(
    storedData.items.map(
      (list) =>
        new List({
          id: list.id,
          name: list.name,
          defaultItems: list.items.map(
            (task) =>
              new Task({
                id: task.id,
                title: task.title,
                notes: task.notes,
                dueDate: task.dueDate,
                completed: task.completed,
                location: task.location,
                labels: task.labels.items.filter((label) => getLabel(label.id)),
              })
          ),
        })
    )
  );

  uncategorizedTasks = allProjects.getItem(
    (proj) => proj.name === 'uncategorized'
  );
} else {
  uncategorizedTasks = new List({ name: 'uncategorized' });
  allProjects.addItem(uncategorizedTasks);
  allProjects.addItem(defaultProjects);
}

let currentSelectedProj = uncategorizedTasks.id;

Storage.store('data', allProjects);

/*
 * Functions
 */

const syncData = () => Storage.sync('data');

const getCurrentSelectedProj = () => currentSelectedProj;

const getAllProjects = () => allProjects.items;

const getAllTasks = () => {
  currentSelectedProj = '';
  return [...allProjects.items].map((proj) => proj.items).flat();
};

const getProjectTasks = (id) => {
  currentSelectedProj = id;
  return allProjects.getItem((proj) => proj.id === id).items;
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

const addProject = (name) => {
  let newProject = new List({ name });
  allProjects.addItem(newProject);

  syncData();
  return newProject;
};

const deleteProject = (id) => {
  allProjects.removeItems((proj) => proj.id === id);
  syncData();
};

const addTask = (task) => {
  let project = allProjects.getItem((proj) => proj.id === task.location);
  project.addItem(task);
  syncData();
};

const deleteTask = (task) => {
  console.log(task, allProjects);
  let project = allProjects.getItem((proj) => proj.id === task.location);
  project.removeItems((item) => item.id === task.id);
  syncData();
};

const transferTask = (id, prevList, newList) => {
  let task = allProjects
    .getItem((proj) => proj.id === prevList)
    .extractItem((task) => task.id === id);

  allProjects.getItem((proj) => proj.id === newList).addItem(task);
  syncData();
};

const segregateTasks = (tasks) => {
  return [
    tasks.filter((task) => !task.completed),
    tasks.filter((task) => task.completed),
  ];
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
  segregateTasks,
};
